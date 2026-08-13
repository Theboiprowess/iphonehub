import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch payments for verification queue
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission((session.user as any).role, "ORDERS_VIEW");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {
      provider: "ecocash",
      status: {
        in: ["AWAITING_PROOF", "PROOF_SUBMITTED", "MATCHING", "VERIFIED", "MISMATCH", "MANUAL_REVIEW", "REJECTED"],
      },
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { order: { orderNumber: { contains: search, mode: "insensitive" } } },
        { order: { customerName: { contains: search, mode: "insensitive" } } },
        { order: { customerPhone: { contains: search, mode: "insensitive" } } },
        { order: { paymentReference: { contains: search, mode: "insensitive" } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        receivingAccount: true,
        proofs: {
          where: { status: { in: ["PENDING", "MATCHED", "APPROVED"] } },
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
        ecoCashTransaction: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch orders for all payments
    const orderIds = payments.map((p) => p.orderId);
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: {
        id: true,
        orderNumber: true,
        paymentReference: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
      },
    });

    const orderMap = new Map(orders.map((o) => [o.id, o]));

    const verificationData = payments.map((payment) => {
      const order = orderMap.get(payment.orderId);
      const hasProof = payment.proofs.length > 0;
      const hasSms = !!payment.ecoCashTransaction;
      
      let matchResult;
      if (hasProof && hasSms) {
        const proof = payment.proofs[0];
        const sms = payment.ecoCashTransaction;
        
        matchResult = {
          amountMatch: Math.abs(Number(payment.amount) - Number(sms.amount)) < 0.01,
          accountMatch: payment.receivingAccountId === sms.receivingAccountId,
          phoneMatch: payment.customerPhone.includes(sms.senderPhone) || sms.senderPhone.includes(payment.customerPhone),
          referenceMatch: proof.transactionReference === sms.transactionReference,
          errors: [],
        };

        if (!matchResult.amountMatch) matchResult.errors.push("Amount mismatch");
        if (!matchResult.accountMatch) matchResult.errors.push("Account mismatch");
        if (!matchResult.phoneMatch) matchResult.errors.push("Phone mismatch");
        if (!matchResult.referenceMatch) matchResult.errors.push("Reference mismatch");
      }

      return {
        id: payment.id,
        orderNumber: order?.orderNumber || "Unknown",
        paymentReference: order?.paymentReference || "Unknown",
        customerName: order?.customerName || "Unknown",
        customerPhone: payment.customerPhone,
        customerEmail: order?.customerEmail || "Unknown",
        amount: Number(payment.amount),
        receivingAccountName: payment.receivingAccount?.name,
        receivingAccountNumber: payment.receivingAccount?.phoneNumber,
        status: payment.status,
        hasProof,
        hasSms,
        proofTransactionRef: payment.proofs[0]?.transactionReference,
        smsTransactionRef: payment.ecoCashTransaction?.transactionReference,
        createdAt: payment.createdAt.toISOString(),
        matchResult,
      };
    });

    return NextResponse.json({ payments: verificationData });
  } catch (error: any) {
    console.error("Error fetching payment verification queue:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch payment verification queue" },
      { status: 500 }
    );
  }
}

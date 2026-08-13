import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// PUT - Update EcoCash receiving account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission((session.user as any).role, "PRODUCTS_EDIT");

    const body = await request.json();
    const { name, phoneNumber, isActive, isDefault, notes } = body;

    // If setting as default, unset previous default
    if (isDefault) {
      await prisma.ecoCashReceivingAccount.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const account = await prisma.ecoCashReceivingAccount.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ account });
  } catch (error: any) {
    console.error("Error updating EcoCash account:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update EcoCash account" },
      { status: 500 }
    );
  }
}

// DELETE - Delete EcoCash receiving account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission((session.user as any).role, "PRODUCTS_DELETE");

    // Check if account has payments
    const paymentCount = await prisma.payment.count({
      where: { receivingAccountId: id },
    });

    if (paymentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete account with associated payments" },
        { status: 400 }
      );
    }

    await prisma.ecoCashReceivingAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting EcoCash account:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete EcoCash account" },
      { status: 500 }
    );
  }
}

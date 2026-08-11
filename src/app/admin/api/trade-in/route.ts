import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET - List all trade-in requests with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "TRADE_IN_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { currentModel: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tradeIns, total] = await Promise.all([
      prisma.tradeInEnquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tradeInEnquiry.count({ where }),
    ]);

    return NextResponse.json({
      tradeIns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching trade-ins:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch trade-ins" },
      { status: 500 }
    );
  }
}

// PUT - Update trade-in status, valuation, or notes
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "TRADE_IN_EDIT");

    const body = await request.json();
    const { id, status, estimatedValue, finalOffer, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Trade-in ID is required" }, { status: 400 });
    }

    const validStatuses = [
      "NEW",
      "UNDER_REVIEW",
      "MORE_INFO_REQUIRED",
      "ESTIMATED",
      "OFFER_SENT",
      "ACCEPTED",
      "DECLINED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue;
    if (finalOffer !== undefined) updateData.finalOffer = finalOffer;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const tradeIn = await prisma.tradeInEnquiry.update({
      where: { id },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TRADE_IN_UPDATED",
        entity: "TradeInEnquiry",
        entityId: id,
        changes: updateData,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/trade-in");
    revalidatePath("/admin");

    return NextResponse.json({ tradeIn });
  } catch (error: any) {
    console.error("Error updating trade-in:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Trade-in not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update trade-in" },
      { status: 500 }
    );
  }
}

// DELETE - Delete trade-in request
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "TRADE_IN_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Trade-in ID is required" }, { status: 400 });
    }

    await prisma.tradeInEnquiry.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TRADE_IN_DELETED",
        entity: "TradeInEnquiry",
        entityId: id,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/trade-in");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting trade-in:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Trade-in not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete trade-in" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET - List all orders with filtering, sorting, pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    await requirePermission(session.user.id, "ORDERS_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      condition: true,
                    },
                  },
                },
              },
            },
          },
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT - Update order status or payment status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ORDERS_EDIT");

    const body = await request.json();
    const { id, status, paymentStatus, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Validate status transitions
    const validStatuses = [
      "PENDING_PAYMENT",
      "PAYMENT_PROCESSING",
      "PAID",
      "CONFIRMED",
      "PROCESSING",
      "READY_FOR_PICKUP",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    const validPaymentStatuses = [
      "PENDING",
      "AWAITING_PROOF",
      "PROOF_SUBMITTED",
      "MATCHING",
      "VERIFIED",
      "APPROVED",
      "MISMATCH",
      "MANUAL_REVIEW",
      "REJECTED",
      "EXPIRED",
      "REFUNDED",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }

    // Update order
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.orderNotes = notes;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ORDER_STATUS_UPDATED",
        entity: "Order",
        entityId: id,
        changes: updateData,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Error updating order:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order (soft delete by updating status)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ORDERS_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Check if order can be cancelled
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow cancellation of certain statuses
    const cancellableStatuses = [
      "PENDING_PAYMENT",
      "PAYMENT_PROCESSING",
      "PAID",
      "CONFIRMED",
    ];

    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: "Order cannot be cancelled in current status" },
        { status: 400 }
      );
    }

    // Cancel order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ORDER_CANCELLED",
        entity: "Order",
        entityId: id,
        changes: { previousStatus: order.status, newStatus: "CANCELLED" },
      },
    });

    // Revalidate paths
    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}

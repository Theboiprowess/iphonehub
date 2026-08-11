import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET - List all customers with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "CUSTOMERS_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          whatsapp: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlist: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// GET single customer with details - will be handled by [id]/route.ts

// PUT - Update customer information
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "CUSTOMERS_EDIT");

    const body = await request.json();
    const { id, name, email, phone, whatsapp, role } = body;

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (role !== undefined) updateData.role = role;

    const customer = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
        role: true,
        updatedAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CUSTOMER_UPDATED",
        entity: "User",
        entityId: id,
        changes: updateData,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return NextResponse.json({ customer });
  } catch (error: any) {
    console.error("Error updating customer:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer (with confirmation)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "CUSTOMERS_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    // Check if customer has orders
    const orderCount = await prisma.order.count({
      where: { userId: id },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete customer with existing orders" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CUSTOMER_DELETED",
        entity: "User",
        entityId: id,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// Helper function to create audit log
async function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  changes: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        changes
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

// GET - List promotions with pagination, search, and filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "PROMOTIONS_VIEW");

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    // Search by name, description, or promo code
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { promoCode: { contains: search, mode: "insensitive" } }
      ];
    }

    // Filter by status (active/inactive)
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Auto-expire promotions past endDate
    await prisma.promotion.updateMany({
      where: {
        isActive: true,
        endDate: { lt: new Date() }
      },
      data: { isActive: false }
    });

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              model: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.promotion.count({ where })
    ]);

    return NextResponse.json({
      promotions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

// POST - Create new promotion
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "PROMOTIONS_EDIT");

    const data = await request.json();

    // Validation
    if (!data.name || !data.type || data.value === undefined) {
      return NextResponse.json(
        { error: "Name, type, and value are required" },
        { status: 400 }
      );
    }

    // Validate dates
    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Validate discount values based on type
    const value = parseFloat(data.value);
    if (isNaN(value) || value < 0) {
      return NextResponse.json(
        { error: "Value must be a positive number" },
        { status: 400 }
      );
    }

    if (data.type === "PERCENTAGE" && value > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    // Validate promo code uniqueness if provided
    if (data.promoCode) {
      const existing = await prisma.promotion.findUnique({
        where: { promoCode: data.promoCode }
      });
      if (existing) {
        return NextResponse.json(
          { error: "Promo code already exists" },
          { status: 400 }
        );
      }
    }

    // Create promotion
    const promotion = await prisma.promotion.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        value: value,
        promoCode: data.promoCode || null,
        startDate,
        endDate,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        productId: data.productId || null,
        variantId: data.variantId || null,
        categoryId: data.categoryId || null
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            model: true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "CREATE",
      "Promotion",
      promotion.id,
      { promotion }
    );

    // Revalidate cache
    revalidatePath("/admin/promotions");
    revalidatePath("/");

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error("Error creating promotion:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}

// PUT - Update promotion
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "PROMOTIONS_EDIT");

    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Promotion ID is required" },
        { status: 400 }
      );
    }

    // Check if promotion exists
    const existing = await prisma.promotion.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            model: true
          }
        }
      }
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate <= startDate) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    // Validate discount values if provided
    if (data.value !== undefined) {
      const value = parseFloat(data.value);
      if (isNaN(value) || value < 0) {
        return NextResponse.json(
          { error: "Value must be a positive number" },
          { status: 400 }
        );
      }

      if (data.type === "PERCENTAGE" && value > 100) {
        return NextResponse.json(
          { error: "Percentage discount cannot exceed 100%" },
          { status: 400 }
        );
      }
    }

    // Validate promo code uniqueness if changed
    if (data.promoCode && data.promoCode !== existing.promoCode) {
      const promoCodeExists = await prisma.promotion.findUnique({
        where: { promoCode: data.promoCode }
      });
      if (promoCodeExists) {
        return NextResponse.json(
          { error: "Promo code already exists" },
          { status: 400 }
        );
      }
    }

    // Update promotion
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type && { type: data.type }),
        ...(data.value !== undefined && { value: parseFloat(data.value) }),
        ...(data.promoCode !== undefined && { promoCode: data.promoCode || null }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.productId !== undefined && { productId: data.productId || null }),
        ...(data.variantId !== undefined && { variantId: data.variantId || null }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null })
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            model: true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "UPDATE",
      "Promotion",
      promotion.id,
      { before: existing, after: promotion }
    );

    // Revalidate cache
    revalidatePath("/admin/promotions");
    revalidatePath("/");

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

// DELETE - Delete promotion
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "PROMOTIONS_EDIT");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Promotion ID is required" },
        { status: 400 }
      );
    }

    // Check if promotion exists
    const existing = await prisma.promotion.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Promotion not found" },
        { status: 404 }
      );
    }

    // Safety check: Don't delete if promotion has been used
    if (existing.usageCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete promotion that has been used. Consider deactivating it instead." },
        { status: 400 }
      );
    }

    // Delete promotion
    await prisma.promotion.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "DELETE",
      "Promotion",
      id,
      { deleted: existing }
    );

    // Revalidate cache
    revalidatePath("/admin/promotions");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}

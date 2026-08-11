import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET - List all inventory with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "PRODUCTS_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const lowStockOnly = searchParams.get("lowStockOnly") === "true";
    const outOfStockOnly = searchParams.get("outOfStockOnly") === "true";
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (lowStockOnly) {
      where.availableStock = { lte: 5 };
    }

    if (outOfStockOnly) {
      where.availableStock = { lte: 0 };
    }

    if (search) {
      where.variant = {
        product: {
          name: { contains: search, mode: "insensitive" },
        },
      };
    }

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastStockUpdate: "desc" },
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  condition: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          movements: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      }),
      prisma.inventory.count({ where }),
    ]);

    return NextResponse.json({
      inventory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// PUT - Adjust stock
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "PRODUCTS_EDIT");

    const body = await request.json();
    const { variantId, adjustment, reason, notes } = body;

    if (!variantId || adjustment === undefined) {
      return NextResponse.json(
        { error: "Variant ID and adjustment are required" },
        { status: 400 }
      );
    }

    if (typeof adjustment !== "number") {
      return NextResponse.json({ error: "Adjustment must be a number" }, { status: 400 });
    }

    const validReasons = [
      "STOCK_ADD",
      "STOCK_REMOVE",
      "STOCK_ADJUST",
      "STOCK_RESERVE",
      "STOCK_RELEASE",
      "STOCK_SOLD",
      "STOCK_RESTOCK",
      "DAMAGED",
      "RETURNED",
      "MANUAL_ADJUST",
    ];

    if (reason && !validReasons.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    // Get current inventory
    const currentInventory = await prisma.inventory.findUnique({
      where: { variantId },
      include: { variant: true },
    });

    if (!currentInventory) {
      // Create inventory record if it doesn't exist
      const newInventory = await prisma.inventory.create({
        data: {
          variantId,
          currentStock: Math.max(0, adjustment),
          reservedStock: 0,
          availableStock: Math.max(0, adjustment),
          soldStock: 0,
          lowStockThreshold: 5,
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });

      // Create movement record
      await prisma.inventoryMovement.create({
        data: {
          inventoryId: newInventory.id,
          previousStock: 0,
          newStock: newInventory.currentStock,
          difference: adjustment,
          reason: reason || "MANUAL_ADJUST",
          notes,
          performedBy: session.user.id,
        },
      });

      // Update variant stock
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newInventory.currentStock },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "INVENTORY_CREATED",
          entity: "Inventory",
          entityId: newInventory.id,
          changes: { adjustment, reason },
        },
      });

      revalidatePath("/admin/inventory");
      revalidatePath("/admin");

      return NextResponse.json({ inventory: newInventory });
    }

    const previousStock = currentInventory.currentStock;
    const newStock = Math.max(0, previousStock + adjustment);
    const difference = newStock - previousStock;

    // Update inventory
    const updatedInventory = await prisma.inventory.update({
      where: { variantId },
      data: {
        currentStock: newStock,
        availableStock: Math.max(0, newStock - currentInventory.reservedStock),
        lastStockUpdate: new Date(),
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create movement record
    await prisma.inventoryMovement.create({
      data: {
        inventoryId: currentInventory.id,
        previousStock,
        newStock,
        difference,
        reason: reason || "MANUAL_ADJUST",
        notes,
        performedBy: session.user.id,
      },
    });

    // Update variant stock
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "INVENTORY_ADJUSTED",
        entity: "Inventory",
        entityId: currentInventory.id,
        changes: { previousStock, newStock, adjustment, reason },
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");

    return NextResponse.json({ inventory: updatedInventory });
  } catch (error: any) {
    console.error("Error adjusting inventory:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to adjust inventory" },
      { status: 500 }
    );
  }
}

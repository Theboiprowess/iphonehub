import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch single accessory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const accessory = await prisma.accessory.findUnique({
      where: { id },
    });

    if (!accessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    return NextResponse.json({ accessory });
  } catch (error) {
    console.error("Error fetching accessory:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessory" },
      { status: 500 }
    );
  }
}

// PUT - Update accessory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      comparePrice,
      costPrice,
      sku,
      stock,
      imageUrl,
      isFeatured,
      isActive,
      compatibility,
      status,
    } = body;

    // Generate new slug if name changed
    const existingAccessory = await prisma.accessory.findUnique({
      where: { id },
    });

    if (!existingAccessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }

    const slug = name !== existingAccessory.name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : existingAccessory.slug;

    const accessory = await prisma.accessory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        category,
        price,
        comparePrice,
        costPrice,
        sku,
        stock,
        imageUrl,
        isFeatured,
        isActive,
        compatibility,
        status,
        publishedAt:
          status === "PUBLISHED" && !existingAccessory.publishedAt
            ? new Date()
            : existingAccessory.publishedAt,
      },
    });

    return NextResponse.json({ accessory });
  } catch (error: any) {
    console.error("Error updating accessory:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update accessory" },
      { status: 500 }
    );
  }
}

// DELETE - Delete accessory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.accessory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json(
      { error: "Failed to delete accessory" },
      { status: 500 }
    );
  }
}

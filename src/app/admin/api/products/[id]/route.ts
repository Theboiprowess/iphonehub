import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - Single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true
          }
        },
        images: {
          orderBy: { order: "asc" }
        },
        devices: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH - Single product action (publish, hide, archive, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    // Check permissions based on action
    switch (action) {
      case "PUBLISH":
        requirePermission((session.user as any).role, "PRODUCTS_PUBLISH");
        break;
      case "DELETE":
        requirePermission((session.user as any).role, "PRODUCTS_DELETE");
        break;
      case "ARCHIVE":
        requirePermission((session.user as any).role, "PRODUCTS_ARCHIVE");
        break;
      default:
        requirePermission((session.user as any).role, "PRODUCTS_EDIT");
    }

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case "PUBLISH":
        updateData = { status: "PUBLISHED", isActive: true, publishedAt: new Date() };
        break;
      case "HIDE":
        updateData = { status: "HIDDEN", isActive: false };
        break;
      case "ARCHIVE":
        updateData = { status: "ARCHIVED", isActive: false };
        break;
      case "ACTIVATE":
        updateData = { isActive: true };
        break;
      case "DEACTIVATE":
        updateData = { isActive: false };
        break;
      case "FEATURE":
        updateData = { isFeatured: true };
        break;
      case "UNFEATURE":
        updateData = { isFeatured: false };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath(`/iphones/${product.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Single product
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

    requirePermission((session.user as any).role, "PRODUCTS_DELETE");

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has orders
    const hasOrders = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId: id
        }
      }
    });

    if (hasOrders) {
      // Archive instead of delete
      await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED", isActive: false }
      });

      revalidatePath("/iphones");
      revalidatePath("/");
      revalidatePath("/admin/(protected)/products");

      return NextResponse.json({ 
        message: "Product archived instead of deleted due to historical orders",
        archived: true
      });
    }

    // Safe to delete
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/iphones");
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
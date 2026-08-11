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

// PATCH - Single product action (publish, hide, archive, etc.) or full edit
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

    const body = await request.json();
    const { action } = body;

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
      case "EDIT":
        requirePermission((session.user as any).role, "PRODUCTS_EDIT");
        break;
      default:
        requirePermission((session.user as any).role, "PRODUCTS_EDIT");
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Handle full product edit (EDIT action)
    if (action === "EDIT") {
      const {
        name,
        model,
        categoryId,
        condition,
        description,
        isFeatured,
        isActive,
        status,
        metaTitle,
        metaDescription,
        variants,
        images,
        devices
      } = body;

      // Update product with full data
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          model,
          categoryId,
          condition,
          description,
          isFeatured,
          isActive,
          status,
          metaTitle,
          metaDescription,
          variants: {
            deleteMany: {},
            create: variants?.map((v: any) => ({
              storage: v.storage,
              colour: v.colour,
              price: v.price,
              comparePrice: v.comparePrice,
              costPrice: v.costPrice,
              sku: v.sku,
              stock: v.stock,
              reserved: v.reserved,
              isActive: v.isActive !== false
            })) || []
          },
          images: {
            deleteMany: {},
            create: images?.map((img: any) => ({
              url: img.url,
              alt: img.alt,
              order: img.order,
              type: img.type
            })) || []
          },
          devices: {
            deleteMany: {},
            create: devices?.map((d: any) => ({
              variantId: d.variantId,
              imei: d.imei,
              serialNumber: d.serialNumber,
              modelNumber: d.modelNumber,
              region: d.region,
              simType: d.simType,
              esimSupport: d.esimSupport,
              networkStatus: d.networkStatus,
              activationStatus: d.activationStatus,
              icloudStatus: d.icloudStatus,
              repairHistory: d.repairHistory,
              screenCondition: d.screenCondition,
              bodyCondition: d.bodyCondition,
              cameraCondition: d.cameraCondition,
              faceIdStatus: d.faceIdStatus,
              touchFunctionality: d.touchFunctionality,
              chargingPortCondition: d.chargingPortCondition,
              batteryHealth: d.batteryHealth,
              condition: d.condition,
              notes: d.notes,
              price: d.price,
              isSold: d.isSold,
              isReserved: d.isReserved
            })) || []
          }
        }
      });

      // Revalidate cache
      revalidatePath("/iphones");
      revalidatePath(`/iphones/${product.slug}`);
      revalidatePath("/");
      revalidatePath("/admin/(protected)/products");

      return NextResponse.json(updatedProduct);
    }

    // Handle status-only actions
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
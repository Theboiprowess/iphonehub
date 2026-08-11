import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, productIds } = await request.json();

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

    if (!action || !productIds || productIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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
      case "DELETE":
        // Check for orders before deleting
        const hasOrders = await prisma.orderItem.findFirst({
          where: {
            variant: {
              productId: { in: productIds }
            }
          }
        });

        if (hasOrders) {
          // Archive instead
          await prisma.product.updateMany({
            where: { id: { in: productIds } },
            data: { status: "ARCHIVED", isActive: false }
          });

          revalidatePath("/iphones");
          revalidatePath("/");
          revalidatePath("/admin/(protected)/products");

          return NextResponse.json({ 
            message: "Products archived instead of deleted due to historical orders",
            archived: true
          });
        }

        // Safe to delete
        await prisma.product.deleteMany({
          where: { id: { in: productIds } }
        });

        revalidatePath("/iphones");
        revalidatePath("/");
        revalidatePath("/admin/(protected)/products");

        return NextResponse.json({ message: "Products deleted successfully" });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Perform the update
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: updateData
    });

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json({ message: `Products ${action.toLowerCase()}d successfully` });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}

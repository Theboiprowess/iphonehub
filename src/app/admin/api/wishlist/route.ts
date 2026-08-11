import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - List all wishlist data aggregated
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ORDERS_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Fetch all wishlists with items
    const wishlists = await prisma.wishlist.findMany({
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
                    category: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten for easier display
    const wishlistItems = wishlists.flatMap((wishlist) =>
      wishlist.items.map((item) => ({
        id: item.id,
        customerId: wishlist.user.id,
        customerName: wishlist.user.name,
        customerEmail: wishlist.user.email,
        productId: item.variant.product.id,
        productName: item.variant.product.name,
        productCondition: item.variant.product.condition,
        categoryName: item.variant.product.category.name,
        variantId: item.variant.id,
        storage: item.variant.storage,
        colour: item.variant.colour,
        price: item.variant.price,
        addedAt: item.createdAt,
      }))
    );

    // Filter by search if provided
    let filteredItems = wishlistItems;
    if (search) {
      filteredItems = wishlistItems.filter(
        (item) =>
          item.productName.toLowerCase().includes(search.toLowerCase()) ||
          item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          item.customerEmail?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = filteredItems.length;
    const paginatedItems = filteredItems.slice(skip, skip + limit);

    // Calculate popular products
    const productCounts = wishlistItems.reduce((acc, item) => {
      const key = item.productId;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([productId, count]) => {
        const item = wishlistItems.find((i) => i.productId === productId);
        return {
          productId,
          productName: item?.productName || "Unknown",
          count,
        };
      });

    return NextResponse.json({
      wishlistItems: paginatedItems,
      popularProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

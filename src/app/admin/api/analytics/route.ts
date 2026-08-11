import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - Get analytics overview data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ANALYTICS_VIEW");

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get counts
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      topProducts,
      lowStockProducts,
      pendingEnquiries,
      pendingTradeIns,
    ] = await Promise.all([
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        where: { 
          createdAt: { gte: startDate },
          paymentStatus: "APPROVED",
        },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.orderItem.groupBy({
        by: ["variantId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.inventory.findMany({
        where: { availableStock: { lte: 5 } },
        include: {
          variant: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: 10,
      }),
      prisma.enquiry.count({ where: { status: "PENDING" } }),
      prisma.tradeInEnquiry.count({ where: { status: "NEW" } }),
    ]);

    // Get product details for top products
    const topProductIds = topProducts.map((p) => p.variantId);
    const topProductVariants = await prisma.productVariant.findMany({
      where: { id: { in: topProductIds } },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const topProductsWithDetails = topProducts.map((p) => {
      const variant = topProductVariants.find((v) => v.id === p.variantId);
      return {
        productName: variant?.product.name || "Unknown",
        quantity: p._sum.quantity,
      };
    });

    return NextResponse.json({
      overview: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingEnquiries,
        pendingTradeIns,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      lowStockProducts,
      period,
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

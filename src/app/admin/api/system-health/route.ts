import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - Get system health status
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "SYSTEM_HEALTH_VIEW");

    const startTime = Date.now();

    // Check database connectivity
    let dbStatus = "healthy";
    let dbLatency = 0;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startTime;
    } catch (error) {
      dbStatus = "unhealthy";
    }

    // Get database stats
    const [productCount, orderCount, userCount, recentErrors] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.auditLog.findMany({
        where: {
          action: { contains: "ERROR" },
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Check low stock count
    const lowStockCount = await prisma.inventory.count({
      where: { availableStock: { lte: 5 } },
    });

    // Get pending tasks
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING_PAYMENT" },
    });

    const pendingEnquiries = await prisma.enquiry.count({
      where: { status: "PENDING" },
    });

    return NextResponse.json({
      status: dbStatus === "healthy" ? "healthy" : "degraded",
      checks: {
        database: {
          status: dbStatus,
          latency: dbLatency,
        },
      },
      stats: {
        products: productCount,
        orders: orderCount,
        users: userCount,
        lowStock: lowStockCount,
        pendingOrders,
        pendingEnquiries,
      },
      recentErrors: recentErrors.map((error) => ({
        action: error.action,
        entity: error.entity,
        createdAt: error.createdAt,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching system health:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch system health" },
      { status: 500 }
    );
  }
}

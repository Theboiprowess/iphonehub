import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Dashboard API: Starting data fetch");
    
    // Get real dashboard statistics from database with error handling
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalCustomers,
      tradeInRequests,
      newTradeIns,
      enquiries,
      newEnquiries,
      pendingReviews,
      lowStockProducts
    ] = await Promise.allSettled([
      // Total products count
      prisma.product.count(),
      
      // Active products (isActive: true and not archived)
      prisma.product.count({
        where: {
          isActive: true,
          status: { not: { in: ['ARCHIVED', 'DRAFT'] } }
        }
      }),
      
      // Out of stock products
      prisma.product.count({
        where: {
          status: 'OUT_OF_STOCK',
          isActive: true
        }
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Pending orders
      prisma.order.count({
        where: { status: 'PENDING_PAYMENT' }
      }),
      
      // Completed orders
      prisma.order.count({
        where: { status: 'DELIVERED' }
      }),
      
      // Total revenue from completed orders
      prisma.order.aggregate({
        where: { 
          status: 'DELIVERED' as any,
          paymentStatus: 'SUCCESS' as any
        },
        _sum: {
          total: true
        }
      }),
      
      // Total customers (users with CUSTOMER role)
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      
      // Trade-in requests
      prisma.tradeInEnquiry.count(),
      
      // New trade-ins (last 7 days)
      prisma.tradeInEnquiry.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Enquiries
      prisma.enquiry.count(),
      
      // New enquiries (last 7 days)
      prisma.enquiry.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Pending reviews (all reviews for now)
      prisma.review.count(),
      
      // Low stock products (stock <= 5)
      prisma.productVariant.findMany({
        where: {
          stock: { lte: 5 },
          isActive: true
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    ]);

    // Extract values from Promise.allSettled results
    const extractValue = (result: any, defaultValue: any) => {
      if (result.status === 'fulfilled') return result.value;
      console.error("Dashboard API error:", result.reason);
      return defaultValue;
    };

    const totalProductsVal = extractValue(totalProducts, 0);
    const activeProductsVal = extractValue(activeProducts, 0);
    const outOfStockProductsVal = extractValue(outOfStockProducts, 0);
    const totalOrdersVal = extractValue(totalOrders, 0);
    const pendingOrdersVal = extractValue(pendingOrders, 0);
    const completedOrdersVal = extractValue(completedOrders, 0);
    const totalRevenueVal = extractValue(totalRevenue, { _sum: { total: 0 } })._sum.total || 0;
    const totalCustomersVal = extractValue(totalCustomers, 0);
    const tradeInRequestsVal = extractValue(tradeInRequests, 0);
    const newTradeInsVal = extractValue(newTradeIns, 0);
    const enquiriesVal = extractValue(enquiries, 0);
    const newEnquiriesVal = extractValue(newEnquiries, 0);
    const pendingReviewsVal = extractValue(pendingReviews, 0);
    const lowStockProductsVal = extractValue(lowStockProducts, []);

    // Format low stock products
    const lowStockItems = lowStockProductsVal.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.name,
      categoryName: item.product.category.name,
      stock: item.stock,
      storage: item.storage,
      colour: item.colour
    }));

    // Get recent orders with error handling
    let recentOrders: any[] = [];
    try {
      recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }

    // Get recent customers with error handling
    let recentCustomers: any[] = [];
    try {
      recentCustomers = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      });
    } catch (error) {
      console.error("Error fetching recent customers:", error);
    }

    console.log("Dashboard API: Successfully fetched data");

    return NextResponse.json({
      totalProducts: totalProductsVal,
      activeProducts: activeProductsVal,
      outOfStockProducts: outOfStockProductsVal,
      totalOrders: totalOrdersVal,
      pendingOrders: pendingOrdersVal,
      completedOrders: completedOrdersVal,
      totalRevenue: totalRevenueVal,
      totalCustomers: totalCustomersVal,
      tradeInRequests: tradeInRequestsVal,
      newTradeIns: newTradeInsVal,
      enquiries: enquiriesVal,
      newEnquiries: newEnquiriesVal,
      pendingReviews: pendingReviewsVal,
      lowStockProducts: lowStockItems,
      recentOrders,
      recentCustomers
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error("Critical error in dashboard API:", error);
    // Return default data instead of error to prevent page crash
    return NextResponse.json({
      totalProducts: 0,
      activeProducts: 0,
      outOfStockProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      tradeInRequests: 0,
      newTradeIns: 0,
      enquiries: 0,
      newEnquiries: 0,
      pendingReviews: 0,
      lowStockProducts: [],
      recentOrders: [],
      recentCustomers: [],
      error: "Using default data due to API error"
    });
  }
}

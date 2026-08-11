import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

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

// GET - List all reviews with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    
    try {
      requirePermission(userRole, "REVIEWS_VIEW");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // 'approved', 'pending', 'rejected', 'all'

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by approval status
    if (status === "approved") {
      where.isApproved = true;
    } else if (status === "pending") {
      where.isApproved = false;
    }
    // 'rejected' and 'all' don't have specific fields in current schema
    // We'll handle 'rejected' as a future enhancement if needed

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              model: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT - Update review status and add admin response
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    
    try {
      requirePermission(userRole, "REVIEWS_MODERATE");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const data = await request.json();
    const { id, isApproved, adminResponse } = data;

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (adminResponse !== undefined) updateData.adminResponse = adminResponse;

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      isApproved ? "REVIEW_APPROVED" : "REVIEW_UPDATED",
      "Review",
      id,
      {
        reviewId: id,
        productId: review.productId,
        productName: review.product.name,
        isApproved,
        hasAdminResponse: !!adminResponse,
      }
    );

    // Revalidate cache for frontend sync
    revalidatePath("/iphones");
    revalidatePath(`/iphones/${review.product.slug}`);
    revalidatePath("/admin/reviews");
    revalidatePath("/admin");
    revalidatePath("/api/products");

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error("Error updating review:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (with confirmation logic)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    
    try {
      requirePermission(userRole, "REVIEWS_MODERATE");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const confirmed = searchParams.get("confirmed");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Require confirmation
    if (confirmed !== "true") {
      return NextResponse.json({
        requiresConfirmation: true,
        message: "Are you sure you want to delete this review? This action cannot be undone.",
        review: {
          id: existingReview.id,
          productName: existingReview.product.name,
          customerName: existingReview.name,
          rating: existingReview.rating,
          comment: existingReview.comment,
        },
      });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "REVIEW_DELETED",
      "Review",
      id,
      {
        reviewId: id,
        productId: existingReview.productId,
        productName: existingReview.product.name,
        customerName: existingReview.name,
        rating: existingReview.rating,
      }
    );

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath(`/iphones/${existingReview.product.slug}`);
    revalidatePath("/admin/reviews");
    revalidatePath("/admin");
    revalidatePath("/api/products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

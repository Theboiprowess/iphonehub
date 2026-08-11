import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET - List all enquiries with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ENQUIRIES_VIEW");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// PUT - Update enquiry status or add response
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ENQUIRIES_EDIT");

    const body = await request.json();
    const { id, status, response } = body;

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (response !== undefined) {
      // Store response in message field for now
      updateData.message = `${body.message || ""}\n\n--- Admin Response ---\n${response}`;
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: updateData,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ENQUIRY_UPDATED",
        entity: "Enquiry",
        entityId: id,
        changes: updateData,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return NextResponse.json({ enquiry });
  } catch (error: any) {
    console.error("Error updating enquiry:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete enquiry
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ENQUIRIES_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    await prisma.enquiry.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ENQUIRY_DELETED",
        entity: "Enquiry",
        entityId: id,
      },
    });

    // Revalidate paths
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting enquiry:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}

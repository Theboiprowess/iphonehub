import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT - Update catalogue item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const catalogue = await prisma.priceCatalogue.update({
      where: { id },
      data: {
        title: body.title,
        series: body.series,
        model: body.model,
        storage: body.storage,
        price: body.price,
        description: body.description,
        order: body.order,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(catalogue);
  } catch (error) {
    console.error("Failed to update catalogue item:", error);
    return NextResponse.json({ error: "Failed to update catalogue item" }, { status: 500 });
  }
}

// DELETE - Delete catalogue item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.priceCatalogue.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete catalogue item:", error);
    return NextResponse.json({ error: "Failed to delete catalogue item" }, { status: 500 });
  }
}

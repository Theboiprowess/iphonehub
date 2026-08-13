import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const {
      message,
      type,
      isActive,
      priority,
      startDate,
      endDate,
      scrollingSpeed,
      displayDuration
    } = data;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        message,
        type,
        isActive,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        scrollingSpeed,
        displayDuration
      }
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.announcement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}

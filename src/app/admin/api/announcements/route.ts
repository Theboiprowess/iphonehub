import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received announcement data:", data);
    
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

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        message,
        type: type || 'INFORMATIONAL',
        isActive: isActive !== undefined ? isActive : true,
        priority: priority || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        scrollingSpeed: scrollingSpeed || 30,
        displayDuration: displayDuration || 0
      }
    });

    console.log("Created announcement:", announcement);
    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all public accessories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = {
      isActive: true,
      status: "PUBLISHED",
    };

    if (category) {
      where.category = category;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const accessories = await prisma.accessory.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ accessories });
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessories" },
      { status: 500 }
    );
  }
}

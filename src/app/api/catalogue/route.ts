import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all catalogue items (public endpoint)
export async function GET() {
  try {
    console.log('PUBLIC API: Fetching catalogue from database...');
    const catalogue = await prisma.priceCatalogue.findMany({
      where: {
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });
    console.log('PUBLIC API: Catalogue fetched successfully:', catalogue.length, 'items');
    console.log('PUBLIC API: Sample items:', catalogue.slice(0, 3));
    return NextResponse.json(catalogue);
  } catch (error) {
    console.error("PUBLIC API: Failed to fetch catalogue:", error);
    // Return empty array instead of error to prevent page crash
    return NextResponse.json([]);
  }
}

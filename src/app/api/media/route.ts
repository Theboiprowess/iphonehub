import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch public media items for gallery
export async function GET(request: Request) {
  try {
    console.log("Public media API called");
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    console.log("Request params:", { category, search });

    // Build simple where clause - allow all categories by default
    const where: any = {};

    // Only filter by category if specifically requested
    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } },
      ];
    }

    console.log("Database query where clause:", where);

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to prevent large responses
    });

    console.log("Found media items:", media.length);

    // Transform to gallery format - map categories to gallery-friendly names
    const categoryMap: Record<string, string> = {
      'PRODUCT': 'products',
      'HERO': 'store',
      'BLOG': 'service',
      'CEO': 'team',
      'LOGO': 'store',
      'BANNER': 'store',
      'OTHER': 'store'
    };

    const galleryImages = media.map((item) => ({
      id: item.id,
      src: item.url,
      alt: item.alt || item.filename,
      category: categoryMap[item.category] || 'store',
      title: (item.metadata as any)?.caption || item.filename,
      description: item.alt || "Photo from iPhone Hub Zimbabwe",
      location: "Masvingo, Zimbabwe",
    }));

    console.log("Returning gallery images:", galleryImages.length);

    return NextResponse.json({ images: galleryImages });
  } catch (error) {
    console.error("Error fetching gallery media:", error);
    console.error("Error stack:", (error as Error).stack);
    
    // Return empty array instead of error to prevent gallery from breaking
    return NextResponse.json({ images: [] });
  }
}

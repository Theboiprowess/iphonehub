import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch homepage configuration
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "HOMEPAGE_VIEW");

    let config = await prisma.homepageConfig.findFirst();
    
    // Create default config if none exists
    if (!config) {
      config = await prisma.homepageConfig.create({
        data: {
          heroHeading: "Find Your Perfect iPhone",
          heroSubtitle: "Boxed. Pre-Owned. Second-Hand.",
          heroDescription: "Discover premium iPhones at the best prices in Zimbabwe",
          heroCtaText: "SHOP iPHONES",
          heroCtaUrl: "/iphones",
          featuredProductIds: [],
        }
      });
    }

    // Fetch banners
    const banners = await prisma.homepageBanner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    // Fetch trust features
    const trustFeatures = await prisma.trustFeature.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return NextResponse.json({
      config,
      banners,
      trustFeatures
    });
  } catch (error) {
    console.error("Error fetching homepage config:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage configuration" },
      { status: 500 }
    );
  }
}

// PUT - Update homepage configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "HOMEPAGE_EDIT");

    const data = await request.json();

    let config = await prisma.homepageConfig.findFirst();
    
    if (config) {
      config = await prisma.homepageConfig.update({
        where: { id: config.id },
        data
      });
    } else {
      config = await prisma.homepageConfig.create({
        data
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage");

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating homepage config:", error);
    return NextResponse.json(
      { error: "Failed to update homepage configuration" },
      { status: 500 }
    );
  }
}

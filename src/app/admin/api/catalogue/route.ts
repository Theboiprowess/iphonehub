import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { modelToImageKey } from "@/lib/iphone-image-provider";

// GET - Fetch all catalogue items
export async function GET() {
  try {
    console.log("ADMIN API: Fetching catalogue from database...");
    const catalogue = await prisma.priceCatalogue.findMany({
      orderBy: { order: 'asc' },
    });
    console.log("ADMIN API: Fetched catalogue items:", catalogue.length);
    console.log("ADMIN API: Sample items:", catalogue.slice(0, 3));
    return NextResponse.json(catalogue);
  } catch (error: any) {
    console.error("ADMIN API: Failed to fetch catalogue:", error);
    
    // Check if table doesn't exist
    if (error.code === 'P2021') {
      console.error("ADMIN API: PriceCatalogue table doesn't exist");
      return NextResponse.json({ error: "PriceCatalogue table doesn't exist. Please run migration first." }, { status: 500 });
    }
    
    return NextResponse.json({ error: "Failed to fetch catalogue", details: String(error) }, { status: 500 });
  }
}

// POST - Create new catalogue item
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Creating catalogue item:", body);
    
    // Auto-generate imageKey if not provided
    const imageKey = body.imageKey || modelToImageKey(body.model);
    
    try {
      const catalogue = await prisma.priceCatalogue.create({
        data: {
          title: body.title,
          series: body.series,
          model: body.model,
          storage: body.storage,
          price: body.price,
          description: body.description,
          imageKey,
          imageOverride: body.imageOverride,
          order: body.order || 0,
          isActive: body.isActive !== undefined ? body.isActive : true,
        },
      });
      console.log("Created catalogue item:", catalogue);
      return NextResponse.json(catalogue);
    } catch (dbError: any) {
      // Table doesn't exist yet
      if (dbError.code === 'P2021') {
        console.error("PriceCatalogue table doesn't exist yet");
        return NextResponse.json({ error: "Database table not created yet. Please run migration first." }, { status: 500 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Failed to create catalogue item:", error);
    return NextResponse.json({ error: "Failed to create catalogue item", details: String(error) }, { status: 500 });
  }
}

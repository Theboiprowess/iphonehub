import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { modelToImageKey } from "@/lib/iphone-image-provider";

// POST - Migrate existing catalogue items with imageKeys
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Starting catalogue image migration...');
    
    // Fetch all catalogue items
    const catalogueItems = await prisma.priceCatalogue.findMany();
    
    console.log(`Found ${catalogueItems.length} catalogue items`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const item of catalogueItems) {
      // Skip if already has imageKey
      if (item.imageKey) {
        console.log(`Skipping ${item.model} - already has imageKey: ${item.imageKey}`);
        skippedCount++;
        continue;
      }
      
      // Generate imageKey from model
      const imageKey = modelToImageKey(item.model);
      
      // Update the item
      await prisma.priceCatalogue.update({
        where: { id: item.id },
        data: { imageKey },
      });
      
      console.log(`Updated ${item.model} with imageKey: ${imageKey}`);
      updatedCount++;
    }
    
    console.log(`Migration complete. Updated ${updatedCount} items, skipped ${skippedCount} items.`);
    
    return NextResponse.json({ 
      success: true, 
      updated: updatedCount,
      skipped: skippedCount,
      total: catalogueItems.length
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: "Migration failed", details: String(error) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting PriceCatalogue migration...");

    // Try to create the table using raw SQL with all required columns
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PriceCatalogue" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "series" TEXT NOT NULL,
          "model" TEXT NOT NULL,
          "storage" TEXT NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "description" TEXT,
          "imageKey" TEXT,
          "imageOverride" TEXT,
          "order" INTEGER NOT NULL DEFAULT 0,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          PRIMARY KEY ("id")
        );
      `);
      console.log("Table created or already exists");
    } catch (tableError: any) {
      console.log("Table creation failed, attempting to add missing columns:", tableError.message);
    }

    // Add missing columns if table exists but schema is outdated
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "PriceCatalogue" 
        ADD COLUMN IF NOT EXISTS "imageKey" TEXT;
      `);
      console.log("Added imageKey column");
    } catch (error) {
      console.log("imageKey column may already exist or error adding:", error);
    }

    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "PriceCatalogue" 
        ADD COLUMN IF NOT EXISTS "imageOverride" TEXT;
      `);
      console.log("Added imageOverride column");
    } catch (error) {
      console.log("imageOverride column may already exist or error adding:", error);
    }

    // Create indexes
    try {
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PriceCatalogue_series_idx" ON "PriceCatalogue"("series");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PriceCatalogue_isActive_idx" ON "PriceCatalogue"("isActive");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PriceCatalogue_order_idx" ON "PriceCatalogue"("order");`);
      console.log("Indexes created or already exist");
    } catch (indexError) {
      console.log("Indexes may already exist:", indexError);
    }

    return NextResponse.json({ success: true, message: "PriceCatalogue table migrated successfully" });
  } catch (error) {
    console.error("Failed to migrate table:", error);
    return NextResponse.json({ error: "Failed to migrate table", details: String(error) }, { status: 500 });
  }
}

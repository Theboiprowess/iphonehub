import { prisma } from "./src/lib/prisma";

async function addAppearanceColumns() {
  try {
    console.log("Adding appearance columns to SiteSettings table...");
    
    // Use raw SQL to add the missing columns
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SiteSettings" 
      ADD COLUMN IF NOT EXISTS "primaryColor" TEXT,
      ADD COLUMN IF NOT EXISTS "secondaryColor" TEXT,
      ADD COLUMN IF NOT EXISTS "buttonStyle" TEXT,
      ADD COLUMN IF NOT EXISTS "siteName" TEXT,
      ADD COLUMN IF NOT EXISTS "logo" TEXT,
      ADD COLUMN IF NOT EXISTS "favicon" TEXT,
      ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
      ADD COLUMN IF NOT EXISTS "seoDescription" TEXT,
      ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT,
      ADD COLUMN IF NOT EXISTS "ogImage" TEXT,
      ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en'
    `);
    
    console.log("Appearance columns added successfully!");
    
    // Set default values
    await prisma.$executeRawUnsafe(`
      UPDATE "SiteSettings" 
      SET "primaryColor" = '#0D161B',
          "secondaryColor" = '#CDB586',
          "buttonStyle" = 'solid',
          "language" = 'en'
      WHERE "primaryColor" IS NULL
    `);
    
    console.log("Default values set successfully!");
    
  } catch (error) {
    console.error("Error adding columns:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addAppearanceColumns();
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to create the table using raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PriceCatalogue" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "series" TEXT NOT NULL,
        "model" TEXT NOT NULL,
        "storage" TEXT NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "description" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        PRIMARY KEY ("id")
      );
    `);

    return NextResponse.json({ success: true, message: "PriceCatalogue table created successfully" });
  } catch (error) {
    console.error("Failed to create table:", error);
    return NextResponse.json({ error: "Failed to create table", details: String(error) }, { status: 500 });
  }
}

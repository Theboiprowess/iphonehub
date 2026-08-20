import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Fetch all accessories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Accessory model exists in the database
    try {
      const accessories = await prisma.accessory.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ accessories });
    } catch (prismaError: any) {
      // If the model doesn't exist, return empty array
      if (prismaError.code === 'P2027' || prismaError.message?.includes('does not exist')) {
        console.warn('Accessory model not found in database, returning empty array');
        return NextResponse.json({ accessories: [] });
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json(
      { error: "Failed to fetch accessories" },
      { status: 500 }
    );
  }
}

// POST - Create new accessory
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      comparePrice,
      costPrice,
      sku,
      stock,
      imageUrl,
      isFeatured,
      isActive,
      compatibility,
      status,
    } = body;

    // Generate ID and slug
    const id = crypto.randomUUID();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if Accessory model exists in the database
    try {
      const accessory = await prisma.accessory.create({
        data: {
          id,
          name,
          slug,
          description,
          category,
          price,
          comparePrice,
          costPrice,
          sku,
          stock,
          imageUrl,
          isFeatured,
          isActive,
          compatibility,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
      });

      return NextResponse.json({ accessory });
    } catch (prismaError: any) {
      // If the model doesn't exist, return specific error
      if (prismaError.code === 'P2027' || prismaError.message?.includes('does not exist') || prismaError.message?.includes('Unknown table')) {
        console.error('Accessory model not found in database:', prismaError);
        return NextResponse.json(
          { 
            error: "Database migration required. The Accessory table doesn't exist in the database. Please run the SQL migration script provided earlier.",
            details: "Run the SQL script in your Supabase database console to create the Accessory table.",
            migrationRequired: true
          },
          { status: 500 }
        );
      }
      throw prismaError;
    }
  } catch (error: any) {
    console.error("Error creating accessory:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create accessory" },
      { status: 500 }
    );
  }
}

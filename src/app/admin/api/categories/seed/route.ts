import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

// POST - Seed default categories
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "CATEGORIES_EDIT");

    const categories = [
      {
        name: 'Boxed iPhones',
        slug: 'boxed-iphones',
        description: 'Brand new boxed iPhones with full warranty',
        order: 1
      },
      {
        name: 'Pre-Owned iPhones',
        slug: 'pre-owned-iphones',
        description: 'High-quality pre-owned iPhones in excellent condition',
        order: 2
      },
      {
        name: 'Second-Hand iPhones',
        slug: 'second-hand-iphones',
        description: 'Affordable second-hand iPhones in good working condition',
        order: 3
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'iPhone accessories including cases, chargers, and more',
        order: 4
      }
    ];

    const created = [];
    for (const category of categories) {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        const createdCategory = await prisma.category.create({
          data: category
        });
        created.push(createdCategory);
      } else {
        created.push(existing);
      }
    }

    return NextResponse.json({ 
      message: "Categories seeded successfully",
      categories: created 
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}
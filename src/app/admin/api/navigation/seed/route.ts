import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

// Default navigation items for iPhone Hub Masvingo
const defaultNavigationItems = [
  {
    label: "Home",
    url: "/",
    order: 0,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Products",
    url: "/products",
    order: 1,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Boxed iPhones",
    url: "/products?condition=BOXED",
    order: 2,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Pre-Owned",
    url: "/products?condition=PRE_OWNED",
    order: 3,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Second Hand",
    url: "/products?condition=SECOND_HAND",
    order: 4,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Trade-In",
    url: "/trade-in",
    order: 5,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "About Us",
    url: "/about",
    order: 6,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Contact",
    url: "/contact",
    order: 7,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "FAQ",
    url: "/faq",
    order: 8,
    isExternal: false,
    isActive: true,
    parentId: null
  },
  {
    label: "Blog",
    url: "/blog",
    order: 9,
    isExternal: false,
    isActive: true,
    parentId: null
  }
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "NAVIGATION_EDIT");

    // Check if navigation items already exist
    const existingCount = await prisma.navigationItem.count();
    
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Navigation items already exist. Delete them first or edit directly." },
        { status: 400 }
      );
    }

    // Create default navigation items
    const createdItems = await prisma.navigationItem.createMany({
      data: defaultNavigationItems
    });

    return NextResponse.json({
      success: true,
      message: `Created ${createdItems.count} navigation items`,
      count: createdItems.count
    });
  } catch (error) {
    console.error("Error seeding navigation items:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to seed navigation items" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const condition = searchParams.get("condition");
    const model = searchParams.get("model");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const storage = searchParams.get("storage");
    const sortBy = searchParams.get("sortBy") || "featured";
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (condition) {
      // Convert hyphenated condition to underscored enum value
      const conditionMap: Record<string, string> = {
        'boxed': 'BOXED',
        'pre-owned': 'PRE_OWNED',
        'second-hand': 'SECOND_HAND'
      };
      where.condition = conditionMap[condition.toLowerCase()] || condition.toUpperCase();
    }

    if (model) {
      where.model = {
        contains: model,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          price: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          },
        },
      };
    }

    if (storage) {
      where.variants = {
        some: {
          storage: storage,
        },
      };
    }

    let orderBy: any = {};
    switch (sortBy) {
      case "price-asc":
        orderBy = { variants: { price: "asc" } };
        break;
      case "price-desc":
        orderBy = { variants: { price: "desc" } };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { isFeatured: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

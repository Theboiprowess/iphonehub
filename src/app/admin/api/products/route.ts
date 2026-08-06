import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// Helper function to generate unique slug
async function generateUniqueSlug(name: string, productId?: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (productId && existing.id === productId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Helper function to create audit log
async function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  changes: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        changes
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

// GET - List products with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const condition = searchParams.get("condition");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { variants: { some: { sku: { contains: search, mode: "insensitive" } } } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (condition) {
      where.condition = condition;
    }

    if (category) {
      where.categoryId = category;
    }

    const orderBy: any = {};
    if (sortBy === "price") {
      orderBy.variants = { price: sortOrder };
    } else if (sortBy === "stock") {
      orderBy.variants = { stock: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: {
              inventory: true
            }
          },
          images: {
            orderBy: { order: "asc" }
          },
          devices: true
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    console.log("User role:", userRole); // Debug logging
    
    if (!userRole) {
      return NextResponse.json({ error: "User role is undefined" }, { status: 401 });
    }

    try {
      requirePermission(userRole, "PRODUCTS_CREATE");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const data = await request.json();

    // Validation
    if (!data.name || !data.model || !data.categoryId || !data.condition) {
      return NextResponse.json(
        { error: "Missing required fields: name, model, categoryId, condition" },
        { status: 400 }
      );
    }

    if (!data.variants || data.variants.length === 0) {
      return NextResponse.json(
        { error: "At least one variant is required" },
        { status: 400 }
      );
    }

    console.log("Received product data:", data); // Debug logging

    // Validate prices
    for (const variant of data.variants) {
      if (variant.price <= 0) {
        return NextResponse.json(
          { error: "Price must be positive" },
          { status: 400 }
        );
      }
      if (variant.stock < 0) {
        return NextResponse.json(
          { error: "Stock cannot be negative" },
          { status: 400 }
        );
      }
    }

    // Validate battery health for pre-owned/second-hand
    if (data.condition !== "BOXED" && data.devices) {
      for (const device of data.devices) {
        if (device.batteryHealth !== undefined && (device.batteryHealth < 0 || device.batteryHealth > 100)) {
          return NextResponse.json(
            { error: "Battery health must be between 0 and 100" },
            { status: 400 }
          );
        }
      }
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(data.name);

    // Check if SKU is unique
    if (data.variants.some((v: any) => v.sku)) {
      const existingSKU = await prisma.productVariant.findFirst({
        where: {
          sku: { in: data.variants.filter((v: any) => v.sku).map((v: any) => v.sku) }
        }
      });

      if (existingSKU) {
        return NextResponse.json(
          { error: `SKU ${existingSKU.sku} already exists` },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        model: data.model,
        categoryId: data.categoryId,
        condition: data.condition,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status || "DRAFT",
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        variants: {
          create: data.variants.map((v: any) => ({
            storage: v.storage,
            colour: v.colour,
            price: v.price,
            comparePrice: v.comparePrice,
            costPrice: v.costPrice,
            sku: v.sku,
            stock: v.stock,
            reserved: v.reserved || 0,
            isActive: v.isActive !== false
          }))
        },
        images: data.images ? {
          create: data.images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt,
            order: img.order || index,
            type: img.type || "MAIN"
          }))
        } : undefined,
        devices: data.devices ? {
          create: data.devices.map((d: any) => ({
            variantId: d.variantId,
            imei: d.imei,
            serialNumber: d.serialNumber,
            modelNumber: d.modelNumber,
            region: d.region,
            simType: d.simType,
            esimSupport: d.esimSupport,
            networkStatus: d.networkStatus,
            activationStatus: d.activationStatus,
            icloudStatus: d.icloudStatus,
            repairHistory: d.repairHistory,
            screenCondition: d.screenCondition,
            bodyCondition: d.bodyCondition,
            cameraCondition: d.cameraCondition,
            faceIdStatus: d.faceIdStatus,
            touchFunctionality: d.touchFunctionality,
            chargingPortCondition: d.chargingPortCondition,
            batteryHealth: d.batteryHealth,
            condition: d.condition,
            notes: d.notes,
            price: d.price,
            isSold: d.isSold || false,
            isReserved: d.isReserved || false
          }))
        } : undefined
      },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true
          }
        },
        images: true,
        devices: true
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "CREATE",
      "Product",
      product.id,
      { productName: product.name, status: product.status }
    );

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    
    try {
      requirePermission(userRole, "PRODUCTS_EDIT");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
        devices: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has orders (prevent destructive deletion later)
    const hasOrders = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId: id
        }
      }
    });

    // Generate new slug if name changed
    let slug = existingProduct.slug;
    if (data.name && data.name !== existingProduct.name) {
      slug = await generateUniqueSlug(data.name, id);
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(slug !== existingProduct.slug && { slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.model && { model: data.model }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.condition && { condition: data.condition }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.status && {
          status: data.status,
          publishedAt: data.status === "PUBLISHED" && existingProduct.status !== "PUBLISHED" 
            ? new Date() 
            : existingProduct.publishedAt
        }),
        ...(data.variants && {
          variants: {
            deleteMany: {},
            create: data.variants.map((v: any) => ({
              storage: v.storage,
              colour: v.colour,
              price: v.price,
              comparePrice: v.comparePrice,
              costPrice: v.costPrice,
              sku: v.sku,
              stock: v.stock,
              reserved: v.reserved || 0,
              isActive: v.isActive !== false
            }))
          }
        }),
        ...(data.images && {
          images: {
            deleteMany: {},
            create: data.images.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt,
              order: img.order || index,
              type: img.type || "MAIN"
            }))
          }
        }),
        ...(data.devices && {
          devices: {
            deleteMany: {},
            create: data.devices.map((d: any) => ({
              variantId: d.variantId,
              imei: d.imei,
              serialNumber: d.serialNumber,
              modelNumber: d.modelNumber,
              region: d.region,
              simType: d.simType,
              esimSupport: d.esimSupport,
              networkStatus: d.networkStatus,
              activationStatus: d.activationStatus,
              icloudStatus: d.icloudStatus,
              repairHistory: d.repairHistory,
              screenCondition: d.screenCondition,
              bodyCondition: d.bodyCondition,
              cameraCondition: d.cameraCondition,
              faceIdStatus: d.faceIdStatus,
              touchFunctionality: d.touchFunctionality,
              chargingPortCondition: d.chargingPortCondition,
              batteryHealth: d.batteryHealth,
              condition: d.condition,
              notes: d.notes,
              price: d.price,
              isSold: d.isSold || false,
              isReserved: d.isReserved || false
            }))
          }
        })
      },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true
          }
        },
        images: true,
        devices: true
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "UPDATE",
      "Product",
      id,
      { 
        productName: updatedProduct.name,
        changes: {
          status: `${existingProduct.status} → ${updatedProduct.status}`,
          ...(data.name && { name: `${existingProduct.name} → ${data.name}` })
        }
      }
    );

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath(`/iphones/${slug}`);
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (with safety checks)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    
    try {
      requirePermission(userRole, "PRODUCTS_DELETE");
    } catch (error) {
      console.error("Permission check failed:", error);
      return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has orders
    const hasOrders = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId: id
        }
      }
    });

    if (hasOrders) {
      // Archive instead of delete
      await prisma.product.update({
        where: { id },
        data: {
          status: "ARCHIVED",
          isActive: false
        }
      });

      await createAuditLog(
        (session.user as any).id,
        "ARCHIVE",
        "Product",
        id,
        { productName: product.name, reason: "Has historical orders" }
      );

      return NextResponse.json({ 
        message: "Product archived instead of deleted due to historical orders",
        archived: true
      });
    }

    // Safe to delete
    await prisma.product.delete({
      where: { id }
    });

    await createAuditLog(
      (session.user as any).id,
      "DELETE",
      "Product",
      id,
      { productName: product.name }
    );

    // Revalidate cache
    revalidatePath("/iphones");
    revalidatePath("/");
    revalidatePath("/admin/(protected)/products");

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

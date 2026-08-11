import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// Helper function to generate unique slug
async function generateUniqueSlug(name: string, categoryId?: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogCategory.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (categoryId && existing.id === categoryId)) {
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

// GET - Fetch all blog categories
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_VIEW");

    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}

// POST - Create new blog category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_CREATE");

    const data = await request.json();
    const { name } = data;

    // Generate unique slug
    const slug = await generateUniqueSlug(name);

    const category = await prisma.blogCategory.create({
      data: {
        name,
        slug
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "CREATE",
      "BlogCategory",
      category.id,
      { name, slug }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating blog category:", error);
    return NextResponse.json(
      { error: "Failed to create blog category" },
      { status: 500 }
    );
  }
}

// PUT - Update blog category
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_EDIT");

    const { id, name } = await request.json();

    // Get existing category for audit log
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      select: { name: true, slug: true }
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Blog category not found" }, { status: 404 });
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = await generateUniqueSlug(name, id);
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug })
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "UPDATE",
      "BlogCategory",
      category.id,
      {
        old: { name: existingCategory.name },
        new: { name: category.name }
      }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating blog category:", error);
    return NextResponse.json(
      { error: "Failed to update blog category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog category
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Get category for audit log
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true }
    });

    if (!category) {
      return NextResponse.json({ error: "Blog category not found" }, { status: 404 });
    }

    // Delete category (cascade will handle relations)
    await prisma.blogCategory.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "DELETE",
      "BlogCategory",
      category.id,
      { name: category.name, slug: category.slug }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return NextResponse.json(
      { error: "Failed to delete blog category" },
      { status: 500 }
    );
  }
}

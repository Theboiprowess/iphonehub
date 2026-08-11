import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// Helper function to generate unique slug
async function generateUniqueSlug(name: string, tagId?: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogTag.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (tagId && existing.id === tagId)) {
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

// GET - Fetch all blog tags
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_VIEW");

    const tags = await prisma.blogTag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog tags" },
      { status: 500 }
    );
  }
}

// POST - Create new blog tag
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

    const tag = await prisma.blogTag.create({
      data: {
        name,
        slug
      }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "CREATE",
      "BlogTag",
      tag.id,
      { name, slug }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating blog tag:", error);
    return NextResponse.json(
      { error: "Failed to create blog tag" },
      { status: 500 }
    );
  }
}

// PUT - Update blog tag
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_EDIT");

    const { id, name } = await request.json();

    // Get existing tag for audit log
    const existingTag = await prisma.blogTag.findUnique({
      where: { id },
      select: { name: true, slug: true }
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Blog tag not found" }, { status: 404 });
    }

    // Generate new slug if name changed
    let slug = existingTag.slug;
    if (name && name !== existingTag.name) {
      slug = await generateUniqueSlug(name, id);
    }

    const tag = await prisma.blogTag.update({
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
      "BlogTag",
      tag.id,
      {
        old: { name: existingTag.name },
        new: { name: tag.name }
      }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error updating blog tag:", error);
    return NextResponse.json(
      { error: "Failed to update blog tag" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog tag
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
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    // Get tag for audit log
    const tag = await prisma.blogTag.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true }
    });

    if (!tag) {
      return NextResponse.json({ error: "Blog tag not found" }, { status: 404 });
    }

    // Delete tag (cascade will handle relations)
    await prisma.blogTag.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "DELETE",
      "BlogTag",
      tag.id,
      { name: tag.name, slug: tag.slug }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog tag:", error);
    return NextResponse.json(
      { error: "Failed to delete blog tag" },
      { status: 500 }
    );
  }
}

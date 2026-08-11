import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// Helper function to generate unique slug
async function generateUniqueSlug(title: string, postId?: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existing || (postId && existing.id === postId)) {
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

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_VIEW");

    const { id } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_EDIT");

    const data = await request.json();
    const { title, excerpt, content, featuredImage, author, isPublished, categoryIds, tagIds } = data;

    const { id } = await context.params;

    // Get existing post for audit log
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { title: true, isPublished: true, slug: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = await generateUniqueSlug(title, id);
    }

    // Set publishedAt if publishing for the first time
    let publishedAt = undefined;
    if (isPublished && !existingPost.isPublished) {
      publishedAt = new Date();
    } else if (!isPublished) {
      publishedAt = null;
    }

    // Update post
    const post = await prisma.$transaction(async (tx) => {
      // Delete existing category and tag relations
      await tx.blogCategoryPost.deleteMany({
        where: { blogPostId: id }
      });
      await tx.blogTagPost.deleteMany({
        where: { blogPostId: id }
      });

      // Update post with new data
      const updatedPost = await tx.blogPost.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(slug && { slug }),
          ...(excerpt !== undefined && { excerpt }),
          ...(content !== undefined && { content }),
          ...(featuredImage !== undefined && { featuredImage }),
          ...(author !== undefined && { author }),
          ...(isPublished !== undefined && { isPublished }),
          ...(publishedAt !== undefined && { publishedAt }),
          categories: categoryIds && categoryIds.length > 0
            ? {
                create: categoryIds.map((categoryId: string) => ({
                  categoryId
                }))
              }
            : undefined,
          tags: tagIds && tagIds.length > 0
            ? {
                create: tagIds.map((tagId: string) => ({
                  tagId
                }))
              }
            : undefined
        },
        include: {
          categories: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          }
        }
      });

      return updatedPost;
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "UPDATE",
      "BlogPost",
      post.id,
      {
        old: { title: existingPost.title, isPublished: existingPost.isPublished },
        new: { title: post.title, isPublished: post.isPublished }
      }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_DELETE");

    const { id } = await context.params;

    // Get post for audit log
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Delete post (cascade will handle relations)
    await prisma.blogPost.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "DELETE",
      "BlogPost",
      post.id,
      { title: post.title, slug: post.slug }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

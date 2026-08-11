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

// GET - List blog posts with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_VIEW");

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } }
      ];
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (category) {
      where.categories = {
        some: {
          categoryId: category
        }
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tagId: tag
        }
      };
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.blogPost.count({ where })
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "BLOG_CREATE");

    const data = await request.json();
    const { title, excerpt, content, featuredImage, author, isPublished, categoryIds, tagIds } = data;

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    // Set publishedAt if publishing
    const publishedAt = isPublished ? new Date() : null;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        author,
        isPublished: isPublished || false,
        publishedAt,
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

    // Create audit log
    await createAuditLog(
      (session.user as any).id,
      "CREATE",
      "BlogPost",
      post.id,
      { title, slug, isPublished }
    );

    // Revalidate cache
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

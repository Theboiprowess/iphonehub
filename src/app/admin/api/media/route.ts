import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Helper function to validate image file
function isValidImageFile(filename: string, mimetype: string): boolean {
  const validMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/bmp',
    'image/tiff'
  ];
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.bmp', '.tiff'];
  
  const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  
  return validMimeTypes.includes(mimetype) && validExtensions.includes(extension);
}

// Helper function to get image dimensions
async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  const sharp = require('sharp');
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height
  };
}

// GET - List all media
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "MEDIA_VIEW");

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (type) {
      where.category = type;
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.media.count({ where })
    ]);

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST - Upload media
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "MEDIA_UPLOAD");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageFile(file.name, file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    
    // Get image dimensions
    let width = 0;
    let height = 0;
    try {
      const dimensions = await getImageDimensions(Buffer.from(bytes));
      width = dimensions.width;
      height = dimensions.height;
    } catch (error) {
      console.error("Error getting image dimensions:", error);
    }

    // Write file to disk
    await writeFile(filepath, Buffer.from(bytes));

    // Save media metadata to database
    const media = await prisma.media.create({
      data: {
        filename,
        url: `/uploads/media/${filename}`,
        mimeType: file.type,
        size: file.size,
        alt: alt || null,
        category: (category && ['PRODUCT', 'HERO', 'BLOG', 'CEO', 'LOGO', 'BANNER', 'OTHER'].includes(category) 
          ? category 
          : 'OTHER') as any,
        metadata: {
          width,
          height,
          caption: caption || null
        },
        uploadedBy: (session.user as any).id
      }
    });

    revalidatePath("/admin/media");
    revalidatePath("/");

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    );
  }
}

// DELETE - Delete media
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "MEDIA_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Get media info to delete file
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    const filepath = join(process.cwd(), 'public', media.url);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Delete from database
    await prisma.media.delete({
      where: { id }
    });

    revalidatePath("/admin/media");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
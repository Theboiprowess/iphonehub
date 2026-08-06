import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "product";

    console.log("Upload request received:", { file: file?.name, type, fileSize: file?.size });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("File too large:", file.size);
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const filename = `${timestamp}-${random}${extension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    console.log("Upload directory:", uploadDir);
    
    if (!existsSync(uploadDir)) {
      console.log("Creating upload directory...");
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const filepath = path.join(uploadDir, filename);
    console.log("Writing file to:", filepath);
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${type}/${filename}`;
    console.log("File uploaded successfully:", publicUrl);

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 });
    }

    // Only allow deleting files from uploads directory
    if (!filePath.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), "public", filePath);
    
    const { unlink } = await import("fs/promises");
    try {
      await unlink(fullPath);
      return NextResponse.json({ success: true });
    } catch (error) {
      // File might not exist, that's okay
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
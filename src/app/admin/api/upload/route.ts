import { NextRequest, NextResponse } from "next/server";

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

    // Validate file size (max 2MB for base64 storage)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      console.error("File too large:", file.size);
      return NextResponse.json({ error: "File too large. Maximum size is 2MB for database storage." }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log("File converted to base64 successfully, size:", base64.length);

    return NextResponse.json({ 
      url: dataUrl, 
      filename: file.name,
      isBase64: true
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file: " + (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // For base64 storage, deletion is handled when the product is updated
  return NextResponse.json({ success: true });
}

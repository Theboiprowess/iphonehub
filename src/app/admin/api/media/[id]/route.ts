import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// PATCH - Update media (for future use)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const body = await request.json();
    
    // Only allow category update (no showInGallery field exists)
    const { category } = body;

    if (category) {
      const media = await prisma.media.update({
        where: { id: params.id },
        data: { category }
      });

      revalidatePath("/admin/media");
      revalidatePath("/gallery");

      return NextResponse.json(media);
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Failed to update media: " + (error as Error).message },
      { status: 500 }
    );
  }
}

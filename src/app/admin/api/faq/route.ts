import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch all FAQs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "FAQ_VIEW");

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const where: any = {};
    if (category) where.category = category;
    if (published === "true") where.isPublished = true;
    if (published === "false") where.isPublished = false;

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { order: "asc" }
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "FAQ_EDIT");

    const data = await request.json();

    const faq = await prisma.fAQ.create({
      data
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// PUT - Update FAQ
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "FAQ_EDIT");

    const { id, ...data } = await request.json();

    const faq = await prisma.fAQ.update({
      where: { id },
      data
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "FAQ_EDIT");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "FAQ ID is required" },
        { status: 400 }
      );
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
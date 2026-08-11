import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch contact information
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "CONTACT_VIEW");

    let contactInfo = await prisma.contactInfo.findFirst();
    
    // Create default contact info if none exists
    if (!contactInfo) {
      contactInfo = await prisma.contactInfo.create({
        data: {
          phonePrimary: "0773227172",
          phonePrimaryLabel: "Artwell",
          phoneSecondary: "0784502347",
          phoneSecondaryLabel: "Sabeka",
          whatsappPrimary: "0773227172",
          whatsappSecondary: "0784502347",
          email: "info@iphonehubzimbabwe.co.zw",
          city: "Zimbabwe",
          country: "Zimbabwe"
        }
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

// PUT - Update contact information
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "CONTACT_EDIT");

    const data = await request.json();

    let contactInfo = await prisma.contactInfo.findFirst();
    
    if (contactInfo) {
      contactInfo = await prisma.contactInfo.update({
        where: { id: contactInfo.id },
        data
      });
    } else {
      contactInfo = await prisma.contactInfo.create({
        data
      });
    }

    revalidatePath("/admin/contact");
    revalidatePath("/contact");

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: "Failed to update contact information" },
      { status: 500 }
    );
  }
}

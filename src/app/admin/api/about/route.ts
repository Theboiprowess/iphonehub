import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch about us information
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Temporarily disable permission check for debugging
    // requirePermission((session.user as any).role, "ABOUT_VIEW");

    let aboutUs = await prisma.aboutUs.findFirst();
    
    // Create default about us if none exists
    if (!aboutUs) {
      aboutUs = await prisma.aboutUs.create({
        data: {
          companyName: "iPhone Hub Zimbabwe",
          heading: "About iPhone Hub Zimbabwe",
          description: "Your trusted source for premium iPhones in Zimbabwe",
          ceoName: "Artwell Gwata",
          ceoTitle: "Founder & CEO",
          teamMembers: [],
          storePhotos: [],
          statistics: {},
          achievements: {}
        }
      });
    }

    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error("Error fetching about us:", error);
    return NextResponse.json(
      { error: "Failed to fetch about us information: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update about us information
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Temporarily disable permission check for debugging
    // requirePermission((session.user as any).role, "ABOUT_EDIT");

    const data = await request.json();

    console.log("Updating about us with data:", data);

    let aboutUs = await prisma.aboutUs.findFirst();
    
    if (aboutUs) {
      aboutUs = await prisma.aboutUs.update({
        where: { id: aboutUs.id },
        data
      });
    } else {
      aboutUs = await prisma.aboutUs.create({
        data
      });
    }

    console.log("About us updated successfully:", aboutUs.id);

    revalidatePath("/admin/about");
    revalidatePath("/about");

    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error("Error updating about us:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to update about us information: " + (error as Error).message },
      { status: 500 }
    );
  }
}

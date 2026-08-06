import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// GET - Fetch website settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "SETTINGS_VIEW");

    let settings = await prisma.siteSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName: "iPhone Hub Masvingo",
          businessEmail: "info@iphonehubmasvingo.co.zw",
          businessPhone: "0773227172",
          currency: "USD"
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update website settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "SETTINGS_EDIT");

    const data = await request.json();

    let settings = await prisma.siteSettings.findFirst();
    
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data
      });
    } else {
      settings = await prisma.siteSettings.create({
        data
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
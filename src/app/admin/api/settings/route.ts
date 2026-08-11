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

    // Temporarily disable permission check for debugging
    // requirePermission((session.user as any).role, "SETTINGS_VIEW");

    let settings = await prisma.siteSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          businessName: "iPhone Hub Zimbabwe",
          businessEmail: "info@iphonehubzimbabwe.co.zw",
          businessPhone: "0773227172",
          currency: "USD"
        }
      });
    }

    console.log("Fetched settings from database:", settings);

    // Check if new columns exist by checking if primaryColor is defined
    const hasNewColumns = 'primaryColor' in settings;
    console.log("Has new appearance columns:", hasNewColumns);

    // Map database fields to frontend format
    const frontendSettings = {
      id: settings.id,
      siteName: settings.businessName,
      contactEmail: settings.businessEmail,
      contactPhone: settings.businessPhone,
      whatsappNumber: settings.whatsappNumber,
      currency: settings.currency,
      language: hasNewColumns ? (settings as any).language || "en" : "en",
      // SEO settings
      seoTitle: (settings.seoMeta as any)?.title,
      seoDescription: (settings.seoMeta as any)?.description,
      seoKeywords: (settings.seoMeta as any)?.keywords,
      ogImage: (settings.seoMeta as any)?.ogImage,
      // Social media
      facebookUrl: (settings.socialMedia as any)?.facebook,
      instagramUrl: (settings.socialMedia as any)?.instagram,
      tiktokUrl: (settings.socialMedia as any)?.tiktok,
      // Appearance - only use if columns exist
      primaryColor: hasNewColumns ? (settings as any).primaryColor || "#0D161B" : "#0D161B",
      secondaryColor: hasNewColumns ? (settings as any).secondaryColor || "#CDB586" : "#CDB586",
      buttonStyle: hasNewColumns ? (settings as any).buttonStyle || "solid" : "solid",
      logo: hasNewColumns ? (settings as any).logo : undefined,
      favicon: hasNewColumns ? (settings as any).favicon : undefined,
    };

    console.log("Mapped frontend settings:", frontendSettings);

    return NextResponse.json(frontendSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings: " + (error as Error).message },
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

    // Temporarily disable permission check for debugging
    // requirePermission((session.user as any).role, "SETTINGS_EDIT");

    const data = await request.json();

    console.log("Received settings data:", data);

    let settings = await prisma.siteSettings.findFirst();
    
    // Check if new columns exist
    const hasNewColumns = settings && 'primaryColor' in settings;
    console.log("Has new appearance columns:", hasNewColumns);
    
    // Map frontend field names to database field names
    const dbData: any = {};
    
    // General settings (always available)
    if (data.siteName) dbData.businessName = data.siteName;
    if (data.contactEmail) dbData.businessEmail = data.contactEmail;
    if (data.contactPhone) dbData.businessPhone = data.contactPhone;
    if (data.whatsappNumber) dbData.whatsappNumber = data.whatsappNumber;
    if (data.currency) dbData.currency = data.currency;
    
    // SEO settings (always available via JSON)
    if (data.seoTitle || data.seoDescription || data.seoKeywords || data.ogImage) {
      dbData.seoMeta = {
        ...(settings?.seoMeta as any || {}),
        ...(data.seoTitle && { title: data.seoTitle }),
        ...(data.seoDescription && { description: data.seoDescription }),
        ...(data.seoKeywords && { keywords: data.seoKeywords }),
        ...(data.ogImage && { ogImage: data.ogImage }),
      };
    }
    
    // Social media settings (always available via JSON)
    if (data.facebookUrl || data.instagramUrl || data.tiktokUrl) {
      dbData.socialMedia = {
        ...(settings?.socialMedia as any || {}),
        ...(data.facebookUrl && { facebook: data.facebookUrl }),
        ...(data.instagramUrl && { instagram: data.instagramUrl }),
        ...(data.tiktokUrl && { tiktok: data.tiktokUrl }),
      };
    }
    
    // Appearance settings (only if columns exist)
    if (hasNewColumns) {
      if (data.language) dbData.language = data.language;
      if (data.primaryColor) dbData.primaryColor = data.primaryColor;
      if (data.secondaryColor) dbData.secondaryColor = data.secondaryColor;
      if (data.buttonStyle) dbData.buttonStyle = data.buttonStyle;
      if (data.logo) dbData.logo = data.logo;
      if (data.favicon) dbData.favicon = data.favicon;
    } else {
      console.log("Skipping appearance columns - they don't exist in database yet");
    }

    console.log("Mapped database data:", dbData);

    if (settings) {
      console.log("Updating existing settings with ID:", settings.id);
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: dbData
      });
    } else {
      console.log("Creating new settings record");
      settings = await prisma.siteSettings.create({
        data: dbData
      });
    }

    console.log("Updated settings:", settings);

    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/iphones");
    revalidatePath("/admin");

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to update settings: " + (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

// GET - List all EcoCash receiving accounts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission((session.user as any).role, "PRODUCTS_VIEW");

    const accounts = await prisma.ecoCashReceivingAccount.findMany({
      orderBy: [
        { isDefault: "desc" },
        { isActive: "desc" },
        { name: "asc" },
      ],
      include: {
        _count: {
          select: {
            payments: true,
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error("Error fetching EcoCash accounts:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch EcoCash accounts" },
      { status: 500 }
    );
  }
}

// POST - Create new EcoCash receiving account
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission((session.user as any).role, "PRODUCTS_EDIT");

    const body = await request.json();
    const { name, phoneNumber, isActive, isDefault, notes } = body;

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    // If setting as default, unset previous default
    if (isDefault) {
      await prisma.ecoCashReceivingAccount.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.ecoCashReceivingAccount.create({
      data: {
        name,
        phoneNumber,
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
        notes,
      },
    });

    return NextResponse.json({ account });
  } catch (error: any) {
    console.error("Error creating EcoCash account:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create EcoCash account" },
      { status: 500 }
    );
  }
}

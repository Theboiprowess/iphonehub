import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List active EcoCash receiving accounts (public endpoint for checkout)
export async function GET(request: NextRequest) {
  try {
    const accounts = await prisma.ecoCashReceivingAccount.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        isDefault: true,
      },
      orderBy: [
        { isDefault: "desc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error("Error fetching EcoCash accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch EcoCash accounts" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      whatsapp,
      currentModel,
      storage,
      condition,
      batteryHealth,
      colour,
      powersOn,
      touchscreenWorking,
      camerasWorking,
      faceIdWorking,
      chargingPortWorking,
      beenRepaired,
      hasCracks,
      liquidDamage,
      allButtonsWorking,
      hasOriginalBox,
      hasChargingCable,
      hasCharger,
      hasReceipt,
      otherAccessories,
      notes,
    } = body;

    const tradeInEnquiry = await prisma.tradeInEnquiry.create({
      data: {
        name,
        email,
        phone,
        whatsapp,
        currentModel,
        storage,
        condition,
        batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
        colour,
        // Store condition details in notes
        notes: JSON.stringify({
          functionality: {
            powersOn,
            touchscreenWorking,
            camerasWorking,
            faceIdWorking,
            chargingPortWorking,
            allButtonsWorking,
          },
          damage: {
            beenRepaired,
            hasCracks,
            liquidDamage,
          },
          accessories: {
            hasOriginalBox,
            hasChargingCable,
            hasCharger,
            hasReceipt,
            otherAccessories,
          },
          customerNotes: notes,
        }),
        status: "NEW",
      },
    });

    return NextResponse.json(tradeInEnquiry);
  } catch (error) {
    console.error("Error creating trade-in enquiry:", error);
    return NextResponse.json(
      { error: "Failed to create trade-in enquiry" },
      { status: 500 }
    );
  }
}
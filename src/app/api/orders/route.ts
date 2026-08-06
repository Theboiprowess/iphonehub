import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      whatsapp,
      deliveryAddress,
      city,
      deliveryMethod,
      paymentMethod,
      orderNotes,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        customerWhatsapp: whatsapp,
        deliveryAddress,
        city,
        orderNotes,
        subtotal,
        deliveryFee,
        total,
        currency: "USD",
        deliveryMethod,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
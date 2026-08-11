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
    const orderNumber = `IHZ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    // Determine initial order status based on payment method
    const initialStatus = paymentMethod === "ecocash" ? "PENDING_PAYMENT" : "PENDING_PAYMENT";

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
        status: initialStatus,
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

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

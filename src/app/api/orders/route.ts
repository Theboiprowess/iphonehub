import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

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
      receivingAccountId,
      orderNotes,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !deliveryMethod || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Server-side validation: Recalculate total and verify stock
    let calculatedSubtotal = 0;
    const itemsWithValidation = [];

    for (const item of items) {
      // Fetch variant from database
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { error: `Product variant not found: ${item.variantId}` },
          { status: 400 }
        );
      }

      if (!variant.isActive) {
        return NextResponse.json(
          { error: `Product is no longer available: ${variant.product.name}` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name}. Available: ${variant.stock}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      // Verify price matches current database price
      const currentPrice = Number(variant.price);
      const itemPrice = Number(item.price);

      if (Math.abs(currentPrice - itemPrice) > 0.01) {
        return NextResponse.json(
          { error: `Price mismatch for ${variant.product.name}. Please refresh your cart.` },
          { status: 400 }
        );
      }

      calculatedSubtotal += currentPrice * item.quantity;
      itemsWithValidation.push({
        variantId: item.variantId,
        quantity: item.quantity,
        price: currentPrice, // Use current database price
      });
    }

    // Calculate delivery fee server-side
    let calculatedDeliveryFee = 0;
    if (deliveryMethod === "local") {
      calculatedDeliveryFee = 15;
    } else if (deliveryMethod === "nationwide") {
      calculatedDeliveryFee = 25;
    }

    const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

    // Verify total matches
    if (Math.abs(calculatedTotal - Number(total)) > 0.01) {
      return NextResponse.json(
        { error: "Order total mismatch. Please refresh your cart." },
        { status: 400 }
      );
    }

    // Generate order number and payment reference
    const orderNumber = `IHZ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    const paymentReference = `IPH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

    // Determine initial order status based on payment method
    const initialStatus = paymentMethod === "ecocash" ? "PENDING_PAYMENT" : "PENDING_PAYMENT";

    // Get default EcoCash receiving account if not specified
    let receivingAccount = null;
    if (paymentMethod === "ecocash") {
      if (receivingAccountId) {
        receivingAccount = await prisma.ecoCashReceivingAccount.findUnique({
          where: { id: receivingAccountId },
        });
      } else {
        receivingAccount = await prisma.ecoCashReceivingAccount.findFirst({
          where: { isDefault: true, isActive: true },
        });
      }
    }

    // Create order in a transaction to ensure data consistency
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          paymentReference,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          customerWhatsapp: whatsapp,
          deliveryAddress,
          city,
          orderNotes,
          subtotal: calculatedSubtotal,
          deliveryFee: calculatedDeliveryFee,
          total: calculatedTotal,
          currency: "USD",
          deliveryMethod,
          paymentMethod,
          status: initialStatus,
          paymentStatus: "PENDING",
          items: {
            create: itemsWithValidation,
          },
        },
        include: {
          items: true,
        },
      });

      // Create payment record for EcoCash
      if (paymentMethod === "ecocash") {
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            receivingAccountId: receivingAccount?.id,
            provider: "ecocash",
            amount: calculatedTotal,
            currency: "USD",
            customerPhone: phone,
            status: "AWAITING_PROOF",
            metadata: {
              paymentReference,
              receivingAccountName: receivingAccount?.name,
              receivingAccountNumber: receivingAccount?.phoneNumber,
            },
          },
        });
      }

      return newOrder;
    });

    // Send order confirmation email to customer
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: {
          include: {
            receivingAccount: true,
          },
        },
      },
    });

    if (orderWithDetails) {
      const emailItems = orderWithDetails.items.map((item) => ({
        name: item.variant.product.name,
        storage: item.variant.storage,
        colour: item.variant.colour,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      // Send customer confirmation (fire and forget)
      sendOrderConfirmationEmail({
        customerName: orderWithDetails.customerName,
        customerEmail: orderWithDetails.customerEmail,
        orderNumber: orderWithDetails.orderNumber,
        paymentReference: orderWithDetails.paymentReference,
        items: emailItems,
        subtotal: Number(orderWithDetails.subtotal),
        deliveryFee: Number(orderWithDetails.deliveryFee),
        total: Number(orderWithDetails.total),
        deliveryMethod: orderWithDetails.deliveryMethod,
        deliveryAddress: orderWithDetails.deliveryAddress || undefined,
        city: orderWithDetails.city || undefined,
        paymentMethod: orderWithDetails.paymentMethod,
        receivingAccountName: orderWithDetails.payment?.receivingAccount?.name,
        receivingAccountNumber: orderWithDetails.payment?.receivingAccount?.phoneNumber,
      }).catch((err) => console.error('Failed to send customer email:', err));

      // Send admin notification (fire and forget)
      sendAdminOrderNotification({
        orderNumber: orderWithDetails.orderNumber,
        paymentReference: orderWithDetails.paymentReference,
        customerName: orderWithDetails.customerName,
        customerEmail: orderWithDetails.customerEmail,
        customerPhone: orderWithDetails.customerPhone,
        customerWhatsapp: orderWithDetails.customerWhatsapp || undefined,
        items: emailItems,
        total: Number(orderWithDetails.total),
        deliveryMethod: orderWithDetails.deliveryMethod,
        paymentMethod: orderWithDetails.paymentMethod,
        receivingAccountName: orderWithDetails.payment?.receivingAccount?.name,
        receivingAccountNumber: orderWithDetails.payment?.receivingAccount?.phoneNumber,
        deliveryAddress: orderWithDetails.deliveryAddress || undefined,
        city: orderWithDetails.city || undefined,
        orderNotes: orderWithDetails.orderNotes || undefined,
      }).catch((err) => console.error('Failed to send admin email:', err));
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

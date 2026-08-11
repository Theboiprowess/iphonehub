import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ecoCashProvider } from '@/lib/payment/ecocash-provider';

/**
 * POST /api/payments/ecocash/initiate
 * 
 * Initiates an EcoCash payment for an order
 * 
 * Request body:
 * {
 *   orderId: string,
 *   customerPhone: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone } = body;

    if (!orderId || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and customerPhone' },
        { status: 400 }
      );
    }

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists
    if (order.payment) {
      return NextResponse.json(
        { error: 'Payment already initiated for this order' },
        { status: 400 }
      );
    }

    // Recalculate order total server-side (security)
    let calculatedTotal = 0;
    for (const item of order.items) {
      calculatedTotal += Number(item.price) * item.quantity;
    }
    calculatedTotal += Number(order.deliveryFee);

    // Verify the calculated total matches the stored total
    if (Math.abs(calculatedTotal - Number(order.total)) > 0.01) {
      console.error('Order total mismatch:', { calculatedTotal, storedTotal: order.total });
      return NextResponse.json(
        { error: 'Order total verification failed' },
        { status: 400 }
      );
    }

    // Create payment record with AWAITING_PROOF status
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'ecocash',
        amount: order.total,
        currency: order.currency,
        customerPhone,
        status: 'AWAITING_PROOF' as any,
        metadata: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
        },
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAYMENT_PROCESSING' as any,
        paymentMethod: 'EcoCash',
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      instructions: 'Pay with EcoCash and submit your proof of payment',
    });

  } catch (error) {
    console.error('EcoCash payment initiation error:', error);
    return NextResponse.json(
      { error: 'Payment initiation failed', message: 'Please try again later' },
      { status: 500 }
    );
  }
}

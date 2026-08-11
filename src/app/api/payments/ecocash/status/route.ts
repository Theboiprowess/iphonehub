import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ecoCashProvider } from '@/lib/payment/ecocash-provider';

/**
 * GET /api/payments/ecocash/status?paymentId=xxx
 * 
 * Checks the current status of an EcoCash payment
 * 
 * Query params:
 * - paymentId: The payment ID in our database
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing paymentId parameter' },
        { status: 400 }
      );
    }

    // Fetch payment from database
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // If payment is already in a final state, return cached status
    if (['SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'].includes(payment.status)) {
      return NextResponse.json({
        success: true,
        status: payment.status,
        paymentId: payment.id,
        providerTransactionId: payment.providerTransactionId,
        merchantReference: payment.merchantReference,
        amount: Number(payment.amount),
        currency: payment.currency,
        completedAt: payment.completedAt,
      });
    }

    // If payment is PENDING or PROCESSING, check with EcoCash
    if (payment.providerTransactionId) {
      const ecoCashStatus = await ecoCashProvider.getPaymentStatus(payment.providerTransactionId);

      if (ecoCashStatus.success) {
        // Update payment status in database
        const updateData: any = {
          status: ecoCashStatus.status as any,
        };

        if (ecoCashStatus.status === 'SUCCESS' && ecoCashStatus.completedAt) {
          updateData.completedAt = ecoCashStatus.completedAt;
        }

        await prisma.payment.update({
          where: { id: payment.id },
          data: updateData,
        });

        // If payment is successful, update order status and reduce inventory
        if (ecoCashStatus.status === 'SUCCESS') {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'PAID' as any,
              paymentStatus: 'SUCCESS' as any,
            },
          });

          // Reduce inventory for each order item
          const orderItems = await prisma.orderItem.findMany({
            where: { orderId: payment.orderId },
          });

          for (const item of orderItems) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        } else if (ecoCashStatus.status === 'FAILED' || ecoCashStatus.status === 'CANCELLED' || ecoCashStatus.status === 'EXPIRED') {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'CANCELLED' as any,
              paymentStatus: 'FAILED' as any,
            },
          });
        }

        return NextResponse.json({
          success: true,
          status: ecoCashStatus.status,
          paymentId: payment.id,
          providerTransactionId: payment.providerTransactionId,
          merchantReference: payment.merchantReference,
          amount: Number(payment.amount),
          currency: payment.currency,
          completedAt: ecoCashStatus.completedAt,
        });
      }
    }

    // Return current database status if EcoCash check fails
    return NextResponse.json({
      success: true,
      status: payment.status,
      paymentId: payment.id,
      providerTransactionId: payment.providerTransactionId,
      merchantReference: payment.merchantReference,
      amount: Number(payment.amount),
      currency: payment.currency,
      completedAt: payment.completedAt,
    });

  } catch (error) {
    console.error('EcoCash status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}

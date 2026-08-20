import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ecoCashProvider } from '@/lib/payment/ecocash-provider';
import { sendOrderConfirmationEmail, sendPaymentSuccessEmail } from '@/lib/email';
import crypto from 'crypto';

/**
 * POST /api/payments/ecocash/webhook
 * 
 * Handles EcoCash payment callbacks/webhooks
 * This endpoint processes payment status updates from EcoCash
 * 
 * Security features:
 * - Signature verification (if EcoCash provides it)
 * - Idempotency handling
 * - Transaction verification
 * - Merchant validation
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract signature from headers if provided
    const signature = req.headers.get('x-ecocash-signature');
    
    // Verify webhook signature if provided
    if (signature) {
      const isValid = await verifyWebhookSignature(body, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const { 
      transactionId, 
      merchantReference, 
      status, 
      amount, 
      currency,
      timestamp 
    } = body;

    if (!transactionId || !merchantReference || !status) {
      return NextResponse.json(
        { error: 'Missing required webhook fields' },
        { status: 400 }
      );
    }

    // Find payment by merchant reference or provider transaction ID
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { merchantReference },
          { providerTransactionId: transactionId },
        ],
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.error('Payment not found for webhook:', { transactionId, merchantReference });
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Idempotency check - if payment is already in final state, don't process again
    if (['APPROVED', 'REJECTED', 'EXPIRED', 'REFUNDED'].includes(payment.status)) {
      console.log('Payment already in final state:', payment.status);
      return NextResponse.json({ success: true, status: payment.status });
    }

    // Verify transaction details match our records
    const amountMatches = Math.abs(Number(amount) - Number(payment.amount)) < 0.01;
    const currencyMatches = currency === payment.currency;

    if (!amountMatches || !currencyMatches) {
      console.error('Webhook transaction mismatch:', {
        webhook: { amount, currency },
        database: { amount: payment.amount, currency: payment.currency },
      });
      return NextResponse.json(
        { error: 'Transaction mismatch' },
        { status: 400 }
      );
    }

    // Map EcoCash status to our payment status
    const mappedStatus = mapEcoCashStatus(status);

    // Update payment status
    const updateData: any = {
      status: mappedStatus as any,
      providerTransactionId: transactionId,
      merchantReference,
      rawResponse: JSON.stringify(body),
    };

    if (mappedStatus === 'APPROVED') {
      updateData.completedAt = new Date();
    } else if (['REJECTED', 'CANCELLED', 'EXPIRED'].includes(mappedStatus)) {
      updateData.failureReason = body.reason || status;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: updateData,
    });

    // Update order status based on payment status
    if (mappedStatus === 'APPROVED') {
      // Verify payment with EcoCash before marking as paid
      const verification = await ecoCashProvider.verifyPayment(
        transactionId,
        Number(payment.amount),
        payment.currency
      );

      if (!verification.valid) {
        console.error('Payment verification failed:', verification);
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REJECTED' as any,
            failureReason: 'Verification failed',
          },
        });
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        );
      }

      // Use transaction to ensure atomic stock updates
      await prisma.$transaction(async (tx) => {
        // Fetch order with items for stock updates
        const orderWithItems = await tx.order.findUnique({
          where: { id: payment.orderId },
          include: {
            items: {
              include: {
                variant: true,
              },
            },
          },
        });

        if (!orderWithItems) {
          throw new Error(`Order not found: ${payment.orderId}`);
        }

        // Update order to PAID
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: 'PAID' as any,
            paymentStatus: 'SUCCESS' as any,
          },
        });

        // Reduce inventory atomically
        for (const item of orderWithItems.items) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (!variant) {
            throw new Error(`Variant not found: ${item.variantId}`);
          }

          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for variant ${item.variantId}. Available: ${variant.stock}, Requested: ${item.quantity}`);
          }

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Update inventory if it exists
          const inventory = await tx.inventory.findUnique({
            where: { variantId: item.variantId },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { variantId: item.variantId },
              data: {
                currentStock: {
                  decrement: item.quantity,
                },
                availableStock: {
                  decrement: item.quantity,
                },
                soldStock: {
                  increment: item.quantity,
                },
                lastStockUpdate: new Date(),
              },
            });

            // Create inventory movement record
            await tx.inventoryMovement.create({
              data: {
                inventoryId: inventory.id,
                previousStock: inventory.currentStock,
                newStock: inventory.currentStock - item.quantity,
                difference: -item.quantity,
                reason: 'STOCK_SOLD',
                referenceId: payment.orderId,
                notes: `Order payment approved`,
              },
            });
          }
        }
      });

      // Send payment success email
      const orderWithDetails = await prisma.order.findUnique({
        where: { id: payment.orderId },
      });

      if (orderWithDetails) {
        // Send payment success email (fire and forget)
        sendPaymentSuccessEmail({
          customerName: orderWithDetails.customerName,
          customerEmail: orderWithDetails.customerEmail,
          orderNumber: orderWithDetails.orderNumber,
          orderTotal: Number(orderWithDetails.total),
          paymentDate: new Date().toISOString(),
        }).catch((err) => console.error('Failed to send payment success email:', err));
      }

    } else if (['REJECTED', 'CANCELLED', 'EXPIRED'].includes(mappedStatus)) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'CANCELLED' as any,
          paymentStatus: 'REJECTED' as any,
        },
      });
    }

    return NextResponse.json({ success: true, status: mappedStatus });

  } catch (error) {
    console.error('EcoCash webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// ===== HELPER FUNCTIONS =====

async function verifyWebhookSignature(body: any, signature: string): Promise<boolean> {
  // Verify webhook signature if EcoCash provides one
  // This prevents webhook spoofing
  
  const apiSecret = process.env.ECOCASH_API_SECRET;
  if (!apiSecret) {
    console.warn('ECOCASH_API_SECRET not configured, skipping signature verification');
    return true;
  }

  // Implementation depends on EcoCash's signing mechanism
  // Common approach: HMAC-SHA256 of the body with the API secret
  const expectedSignature = crypto
    .createHmac('sha256', apiSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  return signature === expectedSignature;
}

function mapEcoCashStatus(ecocashStatus: string): 'PENDING' | 'AWAITING_PROOF' | 'PROOF_SUBMITTED' | 'MATCHING' | 'VERIFIED' | 'APPROVED' | 'MISMATCH' | 'MANUAL_REVIEW' | 'REJECTED' | 'EXPIRED' | 'REFUNDED' {
  const statusMap: Record<string, any> = {
    'pending': 'PENDING',
    'processing': 'MATCHING',
    'completed': 'APPROVED',
    'success': 'APPROVED',
    'paid': 'APPROVED',
    'failed': 'REJECTED',
    'declined': 'REJECTED',
    'cancelled': 'REJECTED',
    'expired': 'EXPIRED',
    'refunded': 'REFUNDED',
  };
  return statusMap[ecocashStatus.toLowerCase()] || 'PENDING';
}

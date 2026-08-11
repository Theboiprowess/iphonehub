import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ecoCashProvider } from '@/lib/payment/ecocash-provider';
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
        order: {
          include: {
            items: true,
          },
        },
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

      // Update order to PAID
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'PAID' as any,
          paymentStatus: 'SUCCESS' as any,
        },
      });

      // Reduce inventory
      for (const item of payment.order.items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // TODO: Send customer confirmation email/WhatsApp
      // TODO: Send admin notification

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

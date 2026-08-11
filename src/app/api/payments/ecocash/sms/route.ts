import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EcoCashSmsParser } from '@/lib/payment/ecocash-sms-parser';
import crypto from 'crypto';

/**
 * POST /api/payments/ecocash/sms
 * 
 * Receives EcoCash transaction notifications from merchant Android phone
 * 
 * Security:
 * - Requires ECOCASH_SMS_FORWARDER_TOKEN in header
 * - Validates message structure
 * - Prevents duplicate transactions
 * - Triggers payment matching
 * 
 * Headers:
 * Authorization: Bearer ECOCASH_SMS_FORWARDER_TOKEN
 * 
 * Request body:
 * {
 *   rawMessage: string,
 *   sender: string,
 *   timestamp: string,
 *   deviceId: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify SMS forwarder authentication
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.ECOCASH_SMS_FORWARDER_TOKEN;
    
    if (!expectedToken) {
      return NextResponse.json(
        { error: 'SMS forwarder not configured' },
        { status: 500 }
      );
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (token !== expectedToken) {
      console.error('Invalid SMS forwarder token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { rawMessage, sender, timestamp, deviceId } = body;
    
    if (!rawMessage) {
      return NextResponse.json(
        { error: 'Missing required field: rawMessage' },
        { status: 400 }
      );
    }
    
    // Parse the SMS message
    const parseResult = EcoCashSmsParser.parseSms(rawMessage);
    
    if (!parseResult.success || !parseResult.transaction) {
      return NextResponse.json(
        { error: 'Failed to parse SMS message', details: parseResult.error },
        { status: 400 }
      );
    }
    
    const transaction = parseResult.transaction;
    
    // Validate parsed transaction
    const validation = EcoCashSmsParser.validateTransaction(transaction);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid transaction data', errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Check for duplicate transaction reference
    const existingTransaction = await prisma.ecoCashTransaction.findUnique({
      where: { transactionReference: transaction.transactionReference },
    });
    
    if (existingTransaction) {
      console.log('Duplicate transaction reference:', transaction.transactionReference);
      return NextResponse.json(
        { error: 'Duplicate transaction reference' },
        { status: 409 }
      );
    }
    
    // Get merchant number from settings
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    
    const merchantNumber = (settings?.paymentConfig as any)?.merchantNumber || '';
    const merchantName = settings?.businessName || 'iPhone Hub Zimbabwe';
    
    // Update transaction with merchant info
    transaction.merchantNumber = merchantNumber;
    transaction.merchantName = transaction.merchantName || merchantName;
    
    // Store the transaction
    const ecoCashTransaction = await prisma.ecoCashTransaction.create({
      data: {
        transactionReference: transaction.transactionReference,
        amount: transaction.amount,
        currency: transaction.currency,
        senderPhone: transaction.senderPhone,
        merchantNumber: transaction.merchantNumber,
        merchantName: transaction.merchantName,
        transactionDate: transaction.transactionDate,
        transactionTime: transaction.transactionTime,
        rawMessage: transaction.rawMessage,
        sourceDevice: deviceId,
        status: 'PENDING',
      },
    });
    
    // Trigger payment matching
    await matchPayment(ecoCashTransaction);
    
    return NextResponse.json({
      success: true,
      transactionId: ecoCashTransaction.id,
      transactionReference: ecoCashTransaction.transactionReference,
      status: 'PENDING',
    });
    
  } catch (error) {
    console.error('EcoCash SMS processing error:', error);
    return NextResponse.json(
      { error: 'SMS processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Match EcoCash transaction with pending payment
 */
async function matchPayment(ecoCashTransaction: any) {
  try {
    // Find pending EcoCash payments with matching reference
    const payment = await prisma.payment.findFirst({
      where: {
        provider: 'ecocash',
        status: {
          in: ['AWAITING_PROOF', 'PROOF_SUBMITTED', 'MATCHING'] as any,
        },
        OR: [
          { amount: ecoCashTransaction.amount },
        ],
      },
      include: {
        order: true,
      },
    });
    
    if (!payment) {
      console.log('No matching payment found for transaction:', ecoCashTransaction.transactionReference);
      // Transaction will remain PENDING until proof is submitted
      return;
    }
    
    // Perform detailed matching
    const matchResult = await verifyMatch(payment, ecoCashTransaction);
    
    if (matchResult.valid) {
      // Update transaction status
      await prisma.ecoCashTransaction.update({
        where: { id: ecoCashTransaction.id },
        data: {
          status: 'MATCHED',
          matchedPaymentId: payment.id,
        },
      });
      
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'VERIFIED',
          providerTransactionId: ecoCashTransaction.transactionReference,
          merchantReference: ecoCashTransaction.transactionReference,
        },
      });
      
      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'PAID' as any,
          paymentStatus: 'SUCCESS' as any,
        },
      });
      
      // Reduce inventory
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
      
      // Log audit event
      await prisma.paymentAuditLog.create({
        data: {
          paymentId: payment.id,
          action: 'PAYMENT_VERIFIED',
          actorType: 'SYSTEM',
          metadata: {
            transactionReference: ecoCashTransaction.transactionReference,
            matchReason: matchResult.reason,
          },
        },
      });
      
      console.log('Payment successfully verified:', payment.id);
    } else {
      // Mark as mismatch
      await prisma.ecoCashTransaction.update({
        where: { id: ecoCashTransaction.id },
        data: {
          status: 'MISMATCH',
        },
      });
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'MISMATCH',
        },
      });
      
      // Log audit event
      await prisma.paymentAuditLog.create({
        data: {
          paymentId: payment.id,
          action: 'PAYMENT_MISMATCH',
          actorType: 'SYSTEM',
          metadata: {
            transactionReference: ecoCashTransaction.transactionReference,
            mismatchReason: matchResult.reason,
          },
        },
      });
      
      console.log('Payment mismatch:', payment.id, matchResult.reason);
    }
  } catch (error) {
    console.error('Payment matching error:', error);
  }
}

/**
 * Verify payment match
 */
async function verifyMatch(payment: any, transaction: any): Promise<{
  valid: boolean;
  reason: string;
}> {
  const errors: string[] = [];
  
  // Check amount match (exact match required)
  const amountMatch = Math.abs(Number(payment.amount) - Number(transaction.amount)) < 0.01;
  if (!amountMatch) {
    errors.push(`Amount mismatch: expected ${payment.amount}, got ${transaction.amount}`);
  }
  
  // Check currency match
  if (payment.currency !== transaction.currency) {
    errors.push(`Currency mismatch: expected ${payment.currency}, got ${transaction.currency}`);
  }
  
  // Check phone match (if available)
  if (payment.customerPhone && transaction.senderPhone) {
    const normalizedPaymentPhone = payment.customerPhone.replace(/[\s-]/g, '');
    const normalizedSenderPhone = transaction.senderPhone.replace(/[\s-]/g, '');
    
    if (!normalizedPaymentPhone.includes(normalizedSenderPhone) && 
        !normalizedSenderPhone.includes(normalizedPaymentPhone)) {
      errors.push(`Phone mismatch: expected ${payment.customerPhone}, got ${transaction.senderPhone}`);
    }
  }
  
  // Check transaction reference in metadata or proof
  const proofs = await prisma.paymentProof.findMany({
    where: { paymentId: payment.id },
  });
  
  if (proofs.length > 0) {
    const referenceMatch = proofs.some(
      (proof: any) => proof.transactionReference === transaction.transactionReference
    );
    
    if (!referenceMatch) {
      errors.push(`Transaction reference mismatch: customer submitted ${proofs[0].transactionReference}, SMS has ${transaction.transactionReference}`);
    }
  }
  
  // Check if transaction already used
  const usedTransaction = await prisma.ecoCashTransaction.findFirst({
    where: {
      transactionReference: transaction.transactionReference,
      status: 'MATCHED',
      NOT: { id: transaction.id },
    },
  });
  
  if (usedTransaction) {
    errors.push('Transaction reference already used for another payment');
  }
  
  return {
    valid: errors.length === 0,
    reason: errors.length > 0 ? errors.join('; ') : 'All checks passed',
  };
}

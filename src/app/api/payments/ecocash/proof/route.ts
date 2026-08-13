import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/payments/ecocash/proof
 * 
 * Handles customer proof submission for EcoCash payments
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const paymentId = formData.get('paymentId') as string;
    const transactionReference = formData.get('transactionReference') as string;
    const amount = formData.get('amount') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const paymentDate = formData.get('paymentDate') as string;
    const screenshot = formData.get('screenshot') as File;
    
    if (!paymentId || !transactionReference || !amount || !senderPhone || !paymentDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate transaction reference format
    if (transactionReference.length < 6) {
      return NextResponse.json(
        { error: 'Invalid transaction reference' },
        { status: 400 }
      );
    }
    
    // Check for duplicate transaction reference
    const existingProof = await prisma.paymentProof.findFirst({
      where: {
        transactionReference,
        status: {
          in: ['PENDING', 'MATCHED', 'APPROVED'],
        },
      },
    });
    
    if (existingProof) {
      return NextResponse.json(
        { error: 'This transaction reference has already been used' },
        { status: 400 }
      );
    }
    
    // Fetch payment
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
    
    // Validate amount matches
    const amountMatch = Math.abs(Number(amount) - Number(payment.amount)) < 0.01;
    if (!amountMatch) {
      return NextResponse.json(
        { error: 'Amount does not match order total' },
        { status: 400 }
      );
    }
    
    // Upload screenshot if provided
    let screenshotUrl = null;
    if (screenshot) {
      // TODO: Implement file upload to cloud storage
      // For now, just store the filename
      screenshotUrl = screenshot.name;
    }
    
    // Create payment proof record
    const proof = await prisma.paymentProof.create({
      data: {
        paymentId,
        transactionReference,
        amount: parseFloat(amount),
        senderPhone,
        paymentDate: new Date(paymentDate),
        screenshotUrl,
        status: 'PENDING',
      },
    });
    
    // Update payment status
    const currentMetadata = (payment.metadata as any) || {};
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PROOF_SUBMITTED' as any,
        metadata: {
          ...currentMetadata,
          proofId: proof.id,
          proofSubmittedAt: new Date().toISOString(),
        },
      },
    });
    
    // Log audit event
    await prisma.paymentAuditLog.create({
      data: {
        paymentId,
        action: 'PROOF_SUBMITTED',
        actorType: 'CUSTOMER',
        metadata: {
          transactionReference,
          senderPhone,
          paymentDate,
          hasScreenshot: !!screenshot,
        },
      },
    });
    
    // Check if merchant SMS already arrived for this receiving account
    const ecoCashTransaction = await prisma.ecoCashTransaction.findFirst({
      where: {
        transactionReference,
        receivingAccountId: payment.receivingAccountId,
        status: 'PENDING',
      },
    });
    
    if (ecoCashTransaction) {
      // Trigger matching
      await matchWithTransaction(payment, ecoCashTransaction);
    }
    
    return NextResponse.json({
      success: true,
      proofId: proof.id,
      status: 'PENDING',
    });
    
  } catch (error) {
    console.error('Proof submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit proof' },
      { status: 500 }
    );
  }
}

/**
 * Match payment with transaction
 */
async function matchWithTransaction(payment: any, transaction: any) {
  try {
    const errors: string[] = [];
    const paymentId = payment.id;
    
    // Check receiving account match
    if (payment.receivingAccountId && transaction.receivingAccountId) {
      if (payment.receivingAccountId !== transaction.receivingAccountId) {
        errors.push('Receiving account mismatch');
      }
    }
    
    // Check amount match
    const amountMatch = Math.abs(Number(payment.amount) - Number(transaction.amount)) < 0.01;
    if (!amountMatch) {
      errors.push('Amount mismatch');
    }
    
    // Check currency match
    if (payment.currency !== transaction.currency) {
      errors.push('Currency mismatch');
    }
    
    // Check phone match
    const normalizedPaymentPhone = payment.customerPhone.replace(/[\s-]/g, '');
    const normalizedSenderPhone = transaction.senderPhone.replace(/[\s-]/g, '');
    
    if (!normalizedPaymentPhone.includes(normalizedSenderPhone) && 
        !normalizedSenderPhone.includes(normalizedPaymentPhone)) {
      errors.push('Phone mismatch');
    }
    
    if (errors.length === 0) {
      // Update transaction
      await prisma.ecoCashTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'MATCHED',
          matchedPaymentId: paymentId,
        },
      });
      
      // Update proof
      await prisma.paymentProof.updateMany({
        where: { paymentId },
        data: {
          status: 'MATCHED',
          matchedTransactionId: transaction.id,
        },
      });
      
      // Update payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'VERIFIED' as any,
          providerTransactionId: transaction.transactionReference,
          merchantReference: transaction.transactionReference,
        },
      });
      
      // Update order
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
      
      // Log audit
      await prisma.paymentAuditLog.create({
        data: {
          paymentId: paymentId,
          action: 'PAYMENT_VERIFIED',
          actorType: 'SYSTEM',
          metadata: {
            transactionReference: transaction.transactionReference,
            trigger: 'PROOF_SUBMISSION',
          },
        },
      });
    } else {
      // Mark as mismatch
      await prisma.ecoCashTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'MISMATCH',
        },
      });
      
      await prisma.paymentProof.updateMany({
        where: { paymentId },
        data: {
          status: 'MISMATCH',
        },
      });
      
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'MISMATCH' as any,
        },
      });
      
      // Log audit
      await prisma.paymentAuditLog.create({
        data: {
          paymentId: paymentId,
          action: 'PAYMENT_MISMATCH',
          actorType: 'SYSTEM',
          metadata: {
            transactionReference: transaction.transactionReference,
            errors,
            trigger: 'PROOF_SUBMISSION',
          },
        },
      });
    }
  } catch (error) {
    console.error('Matching error:', error);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * POST /api/admin/payments/ecocash/[id]/reject
 * 
 * Manually reject a payment
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { notes } = body;
    
    // Fetch payment
    const payment = await prisma.payment.findUnique({
      where: { id },
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
    
    // Update payment status
    await prisma.payment.update({
      where: { id },
      data: {
        status: 'REJECTED' as any,
        failureReason: notes || 'Manually rejected by admin',
      },
    });
    
    // Update order status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'CANCELLED' as any,
        paymentStatus: 'FAILED' as any,
      },
    });
    
    // Log audit event
    await prisma.paymentAuditLog.create({
      data: {
        paymentId: id,
        action: 'PAYMENT_MANUALLY_REJECTED',
        actor: session.user.email,
        actorType: 'ADMIN',
        metadata: {
          notes,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json(
      { error: 'Failed to reject payment' },
      { status: 500 }
    );
  }
}

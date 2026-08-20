import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { sendPaymentSuccessEmail } from '@/lib/email';

/**
 * POST /api/admin/payments/ecocash/[id]/approve
 * 
 * Manually approve a payment
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
        status: 'APPROVED' as any,
        completedAt: new Date(),
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
    
    // Send payment success email to customer
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: payment.orderId },
    });

    if (orderWithDetails) {
      sendPaymentSuccessEmail({
        customerName: orderWithDetails.customerName,
        customerEmail: orderWithDetails.customerEmail,
        orderNumber: orderWithDetails.orderNumber,
        orderTotal: Number(orderWithDetails.total),
        paymentDate: new Date().toISOString(),
      }).catch((err) => console.error('Failed to send payment success email:', err));
    }
    
    // Reduce inventory
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: payment.orderId },
      include: {
        variant: true,
      },
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

      // Update inventory if it exists
      const inventory = await prisma.inventory.findUnique({
        where: { variantId: item.variantId },
      });

      if (inventory) {
        await prisma.inventory.update({
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
        await prisma.inventoryMovement.create({
          data: {
            inventoryId: inventory.id,
            previousStock: inventory.currentStock,
            newStock: inventory.currentStock - item.quantity,
            difference: -item.quantity,
            reason: 'STOCK_SOLD',
            referenceId: payment.orderId,
            notes: `Payment manually approved by admin`,
          },
        });
      }
    }
    
    // Log audit event
    await prisma.paymentAuditLog.create({
      data: {
        paymentId: id,
        action: 'PAYMENT_MANUALLY_APPROVED',
        actor: session.user.email,
        actorType: 'ADMIN',
        metadata: {
          notes,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving payment:', error);
    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500 }
    );
  }
}

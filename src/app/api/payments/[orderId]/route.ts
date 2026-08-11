import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/payments/[orderId]
 * 
 * Fetch payment details for an order
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: {
        proofs: true,
        ecoCashTransaction: true,
        order: {
          select: {
            orderNumber: true,
            total: true,
            currency: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
          },
        },
      },
    });
    
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

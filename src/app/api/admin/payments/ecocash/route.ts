import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * GET /api/admin/payments/ecocash
 * 
 * Fetch all EcoCash payments with stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role
    if (!['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Fetch all EcoCash payments
    const payments = await prisma.payment.findMany({
      where: {
        provider: 'ecocash',
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerEmail: true,
          },
        },
        proofs: {
          orderBy: {
            submittedAt: 'desc',
          },
          take: 1,
        },
        ecoCashTransaction: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Calculate stats
    const stats = {
      total: payments.length,
      pending: payments.filter(p => ['AWAITING_PROOF', 'PROOF_SUBMITTED', 'MATCHING'].includes(p.status)).length,
      verified: payments.filter(p => ['VERIFIED', 'APPROVED'].includes(p.status)).length,
      manualReview: payments.filter(p => p.status === 'MANUAL_REVIEW').length,
      mismatched: payments.filter(p => p.status === 'MISMATCH').length,
    };
    
    return NextResponse.json({
      payments,
      stats,
    });
  } catch (error) {
    console.error('Error fetching EcoCash payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

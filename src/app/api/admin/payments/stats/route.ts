import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/payments/stats
 * 
 * Fetches payment statistics for the admin dashboard
 * Requires admin authentication
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Add proper authentication check
    // const session = await auth();
    // if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any)?.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total payments
    const total = await prisma.payment.count();

    // Status counts
    const successful = await prisma.payment.count({ where: { status: 'APPROVED' as any } });
    const pending = await prisma.payment.count({ where: { status: { in: ['AWAITING_PROOF', 'PROOF_SUBMITTED', 'MATCHING'] as any } } });
    const failed = await prisma.payment.count({ where: { status: { in: ['MISMATCH', 'REJECTED', 'EXPIRED'] as any } } });

    // Revenue calculations
    const todayRevenue = await prisma.payment.aggregate({
      where: {
        status: 'APPROVED' as any,
        createdAt: { gte: todayStart },
      },
      _sum: {
        amount: true,
      },
    });

    const weekRevenue = await prisma.payment.aggregate({
      where: {
        status: 'APPROVED' as any,
        createdAt: { gte: weekStart },
      },
      _sum: {
        amount: true,
      },
    });

    const monthRevenue = await prisma.payment.aggregate({
      where: {
        status: 'APPROVED' as any,
        createdAt: { gte: monthStart },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      total,
      successful,
      pending,
      failed,
      todayRevenue: Number(todayRevenue._sum.amount || 0),
      weekRevenue: Number(weekRevenue._sum.amount || 0),
      monthRevenue: Number(monthRevenue._sum.amount || 0),
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment statistics' },
      { status: 500 }
    );
  }
}

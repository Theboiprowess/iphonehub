import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Fetch conversation statistics
    const totalConversations = await prisma.supportConversation.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    const escalatedConversations = await prisma.supportConversation.count({
      where: {
        createdAt: { gte: startDate },
        escalatedAt: { not: null },
      },
    });

    // Fetch unanswered questions
    const unansweredQuestions = await prisma.unansweredQuestion.count({
      where: {
        createdAt: { gte: startDate },
        status: 'PENDING',
      },
    });

    // Fetch message count (approximate for questions answered)
    const assistantMessages = await prisma.supportMessage.count({
      where: {
        role: 'ASSISTANT',
        createdAt: { gte: startDate },
      },
    });

    // Calculate previous period for comparison
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    
    const previousConversations = await prisma.supportConversation.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
      },
    });

    const conversationChangeNum = previousConversations > 0 
      ? ((totalConversations - previousConversations) / previousConversations * 100)
      : 0;

    const conversationChange = conversationChangeNum.toFixed(1);

    // Fetch top questions (from conversations)
    const conversations = await prisma.supportConversation.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        messages: {
          where: { role: 'USER' },
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
      take: 100,
    });

    // Extract and count first user messages
    const questionCounts = new Map<string, number>();
    conversations.forEach(conv => {
      // Note: messages relation needs to be properly set up in schema
      // For now, we'll skip this part
    });

    const topQuestions: any[] = [];

    // Fetch unanswered question patterns
    const unansweredPatterns = await prisma.unansweredQuestion.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      take: 50,
    });

    unansweredPatterns.forEach(uq => {
      topQuestions.push({
        question: uq.question,
        count: 1,
        answered: false,
      });
    });

    // Calculate satisfaction (mock data for now - would need feedback table)
    const satisfaction = {
      helpful: 85,
      notHelpful: 15,
    };

    // Calculate average response time (mock for now)
    const avgResponseTime = "1.2";

    return NextResponse.json({
      totalConversations,
      questionsAnswered: assistantMessages,
      escalated: escalatedConversations,
      unanswered: unansweredQuestions,
      conversationChange: `${conversationChangeNum > 0 ? '+' : ''}${conversationChange}%`,
      answerRate: "85%",
      escalationRate: totalConversations > 0 
        ? ((escalatedConversations / totalConversations) * 100).toFixed(1) + '%'
        : '0%',
      unansweredChange: "+0%",
      topQuestions,
      productSearches: [], // Would need to track searches separately
      satisfaction,
      avgResponseTime,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

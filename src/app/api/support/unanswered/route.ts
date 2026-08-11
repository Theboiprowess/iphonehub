import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Fetch all unanswered questions (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const questions = await prisma.unansweredQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching unanswered questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Answer an unanswered question (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, answer, addToKB, kbArticleId } = body;

    if (!id || !answer) {
      return NextResponse.json(
        { error: 'ID and answer are required' },
        { status: 400 }
      );
    }

    const question = await prisma.unansweredQuestion.update({
      where: { id },
      data: {
        answer,
        status: 'ANSWERED',
        addedToKB: addToKB || false,
        kbArticleId: addToKB ? kbArticleId : null,
        answeredBy: (session.user as any).id,
        answeredAt: new Date(),
      },
    });

    // If adding to KB, create knowledge article
    if (addToKB && !kbArticleId) {
      await prisma.knowledgeArticle.create({
        data: {
          title: question.question.substring(0, 100),
          content: answer,
          category: question.category || 'General',
          status: 'PUBLISHED',
          slug: question.question.substring(0, 100).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          createdBy: (session.user as any).id,
        },
      });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

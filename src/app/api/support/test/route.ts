import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test OpenAI key
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    // Count products
    const productCount = await prisma.product.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      hasOpenAIKey,
      productCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

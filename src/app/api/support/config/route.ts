import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    isOpenAIConfigured: !!process.env.OPENAI_API_KEY,
    isRedisConfigured: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
  });
}

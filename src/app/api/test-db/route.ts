import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 User count: ${userCount}`);
    
    // Check for admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'iphonehub@gmail.com' }
    });
    
    if (admin) {
      console.log('✅ Admin user found:', admin.email);
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        userCount,
        admin: {
          email: admin.email,
          name: admin.name,
          role: admin.role,
          hasPassword: !!admin.password
        }
      });
    } else {
      console.log('❌ Admin user not found');
      return NextResponse.json({
        success: true,
        message: 'Database connected but admin user missing',
        userCount,
        admin: null
      });
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

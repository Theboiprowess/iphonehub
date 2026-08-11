import { PrismaClient } from './src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });
    
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Check for admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'iphonehub@gmail.com' }
    });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Role:', admin.role);
      console.log('   Password hash:', admin.password ? 'Present' : 'Missing');
    } else {
      console.log('❌ Admin user not found!');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
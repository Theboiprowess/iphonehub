import { PrismaClient } from './src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function createAdminUser() {
  try {
    // Delete existing admin user if exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'iphonehub@gmail.com' }
    });

    if (existingAdmin) {
      console.log('Deleting existing admin user...');
      await prisma.user.delete({
        where: { email: 'iphonehub@gmail.com' }
      });
    }

    // Hash the password using bcryptjs (same as auth.ts)
    const hashedPassword = await bcrypt.hash('Artwell@2026', 10);
    console.log('Password hashed:', hashedPassword);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'iphonehub@gmail.com',
        password: hashedPassword,
        name: 'iPhone Hub Admin',
        role: 'SUPER_ADMIN',
      }
    });

    console.log('Admin user created successfully:', admin.email);
    console.log('Password hash:', admin.password);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
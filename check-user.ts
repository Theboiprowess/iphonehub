import { PrismaClient } from "./src/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkAndResetUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'iphonehub@gmail.com' }
    });
    
    console.log('User found:', !!user);
    
    if (user) {
      console.log('User role:', user.role);
      console.log('User has password:', !!user.password);
      
      // Reset password
      const newPassword = 'Artwell@2026';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await prisma.user.update({
        where: { email: 'iphonehub@gmail.com' },
        data: { 
          password: hashedPassword,
          role: 'SUPER_ADMIN'
        }
      });
      
      console.log('Password reset successfully!');
      console.log('New password:', newPassword);
    } else {
      console.log('User not found. Creating user...');
      
      const hashedPassword = await bcrypt.hash('Artwell@2026', 10);
      
      await prisma.user.create({
        data: {
          email: 'iphonehub@gmail.com',
          name: 'iPhone Hub Admin',
          password: hashedPassword,
          role: 'SUPER_ADMIN'
        }
      });
      
      console.log('User created successfully!');
      console.log('Password: Artwell@2026');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndResetUser();
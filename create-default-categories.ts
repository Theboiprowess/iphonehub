import { PrismaClient } from './src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Creating default categories...');
  
  const categories = [
    {
      name: 'Boxed iPhones',
      slug: 'boxed-iphones',
      description: 'Brand new boxed iPhones with full warranty',
      order: 1
    },
    {
      name: 'Pre-Owned iPhones',
      slug: 'pre-owned-iphones',
      description: 'High-quality pre-owned iPhones in excellent condition',
      order: 2
    },
    {
      name: 'Second-Hand iPhones',
      slug: 'second-hand-iphones',
      description: 'Affordable second-hand iPhones in good working condition',
      order: 3
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'iPhone accessories including cases, chargers, and more',
      order: 4
    }
  ];

  for (const category of categories) {
    try {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        await prisma.category.create({
          data: category
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }

  console.log('Categories creation completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
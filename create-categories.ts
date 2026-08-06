import { PrismaClient } from "./src/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Creating categories...");

  const categories = [
    {
      name: "Boxed iPhones",
      slug: "boxed-iphones",
      description: "Brand new boxed iPhones with original packaging and accessories",
      order: 1
    },
    {
      name: "Pre-Owned iPhones", 
      slug: "pre-owned-iphones",
      description: "Premium pre-owned iPhones in excellent condition",
      order: 2
    },
    {
      name: "Second-Hand iPhones",
      slug: "second-hand-iphones", 
      description: "Quality second-hand iPhones at affordable prices",
      order: 3
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "iPhone accessories including cases, chargers, and more",
      order: 4
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  console.log("Categories created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
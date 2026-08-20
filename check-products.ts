import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Updating iPhone 17 Pro Max condition to SECOND_HAND...');
  
  // Find the iPhone 17 Pro Max
  const product = await prisma.product.findFirst({
    where: {
      name: {
        contains: 'iPhone 17 Pro Max',
        mode: 'insensitive',
      },
    },
  });

  if (!product) {
    console.log('No iPhone 17 Pro Max found');
    return;
  }

  console.log('Found product:', {
    id: product.id,
    name: product.name,
    currentCondition: product.condition,
    status: product.status,
  });

  // Update to SECOND_HAND
  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { condition: 'SECOND_HAND' },
  });

  console.log('Updated product:', {
    id: updated.id,
    name: updated.name,
    newCondition: updated.condition,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

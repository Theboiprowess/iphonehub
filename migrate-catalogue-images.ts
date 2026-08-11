import { prisma } from './src/lib/prisma';
import { modelToImageKey } from './src/lib/iphone-image-provider';

async function migrateCatalogueImages() {
  console.log('Starting catalogue image migration...');
  
  try {
    // Fetch all catalogue items
    const catalogueItems = await prisma.priceCatalogue.findMany();
    
    console.log(`Found ${catalogueItems.length} catalogue items`);
    
    let updatedCount = 0;
    
    for (const item of catalogueItems) {
      // Skip if already has imageKey
      if (item.imageKey) {
        console.log(`Skipping ${item.model} - already has imageKey: ${item.imageKey}`);
        continue;
      }
      
      // Generate imageKey from model
      const imageKey = modelToImageKey(item.model);
      
      // Update the item
      await prisma.priceCatalogue.update({
        where: { id: item.id },
        data: { imageKey },
      });
      
      console.log(`Updated ${item.model} with imageKey: ${imageKey}`);
      updatedCount++;
    }
    
    console.log(`Migration complete. Updated ${updatedCount} items.`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateCatalogueImages();

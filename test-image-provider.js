import { modelToImageKey, getIPhoneImageUrl, getAllImageKeys, hasImageKey } from './src/lib/iphone-image-provider';

console.log('=== iPhone Image Provider Test ===\n');

// Test models from the catalogue
const testModels = [
  'iPhone 17 Pro Max',
  'iPhone 16 Pro Max',
  'iPhone 16 Plus',
  'iPhone 15 Pro Max',
  'iPhone 15 Plus',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Plus',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13',
  'iPhone 12 Pro Max',
  'iPhone 12 Pro',
  'iPhone 12',
  'iPhone 11 Pro Max',
  'iPhone 11 Pro',
  'iPhone 11',
  'iPhone XS Max',
  'iPhone XR',
  'iPhone X',
];

console.log('Testing model to imageKey mapping:\n');
testModels.forEach(model => {
  const imageKey = modelToImageKey(model);
  const imageUrl = getIPhoneImageUrl(model);
  const hasMapping = hasImageKey(imageKey);
  
  console.log(`${model}`);
  console.log(`  → imageKey: ${imageKey}`);
  console.log(`  → hasMapping: ${hasMapping}`);
  console.log(`  → imageUrl: ${imageUrl ? (imageUrl ? 'CONFIGURED' : 'EMPTY/FALLBACK') : 'NULL'}`);
  console.log('');
});

console.log('\n=== All Available Image Keys ===');
const allKeys = getAllImageKeys();
console.log(`Total: ${allKeys.length}`);
allKeys.forEach(key => {
  console.log(`  - ${key}`);
});

console.log('\n=== Test Complete ===');

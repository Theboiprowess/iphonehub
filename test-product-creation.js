// Test product creation API
fetch('http://localhost:3000/admin/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'iPhone 13 Pro',
    model: 'iPhone 13 Pro',
    categoryId: 'test-category-id',
    condition: 'SECOND_HAND',
    description: 'iPhone 13 Pro iCassa Approved 256 GB',
    status: 'DRAFT',
    variants: [{
      storage: '256 GB',
      colour: 'BLUE',
      price: 400,
      comparePrice: null,
      costPrice: null,
      sku: null,
      stock: 0,
      reserved: 0,
      isActive: true
    }],
    images: [],
    devices: []
  })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
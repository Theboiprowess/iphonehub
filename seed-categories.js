// Simple script to seed categories via API
fetch('http://localhost:3000/admin/api/categories/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
const bcrypt = require('bcryptjs');

const password = 'Artwell@2026';
const hash = bcrypt.hashSync(password, 10);
console.log('Password:', password);
console.log('Hash:', hash);

// Verify it works
const isValid = bcrypt.compareSync(password, hash);
console.log('Verification:', isValid);

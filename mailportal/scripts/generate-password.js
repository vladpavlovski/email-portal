#!/usr/bin/env node

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Password hash:', hash);
    console.log('\nUse this SQL to update the admin password:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@mailportal.local';`);
  })
  .catch(err => {
    console.error('Error generating hash:', err);
    process.exit(1);
  });
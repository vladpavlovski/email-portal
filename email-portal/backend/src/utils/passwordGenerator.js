const crypto = require('crypto');

/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 16)
 * @param {object} options - Password generation options
 * @returns {string} Generated password
 */
const generatePassword = (length = 16, options = {}) => {
  const defaults = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true, // Exclude similar looking characters (0, O, l, 1, etc.)
    excludeAmbiguous: true // Exclude ambiguous symbols
  };

  const settings = { ...defaults, ...options };

  let charset = '';
  
  if (settings.includeLowercase) {
    charset += settings.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (settings.includeUppercase) {
    charset += settings.excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (settings.includeNumbers) {
    charset += settings.excludeSimilar ? '23456789' : '0123456789';
  }
  
  if (settings.includeSymbols) {
    charset += settings.excludeAmbiguous ? '!#$%&*+-=?@^_' : '!#$%&()*+,-./:;<=>?@[]^_`{|}~';
  }

  if (charset.length === 0) {
    throw new Error('At least one character type must be included');
  }

  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  // Ensure password has at least one character from each selected type
  if (settings.includeLowercase && !/[a-z]/.test(password)) {
    const lowerChars = settings.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    password = password.substring(0, password.length - 1) + lowerChars[crypto.randomInt(lowerChars.length)];
  }
  
  if (settings.includeUppercase && !/[A-Z]/.test(password)) {
    const upperChars = settings.excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    password = password.substring(0, password.length - 1) + upperChars[crypto.randomInt(upperChars.length)];
  }
  
  if (settings.includeNumbers && !/[0-9]/.test(password)) {
    const numberChars = settings.excludeSimilar ? '23456789' : '0123456789';
    password = password.substring(0, password.length - 1) + numberChars[crypto.randomInt(numberChars.length)];
  }
  
  if (settings.includeSymbols && !/[!#$%&()*+,\-./:;<=>?@\[\]^_`{|}~]/.test(password)) {
    const symbolChars = settings.excludeAmbiguous ? '!#$%&*+-=?@^_' : '!#$%&()*+,-./:;<=>?@[]^_`{|}~';
    password = password.substring(0, password.length - 1) + symbolChars[crypto.randomInt(symbolChars.length)];
  }

  // Shuffle the password to ensure randomness
  return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
};

module.exports = { generatePassword };
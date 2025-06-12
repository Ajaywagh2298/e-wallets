import CryptoJS from 'crypto-js';

// Secret key for encryption/decryption
const SECRET_KEY = 'your-secret-key-here-change-this-in-production';

/**
 * Encrypt a string value
 * @param {string} text - The text to encrypt
 * @returns {string} - Base64 encoded encrypted string
 */
export const encrypt = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return text; // Return as-is if not a string
    }
    
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    // Convert to base64 for safe storage
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
  } catch (error) {
     // console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

/**
 * Decrypt a string value
 * @param {string} encryptedText - The encrypted text to decrypt
 * @returns {string} - Decrypted string
 */
export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText || typeof encryptedText !== 'string') {
      return encryptedText; // Return as-is if not a string
    }
    
    // Convert from base64
    const encrypted = CryptoJS.enc.Base64.parse(encryptedText).toString(CryptoJS.enc.Utf8);
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
     // console.error('Decryption error:', error);
    return encryptedText; // Return original text if decryption fails
  }
};

/**
 * Hash a string using SHA256
 * @param {string} text - The text to hash
 * @returns {string} - SHA256 hash
 */
export const hash = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return text;
    }
    return CryptoJS.SHA256(text).toString();
  } catch (error) {
     // console.error('Hashing error:', error);
    return text;
  }
};

/**
 * Generate a random key
 * @param {number} length - Length of the key (default: 32)
 * @returns {string} - Random key
 */
export const generateKey = (length = 32) => {
  try {
    return CryptoJS.lib.WordArray.random(length).toString();
  } catch (error) {
     // console.error('Key generation error:', error);
    return Math.random().toString(36).substring(2, length + 2);
  }
};

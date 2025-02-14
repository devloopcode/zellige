/**
 * Validator module for various data validation operations
 * @module validators
 */

/**
 * Import CIN validation utilities
 */
import {
  validateCIN,
  generateTestCIN,
  getCINRegion,
  sanitizeCIN,
  isValidCIN,
} from './cin';

/**
 * Import passport validation utilities
 */
import {
  validatePassport,
  isValidPassport,
  normalizePassport,
  formatPassport,
  generateRandomPassport,
  extractPassportComponents,
  arePassportsEquivalent,
} from './passport';

/**
 * Namespace containing all CIN-related validation functions
 */
const cin = {
  validate: validateCIN,
  generateTest: generateTestCIN,
  getRegion: getCINRegion,
  sanitize: sanitizeCIN,
  isValid: isValidCIN,
};

/**
 * Namespace containing all passport-related validation functions
 */
const passport = {
  validate: validatePassport,
  isValid: isValidPassport,
  normalize: normalizePassport,
  format: formatPassport,
  generateRandom: generateRandomPassport,
  extractComponents: extractPassportComponents,
  areEquivalent: arePassportsEquivalent,
};

/**
 * Collection of all validator namespaces
 */
export const validators = {
  cin,
  passport,
};

/**
 * Default export providing access to all validator functions
 * @default
 */
export default validators;

/**
 * Direct exports of CIN validation functions for granular imports
 */
export { validateCIN, generateTestCIN, getCINRegion, sanitizeCIN, isValidCIN };

/**
 * Direct exports of passport validation functions for granular imports
 */
export {
  validatePassport,
  isValidPassport,
  normalizePassport,
  formatPassport,
  generateRandomPassport,
  extractPassportComponents,
  arePassportsEquivalent,
};

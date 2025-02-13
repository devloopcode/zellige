/**
 * Validator module for CIN (Carte d'Identité Nationale) operations
 * @module validators
 */

/**
 * Import CIN validation utilities
 */
import {
  validateCIN,
  extractCINMetadata,
  generateTestCIN,
  getCINRegion,
  sanitizeCIN,
  isValidCIN,
} from './cin';

/**
 * Namespace containing all CIN-related validation functions
 */
const cin = {
  validate: validateCIN,
  extractMetadata: extractCINMetadata,
  generateTest: generateTestCIN,
  getRegion: getCINRegion,
  sanitize: sanitizeCIN,
  isValid: isValidCIN,
};

/**
 * Collection of all validator namespaces
 */
export const validators = {
  cin,
};

/**
 * Default export providing access to all validator functions
 * @default
 */
export default validators;

/**
 * Direct exports of CIN validation functions for granular imports
 */
export {
  validateCIN,
  extractCINMetadata,
  generateTestCIN,
  getCINRegion,
  sanitizeCIN,
  isValidCIN,
};

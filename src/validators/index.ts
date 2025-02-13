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
export { validateCIN, generateTestCIN, getCINRegion, sanitizeCIN, isValidCIN };

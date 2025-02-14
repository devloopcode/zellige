import {
  PassportComponents,
  PassportErrorCode,
  ValidationOptions,
  ValidationResult,
} from '../types/passport';

/**
 * Custom error class for passport validation failures
 * @class
 * @extends Error
 * @description
 * Specialized error class that includes both an error code and message.
 * Useful for catching and handling specific validation errors.
 *
 * @example
 * ```typescript
 * try {
 *   validatePassport('invalid');
 * } catch (error) {
 *   if (error instanceof PassportValidationError) {
 *     console.log(error.code); // Access the error code
 *   }
 * }
 * ```
 */
export class PassportValidationError extends Error {
  constructor(
    public code: PassportErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'PassportValidationError';
  }
}

// Constants
const PASSPORT_REGEX = /^[A-Z]{2}\d{6}$/;
const DEFAULT_OPTIONS: ValidationOptions = {
  strict: true,
  allowLowerCase: true,
  maxLength: 100, // Prevent DOS attacks from very long inputs
};

/**
 * Normalizes a passport number by removing spaces and converting to uppercase
 * @param {string} passport - Raw passport number to normalize
 * @throws {PassportValidationError} If input is not a string or exceeds max length
 * @returns {string} Normalized passport number
 *
 * @example
 * ```typescript
 * const normalized = normalizePassport('ab 123 456'); // Returns 'AB123456'
 * ```
 */
export function normalizePassport(passport: string): string {
  if (typeof passport !== 'string') {
    throw new PassportValidationError(
      PassportErrorCode.INVALID_FORMAT,
      'Input must be a string'
    );
  }

  if (passport.length > DEFAULT_OPTIONS.maxLength) {
    throw new PassportValidationError(
      PassportErrorCode.INVALID_LENGTH,
      `Input exceeds maximum length of ${DEFAULT_OPTIONS.maxLength} characters`
    );
  }

  return passport.replace(/\s+/g, '').toUpperCase();
}

/**
 * Checks if a given string is a valid Moroccan passport number
 * @param passport - The passport number to validate
 * @param options - Validation options
 * @returns boolean indicating validity
 */
export function isValidPassport(
  passport: string,
  options: ValidationOptions = DEFAULT_OPTIONS
): boolean {
  try {
    return validatePassport(passport, options).isValid;
  } catch (error) {
    if (error instanceof PassportValidationError) {
      return false;
    }
    throw error; // Re-throw unexpected errors
  }
}

/**
 * Comprehensive passport validation with detailed feedback
 * @param {string} passport - The passport number to validate
 * @param {ValidationOptions} [options=DEFAULT_OPTIONS] - Validation options
 * @returns {ValidationResult} Detailed validation result
 *
 * @example
 * ```typescript
 * const result = validatePassport('AB123456');
 * if (!result.isValid) {
 *   console.log(result.errors); // Array of validation errors
 * }
 * ```
 *
 * @security
 * - Implements input length restrictions to prevent DOS attacks
 * - Sanitizes input through normalization
 * - Provides detailed error feedback without exposing system details
 *
 * @performance
 * - O(n) time complexity where n is input length
 * - Early returns for invalid inputs
 * - Optimized regex patterns
 */
export function validatePassport(
  passport: string,
  options: ValidationOptions = DEFAULT_OPTIONS
): ValidationResult {
  const result: ValidationResult = {
    isValid: false,
    errors: [],
  };

  try {
    // Input type validation
    if (typeof passport !== 'string') {
      result.errors.push({
        code: PassportErrorCode.INVALID_FORMAT,
        message: 'Input must be a string',
        field: 'passport',
      });
      return result;
    }

    // Check for null/undefined/empty
    if (!passport.trim()) {
      result.errors.push({
        code: PassportErrorCode.REQUIRED,
        message: 'Passport number is required',
        field: 'passport',
      });
      return result;
    }

    // Check input length for DOS prevention
    if (passport.length > DEFAULT_OPTIONS.maxLength) {
      result.errors.push({
        code: PassportErrorCode.INVALID_LENGTH,
        message: `Input exceeds maximum length of ${DEFAULT_OPTIONS.maxLength} characters`,
        field: 'passport',
      });
      return result;
    }

    // Normalize input
    const normalizedPassport = normalizePassport(passport);
    result.normalizedValue = normalizedPassport;

    // Length check (should be 8 characters: 2 letters + 6 digits)
    if (normalizedPassport.length !== 8) {
      result.errors.push({
        code: PassportErrorCode.INVALID_LENGTH,
        message:
          'Passport number must be exactly 8 characters (2 letters + 6 digits)',
        field: 'passport',
      });
    }

    // Basic format check
    if (!PASSPORT_REGEX.test(normalizedPassport)) {
      result.errors.push({
        code: PassportErrorCode.INVALID_FORMAT,
        message:
          'Invalid passport format. Must be two letters followed by 6 digits',
        field: 'passport',
      });
    }

    // Prefix validation (first two characters must be letters)
    if (!/^[A-Z]{2}/.test(normalizedPassport)) {
      result.errors.push({
        code: PassportErrorCode.INVALID_PREFIX,
        message: 'First two characters must be letters (A-Z)',
        field: 'prefix',
      });
    }

    // Digit validation (last 6 characters must be digits)
    if (!/^[A-Z]{2}\d{6}$/.test(normalizedPassport)) {
      result.errors.push({
        code: PassportErrorCode.INVALID_DIGITS,
        message: 'Must contain exactly 6 digits after the two-letter prefix',
        field: 'number',
      });
    }

    // Additional strict mode validations
    if (options.strict) {
      // Check for invalid characters
      if (/[^A-Z0-9]/.test(normalizedPassport)) {
        result.errors.push({
          code: PassportErrorCode.INVALID_FORMAT,
          message: 'Passport contains invalid characters',
          field: 'passport',
        });
      }

      // Check case sensitivity if not allowing lowercase
      if (!options.allowLowerCase && /[a-z]/.test(passport)) {
        result.errors.push({
          code: PassportErrorCode.INVALID_FORMAT,
          message: 'Lowercase letters are not allowed in strict mode',
          field: 'passport',
        });
      }
    }

    result.isValid = result.errors.length === 0;
    return result;
  } catch {
    // Handle unexpected errors
    result.errors.push({
      code: PassportErrorCode.INVALID_FORMAT,
      message: 'Unexpected error during validation',
      field: 'passport',
    });
    return result;
  }
}

/**
 * Formats a passport number to the standard format
 * @param passport - The passport number to format
 * @param separator - Optional separator between prefix and number
 * @returns Formatted passport number or null if invalid
 */
export function formatPassport(
  passport: string,
  separator: string = ''
): string | null {
  try {
    if (typeof passport !== 'string') {
      throw new PassportValidationError(
        PassportErrorCode.INVALID_FORMAT,
        'Input must be a string'
      );
    }

    if (typeof separator !== 'string') {
      throw new PassportValidationError(
        PassportErrorCode.INVALID_FORMAT,
        'Separator must be a string'
      );
    }

    const validation = validatePassport(passport);
    if (!validation.isValid) {
      return null;
    }

    const components = extractPassportComponents(validation.normalizedValue!);
    return components
      ? `${components.prefix}${separator}${components.number}`
      : null;
  } catch {
    return null;
  }
}

/**
 * Generates a random valid Moroccan passport number
 * @param options - Generation options
 * @returns A valid passport number
 */
export function generateRandomPassport(
  options: {
    prefix?: string;
    avoiding?: Set<string>;
  } = {}
): string {
  // Generate random two-letter prefix if not provided
  const prefix =
    options.prefix ||
    Array.from({ length: 2 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');

  // Generate 6 random digits
  const digits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  const passport = `${prefix}${digits}`;

  // Ensure we don't generate a number in the avoiding set
  if (options.avoiding?.has(passport)) {
    return generateRandomPassport(options);
  }

  return passport;
}

/**
 * Extracts and validates components of a passport number
 * @param passport - The passport number to analyze
 * @returns PassportComponents object or null if invalid
 */
export function extractPassportComponents(
  passport: string
): PassportComponents | null {
  const normalized = normalizePassport(passport.replace(/-/g, ''));
  if (!PASSPORT_REGEX.test(normalized)) {
    return null;
  }

  return {
    prefix: normalized.slice(0, 2),
    number: normalized.slice(2),
    raw: normalized,
  };
}

/**
 * Checks if two passport numbers are equivalent (accounting for formatting)
 * @param passport1 - First passport number
 * @param passport2 - Second passport number
 * @returns boolean indicating if passports are equivalent
 */
export function arePassportsEquivalent(
  passport1: string,
  passport2: string
): boolean {
  try {
    if (!passport1 || !passport2) return false;
    const norm1 = normalizePassport(passport1.replace(/-/g, ''));
    const norm2 = normalizePassport(passport2.replace(/-/g, ''));
    return norm1 === norm2;
  } catch {
    return false;
  }
}

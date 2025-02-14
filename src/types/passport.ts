/**
 * Error codes for passport validation
 * @enum {string}
 * @readonly
 * @description Standardized error codes used throughout the validation process
 */
export enum PassportErrorCode {
  REQUIRED = 'PASSPORT_REQUIRED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_LENGTH = 'INVALID_LENGTH',
  INVALID_PREFIX = 'INVALID_PREFIX',
  INVALID_DIGITS = 'INVALID_DIGITS',
  INVALID_CHARACTERS = 'INVALID_CHARACTERS',
}

/**
 * Detailed error information
 * @interface
 * @description
 * Provides structured error details including error code, human-readable message,
 * and optional field identifier for precise error location
 */
export interface PassportError {
  code: PassportErrorCode;
  message: string;
  field?: string;
}

/**
 * Validation result with detailed information
 * @interface
 * @description
 * Comprehensive validation result containing:
 * - Overall validity status
 * - Array of detailed errors (if any)
 * - Normalized value (if valid)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: PassportError[];
  normalizedValue?: string;
}

/**
 * Passport components structure
 * @interface
 * @description
 * Breaks down a passport number into its constituent parts for easier processing
 * and validation. Useful for systems that need to work with passport components
 * separately.
 */
export interface PassportComponents {
  prefix: string; // Two-letter prefix
  number: string; // Six-digit number
  raw: string; // Complete passport number
}

/**
 * Configuration options for validation
 * @interface
 * @description
 * Configurable options to customize validation behavior:
 * - strict: Enables additional validation rules
 * - allowLowerCase: Controls case sensitivity
 * - maxLength: Prevents DOS attacks from excessive input length
 *
 * @example
 * ```typescript
 * const options: ValidationOptions = {
 *   strict: true,
 *   allowLowerCase: false,
 *   maxLength: 50
 * };
 * ```
 */
export interface ValidationOptions {
  strict?: boolean; // Enables additional strict validation rules
  allowLowerCase?: boolean; // Allow lowercase input (will be normalized)
  maxLength: number; // Prevent DOS attacks from very long inputs
}

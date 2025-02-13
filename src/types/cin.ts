export enum CINErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_REGION = 'INVALID_REGION',
  INVALID_SEQUENCE = 'INVALID_SEQUENCE',
  PARTIALLY_VALID = 'PARTIALLY_VALID',
}

/**
 * Represents an error that occurred during CIN validation
 */
export interface CINError {
  /** The type of error that occurred */
  code: CINErrorCode;
  /** Detailed error message */
  message: string;
}

/**
 * Result of validating a CIN
 */
export interface CINValidationResult {
  /** Whether the CIN is valid */
  isValid: boolean;
  /** Array of validation errors if any */
  errors: CINError[];
  /** Additional metadata extracted from the CIN */
  metadata?: {
    /** Region code from the CIN */
    region?: string;
    /** Sequence number */
    sequence?: string;
    /** Office that issued the CIN (if available) */
    issuingOffice?: string;
  };
}

/**
 * Core metadata extracted from a CIN
 */
export interface CINMetadata {
  /** Region code from the CIN */
  region: string;
  /** Sequence number */
  sequence: string;
}

export interface CINFormatOptions {
  /**
   * Add spaces between different parts of the CIN
   * @default false
   */
  addSpaces?: boolean;

  /**
   * Convert to specified case (upper, lower, or preserve)
   * @default 'upper'
   */
  letterCase?: 'upper' | 'lower' | 'preserve';

  /**
   * Add region name in parentheses after the CIN
   * @default false
   */
  includeRegion?: boolean;

  /**
   * Include separator between prefix and numbers
   * @default ''
   */
  separator?: string;

  /**
   * Group digits (e.g., 123-456 or 123.456)
   * @default undefined
   */
  digitGrouping?: {
    groupSize: number;
    separator: string;
  };

  /**
   * Include issuing office information
   * @default false
   */
  includeIssuingOffice?: boolean;

  /**
   * Format to use for dates in metadata
   * @default 'YYYY'
   */
  dateFormat?: string;

  /**
   * Include validation status in output
   * @default false
   */
  includeValidationStatus?: boolean;

  /**
   * Custom template for formatting
   * Example: '{prefix}-{sequence} ({region})'
   * @default undefined
   */
  template?: string;

  /**
   * Mask certain digits for privacy
   * @default undefined
   */
  mask?: {
    enabled: boolean;
    character?: string;
    start?: number;
    length?: number;
  };
}

/**
 * Result of formatting a CIN
 */
export interface CINFormatResult {
  /** Formatted CIN string, null if formatting failed */
  formatted: string | null;
  /** Original input value before formatting */
  originalInput: unknown;
  /** Whether the input was valid */
  isValid: boolean;
  /** Error message if formatting failed */
  error?: string;
  /** Metadata about the formatting operation */
  metadata: {
    /** Region code from the CIN */
    region?: string;
    /** Sequence number */
    sequence?: string;
    /** Office that issued the CIN */
    issuingOffice?: string;
    /** List of formatting operations applied */
    formattingApplied: string[];
    /** Number of digits that were masked */
    maskedDigits?: number;
    /** Original format before changes */
    originalFormat?: string;
  };
  /** Detailed validation information */
  validation?: {
    /** Overall validation status */
    status: 'valid' | 'invalid' | 'partially_valid';
    /** Individual validation checks performed */
    checks: Array<{
      /** Name of the validation check */
      check: string;
      /** Whether the check passed */
      passed: boolean;
      /** Additional information about the check result */
      message?: string;
    }>;
  };
}

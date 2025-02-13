import { validateCIN, sanitizeCIN } from '../validators/cin';
import {
  CINErrorCode,
  CINValidationResult,
  CINFormatOptions,
  CINFormatResult,
} from '../types/cin';

/**
 * Error class for CIN (Citizen Identification Number) formatting errors.
 * Used to throw specific formatting-related errors during CIN processing.
 *
 * @extends Error
 */
export class CINFormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CINFormattingError';
  }
}

/**
 * A comprehensive formatter for Citizen Identification Numbers (CIN) with extensive configuration options.
 * Provides various formatting capabilities including:
 * - Case formatting (upper/lower)
 * - Digit grouping with custom separators
 * - Region and issuing office inclusion
 * - Custom templates
 * - Masking for sensitive information
 *
 * @example
 * ```typescript
 * const formatter = new CINFormatter({
 *   addSpaces: true,
 *   letterCase: 'upper',
 *   includeRegion: true
 * });
 * const result = formatter.format('ABC123456');
 * ```
 */
export class CINFormatter {
  private options: Required<CINFormatOptions>;
  private static readonly DEFAULT_OPTIONS: Required<CINFormatOptions> = {
    addSpaces: false,
    letterCase: 'upper',
    includeRegion: false,
    separator: '',
    digitGrouping: { groupSize: 0, separator: '' },
    includeIssuingOffice: false,
    dateFormat: 'YYYY',
    includeValidationStatus: false,
    template: '',
    mask: {
      enabled: false,
      character: '*',
      start: 0,
      length: 4,
    },
  };

  /**
   * Creates a new instance of CINFormatter with specified options.
   *
   * @param {CINFormatOptions} options - Configuration options for CIN formatting
   * @throws {CINFormattingError} When provided options are invalid
   */
  constructor(options: CINFormatOptions = {}) {
    this.validateOptions(options);
    this.options = { ...CINFormatter.DEFAULT_OPTIONS, ...options };
  }

  /**
   * Validate formatting options
   */
  private validateOptions(options: CINFormatOptions): void {
    if (options.digitGrouping) {
      if (options.digitGrouping.groupSize <= 0) {
        throw new CINFormattingError('Digit grouping size must be positive');
      }
      if (options.digitGrouping.separator.length > 1) {
        throw new CINFormattingError(
          'Digit grouping separator must be a single character'
        );
      }
    }

    if (options.mask?.enabled) {
      if ((options.mask.start ?? 0) < 0) {
        throw new CINFormattingError(
          'Mask start position must be non-negative'
        );
      }
      if ((options.mask.length ?? 0) <= 0) {
        throw new CINFormattingError('Mask length must be positive');
      }
      if (options.mask.character && options.mask.character.length !== 1) {
        throw new CINFormattingError(
          'Mask character must be a single character'
        );
      }
    }

    if (options.template && !this.isValidTemplate(options.template)) {
      throw new CINFormattingError('Invalid template format');
    }
  }

  /**
   * Validate template string format
   */
  private isValidTemplate(template: string): boolean {
    const validTokens = ['{prefix}', '{sequence}', '{region}', '{formatted}'];
    const templateTokens = template.match(/\{[^}]+\}/g) || [];
    return templateTokens.every(token => validTokens.includes(token));
  }

  /**
   * Formats a CIN string according to the specified options.
   *
   * @param {unknown} cin - The CIN to format (can be string, number, or other types)
   * @returns {CINFormatResult} Formatted result containing the formatted CIN and metadata
   *
   * @throws {CINFormattingError} When formatting fails due to invalid input or options
   *
   * @example
   * ```typescript
   * const result = formatter.format('ABC123456');
   * console.log(result.formatted); // Formatted CIN
   * console.log(result.metadata); // Additional formatting metadata
   * ```
   */
  public format(cin: unknown): CINFormatResult {
    try {
      // Validate and sanitize input
      const sanitized = sanitizeCIN(cin);
      const validationResult = validateCIN(sanitized);

      // Prepare result object
      const result: CINFormatResult = {
        formatted: null,
        originalInput: cin,
        isValid: validationResult.isValid,
        metadata: {
          region: validationResult.metadata?.region,
          sequence: validationResult.metadata?.sequence,
          issuingOffice: validationResult.metadata?.issuingOffice,
          formattingApplied: [],
          originalFormat: String(cin),
        },
      };

      // If validation failed, return early with error information
      if (!validationResult.isValid) {
        result.error = validationResult.errors[0]?.message;
        if (this.options.includeValidationStatus) {
          result.validation = this.getValidationDetails(validationResult);
        }
        return result;
      }

      // Extract parts from validation result
      const prefix = validationResult.metadata?.issuingOffice || '';
      const sequence = validationResult.metadata?.sequence || '';

      // Apply primary formatting
      result.formatted = this.applyFormatting(prefix, sequence, result);

      // Apply template if specified
      if (this.options.template) {
        result.formatted = this.applyTemplate(
          result.formatted,
          validationResult.metadata
        );
        result.metadata.formattingApplied.push('template');
      }

      // Apply masking if enabled
      if (this.options.mask?.enabled) {
        result.formatted = this.applyMasking(result.formatted);
        result.metadata.maskedDigits = this.calculateMaskedDigits();
        result.metadata.formattingApplied.push('masking');
      }

      // Add validation details if requested
      if (this.options.includeValidationStatus) {
        result.validation = this.getValidationDetails(validationResult);
      }

      return result;
    } catch (error) {
      return {
        formatted: null,
        originalInput: cin,
        isValid: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          formattingApplied: [],
        },
      };
    }
  }

  /**
   * Apply formatting according to options
   */
  private applyFormatting(
    prefix: string,
    sequence: string,
    result: CINFormatResult
  ): string {
    const formattedPrefix = this.formatLetterCase(prefix);
    const formattedSequence = this.formatSequence(sequence);
    let formatted = formattedPrefix;

    if (this.options.separator) {
      formatted += this.options.separator;
      result.metadata.formattingApplied.push('separator');
    }

    if (this.options.addSpaces) {
      formatted += ' ';
      result.metadata.formattingApplied.push('spaces');
    }

    formatted += formattedSequence;

    // Add additional information based on options
    if (this.options.includeRegion && result.metadata?.region) {
      formatted += ' ';
      formatted += `(${result.metadata.region})`;
      result.metadata.formattingApplied.push('region');
    }

    if (this.options.includeIssuingOffice && result.metadata?.issuingOffice) {
      formatted += this.options.addSpaces ? ' ' : '';
      formatted += `[Office: ${result.metadata.issuingOffice}]`;
      result.metadata.formattingApplied.push('issuingOffice');
    }

    return formatted;
  }

  /**
   * Format letter case according to options
   */
  private formatLetterCase(text: string): string {
    switch (this.options.letterCase) {
      case 'lower':
        return text.toLowerCase();
      case 'upper':
        return text.toUpperCase();
      default:
        return text;
    }
  }

  /**
   * Format sequence according to digit grouping options
   */
  private formatSequence(sequence: string): string {
    if (
      !this.options.digitGrouping ||
      this.options.digitGrouping.groupSize <= 0
    ) {
      return sequence;
    }

    const { groupSize, separator } = this.options.digitGrouping;
    const regex = new RegExp(`(\\d{${groupSize}})(?=\\d)`, 'g');
    return sequence.replace(regex, `$1${separator}`);
  }

  /**
   * Apply template formatting
   */
  private applyTemplate(
    formatted: string,
    metadata?: CINValidationResult['metadata']
  ): string {
    if (!this.options.template || !metadata) {
      return formatted;
    }

    const replacements = {
      '{prefix}': metadata.issuingOffice || '',
      '{sequence}': metadata.sequence || '',
      '{region}':
        this.options.includeRegion && metadata.region
          ? ` (${metadata.region})`
          : '',
      '{formatted}': formatted,
    };

    let result = this.options.template;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }

    return result;
  }

  /**
   * Apply masking to sensitive digits
   */
  private applyMasking(formatted: string): string {
    if (!this.options.mask?.enabled) {
      return formatted;
    }

    const maskChar = this.options.mask.character || '*';
    const start = this.options.mask.start || 0;
    const length = this.options.mask.length || 4;

    const parts = formatted.split('');
    const digitIndexes = this.findDigitIndexes(formatted);

    for (let i = start; i < start + length && i < digitIndexes.length; i++) {
      parts[digitIndexes[i]] = maskChar;
    }

    return parts.join('');
  }

  /**
   * Find indexes of digits in formatted string
   */
  private findDigitIndexes(formatted: string): number[] {
    return formatted.split('').reduce((indexes, char, index) => {
      if (/\d/.test(char)) {
        indexes.push(index);
      }
      return indexes;
    }, [] as number[]);
  }

  /**
   * Calculate number of masked digits
   */
  private calculateMaskedDigits(): number {
    if (!this.options.mask?.enabled) {
      return 0;
    }
    return Math.min(
      this.options.mask.length || 4,
      6 - (this.options.mask.start || 0)
    );
  }

  /**
   * Get detailed validation information
   */
  private getValidationDetails(validationResult: CINValidationResult): {
    status: 'valid' | 'invalid' | 'partially_valid';
    checks: Array<{ check: string; passed: boolean; message?: string }>;
  } {
    const status = validationResult.isValid
      ? 'valid'
      : validationResult.errors.some(
            e => e.code === CINErrorCode.PARTIALLY_VALID
          )
        ? 'partially_valid'
        : 'invalid';

    return {
      status,
      checks: validationResult.errors.map(error => ({
        check: error.code,
        passed: false,
        message: error.message,
      })),
    };
  }
}

/**
 * Utility function to format a CIN with various display options.
 * Provides a simplified interface to the CINFormatter class.
 *
 * @param {unknown} cin - The CIN to format
 * @param {CINFormatOptions} options - Formatting options
 * @returns {CINFormatResult} Formatted result containing the formatted CIN and metadata
 *
 * @example
 * ```typescript
 * const result = formatCIN('ABC123456', { addSpaces: true });
 * console.log(result.formatted);
 * ```
 */
export function formatCIN(
  cin: unknown,
  options: CINFormatOptions = {}
): CINFormatResult {
  const formatter = new CINFormatter(options);
  return formatter.format(cin);
}

/**
 * Generates all possible standard format variations of a CIN.
 * Useful for displaying different formatting options or for comparison purposes.
 *
 * @param {unknown} cin - The CIN to format
 * @returns {Record<string, string> | null} Object containing different format variations,
 *                                         or null if the input CIN is invalid
 *
 * @example
 * ```typescript
 * const formats = getAllCINFormats('ABC123456');
 * if (formats) {
 *   console.log(formats.standard);    // Basic format
 *   console.log(formats.withSpaces);  // Format with spaces
 *   console.log(formats.masked);      // Masked format
 * }
 * ```
 */
export function getAllCINFormats(cin: unknown): Record<string, string> | null {
  const validation = validateCIN(cin);
  if (!validation.isValid) {
    return null;
  }

  return {
    standard: formatCIN(cin).formatted!,
    withSpaces: formatCIN(cin, { addSpaces: true }).formatted!,
    withRegion: formatCIN(cin, { includeRegion: true }).formatted!,
    withSeparator: formatCIN(cin, {
      digitGrouping: { groupSize: 3, separator: '-' },
    }).formatted!,
    lowercase: formatCIN(cin, { letterCase: 'lower' }).formatted!,
    withIssuingOffice: formatCIN(cin, { includeIssuingOffice: true })
      .formatted!,
    masked: formatCIN(cin, {
      mask: { enabled: true, character: '*', start: 2, length: 4 },
    }).formatted!,
    custom: formatCIN(cin, {
      template: '{prefix}-{sequence} ({region})',
      includeRegion: true,
      separator: '-',
    }).formatted!,
    formatted: formatCIN(cin, {
      addSpaces: true,
      includeRegion: true,
      digitGrouping: { groupSize: 3, separator: '.' },
      includeValidationStatus: true,
    }).formatted!,
  };
}

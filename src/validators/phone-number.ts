import {
  ERRORS,
  type OperatorType,
  type PhoneType,
  type PhoneFormat,
  type PhoneInput,
  type PhoneValidationResult,
  type PhoneDetails,
} from '../types/phone-number';
import { CONFIG, PATTERNS } from '../constants/phone-number';

/**
 * LRU Cache for efficient memory management
 * @template K Cache key type
 * @template V Cache value type
 */
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly maxSize: number;
  private lastCleanup: number = Date.now();
  private readonly cleanupInterval: number;

  constructor(
    maxSize: number,
    cleanupInterval: number = CONFIG.CACHE_CLEANUP_INTERVAL
  ) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.cleanupInterval = cleanupInterval;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value) {
      // Refresh item position
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  private shouldCleanup(): boolean {
    const now = Date.now();
    if (now - this.lastCleanup >= this.cleanupInterval) {
      this.lastCleanup = now;
      return true;
    }
    return false;
  }

  set(key: K, value: V): void {
    if (this.shouldCleanup()) {
      this.clear();
    }
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Initialize caches
const validationCache = new LRUCache<string, PhoneValidationResult>(
  CONFIG.MAX_CACHE_SIZE
);
const detailsCache = new LRUCache<string, PhoneDetails>(CONFIG.MAX_CACHE_SIZE);

// Pre-compile regex patterns for better performance
const COMPILED_PATTERNS = {
  GENERAL: new RegExp(PATTERNS.GENERAL),
  FAKE: new RegExp(PATTERNS.FAKE),
  // ... existing code ...
} as const;

/**
 * Normalizes a phone number by removing non-numeric characters and standardizing format
 * @param input Raw phone number
 * @returns 9-digit normalized number or null if invalid
 */
function normalizeInput(input: PhoneInput): string | null {
  if (!input) {
    return null;
  }

  if (typeof input !== 'string' || input.trim().length === 0) {
    return null;
  }

  if (input.length > CONFIG.MAX_INPUT_LENGTH) {
    return null;
  }

  const normalized = input.replace(/[\s-.()+]/g, '').replace(/\D/g, '');

  if (normalized.startsWith('00212')) return normalized.slice(5);
  if (normalized.startsWith('212')) return normalized.slice(3);
  if (normalized.startsWith('0')) return normalized.slice(1);

  return normalized;
}

/**
 * Determines telecom operator from phone number prefix
 * @param normalizedNumber 9-digit phone number
 * @returns Detected operator or 'UNKNOWN'
 */
function detectOperator(normalizedNumber: string): OperatorType {
  const { OPERATORS } = PATTERNS;

  if (
    OPERATORS.IAM.FIXED.test(normalizedNumber) ||
    OPERATORS.IAM.MOBILE.test(normalizedNumber)
  ) {
    return 'IAM';
  }
  if (
    OPERATORS.ORANGE.FIXED.test(normalizedNumber) ||
    OPERATORS.ORANGE.MOBILE.test(normalizedNumber)
  ) {
    return 'ORANGE';
  }
  if (
    OPERATORS.INWI.FIXED.test(normalizedNumber) ||
    OPERATORS.INWI.MOBILE.test(normalizedNumber)
  ) {
    return 'INWI';
  }

  return 'UNKNOWN';
}

/**
 * Determines if number is mobile or fixed line
 * Mobile starts with 6/7, fixed with 5
 * @param normalizedNumber 9-digit phone number
 * @returns 'MOBILE', 'FIXED', or 'UNKNOWN'
 */
function getPhoneType(normalizedNumber: string): PhoneType {
  const { TYPES } = PATTERNS;

  if (TYPES.MOBILE.test(normalizedNumber)) return 'MOBILE';
  if (TYPES.FIXED.test(normalizedNumber)) return 'FIXED';

  return 'UNKNOWN';
}

/**
 * Validates a Moroccan phone number
 * @param phone Phone number to validate
 * @returns Validation result with details
 */
export function validatePhone(phone: PhoneInput): PhoneValidationResult {
  if (!phone) {
    return { isValid: false, error: ERRORS.EMPTY_INPUT };
  }

  const normalized = normalizeInput(phone);
  if (!normalized) {
    return { isValid: false, error: ERRORS.INVALID_FORMAT };
  }

  if (normalized.length !== 9) {
    return { isValid: false, error: ERRORS.INVALID_FORMAT };
  }

  // Check cache
  const cacheKey = normalized;
  const cached = validationCache.get(cacheKey);
  if (cached) return cached;

  if (!COMPILED_PATTERNS.GENERAL.test(`0${normalized}`)) {
    return { isValid: false, error: ERRORS.INVALID_FORMAT };
  }

  const type = getPhoneType(normalized);
  const operator = detectOperator(normalized);
  const isFake = COMPILED_PATTERNS.FAKE.test(normalized);

  const result: PhoneValidationResult = {
    isValid: true,
    normalizedNumber: normalized,
    type,
    operator,
    isFake,
  };

  validationCache.set(cacheKey, result);
  return result;
}

/**
 * Formats a phone number to specified format (NATIONAL, INTERNATIONAL, E164, RFC3966)
 * @param phone Phone number to format
 * @param format Desired format
 * @returns Formatted number or null if invalid
 */
export function formatPhone(
  phone: PhoneInput,
  format: PhoneFormat = 'INTERNATIONAL'
): string | null {
  if (!phone) return null;

  const { isValid, normalizedNumber } = validatePhone(phone);
  if (!isValid || !normalizedNumber) return null;

  switch (format) {
    case 'NATIONAL':
      return `0${normalizedNumber}`;
    case 'E164':
      return `+${CONFIG.COUNTRY_CODE}${normalizedNumber}`;
    case 'RFC3966':
      return `tel:+${CONFIG.COUNTRY_CODE}-${normalizedNumber}`;
    case 'INTERNATIONAL':
      return `+${CONFIG.COUNTRY_CODE} ${normalizedNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{3})/, '$1 $2 $3 $4')}`;
    default:
      return null;
  }
}

/**
 * Gets comprehensive details about a phone number including validation, type, formats
 * @param phone Phone number to analyze
 * @returns Detailed phone information
 */
export function getPhoneDetails(phone: string): PhoneDetails {
  const normalized = normalizeInput(phone);
  if (!normalized) {
    return {
      type: 'UNKNOWN',
      operator: 'UNKNOWN',
      region: CONFIG.REGION,
      isValid: false,
      isFake: true,
      formats: {
        national: '',
        international: '',
        e164: '',
        rfc3966: '',
      },
    };
  }

  const cacheKey = normalized;
  const cached = detailsCache.get(cacheKey);
  if (cached) return cached;

  const validation = validatePhone(phone);

  const result: PhoneDetails = {
    type: validation.type || 'UNKNOWN',
    operator: validation.operator || 'UNKNOWN',
    region: CONFIG.REGION,
    isValid: validation.isValid,
    isFake: validation.isFake || false,
    formats: {
      national: formatPhone(phone, 'NATIONAL') || '',
      international: formatPhone(phone, 'INTERNATIONAL') || '',
      e164: formatPhone(phone, 'E164') || '',
      rfc3966: formatPhone(phone, 'RFC3966') || '',
    },
  };

  detailsCache.set(cacheKey, result);
  return result;
}

/**
 * Extracts valid Moroccan phone numbers from text
 * @param text Text containing potential phone numbers
 * @returns Array of valid unique numbers in national format
 */
export function extractPhoneNumbers(text: string): string[] {
  if (typeof text !== 'string') return [];

  const phonePattern = /(?:\+212|00212|0)?[567]\d{8}/g;
  const matches = text.match(phonePattern) || [];

  return [...new Set(matches)]
    .map(phone => {
      const validation = validatePhone(phone);
      if (
        validation.isValid &&
        !validation.isFake &&
        validation.normalizedNumber
      ) {
        return `0${validation.normalizedNumber}`;
      }
      return null;
    })
    .filter((phone): phone is string => phone !== null);
}

/**
 * Masks a phone number for privacy (+212 XX ****** X)
 * @param phone Phone number to mask
 * @param maskChar Character for masking
 * @returns Masked number or null if invalid
 */
export function maskPhone(
  phone: string,
  maskChar: string = '*'
): string | null {
  const { isValid, normalizedNumber } = validatePhone(phone);
  if (!isValid || !normalizedNumber) return null;

  const mask = maskChar.charAt(0).repeat(6);
  return `+${CONFIG.COUNTRY_CODE} ${normalizedNumber.slice(0, 2)} ${mask} ${normalizedNumber.slice(-1)}`;
}

/**
 * Compares two phone numbers for equality after normalization
 * @param phone1 First phone number
 * @param phone2 Second phone number
 * @returns True if numbers are equivalent
 */
export function arePhoneNumbersEqual(phone1: string, phone2: string): boolean {
  const norm1 = normalizeInput(phone1);
  const norm2 = normalizeInput(phone2);
  return norm1 === norm2;
}

// Expose necessary types and constants
export { ERRORS };

/**
 * Sanitizes a phone number by removing non-numeric characters
 * @param phone Phone number to sanitize
 * @returns Sanitized number or null if invalid
 */
export function sanitizePhone(phone: PhoneInput): string | null {
  if (!phone) return null;

  const normalized = normalizeInput(phone);
  if (!normalized) return null;

  return normalized.replace(/[^\d+]/g, '');
}

import {
  isValidPassport,
  validatePassport,
  formatPassport,
  generateRandomPassport,
  extractPassportComponents,
  arePassportsEquivalent,
  normalizePassport,
} from '../../src/';
import { PassportErrorCode } from '../../src/types/passport';

describe('Moroccan Passport Validator', () => {
  describe('normalizePassport', () => {
    it('should remove spaces and convert to uppercase', () => {
      expect(normalizePassport('xa 123 456')).toBe('XA123456');
      expect(normalizePassport('yb123  456')).toBe('YB123456');
      expect(normalizePassport('zc123\t456')).toBe('ZC123456');
    });
  });

  describe('isValidPassport', () => {
    const validPassports = ['XA123456', 'YB987654', 'ZC555555'];
    const invalidPassports = [
      '12345678', // No letters
      'A123456', // One letter only
      'ABC12345', // Three letters
      'XA12345', // Too short
      'XA1234567', // Too long
      'X1234567', // Wrong format
      '!A123456', // Invalid character
      '', // Empty string
    ];

    test.each(validPassports)(
      'should return true for valid passport %s',
      passport => {
        expect(isValidPassport(passport)).toBe(true);
      }
    );

    test.each(invalidPassports)(
      'should return false for invalid passport %s',
      passport => {
        expect(isValidPassport(passport)).toBe(false);
      }
    );

    it('should handle null/undefined input at compile time', () => {
      // @ts-expect-error - null is not assignable to string
      isValidPassport(null);
      // @ts-expect-error - undefined is not assignable to string
      isValidPassport(undefined);
    });
  });

  describe('validatePassport', () => {
    it('should return detailed validation for valid passport', () => {
      const result = validatePassport('XA123456');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.normalizedValue).toBe('XA123456');
    });

    it('should return appropriate errors for invalid passport', () => {
      const result = validatePassport('123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: PassportErrorCode.INVALID_FORMAT,
        })
      );
    });

    it('should handle empty input', () => {
      const result = validatePassport('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: PassportErrorCode.REQUIRED,
        })
      );
    });

    it('should validate prefix format', () => {
      const result = validatePassport('A1234567');
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: PassportErrorCode.INVALID_PREFIX,
        })
      );
    });
  });

  describe('formatPassport', () => {
    it('should format valid passport numbers', () => {
      expect(formatPassport('XA123456')).toBe('XA123456');
      expect(formatPassport('XA123456', '-')).toBe('XA-123456');
      expect(formatPassport('XA123456', ' ')).toBe('XA 123456');
    });

    it('should return null for invalid passport numbers', () => {
      expect(formatPassport('123')).toBeNull();
      expect(formatPassport('')).toBeNull();
      expect(formatPassport('INVALID')).toBeNull();
    });

    it('should handle normalized input', () => {
      expect(formatPassport('xa 123 456')).toBe('XA123456');
      expect(formatPassport('xa 123 456', '-')).toBe('XA-123456');
    });
  });

  describe('generateRandomPassport', () => {
    it('should generate valid passport numbers', () => {
      const passport = generateRandomPassport();
      expect(isValidPassport(passport)).toBe(true);
    });

    it('should respect specified prefix', () => {
      const passport = generateRandomPassport({ prefix: 'XA' });
      expect(passport.slice(0, 2)).toBe('XA');
      expect(isValidPassport(passport)).toBe(true);
    });

    it('should avoid specified numbers', () => {
      const avoiding = new Set(['XA123456']);
      const passport = generateRandomPassport({
        prefix: 'XA',
        avoiding,
      });
      expect(passport).not.toBe('XA123456');
      expect(isValidPassport(passport)).toBe(true);
    });

    it('should generate unique numbers in multiple calls', () => {
      const passports = new Set();
      for (let i = 0; i < 100; i++) {
        passports.add(generateRandomPassport());
      }
      expect(passports.size).toBe(100); // All should be unique
    });
  });

  describe('extractPassportComponents', () => {
    it('should correctly extract components of valid passport', () => {
      const components = extractPassportComponents('XA123456');
      expect(components).toEqual({
        prefix: 'XA',
        number: '123456',
        raw: 'XA123456',
      });
    });

    it('should return null for invalid passport', () => {
      expect(extractPassportComponents('123')).toBeNull();
      expect(extractPassportComponents('')).toBeNull();
      expect(extractPassportComponents('INVALID')).toBeNull();
    });

    it('should handle normalized input', () => {
      const components = extractPassportComponents('xa 123 456');
      expect(components).toEqual({
        prefix: 'XA',
        number: '123456',
        raw: 'XA123456',
      });
    });
  });

  describe('arePassportsEquivalent', () => {
    it('should identify equivalent passports despite formatting', () => {
      expect(arePassportsEquivalent('XA123456', 'XA123456')).toBe(true);
      expect(arePassportsEquivalent('XA123456', 'xa 123 456')).toBe(true);
      expect(arePassportsEquivalent('xa-123-456', 'XA123456')).toBe(true);
    });

    it('should identify non-equivalent passports', () => {
      expect(arePassportsEquivalent('XA123456', 'XA123457')).toBe(false);
      expect(arePassportsEquivalent('XA123456', 'XB123456')).toBe(false);
    });

    it('should handle empty or invalid input', () => {
      expect(arePassportsEquivalent('', '')).toBe(false);
      expect(arePassportsEquivalent('XA123456', '')).toBe(false);
      expect(arePassportsEquivalent('', 'XA123456')).toBe(false);
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    it('should handle complete validation workflow', () => {
      // Generate a random passport
      const passport = generateRandomPassport();

      // Validate it
      const validation = validatePassport(passport);
      expect(validation.isValid).toBe(true);

      // Format it
      const formatted = formatPassport(passport, '-');
      expect(formatted).toBe(`${passport.slice(0, 2)}-${passport.slice(2)}`);

      // Extract components
      const components = extractPassportComponents(formatted!);
      expect(components).toBeTruthy();
      expect(components!.raw).toBe(passport);
    });

    it('should handle invalid input', () => {
      const validation = validatePassport('INVALID');
      expect(validation.isValid).toBe(false);
      expect(formatPassport('INVALID')).toBeNull();
      expect(extractPassportComponents('INVALID')).toBeNull();
    });
  });
});

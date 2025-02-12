import { validateCIN, extractCINMetadata, formatCIN } from '../../src';

describe('CIN Validator', () => {
  describe('validateCIN', () => {
    test('should validate correct CIN numbers', () => {
      const validCINs = [
        'A123456', // Single letter, 6 digits
        'BE12345', // Two letters, 5 digits
        'BH12345', // Two letters, 5 digits
        'K123456', // Single letter, 6 digits
      ];

      validCINs.forEach(cin => {
        const result = validateCIN(cin);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('should reject invalid CIN numbers', () => {
      const invalidCINs = [
        '', // empty
        'ABC123', // too many letters
        '123456', // no letters
        'A12345', // single letter with 5 digits (invalid)
        'BE123456', // two letters with 6 digits (invalid)
        'A1234567', // too many digits
        'Z123456', // invalid region
        'A12345A', // digits must be at end
        'BE0123456', // sequence starting with 0
        'XX12345', // invalid two-letter combination
      ];

      invalidCINs.forEach(cin => {
        const result = validateCIN(cin);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    test('should handle whitespace and case sensitivity', () => {
      const result = validateCIN(' a123456 ');
      expect(result.isValid).toBe(true);
    });

    test('should validate sequence numbers', () => {
      expect(validateCIN('A012345').isValid).toBe(false); // Cannot start with 0
      expect(validateCIN('BE01234').isValid).toBe(false); // Cannot start with 0
    });
  });

  describe('extractCINMetadata', () => {
    test('should extract correct region information', () => {
      const metadata = extractCINMetadata('BE12345');
      expect(metadata).toEqual({
        region: 'Casablanca-Settat',
        sequence: '12345',
      });
    });

    test('should return null for invalid CIN', () => {
      const metadata = extractCINMetadata('invalid');
      expect(metadata).toBeNull();
    });
  });

  describe('formatCIN', () => {
    test('should format valid CIN correctly', () => {
      expect(formatCIN('be12345')).toBe('BE12345');
      expect(formatCIN(' A123456 ')).toBe('A123456');
    });

    test('should return null for invalid CIN', () => {
      expect(formatCIN('invalid')).toBeNull();
    });
  });
});

import {
  validateCIN,
  extractCINMetadata,
  formatCIN,
  generateTestCIN,
  getCINRegion,
  sanitizeCIN,
  isValidCIN,
} from '../../src';

describe('CIN Validator', () => {
  describe('validateCIN', () => {
    test('should validate correct CIN numbers', () => {
      const validCINs = [
        'AA123456', // Rabat (1 letter)
        'BE123456', // Casablanca (2 letters)
        'BH123456', // Casablanca (2 letters)
        'AG123456', // Rabat (2 letters)
        'EE123456', // Marrakech (2 letters)
        'JK123456', // Agadir (2 letters)
        'BX123456', // MRE (2 letters)
        'ZT123456', // Taounate (2 letters)
        'UA123456', // Goulmima (2 letters)
        'AD123456', // Temara (2 letters)
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
        'ABCD123456', // too many letters (>3)
        '123456', // no letters
        'A12345', // too few digits
        'BE1234567', // too many digits
        'YY123456', // invalid letter combination
        'A123456A', // digits must be at end
        'BE012345', // sequence starting with 0
        'XX123456', // invalid letter combination
        '##123456', // invalid characters
        -1, // invalid type
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
      expect(validateCIN('BE012345').isValid).toBe(false); // Cannot start with 0
      expect(validateCIN('AJC012345').isValid).toBe(false); // Cannot start with 0
    });
  });

  describe('extractCINMetadata', () => {
    test('should extract correct region information', () => {
      const testCases = [
        {
          cin: 'BE123456',
          expected: { region: 'Casablanca', sequence: '123456' },
        },
        {
          cin: 'A123456',
          expected: { region: 'Rabat', sequence: '123456' },
        },
        {
          cin: 'EE123456',
          expected: { region: 'Marrakech', sequence: '123456' },
        },
        {
          cin: 'BX123456',
          expected: { region: 'MRE', sequence: '123456' },
        },
        {
          cin: 'UA123456',
          expected: { region: 'Goulmima', sequence: '123456' },
        },
        {
          cin: 'AG123456',
          expected: { region: 'Rabat', sequence: '123456' },
        },
      ];

      testCases.forEach(({ cin, expected }) => {
        const metadata = extractCINMetadata(cin);
        expect(metadata).toEqual(expected);
      });
    });

    test('should return null for invalid CIN', () => {
      const metadata = extractCINMetadata('invalid');
      expect(metadata).toBeNull();
    });
  });

  describe('formatCIN', () => {
    test('should format valid CIN correctly', () => {
      expect(formatCIN('be123456')).toBe('BE123456');
      expect(formatCIN(' A123456 ')).toBe('A123456');
      expect(formatCIN('ag123456')).toBe('AG123456');
    });

    test('should return null for invalid CIN', () => {
      expect(formatCIN('invalid')).toBeNull();
    });
  });

  describe('generateTestCIN', () => {
    test('should generate valid CIN with specified prefix', () => {
      const cin = generateTestCIN('BE');
      expect(validateCIN(cin).isValid).toBe(true);
      expect(cin).toMatch(/^BE\d{6}$/);
    });

    test('should generate valid CIN with random prefix', () => {
      const cin = generateTestCIN();
      expect(validateCIN(cin).isValid).toBe(true);
    });
  });

  describe('getCINRegion', () => {
    test('should return correct region for valid prefix', () => {
      expect(getCINRegion('BE')).toBe('Casablanca');
      expect(getCINRegion('be')).toBe('Casablanca');
      expect(getCINRegion(' BE ')).toBe('Casablanca');
    });

    test('should return null for invalid prefix', () => {
      expect(getCINRegion('XX')).toBeNull();
      expect(getCINRegion('')).toBeNull();
    });
  });

  describe('input validation', () => {
    test('should handle non-string inputs', () => {
      expect(validateCIN(null).isValid).toBe(false);
      expect(validateCIN(undefined).isValid).toBe(false);
      expect(validateCIN(123).isValid).toBe(false);
      expect(validateCIN({}).isValid).toBe(false);
      expect(validateCIN([]).isValid).toBe(false);
    });

    test('should handle sanitization edge cases', () => {
      expect(sanitizeCIN(null)).toBeNull();
      expect(sanitizeCIN(undefined)).toBeNull();
      expect(sanitizeCIN(123)).toBeNull();
      expect(sanitizeCIN('BE-123.456')).toBe('BE123456');
      expect(sanitizeCIN('be@123#456')).toBe('BE123456');
    });
  });

  describe('metadata extraction', () => {
    test('should handle invalid inputs for metadata extraction', () => {
      expect(extractCINMetadata(null)).toBeNull();
      expect(extractCINMetadata(undefined)).toBeNull();
      expect(extractCINMetadata(123)).toBeNull();
      expect(extractCINMetadata('invalid')).toBeNull();
    });
  });

  describe('CIN formatting', () => {
    test('should handle invalid inputs for formatting', () => {
      expect(formatCIN(null)).toBeNull();
      expect(formatCIN(undefined)).toBeNull();
      expect(formatCIN(123)).toBeNull();
      expect(formatCIN('invalid')).toBeNull();
      expect(formatCIN('XX123456')).toBeNull();
    });
  });

  describe('isValidCIN', () => {
    test('should return true for valid CIN', () => {
      expect(isValidCIN('A123456')).toBe(true);
      expect(isValidCIN('BE123456')).toBe(true);
      expect(isValidCIN('AG123456')).toBe(true);
    });

    test('should return false for invalid CIN', () => {
      expect(isValidCIN('')).toBe(false);
      expect(isValidCIN('ABCD123456')).toBe(false);
      expect(isValidCIN('123456')).toBe(false);
      expect(isValidCIN('A12345')).toBe(false);
      expect(isValidCIN('BE1234567')).toBe(false);
      expect(isValidCIN('YY123456')).toBe(false);
      expect(isValidCIN('A123456A')).toBe(false);
      expect(isValidCIN('BE012345')).toBe(false);
      expect(isValidCIN('XX123456')).toBe(false);
    });

    test('should handle non-string inputs', () => {
      expect(isValidCIN(null)).toBe(false);
      expect(isValidCIN(undefined)).toBe(false);
      expect(isValidCIN(123)).toBe(false);
      expect(isValidCIN({})).toBe(false);
      expect(isValidCIN([])).toBe(false);
    });

    test('should handle whitespace and case sensitivity', () => {
      expect(isValidCIN(' a123456 ')).toBe(true);
      expect(isValidCIN('BE123456')).toBe(true);
      expect(isValidCIN('be123456')).toBe(true);
    });
  });
});

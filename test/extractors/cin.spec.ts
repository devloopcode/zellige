import { extractCINMetadata } from '../../src/extractors/cin';

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

  describe('metadata extraction', () => {
    test('should handle invalid inputs for metadata extraction', () => {
      expect(extractCINMetadata(null)).toBeNull();
      expect(extractCINMetadata(undefined)).toBeNull();
      expect(extractCINMetadata(123)).toBeNull();
      expect(extractCINMetadata('invalid')).toBeNull();
    });
  });

  test('should return null for invalid CIN', () => {
    const metadata = extractCINMetadata('invalid');
    expect(metadata).toBeNull();
  });
});

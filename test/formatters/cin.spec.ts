import {
  formatCIN,
  CINFormatter,
  CINFormattingError,
  getAllCINFormats,
} from '../../src/formatters/cin';
import type { CINFormatOptions } from '../../src/types/cin';

describe('CINFormatter', () => {
  // Test basic formatting
  it('should format a valid CIN with default options', () => {
    const result = formatCIN('AB123456');
    expect(result.formatted).toBe('AB123456');
    expect(result.isValid).toBe(true);
  });

  // Test invalid input
  it('should handle invalid input', () => {
    const result = formatCIN('invalid');
    expect(result.formatted).toBeNull();
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  // Test formatting options
  describe('formatting options', () => {
    it('should add spaces when specified', () => {
      const options: CINFormatOptions = { addSpaces: true };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('AB 123456');
    });

    it('should convert to lowercase when specified', () => {
      const options: CINFormatOptions = { letterCase: 'lower' };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('ab123456');
    });

    it('should include region when specified', () => {
      const options: CINFormatOptions = { includeRegion: true };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('AB123456 (Salé)');
    });

    it('should apply digit grouping', () => {
      const options: CINFormatOptions = {
        digitGrouping: { groupSize: 3, separator: '-' },
      };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('AB123-456');
    });

    it('should apply masking', () => {
      const options: CINFormatOptions = {
        mask: { enabled: true, character: '*', start: 2, length: 4 },
      };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('AB12****');
    });
  });

  // Test template formatting
  describe('template formatting', () => {
    it('should apply custom template', () => {
      const options: CINFormatOptions = {
        template: '{prefix}-{sequence} {region}',
        includeRegion: true,
      };
      const result = formatCIN('AB123456', options);
      expect(result.formatted).toBe('AB-123456  (Salé)');
    });

    it('should reject invalid template', () => {
      expect(
        () =>
          new CINFormatter({
            template: '{invalid}',
          })
      ).toThrow(CINFormattingError);
    });
  });

  // Test validation status
  describe('validation status', () => {
    it('should include validation status when requested', () => {
      const options: CINFormatOptions = { includeValidationStatus: true };
      const result = formatCIN('AB123456', options);
      expect(result.validation).toBeDefined();
      expect(result.validation?.status).toBe('valid');
    });
  });

  // Test metadata
  describe('metadata handling', () => {
    it('should include formatting metadata', () => {
      const options: CINFormatOptions = {
        addSpaces: true,
        includeRegion: true,
      };
      const result = formatCIN('AB123456', options);
      expect(result.metadata.formattingApplied).toContain('spaces');
      expect(result.metadata.formattingApplied).toContain('region');
    });
  });

  // Test getAllCINFormats
  describe('getAllCINFormats', () => {
    it('should return all format variations for valid CIN', () => {
      const formats = getAllCINFormats('AB123456');
      expect(formats).not.toBeNull();
      expect(formats?.standard).toBeDefined();
      expect(formats?.withSpaces).toBeDefined();
      expect(formats?.withRegion).toBeDefined();
      expect(formats?.withSeparator).toBeDefined();
      expect(formats?.lowercase).toBeDefined();
      expect(formats?.masked).toBeDefined();
    });

    it('should return null for invalid CIN', () => {
      const formats = getAllCINFormats('invalid');
      expect(formats).toBeNull();
    });
  });

  // Test error handling
  describe('error handling', () => {
    it('should throw error for invalid digit grouping options', () => {
      expect(
        () =>
          new CINFormatter({
            digitGrouping: { groupSize: -1, separator: '-' },
          })
      ).toThrow(CINFormattingError);
    });

    it('should throw error for invalid mask options', () => {
      expect(
        () =>
          new CINFormatter({
            mask: { enabled: true, start: -1, length: 4 },
          })
      ).toThrow(CINFormattingError);
    });
  });
});

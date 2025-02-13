import { validateCIN } from '../validators/cin';
import type { CINMetadata } from '../types/cin';

/**
 * Extracts region and sequence information from a valid CIN
 *
 * @param cin - The CIN string to analyze
 * @returns Object containing region and sequence information, or null if CIN is invalid
 *
 * @example
 * ```typescript
 * extractCINMetadata('A123456');
 * // Returns {
 * //   region: 'Rabat',
 * //   sequence: '123456'
 * // }
 *
 * extractCINMetadata('invalid'); // Returns null
 * ```
 */
export function extractCINMetadata(cin: unknown): CINMetadata | null {
  const validationResult = validateCIN(cin);
  if (!validationResult.isValid || !validationResult.metadata) {
    return null;
  }

  return {
    region: validationResult.metadata.region!,
    sequence: validationResult.metadata.sequence!,
  };
}

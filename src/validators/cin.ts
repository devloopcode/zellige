// src/validators/cin.ts

export interface CINValidationResult {
  isValid: boolean;
  errors: string[];
  metadata?: {
    region?: string;
    year?: string;
    sequence?: string;
  };
}

/**
 * Regular expression for Moroccan CIN validation
 * Format:
 * - Single letter: A-Z followed by exactly 6 digits
 * - Two letters: Valid two-letter combinations followed by exactly 5 digits
 */
const SINGLE_LETTER_CIN_REGEX = /^[A-Z]\d{6}$/;
const TWO_LETTER_CIN_REGEX = /^(BE|BH|BJ|BK|CD|EE)\d{5}$/;

/**
 * Mapping of CIN prefixes to regions
 */
const REGION_PREFIXES: { [key: string]: string } = {
  A: 'Rabat-Salé-Kénitra',
  BE: 'Casablanca-Settat',
  BH: 'Casablanca-Settat',
  BJ: 'Casablanca-Settat',
  BK: 'Casablanca-Settat',
  C: 'Fès-Meknès',
  CD: 'Fès-Meknès',
  D: 'Fès-Meknès',
  E: 'Fès-Meknès',
  EE: 'Fès-Meknès',
  F: 'Rabat-Salé-Kénitra',
  G: 'Marrakech-Safi',
  H: 'Marrakech-Safi',
  I: 'Tanger-Tétouan-Al Hoceïma',
  J: 'Tanger-Tétouan-Al Hoceïma',
  K: "L'Oriental",
  L: "L'Oriental",
  M: 'Souss-Massa',
  N: 'Souss-Massa',
  P: 'Béni Mellal-Khénifra',
  Q: 'Béni Mellal-Khénifra',
  R: 'Drâa-Tafilalet',
  S: 'Drâa-Tafilalet',
  T: 'Guelmim-Oued Noun',
  U: 'Laâyoune-Sakia El Hamra',
  V: 'Dakhla-Oued Ed-Dahab',
  W: 'Dakhla-Oued Ed-Dahab',
};

/**
 * Validates a Moroccan CIN (Carte d'Identité Nationale) number
 * @param cin - The CIN number to validate
 * @returns CINValidationResult object containing validation status and details
 */
export function validateCIN(cin: string): CINValidationResult {
  const result: CINValidationResult = {
    isValid: false,
    errors: [],
  };

  // Check if empty
  if (!cin || typeof cin !== 'string') {
    result.errors.push('CIN cannot be empty and must be a string');
    return result;
  }

  // Normalize input
  const normalizedCIN = cin.trim().toUpperCase();

  // Check if it matches either pattern
  const isSingleLetterValid = SINGLE_LETTER_CIN_REGEX.test(normalizedCIN);
  const isTwoLetterValid = TWO_LETTER_CIN_REGEX.test(normalizedCIN);

  if (!isSingleLetterValid && !isTwoLetterValid) {
    result.errors.push(
      'Invalid CIN format. Must be either:\n' +
        '- One letter followed by 6 digits (e.g., A123456)\n' +
        '- Valid two-letter combination (BE,BH,BJ,BK,CD,EE) followed by 5 digits'
    );
    return result;
  }

  // Extract prefix (letters)
  const prefix = normalizedCIN.match(/^[A-Z]+/)![0];

  // Validate region prefix
  if (!REGION_PREFIXES[prefix]) {
    result.errors.push(`Invalid region prefix: ${prefix}`);
    return result;
  }

  // Extract sequence (numbers)
  const sequence = normalizedCIN.match(/\d+$/)![0];

  // Additional validation for sequence
  if (!/^[1-9]\d*$/.test(sequence)) {
    result.errors.push('Sequence number cannot start with 0');
    return result;
  }

  // If we got here, the CIN is valid
  result.isValid = true;
  result.metadata = {
    region: REGION_PREFIXES[prefix],
    sequence: sequence,
  };

  return result;
}

/**
 * Extracts metadata from a valid CIN number
 * @param cin - The CIN number to analyze
 * @returns Metadata object or null if CIN is invalid
 */
export function extractCINMetadata(cin: string) {
  const validation = validateCIN(cin);
  return validation.isValid ? validation.metadata : null;
}

/**
 * Formats a CIN number to standard format
 * @param cin - The CIN number to format
 * @returns Formatted CIN string or null if invalid
 */
export function formatCIN(cin: string): string | null {
  const validation = validateCIN(cin);
  if (!validation.isValid) {
    return null;
  }

  return cin.trim().toUpperCase();
}

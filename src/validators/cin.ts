export enum CINErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_REGION = 'INVALID_REGION',
  INVALID_SEQUENCE = 'INVALID_SEQUENCE',
}

export interface CINError {
  code: CINErrorCode;
  message: string;
}

export interface CINValidationResult {
  isValid: boolean;
  errors: CINError[];
  metadata?: {
    region?: string;
    year?: string;
    sequence?: string;
    issuingOffice?: string;
  };
}

export interface CINMetadata {
  region: string;
  sequence: string;
}

/**
 * Regular expression for Moroccan CIN validation
 * Format: 1-3 letters followed by 6 digits
 */
const CIN_REGEX = /^[A-Z]{1,3}\d{6}$/;

/**
 * Mapping of CIN prefixes to regions
 */
const REGION_PREFIXES: { [key: string]: string } = {
  // Rabat-Salé-Kénitra Region
  A: 'Rabat',
  AA: 'Rabat',
  AG: 'Rabat',
  AC: 'Rabat',
  AJ: 'Rabat',
  AB: 'Salé',
  AE: 'Salé',
  AY: 'Salé',
  AS: 'Salé',
  AD: 'Témara',
  G: 'Kénitra',
  GA: 'Sidi Slimane',
  GB: 'Souk El Arbâa du Gharb',
  GK: 'Sidi Kacem',
  GM: 'Ouezzane',
  GN: 'Mechraa Belqsiri',
  GJ: 'Jorf El Melha',

  // Casablanca-Settat Region
  B: 'Casablanca',
  BA: 'Casablanca',
  BB: 'Casablanca',
  BE: 'Casablanca',
  BH: 'Casablanca',
  BJ: 'Casablanca',
  BK: 'Casablanca',
  BL: 'Casablanca',
  BM: 'Casablanca',
  BF: 'Casablanca',
  BV: 'Casablanca',
  BW: 'Casablanca',
  T: 'Mohammedia',
  TA: 'Benslimane',
  TK: 'Benslimane',
  W: 'Settat',
  WA: 'Berrechid',
  WB: 'Ben Ahmed',

  // Fès-Meknès Region
  C: 'Fès',
  CC: 'Fès',
  CD: 'Fès',
  CB: 'Sefrou',
  CN: 'Boulemane',
  D: 'Meknès',
  DN: 'Meknès',
  DA: 'Azrou',
  DB: 'Ifrane',
  DC: 'Moulay Driss Zerhoun',
  DJ: 'Ain Taoujdate',
  DO: 'Ouislane',

  // Marrakech-Safi Region
  E: 'Marrakech',
  EE: 'Marrakech',
  EA: 'Ben Guerir',
  H: 'Safi',
  HH: 'Safi',
  HA: 'Youssoufia',
  Y: 'El Kelâa des Sraghna',

  // Tanger-Tétouan-Al Hoceïma Region
  K: 'Tanger',
  KB: 'Tanger',
  KA: 'Assilah',
  L: 'Tétouan',
  LA: 'Larache',
  LB: 'Ksar El Kebir',
  LC: 'Chefchaouen',
  LE: 'Martil',
  LF: 'Fnideq',
  LG: 'Mdiq',
  R: 'Al Hoceima',
  RB: 'Imzouren',
  RC: 'Targuist',
  RX: 'Beni Bouayach',

  // L'Oriental Region
  F: 'Oujda',
  FA: 'Berkane',
  FB: 'Taourirt',
  FD: 'Aïn Beni Mathar',
  FE: 'Saïdia',
  FG: 'Figuig',
  FH: 'Jerada',
  FJ: 'Ahfir',
  FK: 'Touissit',
  FL: 'Bouârfa',

  // Souss-Massa Region
  J: 'Agadir',
  JK: 'Agadir',
  JB: 'Inzegane',
  JC: 'Taroudant',
  JE: 'Tiznit',
  JH: 'Chtouka Aït Baha',
  JM: 'Ait Melloul',
  JT: 'Ouled Teima',

  // Béni Mellal-Khénifra Region
  I: 'Beni Mellal',
  IA: 'Kasba Tadla',
  IB: 'Fqih Ben Saleh',
  IC: 'Azilal',
  ID: 'Souk Sebt',
  IE: 'Demnate',
  V: 'Khenifra',
  VA: 'Midelt',
  VM: "M'rirt",

  // Other Regions
  M: 'El Jadida',
  MA: 'Azemmour',
  MC: 'Sidi Bennour',
  MD: 'Zemamra',
  N: 'Essaouira',
  O: 'Dakhla',
  OD: 'Dakhla',
  P: 'Ouarzazate',
  PA: 'Tinghir',
  PB: 'Zagora',
  Q: 'Khouribga',
  QA: 'Oued Zem',
  QB: 'Bejaâd',
  S: 'Nador',
  SA: 'Nador',
  SB: 'Zegangan',
  SH: 'Lâayoune',
  SJ: 'Smara',
  SK: 'Tarfaya',
  SL: 'Boujdour',
  U: 'Errachidia',
  UA: 'Goulmima',
  UB: 'Rich',
  UC: 'Erfoud',
  UD: 'Rissani',
  X: 'Khemisset',
  XA: 'Tiflet',
  Z: 'Taza',
  ZG: 'Guercif',
  ZH: 'Karia Ba Mohamed',
  ZT: 'Taounate',

  // MRE (Marocains Résidents à l'Étranger)
  BX: 'MRE',
  DF: 'MRE',
  PK: 'MRE',
  PP: 'MRE',
  PS: 'MRE',
  PH: 'MRE',
  PY: 'MRE',
  ES: 'MRE',

  // Additional/Updated entries
  FC: 'El Aioun Sidi Mellouk',
  JA: 'Guelmim',
  JD: 'Sidi Ifni',
  JF: 'Tan-Tan',
  JY: 'Tata',
  JZ: 'Assa-Zag',
};

// Add literal types for regions
export type CINRegionPrefix = keyof typeof REGION_PREFIXES;

/**
 * Sanitizes a CIN (Carte d'Identité Nationale) input string by removing whitespace and special characters
 *
 * @param input - Raw CIN input that needs to be sanitized
 * @returns Sanitized uppercase string or null if input is invalid
 *
 * @example
 * ```typescript
 * sanitizeCIN('A 123456'); // Returns 'A123456'
 * sanitizeCIN('BE-789.012'); // Returns 'BE789012'
 * sanitizeCIN(null); // Returns null
 * ```
 */
export function sanitizeCIN(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

/**
 * Performs comprehensive validation of a Moroccan CIN (Carte d'Identité Nationale)
 *
 * @param cin - The CIN string to validate
 * @returns Validation result containing status, errors, and metadata if valid
 *
 * @example
 * ```typescript
 * validateCIN('A123456');
 * // Returns {
 * //   isValid: true,
 * //   errors: [],
 * //   metadata: {
 * //     region: 'Rabat',
 * //     sequence: '123456',
 * //     issuingOffice: 'A'
 * //   }
 * // }
 *
 * validateCIN('XX999999');
 * // Returns {
 * //   isValid: false,
 * //   errors: [{
 * //     code: CINErrorCode.INVALID_REGION,
 * //     message: 'Invalid region prefix: XX'
 * //   }]
 * // }
 * ```
 */
export function validateCIN(cin: unknown): CINValidationResult {
  const result: CINValidationResult = {
    isValid: false,
    errors: [],
  };

  // Input validation
  if (!cin || typeof cin !== 'string') {
    result.errors.push({
      code: CINErrorCode.INVALID_INPUT,
      message: 'CIN must be a non-empty string',
    });
    return result;
  }

  // Sanitize input
  const sanitized = sanitizeCIN(cin);
  if (!sanitized) {
    result.errors.push({
      code: CINErrorCode.INVALID_INPUT,
      message: 'CIN contains invalid characters',
    });
    return result;
  }

  // Check format
  if (!CIN_REGEX.test(sanitized)) {
    result.errors.push({
      code: CINErrorCode.INVALID_FORMAT,
      message: 'Invalid CIN format. Must be 1-3 letters followed by 6 digits',
    });
    return result;
  }

  // Extract and validate parts
  const prefix = sanitized.match(/^[A-Z]+/)![0] as CINRegionPrefix;
  const sequence = sanitized.match(/\d+$/)![0];

  // Validate region
  if (!REGION_PREFIXES[prefix]) {
    result.errors.push({
      code: CINErrorCode.INVALID_REGION,
      message: `Invalid region prefix: ${prefix}`,
    });
    return result;
  }

  // Validate sequence
  if (!/^[1-9]\d{5}$/.test(sequence)) {
    result.errors.push({
      code: CINErrorCode.INVALID_SEQUENCE,
      message: 'Sequence must be 6 digits and cannot start with 0',
    });
    return result;
  }

  // Valid CIN
  result.isValid = true;
  result.metadata = {
    region: REGION_PREFIXES[prefix],
    sequence: sequence,
    issuingOffice: prefix as string,
  };

  return result;
}

/**
 * Quick check to determine if a string is a valid Moroccan CIN
 *
 * @param cin - The CIN string to check
 * @returns True if the CIN is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidCIN('A123456'); // Returns true
 * isValidCIN('XX999999'); // Returns false
 * isValidCIN('12345'); // Returns false
 * ```
 */
export function isValidCIN(cin: unknown): boolean {
  return validateCIN(cin).isValid;
}

/**
 * Retrieves the region name associated with a CIN prefix
 *
 * @param prefix - The CIN prefix (1-3 letters) to look up
 * @returns The full region name or null if the prefix is invalid
 *
 * @example
 * ```typescript
 * getCINRegion('A'); // Returns 'Rabat'
 * getCINRegion('BK'); // Returns 'Casablanca'
 * getCINRegion('XX'); // Returns null
 * ```
 */
export function getCINRegion(prefix: string): string | null {
  const sanitized = prefix.trim().toUpperCase();
  return REGION_PREFIXES[sanitized as CINRegionPrefix] || null;
}

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

/**
 * Formats a CIN string to its standardized format (uppercase, no spaces or special characters)
 *
 * @param cin - The CIN string to format
 * @returns Formatted CIN string or null if input is invalid
 *
 * @example
 * ```typescript
 * formatCIN('a 123-456'); // Returns 'A123456'
 * formatCIN('bk.789.012'); // Returns 'BK789012'
 * formatCIN('invalid'); // Returns null
 * ```
 */
export function formatCIN(cin: unknown): string | null {
  const sanitized = sanitizeCIN(cin);
  if (!sanitized) {
    return null;
  }

  const validationResult = validateCIN(sanitized);
  if (!validationResult.isValid) {
    return null;
  }

  return sanitized;
}

/**
 * Generates a random valid CIN for testing purposes
 *
 * @param prefix - Optional specific region prefix to use
 * @returns A valid CIN string
 *
 * @example
 * ```typescript
 * generateTestCIN(); // Returns random CIN like 'A123456'
 * generateTestCIN('BK'); // Returns random CIN starting with 'BK'
 * ```
 */
export function generateTestCIN(prefix?: CINRegionPrefix): string {
  const randomPrefix =
    prefix ||
    Object.keys(REGION_PREFIXES)[
      Math.floor(Math.random() * Object.keys(REGION_PREFIXES).length)
    ];
  const sequence = String(Math.floor(Math.random() * 899999) + 100000);
  return `${randomPrefix}${sequence}`;
}

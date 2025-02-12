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
const SINGLE_LETTER_CIN_REGEX = /^[ABCDEFGHIJKLMNOPQRSTUVWXZ]\d{6}$/;
const TWO_LETTER_CIN_REGEX =
  /^(AG|AC|AJ|AB|AE|AY|AS|AD|BA|BB|BE|BH|BJ|BK|BL|BM|BF|BV|BW|BX|CC|CD|CB|CN|DN|DA|DB|DC|DJ|DO|DF|EE|EA|ES|FA|FB|FC|FD|FE|FG|FH|FJ|FK|FL|GA|GB|GK|GM|GN|GJ|HH|HA|IA|IB|IC|ID|IE|JK|JA|JB|JC|JD|JE|JF|JH|JM|JT|JY|JZ|KB|KA|LA|LB|LC|LE|LF|LG|MA|MC|MD|OD|PA|PB|PK|PP|PY|QA|QB|RB|RC|RX|SA|SB|SH|SJ|SK|SL|TA|TK|UA|UB|UC|UD|VA|VM|WA|WB|XA|ZG|ZH|ZT)\d{5}$/;

/**
 * Mapping of CIN prefixes to regions
 */
const REGION_PREFIXES: { [key: string]: string } = {
  // Rabat-Salé-Kénitra Region
  A: 'Rabat',
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
  PY: 'MRE',
  ES: 'MRE',
};

/**
 * Validates a Moroccan CIN (Carte d'Identité Nationale) number
 * @param cin - The CIN number to validate
 * @returns CINValidationResult object containing validation status and details
 */
/**
 * Validates a CIN (Citizen Identification Number) based on specific patterns and rules.
 *
 * @param cin - The CIN string to validate.
 * @returns An object containing the validation result, including whether the CIN is valid,
 *          any errors encountered during validation, and metadata if the CIN is valid.
 *
 * The validation process includes:
 * - Checking if the CIN is empty or not a string.
 * - Normalizing the input by trimming and converting to uppercase.
 * - Checking if the CIN matches either of the allowed patterns:
 *   - One letter followed by 6 digits (e.g., A123456)
 *   - Valid two-letter combination (BE, BH, BJ, BK, CD, EE) followed by 5 digits
 * - Extracting and validating the region prefix.
 * - Extracting and validating the sequence number.
 *
 * If the CIN is valid, the result will include metadata with the region and sequence number.
 *
 * @example
 * ```typescript
 * const result = validateCIN('A123456');
 * if (result.isValid) {
 *   console.log('Valid CIN:', result.metadata);
 * } else {
 *   console.error('Invalid CIN:', result.errors);
 * }
 * ```
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

export type OperatorType = 'IAM' | 'INWI' | 'ORANGE' | 'UNKNOWN';
export type PhoneType = 'MOBILE' | 'FIXED' | 'UNKNOWN';
export type PhoneFormat = 'NATIONAL' | 'INTERNATIONAL' | 'E164' | 'RFC3966';
export type PhoneInput = string | null | undefined;
export type ValidationError = keyof typeof ERRORS;

export interface PhoneValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
  readonly normalizedNumber?: string;
  readonly type?: PhoneType;
  readonly operator?: OperatorType;
  readonly isFake?: boolean;
}

export interface PhoneDetails {
  readonly type: PhoneType;
  readonly operator: OperatorType;
  readonly region: string;
  readonly isValid: boolean;
  readonly isFake: boolean;
  readonly formats: Readonly<{
    national: string;
    international: string;
    e164: string;
    rfc3966: string;
  }>;
}

export const ERRORS = {
  REQUIRED: 'Phone number is required',
  INVALID_FORMAT: 'Invalid phone number format',
  INVALID_PREFIX: 'Invalid phone number prefix',
  INVALID_LENGTH: 'Invalid phone number length',
  UNKNOWN_OPERATOR: 'Unknown operator',
  UNKNOWN_TYPE: 'Unknown phone type',
  EMPTY_INPUT: 'Phone number cannot be empty',
  INVALID_COUNTRY: 'Invalid country code',
  INVALID_CHARACTERS: 'Phone number contains invalid characters',
} as const;

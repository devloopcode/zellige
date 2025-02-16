export const CONFIG = {
  COUNTRY_CODE: '212',
  MAX_INPUT_LENGTH: 20,
  MAX_CACHE_SIZE: 10000,
  CACHE_CLEANUP_INTERVAL: 3600000, // 1 hour
  REGION: 'MA' as const,
} as const;

export const PATTERNS = {
  GENERAL: /^(?:(?:\+|00)212|0)?[567]\d{8}$/,
  OPERATORS: {
    IAM: {
      FIXED: /^5[23]/,
      MOBILE: /^6[0-4]/,
    },
    INWI: {
      FIXED: /^5[45]/,
      MOBILE: /^65/,
    },
    ORANGE: {
      FIXED: /^5[67]/,
      MOBILE: /^66/,
    },
  },
  TYPES: {
    FIXED: /^5/,
    MOBILE: /^[67]/,
  },
  FAKE: /^(?:0*|1*|(\d)\1{8}|12345678|87654321)$/,
} as const;

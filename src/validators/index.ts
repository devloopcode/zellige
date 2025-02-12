// Import all validators
import { validateCIN, extractCINMetadata, formatCIN } from './cin';

// Export individual validators
export const cin = {
  validate: validateCIN,
  extractMetadata: extractCINMetadata,
  format: formatCIN,
};

// Export all validators as a group
export const validators = {
  cin,
};

// Default export for easier importing
export default validators;

// export individual functions for direct use
export { validateCIN, extractCINMetadata, formatCIN };

// Export types
export type { CINValidationResult } from './cin';

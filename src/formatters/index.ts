/**
 * Formatter module for CIN (Carte d'Identité Nationale) operations
 * @module formatters
 */

/**
 * Import CIN formatting utilities
 */
import {
  formatCIN,
  getAllCINFormats,
  CINFormatter,
  CINFormattingError,
} from './cin';

/**
 * Namespace containing all CIN-related formatting functions
 */
const cin = {
  format: formatCIN,
  getAllFormats: getAllCINFormats,
  Formatter: CINFormatter,
  FormattingError: CINFormattingError,
};

/**
 * Collection of all formatter namespaces
 */
export const formatters = {
  cin,
};

/**
 * Default export providing access to all formatter functions
 * @default
 */
export default formatters;

/**
 * Direct exports of CIN formatting functions and classes for granular imports
 */
export { formatCIN, getAllCINFormats, CINFormatter, CINFormattingError };

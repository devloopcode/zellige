/**
 * Extractor module for various data extraction operations
 * @module extractors
 */

/**
 * Import CIN extraction utilities
 */
import { extractCINMetadata } from './cin';

/**
 * Namespace containing all CIN-related extraction functions
 */
const cin = {
  extract: extractCINMetadata,
};

/**
 * Collection of all extractor namespaces
 */
export const extractors = {
  cin,
};

/**
 * Default export providing access to all extractor functions
 * @default
 */
export default extractors;

/**
 * Direct exports of CIN extraction functions for granular imports
 */
export { extractCINMetadata };

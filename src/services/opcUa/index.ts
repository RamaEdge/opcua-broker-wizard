
// Export types
export * from './opcUaTypes';

// Export connection functions
export { testConnection } from './opcUaConnection';

// Export browsing functions
export { browseServer } from './opcUaBrowse';

// Export read/write functions
export { readNodeValue, writeNodeValue } from './opcUaReadWrite';

// Export utility functions that might be useful externally
export { validateEndpointFormat } from './opcUaUtils';

// Create a consolidated service object for backward compatibility
import { browseServer } from './opcUaBrowse';
import { testConnection } from './opcUaConnection';
import { readNodeValue, writeNodeValue } from './opcUaReadWrite';

/**
 * Service to handle OPC UA server connections and browsing through a Rust backend
 */
export const opcUaService = {
  testConnection,
  browseServer,
  readNodeValue,
  writeNodeValue
};

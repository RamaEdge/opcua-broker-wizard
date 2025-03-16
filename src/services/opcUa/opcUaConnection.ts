import type { ConnectionStatus } from './opcUaTypes';
import { validateEndpointFormat, createErrorHandler, getApiBaseUrl } from './opcUaUtils';

interface ErrorResponse {
  message: string;
}

interface ConnectionResponse {
  connected: boolean;
  message?: string;
}

/**
 * Test connection to an OPC UA server via Rust backend
 * @param endpoint The server endpoint URL
 * @returns Promise resolving to connection status
 */
export const testConnection = async (endpoint: string): Promise<{ status: ConnectionStatus; message?: string }> => {
  try {
    // Initial validation
    const validation = validateEndpointFormat(endpoint);
    if (!validation.isValid) {
      return { status: 'error', message: validation.message };
    }
    
    // Call the Rust backend to validate the connection
    const response = await fetch(`${getApiBaseUrl()}/validate-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      return { 
        status: 'error', 
        message: errorData.message || `Connection error: ${response.statusText}` 
      };
    }
    
    const data = await response.json() as ConnectionResponse;
    return data.connected 
      ? { status: 'connected' } 
      : { status: 'error', message: data.message || 'Failed to connect to the server' };
    
  } catch (error) {
    const errorMessage = createErrorHandler('connecting to OPC UA server', false)(error);
    return { status: 'error', message: errorMessage };
  }
};

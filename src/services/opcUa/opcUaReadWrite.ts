
import { createErrorHandler, getApiBaseUrl } from './opcUaUtils';

/**
 * Read a value from an OPC UA node via Rust backend
 * @param endpoint The server endpoint URL
 * @param nodeId The node ID to read
 * @returns Promise resolving to the node value
 */
export const readNodeValue = async (endpoint: string, nodeId: string): Promise<any> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/read-value`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, nodeId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Read error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value;
    
  } catch (error) {
    createErrorHandler('reading OPC UA node value')(error);
    return null;
  }
};

/**
 * Write a value to an OPC UA node via Rust backend
 * @param endpoint The server endpoint URL
 * @param nodeId The node ID to write to
 * @param value The value to write
 * @returns Promise resolving to success status
 */
export const writeNodeValue = async (endpoint: string, nodeId: string, value: any): Promise<boolean> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/write-value`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, nodeId, value }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Write error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.success;
    
  } catch (error) {
    createErrorHandler('writing OPC UA node value')(error);
    return false;
  }
};

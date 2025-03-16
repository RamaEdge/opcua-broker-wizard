type OpcUaValueType = 
  | string 
  | number 
  | boolean 
  | Date 
  | Array<OpcUaValueType>
  | { [key: string]: OpcUaValueType };

type WriteValueType = 
  | string 
  | number 
  | boolean 
  | Date 
  | Array<WriteValueType>
  | { [key: string]: WriteValueType };

interface ErrorResponse {
  message: string;
}

interface OpcUaReadResponse {
  value: OpcUaValueType;
  dataType?: string;
  sourceTimestamp?: string;
}

interface WriteNodeParams {
  endpoint: string;
  nodeId: string;
  value: WriteValueType;
  dataType?: string;
}

import { createErrorHandler, getApiBaseUrl } from './opcUaUtils';

/**
 * Read a value from an OPC UA node via Rust backend
 * @param endpoint The server endpoint URL
 * @param nodeId The node ID to read
 * @returns Promise resolving to the node value
 */
export const readNodeValue = async (
  endpoint: string, 
  nodeId: string
): Promise<OpcUaReadResponse> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/read-value`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, nodeId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || `Read error: ${response.statusText}`);
    }
    
    const data = await response.json() as OpcUaReadResponse;
    return data;
  } catch (error) {
    createErrorHandler('reading OPC UA node value')(error);
    throw error;
  }
};

/**
 * Write a value to an OPC UA node via Rust backend
 * @param params The write request parameters
 * @returns Promise resolving to success status
 */
export const writeNodeValue = async (
  params: WriteNodeParams
): Promise<void> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/write-value`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || `Write error: ${response.statusText}`);
    }
  } catch (error) {
    createErrorHandler('writing OPC UA node value')(error);
  }
};


import { toast } from "@/hooks/use-toast";

import { createErrorHandler, getApiBaseUrl } from './opcUaUtils';
import { testConnection } from './opcUaConnection';
import type { OpcUaNode } from './opcUaTypes';

/**
 * Browse the OPC UA server address space via Rust backend
 * @param endpoint The server endpoint URL
 * @param nodeId The node ID to browse from (optional)
 * @returns Promise resolving to an array of OPC UA nodes
 */
export const browseServer = async (endpoint: string, nodeId?: string): Promise<OpcUaNode[]> => {
  const handleError = createErrorHandler('Browse server');
  
  try {
    // Validate connection first (optional - you might want to skip this if you know you're already connected)
    if (!nodeId) {
      const connectionCheck = await testConnection(endpoint);
      if (connectionCheck.status !== 'connected') {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: connectionCheck.message || 'Failed to connect to the server'
        });
        throw new Error(connectionCheck.message || 'Failed to connect to the server');
      }
    }
    
    // Call the Rust backend to browse the server
    const response = await fetch(`${getApiBaseUrl()}/browse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        endpoint,
        nodeId: nodeId || 'i=84' // Root folder (i=84) if no nodeId is provided
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Browse error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.nodes;
    
  } catch (error) {
    return handleError(error);
  }
};

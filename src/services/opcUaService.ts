
import { toast } from "@/hooks/use-toast";

export type OpcUaNode = {
  id: string;
  name: string;
  nodeType: string;
  children?: OpcUaNode[];
  dataType?: string;
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting' | 'validating';

// Backend API configuration
const BACKEND_URL = import.meta.env.VITE_OPCUA_BACKEND_URL || 'http://localhost:3000/api';

/**
 * Service to handle OPC UA server connections and browsing through a Rust backend
 */
export const opcUaService = {
  /**
   * Test connection to an OPC UA server via Rust backend
   * @param endpoint The server endpoint URL
   * @returns Promise resolving to connection status
   */
  testConnection: async (endpoint: string): Promise<{ status: ConnectionStatus; message?: string }> => {
    try {
      // Initial validation
      if (!endpoint) {
        return { status: 'error', message: 'Endpoint URL is required' };
      }
      
      // Validate endpoint format
      if (!endpoint.startsWith('opc.tcp://')) {
        return { status: 'error', message: 'Endpoint must start with opc.tcp://' };
      }
      
      // Extract host and port from endpoint for basic validation
      try {
        const url = new URL(endpoint);
        const host = url.hostname;
        const port = url.port;
        
        if (!host) {
          return { status: 'error', message: 'Invalid hostname in endpoint URL' };
        }
        
        if (port && (isNaN(Number(port)) || Number(port) <= 0 || Number(port) > 65535)) {
          return { status: 'error', message: 'Invalid port number. Port must be between 1-65535' };
        }
      } catch (e) {
        return { status: 'error', message: 'Invalid endpoint URL format' };
      }
      
      // Call the Rust backend to validate the connection
      const response = await fetch(`${BACKEND_URL}/validate-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { 
          status: 'error', 
          message: errorData.message || `Connection error: ${response.statusText}` 
        };
      }
      
      const data = await response.json();
      return data.connected 
        ? { status: 'connected' } 
        : { status: 'error', message: data.message || 'Failed to connect to the server' };
      
    } catch (error) {
      console.error('Error connecting to OPC UA server:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to reach the backend server';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { status: 'error', message: errorMessage };
    }
  },
  
  /**
   * Browse the OPC UA server address space via Rust backend
   * @param endpoint The server endpoint URL
   * @param nodeId The node ID to browse from (optional)
   * @returns Promise resolving to an array of OPC UA nodes
   */
  browseServer: async (endpoint: string, nodeId?: string): Promise<OpcUaNode[]> => {
    try {
      // Validate connection first (optional - you might want to skip this if you know you're already connected)
      if (!nodeId) {
        const connectionCheck = await opcUaService.testConnection(endpoint);
        if (connectionCheck.status !== 'connected') {
          throw new Error(connectionCheck.message || 'Failed to connect to the server');
        }
      }
      
      // Call the Rust backend to browse the server
      const response = await fetch(`${BACKEND_URL}/browse`, {
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
      console.error('Error browsing OPC UA server:', error);
      toast({
        title: "Error browsing server",
        description: error instanceof Error ? error.message : "Failed to browse the OPC UA server",
        variant: "destructive",
      });
      return [];
    }
  },
  
  /**
   * Read a value from an OPC UA node via Rust backend
   * @param endpoint The server endpoint URL
   * @param nodeId The node ID to read
   * @returns Promise resolving to the node value
   */
  readNodeValue: async (endpoint: string, nodeId: string): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/read-value`, {
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
      console.error('Error reading OPC UA node value:', error);
      toast({
        title: "Error reading node value",
        description: error instanceof Error ? error.message : "Failed to read the node value",
        variant: "destructive",
      });
      return null;
    }
  },
  
  /**
   * Write a value to an OPC UA node via Rust backend
   * @param endpoint The server endpoint URL
   * @param nodeId The node ID to write to
   * @param value The value to write
   * @returns Promise resolving to success status
   */
  writeNodeValue: async (endpoint: string, nodeId: string, value: any): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/write-value`, {
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
      console.error('Error writing OPC UA node value:', error);
      toast({
        title: "Error writing node value",
        description: error instanceof Error ? error.message : "Failed to write the node value",
        variant: "destructive",
      });
      return false;
    }
  }
};

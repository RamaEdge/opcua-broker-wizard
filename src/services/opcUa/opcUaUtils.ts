
import { toast } from "@/hooks/use-toast";
import { backendConfig } from "@/config/backendConfig";

/**
 * Validates an OPC UA endpoint format
 * @param endpoint The endpoint to validate
 * @returns An object with validation result and optional error message
 */
export const validateEndpointFormat = (endpoint: string): { isValid: boolean; message?: string } => {
  // Check if endpoint is provided
  if (!endpoint) {
    return { isValid: false, message: 'Endpoint URL is required' };
  }
  
  // Check if endpoint has the correct protocol
  if (!endpoint.startsWith('opc.tcp://')) {
    return { isValid: false, message: 'Endpoint must start with opc.tcp://' };
  }
  
  // Validate URL format and extract host and port
  try {
    const url = new URL(endpoint);
    const host = url.hostname;
    const port = url.port;
    
    if (!host) {
      return { isValid: false, message: 'Invalid hostname in endpoint URL' };
    }
    
    if (port && (isNaN(Number(port)) || Number(port) <= 0 || Number(port) > 65535)) {
      return { isValid: false, message: 'Invalid port number. Port must be between 1-65535' };
    }
    
    return { isValid: true };
  } catch (e) {
    return { isValid: false, message: 'Invalid endpoint URL format' };
  }
};

/**
 * Creates a standardized error handler for OPC UA operations
 * @param operation Name of the operation for logging
 * @param showToast Whether to show a toast notification for the error
 * @returns A function to handle errors consistently
 */
export const createErrorHandler = (operation: string, showToast = true) => {
  return (error: unknown): string => {
    console.error(`Error ${operation}:`, error);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error instanceof Error) {
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to reach the backend server';
      } else {
        errorMessage = error.message;
      }
    }
    
    if (showToast) {
      toast({
        title: `Error ${operation}`,
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    return errorMessage;
  };
};

/**
 * Get the API base URL from configuration
 */
export const getApiBaseUrl = (): string => {
  return backendConfig.opcUaBackendUrl;
};

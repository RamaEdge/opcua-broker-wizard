
import { validateEndpointFormat, createErrorHandler, getApiBaseUrl } from '../opcUaUtils';
import { toast } from '@/hooks/use-toast';
import { backendConfig } from '@/config/backendConfig';

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

describe('opcUaUtils', () => {
  describe('validateEndpointFormat', () => {
    it('should validate correct OPC UA endpoint', () => {
      const validEndpoint = 'opc.tcp://localhost:4840';
      const result = validateEndpointFormat(validEndpoint);
      
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject empty endpoint', () => {
      const result = validateEndpointFormat('');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Endpoint URL is required');
    });

    it('should reject endpoint with wrong protocol', () => {
      const invalidEndpoint = 'http://localhost:4840';
      const result = validateEndpointFormat(invalidEndpoint);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Endpoint must start with opc.tcp://');
    });

    it('should reject endpoint with invalid hostname', () => {
      const invalidEndpoint = 'opc.tcp://:4840';
      const result = validateEndpointFormat(invalidEndpoint);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid hostname in endpoint URL');
    });

    it('should reject endpoint with invalid port', () => {
      const invalidEndpoint = 'opc.tcp://localhost:99999';
      const result = validateEndpointFormat(invalidEndpoint);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid port number. Port must be between 1-65535');
    });

    it('should handle malformed URLs', () => {
      const malformedEndpoint = 'opc.tcp://loc@:host:4840';
      const result = validateEndpointFormat(malformedEndpoint);
      
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid endpoint format');
    });
  });

  describe('createErrorHandler', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log errors to console', () => {
      console.error = jest.fn();
      
      const handler = createErrorHandler('test operation');
      const error = new Error('Test error');
      
      handler(error);
      
      expect(console.error).toHaveBeenCalledWith('Error test operation:', error);
    });

    it('should return error message', () => {
      const handler = createErrorHandler('test operation');
      const error = new Error('Test error');
      
      const result = handler(error);
      
      expect(result).toBe('Test error');
    });

    it('should show toast notification when showToast is true', () => {
      const handler = createErrorHandler('test operation', true);
      const error = new Error('Test error');
      
      handler(error);
      
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error test operation',
        description: 'Test error',
        variant: 'destructive'
      }));
    });

    it('should not show toast notification when showToast is false', () => {
      const handler = createErrorHandler('test operation', false);
      const error = new Error('Test error');
      
      handler(error);
      
      expect(toast).not.toHaveBeenCalled();
    });

    it('should handle network errors with special message', () => {
      const handler = createErrorHandler('test operation');
      const error = new Error('Failed to fetch');
      
      const result = handler(error);
      
      expect(result).toBe('Network error: Unable to reach the backend server');
    });
  });

  describe('getApiBaseUrl', () => {
    it('should return the correct API base URL from config', () => {
      const result = getApiBaseUrl();
      
      expect(result).toBe(backendConfig.opcUaBackendUrl);
    });
  });
});

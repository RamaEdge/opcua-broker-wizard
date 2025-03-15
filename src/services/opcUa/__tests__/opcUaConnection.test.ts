
import { testConnection } from '../opcUaConnection';
import { server } from '@/test/mocks/server';
import { toast } from '@/hooks/use-toast';

// Start the server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

describe('opcUaConnection', () => {
  describe('testConnection', () => {
    it('should validate endpoint format and return error for invalid endpoint', async () => {
      const invalidEndpoint = 'invalid-endpoint';
      const result = await testConnection(invalidEndpoint);
      
      expect(result.status).toBe('error');
      expect(result.message).toContain('must start with opc.tcp://');
    });

    it('should return connected status for successful connection', async () => {
      const validEndpoint = 'opc.tcp://test-success:4840';
      const result = await testConnection(validEndpoint);
      
      expect(result.status).toBe('connected');
    });

    it('should return error status when server returns connection failure', async () => {
      const failureEndpoint = 'opc.tcp://test-failure:4840';
      const result = await testConnection(failureEndpoint);
      
      expect(result.status).toBe('error');
      expect(result.message).toBe('Failed to connect to server');
    });

    it('should handle server errors gracefully', async () => {
      const errorEndpoint = 'opc.tcp://test-error:4840';
      const result = await testConnection(errorEndpoint);
      
      expect(result.status).toBe('error');
      expect(result.message).toContain('Connection error');
    });

    it('should validate hostname in endpoint URL', async () => {
      const invalidHostEndpoint = 'opc.tcp://:4840';
      const result = await testConnection(invalidHostEndpoint);
      
      expect(result.status).toBe('error');
      expect(result.message).toContain('Invalid hostname');
    });

    it('should validate port in endpoint URL', async () => {
      const invalidPortEndpoint = 'opc.tcp://localhost:99999';
      const result = await testConnection(invalidPortEndpoint);
      
      expect(result.status).toBe('error');
      expect(result.message).toContain('Invalid port');
    });
  });
});

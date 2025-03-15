
import { browseServer } from '../opcUaBrowse';
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

// Mock the testConnection function
jest.mock('../opcUaConnection', () => ({
  testConnection: jest.fn()
}));

describe('opcUaBrowse', () => {
  describe('browseServer', () => {
    beforeEach(() => {
      (testConnection as jest.Mock).mockResolvedValue({ status: 'connected' });
    });

    it('should validate connection before browsing if no nodeId is provided', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      await browseServer(endpoint);
      
      expect(testConnection).toHaveBeenCalledWith(endpoint);
    });

    it('should not validate connection if nodeId is provided', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      const nodeId = 'i=85';
      await browseServer(endpoint, nodeId);
      
      expect(testConnection).not.toHaveBeenCalled();
    });

    it('should return array of nodes from successful response', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      const result = await browseServer(endpoint);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Objects');
      expect(result[1].name).toBe('Types');
    });

    it('should show error toast and throw error on connection failure', async () => {
      (testConnection as jest.Mock).mockResolvedValue({ 
        status: 'error', 
        message: 'Failed to connect to the server' 
      });
      
      const endpoint = 'opc.tcp://test-failure:4840';
      
      await expect(browseServer(endpoint)).rejects.toThrow('Failed to connect to the server');
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive',
        title: 'Connection Failed'
      }));
    });

    it('should handle server errors gracefully', async () => {
      (testConnection as jest.Mock).mockResolvedValue({ status: 'connected' });
      
      const errorEndpoint = 'opc.tcp://test-error:4840';
      
      // Since browseServer returns an empty array on error after logging
      const result = await browseServer(errorEndpoint);
      expect(result).toEqual([]);
    });
  });
});

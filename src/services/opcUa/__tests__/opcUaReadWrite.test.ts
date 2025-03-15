
import { readNodeValue, writeNodeValue } from '../opcUaReadWrite';
import { server } from '@/test/mocks/server';

// Start the server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

describe('opcUaReadWrite', () => {
  describe('readNodeValue', () => {
    it('should read numeric value correctly', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      const nodeId = 'i=42';
      
      const result = await readNodeValue(endpoint, nodeId);
      
      expect(result).not.toBeNull();
      expect(result.value).toBe(42);
      expect(result.dataType).toBe('Int32');
    });

    it('should read boolean value correctly', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      const nodeId = 'i=bool';
      
      const result = await readNodeValue(endpoint, nodeId);
      
      expect(result).not.toBeNull();
      expect(result.value).toBe(true);
      expect(result.dataType).toBe('Boolean');
    });

    it('should return null on error', async () => {
      const endpoint = 'opc.tcp://test-server:4840';
      const nodeId = 'i=error';
      
      const result = await readNodeValue(endpoint, nodeId);
      
      expect(result).toBeNull();
    });
  });

  describe('writeNodeValue', () => {
    it('should write numeric value correctly', async () => {
      const params = {
        endpoint: 'opc.tcp://test-server:4840',
        nodeId: 'i=42',
        value: 100
      };
      
      // Since writeNodeValue returns void, we just verify it doesn't throw
      await expect(writeNodeValue(params)).resolves.toBeUndefined();
    });

    it('should write boolean value correctly', async () => {
      const params = {
        endpoint: 'opc.tcp://test-server:4840',
        nodeId: 'i=bool',
        value: false,
        dataType: 'Boolean'
      };
      
      await expect(writeNodeValue(params)).resolves.toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      const params = {
        endpoint: 'opc.tcp://test-server:4840',
        nodeId: 'i=error',
        value: 100
      };
      
      // Should not throw but handle error internally
      await expect(writeNodeValue(params)).resolves.toBeUndefined();
    });
  });
});

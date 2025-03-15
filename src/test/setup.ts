
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock the toast functionality
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
  useToast: () => ({
    toast: jest.fn(),
    dismiss: jest.fn(),
  }),
}));

// Global beforeAll setup
beforeAll(() => {
  // Set up environment variables for testing
  process.env.VITE_OPCUA_BACKEND_URL = 'http://localhost:3000/api';
});

// Global afterEach cleanup
afterEach(() => {
  jest.clearAllMocks();
});

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPCUA_BACKEND_URL: string;
}

// Configuration for backend services
export const backendConfig = {
  // OPC UA Rust backend URL
  opcUaBackendUrl: (import.meta.env.VITE_OPCUA_BACKEND_URL as ImportMetaEnv['VITE_OPCUA_BACKEND_URL']) || 'http://localhost:3000/api',
  
  // Connection timeout in milliseconds
  connectionTimeout: 10000,
  
  // Default security policy
  defaultSecurityPolicy: 'None',
  
  // Default message security mode
  defaultSecurityMode: 'None',
  
  // Authentication settings
  defaultAuthType: 'anonymous',
};

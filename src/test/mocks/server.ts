
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { backendConfig } from '@/config/backendConfig';

// Define handlers for the mock server
export const handlers = [
  // Test connection handler
  http.post(`${backendConfig.opcUaBackendUrl}/validate-connection`, async ({ request }) => {
    const body = await request.json();
    const { endpoint } = body;

    // Simulate different responses based on test endpoints
    if (endpoint === 'opc.tcp://test-success:4840') {
      return HttpResponse.json({ connected: true, message: 'Connection successful' });
    } else if (endpoint === 'opc.tcp://test-failure:4840') {
      return HttpResponse.json({ connected: false, message: 'Failed to connect to server' });
    } else if (endpoint === 'opc.tcp://test-error:4840') {
      return new HttpResponse(null, { status: 500 });
    }

    // Default success response
    return HttpResponse.json({ connected: true, message: 'Connection successful' });
  }),

  // Browse server handler
  http.post(`${backendConfig.opcUaBackendUrl}/browse`, async ({ request }) => {
    const body = await request.json();
    const { endpoint, nodeId } = body;

    // Mock data for browsing
    const mockNodes = [
      {
        id: 'i=85',
        name: 'Objects',
        nodeType: 'Folder',
        children: []
      },
      {
        id: 'i=86',
        name: 'Types',
        nodeType: 'Folder',
        children: []
      }
    ];

    if (endpoint === 'opc.tcp://test-error:4840') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({ nodes: mockNodes });
  }),

  // Read value handler
  http.post(`${backendConfig.opcUaBackendUrl}/read-value`, async ({ request }) => {
    const body = await request.json();
    const { nodeId } = body;

    if (nodeId === 'i=error') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({
      value: nodeId === 'i=bool' ? true : 42,
      dataType: nodeId === 'i=bool' ? 'Boolean' : 'Int32',
      sourceTimestamp: new Date().toISOString()
    });
  }),

  // Write value handler
  http.post(`${backendConfig.opcUaBackendUrl}/write-value`, async ({ request }) => {
    const body = await request.json();
    const { nodeId } = body;

    if (nodeId === 'i=error') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({ success: true });
  })
];

// Set up the server
export const server = setupServer(...handlers);

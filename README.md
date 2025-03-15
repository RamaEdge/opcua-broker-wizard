
# OPC UA Web Client

A web-based client for OPC UA communication with a Rust backend.

## Features

- Connect to OPC UA servers
- Browse OPC UA address space
- Read and write OPC UA node values

## Development

### Prerequisites

- Node.js (v16 or higher)
- Rust (for the backend)

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Set environment variables:

```
VITE_OPCUA_BACKEND_URL=http://localhost:3000/api
```

## Testing

Run the tests with Jest:

```bash
npm test
```

Or with coverage reports:

```bash
npm test -- --coverage
```

## Project Structure

- `src/services/opcUa/`: OPC UA service modules
  - `index.ts`: Main entry point and re-exports
  - `opcUaTypes.ts`: TypeScript type definitions
  - `opcUaConnection.ts`: Connection handling
  - `opcUaBrowse.ts`: Server browsing functionality
  - `opcUaReadWrite.ts`: Node value reading and writing
  - `opcUaUtils.ts`: Utility functions
  - `__tests__/`: Unit tests for OPC UA services

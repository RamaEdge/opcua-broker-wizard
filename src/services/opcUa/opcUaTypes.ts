
/**
 * Represents an OPC UA node in the server's address space
 */
export type OpcUaNode = {
  id: string;
  name: string;
  nodeType: string;
  children?: OpcUaNode[];
  dataType?: string;
};

/**
 * Possible connection statuses for an OPC UA server
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting' | 'validating';

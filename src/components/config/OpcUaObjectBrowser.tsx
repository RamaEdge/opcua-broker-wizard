import { Folder, File, ChevronRight, ChevronDown, Search, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { opcUaService, type OpcUaNode } from '@/services/opcUa';

interface TreeNodeProps {
  node: OpcUaNode;
  level: number;
  expanded: Record<string, boolean>;
  selected: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string, _nodeType: string) => void; // Prefixed with underscore
  loadChildNodes: (id: string) => Promise<void>;
  isLoading: Record<string, boolean>;
}

const TreeNode = ({ 
  node, 
  level, 
  expanded, 
  selected, 
  onToggleExpand, 
  onToggleSelect,
  loadChildNodes,
  isLoading
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];
  const isSelected = selected[node.id];
  const isNodeLoading = isLoading[node.id];
  
  const handleToggleExpand = async () => {
    if (hasChildren) {
      onToggleExpand(node.id);
      
      if (!node.children || node.children.length === 0 || !isExpanded) {
        await loadChildNodes(node.id);
      }
    }
  };
  
  const getNodeIcon = () => {
    if (node.nodeType === 'Folder') {
      return <Folder className="h-4 w-4 text-amber-500" />;
    }
    if (node.nodeType === 'Object') {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    if (node.nodeType === 'ObjectType') {
      return <Folder className="h-4 w-4 text-purple-500" />;
    }
    if (node.nodeType === 'VariableType') {
      return <File className="h-4 w-4 text-pink-500" />;
    }
    return <File className="h-4 w-4 text-green-500" />;
  };

  const getButtonIcon = (isNodeLoading: boolean, isExpanded: boolean) => {
    if (isNodeLoading) {
      return <Spinner className="h-3.5 w-3.5" />;
    }
    if (isExpanded) {
      return <ChevronDown className="h-3.5 w-3.5" />;
    }
    return <ChevronRight className="h-3.5 w-3.5" />;
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-1 rounded-md mb-1 transition-colors",
          isSelected && "bg-accent",
          !isSelected && "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 p-0 mr-1" 
            onClick={() => {
              void handleToggleExpand();
            }}
            disabled={isNodeLoading}
          >
            {getButtonIcon(isNodeLoading, isExpanded)}
          </Button>
        ) : (
          <div className="w-6" />
        )}
        
        <div className="mr-2">{getNodeIcon()}</div>
        
        <div 
          className="flex-1 flex items-center cursor-pointer text-sm"
          onClick={() => onToggleSelect(node.id, node.nodeType)}
        >
          <span className="mr-1">{node.name}</span>
          {node.dataType && (
            <span className="text-xs text-muted-foreground ml-1">({node.dataType})</span>
          )}
        </div>
        
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(node.id, node.nodeType)}
          className="h-3.5 w-3.5"
        />
      </div>
      
      {hasChildren && isExpanded && (
        <div className="transition-all">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              selected={selected}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
              loadChildNodes={loadChildNodes}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface OpcUaObjectBrowserProps {
  onSelectionChange?: (selectedNodes: OpcUaNode[]) => void;
  endpoint?: string;
}

const OpcUaObjectBrowser = ({ onSelectionChange, endpoint = '' }: OpcUaObjectBrowserProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<OpcUaNode[]>([]);
  const [opcUaNodes, setOpcUaNodes] = useState<OpcUaNode[]>([]);
  const [allNodes, setAllNodes] = useState<OpcUaNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nodeBrowsingStatus, setNodeBrowsingStatus] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  
  const flattenNodes = useCallback((nodes: OpcUaNode[]): OpcUaNode[] => {
    return nodes.reduce((acc: OpcUaNode[], node) => {
      acc.push(node);
      if (node.children && node.children.length > 0) {
        acc = [...acc, ...flattenNodes(node.children)];
      }
      return acc;
    }, []);
  }, []);
  
  const loadInitialNodes = useCallback(async () => {
    if (!endpoint) {
      setError("No endpoint URL provided");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const nodes = await opcUaService.browseServer(endpoint);
      setOpcUaNodes(nodes);
      
      const flattenedNodes = flattenNodes(nodes);
      setAllNodes(flattenedNodes);
      
      const initialExpanded: Record<string, boolean> = {};
      nodes.forEach(node => {
        initialExpanded[node.id] = true;
      });
      setExpanded(initialExpanded);
    } catch (error) {
      console.error("Error loading initial nodes:", error);
      setError("Failed to load OPC UA objects. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, flattenNodes]);
  
  useEffect(() => {
    if (endpoint) {
      void loadInitialNodes();
    }
  }, [endpoint, loadInitialNodes]);
  
  const loadChildNodes = async (nodeId: string) => {
    if (!endpoint) {
      return;
    }
    
    setNodeBrowsingStatus(prev => ({ ...prev, [nodeId]: true }));
    
    try {
      const childNodes = await opcUaService.browseServer(endpoint, nodeId);
      
      const updateNodeChildren = (nodes: OpcUaNode[]): OpcUaNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, children: childNodes };
          } else if (node.children && node.children.length > 0) {
            return { ...node, children: updateNodeChildren(node.children) };
          }
          return node;
        });
      };
      
      const updatedNodes = updateNodeChildren(opcUaNodes);
      setOpcUaNodes(updatedNodes);
      
      setAllNodes(flattenNodes(updatedNodes));
    } catch (error) {
      console.error(`Error loading child nodes for ${nodeId}:`, error);
    } finally {
      setNodeBrowsingStatus(prev => ({ ...prev, [nodeId]: false }));
    }
  };
  
  const filteredNodes = searchTerm 
    ? allNodes.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.nodeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.dataType?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : opcUaNodes;
  
  const findNodeById = (id: string): OpcUaNode | undefined => {
    return allNodes.find(node => node.id === id);
  };
  
  const handleToggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleToggleSelect = (id: string, _nodeType: string) => {
    const newSelected = {
      ...selected,
      [id]: !selected[id]
    };
    
    setSelected(newSelected);
    
    const updatedSelectedNodes = Object.keys(newSelected)
      .filter(nodeId => newSelected[nodeId])
      .map(nodeId => findNodeById(nodeId))
      .filter((node): node is OpcUaNode => !!node);
    
    setSelectedNodes(updatedSelectedNodes);
    if (onSelectionChange) {
      onSelectionChange(updatedSelectedNodes);
    }
  };
  
  interface SearchResultsProps {
    nodes: Array<{
      id: string;
      name: string;
      nodeType: string;
    }>;
    selected: Record<string, boolean>;
    onToggleSelect: (id: string, nodeType: string) => void;
  }

  const SearchResults = ({ nodes, selected, onToggleSelect }: SearchResultsProps) => {
    const getNodeIcon = (nodeType: string) => {
      switch (nodeType) {
        case 'Folder':
          return <Folder className="h-4 w-4 text-amber-500" />;
        case 'Object':
          return <Folder className="h-4 w-4 text-blue-500" />;
        default:
          return <File className="h-4 w-4 text-green-500" />;
      }
    };

    if (nodes.length === 0) {
      return (
        <div className="py-2 text-center text-sm text-muted-foreground">
          No results match your search
        </div>
      );
    }

    return (
      <>
        {nodes.map(node => (
          <div
            key={node.id}
            className="flex items-center py-1 px-2 hover:bg-muted/50 rounded-md"
          >
            <div className="mr-2">{getNodeIcon(node.nodeType)}</div>
            <div className="flex-1 text-sm">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.nodeType}</div>
            <Checkbox
              checked={selected[node.id]}
              onCheckedChange={() => onToggleSelect(node.id, node.nodeType)}
              className="ml-2 h-3.5 w-3.5"
            />
          </div>
        ))}
      </>
    );
  };

  const renderContent = () => {
    if (isLoading && opcUaNodes.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner className="w-6 h-6" />
          <span className="ml-2 text-sm text-muted-foreground">Loading OPC UA objects...</span>
        </div>
      );
    }

    if (searchTerm) {
      return (
        <SearchResults 
          nodes={filteredNodes} 
          selected={selected} 
          onToggleSelect={handleToggleSelect} 
        />
      );
    }

    if (opcUaNodes.length > 0) {
      return opcUaNodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          selected={selected}
          onToggleExpand={handleToggleExpand}
          onToggleSelect={handleToggleSelect}
          loadChildNodes={loadChildNodes}
          isLoading={nodeBrowsingStatus}
        />
      ));
    }

    return (
      <div className="py-2 text-center text-sm text-muted-foreground">
        {!endpoint ? "Enter a server endpoint to browse objects" : "No OPC UA objects found"}
      </div>
    );
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search OPC UA objects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => void loadInitialNodes()} 
          disabled={isLoading || !endpoint}
          className="ml-2"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center text-xs text-muted-foreground pb-1 px-1 border-b">
        <span>Name</span>
        <span className="mr-3.5">Select</span>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {renderContent()}
        </div>
      </ScrollArea>
      
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Selected Items: {selectedNodes.length}</span>
          {selectedNodes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected({});
                setSelectedNodes([]);
                if (onSelectionChange) {
                  onSelectionChange([]);
                }
              }}
              className="text-xs h-7 px-2"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpcUaObjectBrowser;
export type { OpcUaNode };

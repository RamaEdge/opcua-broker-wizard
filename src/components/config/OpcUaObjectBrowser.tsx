
import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Mock data representing OPC UA objects following OPC UA information model
const mockOpcUaObjects = [
  {
    id: '1',
    name: 'Objects',
    nodeType: 'Folder',
    children: [
      {
        id: '1.1',
        name: 'Server',
        nodeType: 'Object',
        children: [
          {
            id: '1.1.1',
            name: 'ServerStatus',
            nodeType: 'Object',
            children: [
              { id: '1.1.1.1', name: 'State', nodeType: 'Variable', dataType: 'String' },
              { id: '1.1.1.2', name: 'StartTime', nodeType: 'Variable', dataType: 'DateTime' },
              { id: '1.1.1.3', name: 'CurrentTime', nodeType: 'Variable', dataType: 'DateTime' },
              { id: '1.1.1.4', name: 'BuildInfo', nodeType: 'Variable', dataType: 'Structure' },
            ]
          },
          {
            id: '1.1.2',
            name: 'ServerCapabilities',
            nodeType: 'Object',
            children: [
              { id: '1.1.2.1', name: 'MaxBrowseContinuationPoints', nodeType: 'Variable', dataType: 'UInt16' },
              { id: '1.1.2.2', name: 'MaxQueryContinuationPoints', nodeType: 'Variable', dataType: 'UInt16' },
              { id: '1.1.2.3', name: 'MaxHistoryContinuationPoints', nodeType: 'Variable', dataType: 'UInt16' },
            ]
          },
          { id: '1.1.3', name: 'ServerDiagnostics', nodeType: 'Object' },
          { id: '1.1.4', name: 'VendorServerInfo', nodeType: 'Object' },
          { id: '1.1.5', name: 'ServerRedundancy', nodeType: 'Object' },
        ]
      },
      {
        id: '1.2',
        name: 'DeviceSet',
        nodeType: 'Object',
        children: [
          {
            id: '1.2.1',
            name: 'PLC1',
            nodeType: 'Object',
            children: [
              { id: '1.2.1.1', name: 'Temperature', nodeType: 'Variable', dataType: 'Float' },
              { id: '1.2.1.2', name: 'Pressure', nodeType: 'Variable', dataType: 'Float' },
              { id: '1.2.1.3', name: 'Status', nodeType: 'Variable', dataType: 'Boolean' },
            ]
          },
          {
            id: '1.2.2',
            name: 'Sensor001',
            nodeType: 'Object',
            children: [
              { id: '1.2.2.1', name: 'Value', nodeType: 'Variable', dataType: 'Double' },
              { id: '1.2.2.2', name: 'Units', nodeType: 'Variable', dataType: 'String' },
              { id: '1.2.2.3', name: 'IsActive', nodeType: 'Variable', dataType: 'Boolean' },
            ]
          }
        ]
      },
    ]
  },
  {
    id: '2',
    name: 'Types',
    nodeType: 'Folder',
    children: [
      {
        id: '2.1',
        name: 'ObjectTypes',
        nodeType: 'Folder',
        children: [
          { id: '2.1.1', name: 'BaseObjectType', nodeType: 'ObjectType' },
          { id: '2.1.2', name: 'FolderType', nodeType: 'ObjectType' },
          { id: '2.1.3', name: 'DeviceType', nodeType: 'ObjectType' },
        ]
      },
      {
        id: '2.2',
        name: 'VariableTypes',
        nodeType: 'Folder',
        children: [
          { id: '2.2.1', name: 'BaseVariableType', nodeType: 'VariableType' },
          { id: '2.2.2', name: 'PropertyType', nodeType: 'VariableType' },
          { id: '2.2.3', name: 'DataItemType', nodeType: 'VariableType' },
        ]
      },
      { id: '2.3', name: 'ReferenceTypes', nodeType: 'Folder' },
      { id: '2.4', name: 'DataTypes', nodeType: 'Folder' },
      { id: '2.5', name: 'EventTypes', nodeType: 'Folder' },
    ]
  },
  {
    id: '3',
    name: 'Views',
    nodeType: 'Folder',
    children: []
  }
];

type OpcUaNode = {
  id: string;
  name: string;
  nodeType: string;
  children?: OpcUaNode[];
  dataType?: string;
};

interface TreeNodeProps {
  node: OpcUaNode;
  level: number;
  expanded: Record<string, boolean>;
  selected: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string, nodeType: string) => void;
}

const TreeNode = ({ 
  node, 
  level, 
  expanded, 
  selected, 
  onToggleExpand, 
  onToggleSelect 
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded[node.id];
  const isSelected = selected[node.id];
  
  const handleToggleExpand = () => {
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };
  
  const getNodeIcon = () => {
    if (node.nodeType === 'Folder') return <Folder className="h-4 w-4 text-amber-500" />;
    if (node.nodeType === 'Object') return <Folder className="h-4 w-4 text-blue-500" />;
    if (node.nodeType === 'ObjectType') return <Folder className="h-4 w-4 text-purple-500" />;
    if (node.nodeType === 'VariableType') return <File className="h-4 w-4 text-pink-500" />;
    return <File className="h-4 w-4 text-green-500" />;
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
            onClick={handleToggleExpand}
          >
            {isExpanded ? 
              <ChevronDown className="h-3.5 w-3.5" /> : 
              <ChevronRight className="h-3.5 w-3.5" />
            }
          </Button>
        ) : (
          <div className="w-6"></div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface OpcUaObjectBrowserProps {
  onSelectionChange?: (selectedNodes: OpcUaNode[]) => void;
}

const OpcUaObjectBrowser = ({ onSelectionChange }: OpcUaObjectBrowserProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    '1': true,
    '2': true
  });
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<OpcUaNode[]>([]);
  
  // Flatten the tree for searching
  const flattenNodes = (nodes: OpcUaNode[]): OpcUaNode[] => {
    return nodes.reduce((acc: OpcUaNode[], node) => {
      acc.push(node);
      if (node.children && node.children.length > 0) {
        acc = [...acc, ...flattenNodes(node.children)];
      }
      return acc;
    }, []);
  };
  
  const allNodes = flattenNodes(mockOpcUaObjects);
  
  const filteredNodes = searchTerm 
    ? allNodes.filter(node => 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.nodeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.dataType && node.dataType.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : mockOpcUaObjects;
  
  const findNodeById = (id: string): OpcUaNode | undefined => {
    return allNodes.find(node => node.id === id);
  };
  
  const handleToggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleToggleSelect = (id: string, nodeType: string) => {
    const newSelected = {
      ...selected,
      [id]: !selected[id]
    };
    
    setSelected(newSelected);
    
    // Update selectedNodes array for parent component
    const updatedSelectedNodes = Object.keys(newSelected)
      .filter(nodeId => newSelected[nodeId])
      .map(nodeId => findNodeById(nodeId))
      .filter((node): node is OpcUaNode => !!node);
    
    setSelectedNodes(updatedSelectedNodes);
    if (onSelectionChange) {
      onSelectionChange(updatedSelectedNodes);
    }
  };
  
  return (
    <div className="space-y-4 border rounded-md p-4 bg-card">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search OPC UA objects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8"
        />
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground pb-1 px-1 border-b">
        <span>Name</span>
        <span className="mr-3.5">Select</span>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {searchTerm ? (
            filteredNodes.map(node => (
              <div
                key={node.id}
                className="flex items-center py-1 px-2 hover:bg-muted/50 rounded-md"
              >
                <div className="mr-2">{
                  node.nodeType === 'Folder' ? <Folder className="h-4 w-4 text-amber-500" /> :
                  node.nodeType === 'Object' ? <Folder className="h-4 w-4 text-blue-500" /> :
                  <File className="h-4 w-4 text-green-500" />
                }</div>
                <div className="flex-1 text-sm">{node.name}</div>
                <div className="text-xs text-muted-foreground">{node.nodeType}</div>
                <Checkbox
                  checked={selected[node.id]}
                  onCheckedChange={() => handleToggleSelect(node.id, node.nodeType)}
                  className="ml-2 h-3.5 w-3.5"
                />
              </div>
            ))
          ) : (
            mockOpcUaObjects.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                expanded={expanded}
                selected={selected}
                onToggleExpand={handleToggleExpand}
                onToggleSelect={handleToggleSelect}
              />
            ))
          )}
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

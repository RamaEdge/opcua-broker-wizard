
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { OpcUaNode } from '@/services/opcUa';

interface SelectedNodesListProps {
  selectedNodes: OpcUaNode[];
}

const SelectedNodesList = ({ selectedNodes }: SelectedNodesListProps) => {
  if (selectedNodes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="text-sm font-medium mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
        Selected Nodes ({selectedNodes.length})
      </div>
      <ScrollArea className="h-[100px]">
        <div className="space-y-1">
          {selectedNodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between text-xs bg-muted/50 p-1.5 rounded-md">
              <div className="flex items-center">
                {node.nodeType === 'Folder' ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 mr-2">Folder</Badge>
                ) : node.nodeType === 'Object' ? (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 mr-2">Object</Badge>
                ) : node.nodeType === 'Variable' ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 mr-2">Variable</Badge>
                ) : (
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 mr-2">{node.nodeType}</Badge>
                )}
                <span>{node.name}</span>
              </div>
              {node.dataType && (
                <span className="text-muted-foreground">{node.dataType}</span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedNodesList;

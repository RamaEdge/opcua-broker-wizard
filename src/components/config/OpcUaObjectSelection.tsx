
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';
import OpcUaObjectBrowser, { type OpcUaNode } from './OpcUaObjectBrowser';
import SubscriptionSettings from './subscription/SubscriptionSettings';
import SelectedNodesList from './nodes/SelectedNodesList';

interface OpcUaObjectSelectionProps {
  onSelectionChange?: (selectedNodes: OpcUaNode[]) => void;
  endpoint?: string;
}

const OpcUaObjectSelection = ({ onSelectionChange, endpoint }: OpcUaObjectSelectionProps) => {
  const [selectedNodes, setSelectedNodes] = useState<OpcUaNode[]>([]);
  
  const handleSelectionChange = (nodes: OpcUaNode[]) => {
    setSelectedNodes(nodes);
    if (onSelectionChange) {
      onSelectionChange(nodes);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-primary" />
              OPC UA Object Selection
            </CardTitle>
            <CardDescription>
              Browse and select OPC UA objects to monitor
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-muted/50">
              {selectedNodes.length} Selected
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="objects" className="space-y-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="objects" className="space-y-4">
            <OpcUaObjectBrowser 
              onSelectionChange={handleSelectionChange} 
              endpoint={endpoint}
            />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionSettings defaultMode="polling" />
          </TabsContent>
        </Tabs>
        
        <SelectedNodesList selectedNodes={selectedNodes} />
      </CardContent>
    </Card>
  );
};

export default OpcUaObjectSelection;

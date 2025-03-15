
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cpu, Clock, ChevronDown, Info, BookOpen } from 'lucide-react';
import OpcUaObjectBrowser, { type OpcUaNode } from './OpcUaObjectBrowser';

interface OpcUaObjectSelectionProps {
  onSelectionChange?: (selectedNodes: OpcUaNode[]) => void;
}

const OpcUaObjectSelection = ({ onSelectionChange }: OpcUaObjectSelectionProps) => {
  const [selectedNodes, setSelectedNodes] = useState<OpcUaNode[]>([]);
  const [subscriptionMode, setSubscriptionMode] = useState('polling');
  const [isExpanded, setIsExpanded] = useState(true);
  
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="objects" className="space-y-4">
            <OpcUaObjectBrowser onSelectionChange={handleSelectionChange} />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Data Acquisition Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Determine how to collect data from OPC UA server
                  </div>
                </div>
                
                <Tabs defaultValue={subscriptionMode} onValueChange={setSubscriptionMode} className="w-[250px]">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="polling">Polling</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Separator />
              
              {subscriptionMode === 'polling' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Polling Interval</div>
                      <div className="text-sm text-muted-foreground">
                        How frequently to read values (ms)
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="100" 
                        max="10000" 
                        step="100" 
                        defaultValue="1000"
                        className="w-[120px] accent-primary" 
                      />
                      <span className="ml-2 w-12 text-sm">1000ms</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Queue Size</div>
                      <div className="text-sm text-muted-foreground">
                        Number of values to buffer
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        defaultValue="10"
                        className="w-[120px] accent-primary" 
                      />
                      <span className="ml-2 w-12 text-sm">10</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Publishing Interval</div>
                      <div className="text-sm text-muted-foreground">
                        How frequently the server sends updates (ms)
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="100" 
                        max="10000" 
                        step="100" 
                        defaultValue="1000"
                        className="w-[120px] accent-primary" 
                      />
                      <span className="ml-2 w-12 text-sm">1000ms</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Lifetime Count</div>
                      <div className="text-sm text-muted-foreground">
                        Number of publishing intervals before timeout
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        defaultValue="10"
                        className="w-[120px] accent-primary" 
                      />
                      <span className="ml-2 w-12 text-sm">10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Keep Alive Count</div>
                      <div className="text-sm text-muted-foreground">
                        Publishing intervals with no data changes before sending
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        defaultValue="3"
                        className="w-[120px] accent-primary" 
                      />
                      <span className="ml-2 w-12 text-sm">3</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deadband">Use Deadband</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Only report changes when they exceed the deadband value
                  </p>
                </div>
                <Switch id="deadband" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="historizing">Enable Historizing</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Store historical values for selected nodes
                  </p>
                </div>
                <Switch id="historizing" />
              </div>
              
              <Separator />
              
              <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">OPC UA Information Model</h4>
                  </div>
                  <CollapsibleTrigger asChild>
                    <button className="h-6 w-6 rounded-md border hover:bg-muted flex items-center justify-center">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="rounded-md border bg-muted/50 p-3">
                    <div className="flex gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm font-medium">About OPC UA Object Types</div>
                    </div>
                    <ScrollArea className="h-[150px]">
                      <div className="text-xs text-muted-foreground space-y-2">
                        <p>The OPC UA information model organizes data in a hierarchical structure:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                          <li><span className="font-medium">Objects</span> - Represents physical or logical components</li>
                          <li><span className="font-medium">Variables</span> - Contains actual data values</li>
                          <li><span className="font-medium">Methods</span> - Functions that can be called</li>
                          <li><span className="font-medium">ObjectTypes</span> - Templates that define object structure</li>
                          <li><span className="font-medium">VariableTypes</span> - Templates for variables</li>
                          <li><span className="font-medium">DataTypes</span> - Defines the data format</li>
                          <li><span className="font-medium">ReferenceTypes</span> - Defines relationships between nodes</li>
                        </ul>
                        <p>Standard objects typically include Server, DeviceSet, and various diagnostic nodes.</p>
                      </div>
                    </ScrollArea>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedNodes.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default OpcUaObjectSelection;

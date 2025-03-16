import { ChevronDown, BookOpen, Info } from 'lucide-react';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

const OpcUaInfoPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
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
  );
};

export default OpcUaInfoPanel;

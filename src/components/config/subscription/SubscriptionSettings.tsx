
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SubscriptionSettingsProps {
  defaultMode?: 'polling' | 'subscription';
}

const SubscriptionSettings = ({ defaultMode = 'polling' }: SubscriptionSettingsProps) => {
  const [subscriptionMode, setSubscriptionMode] = useState<'polling' | 'subscription'>(defaultMode);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <Label>Data Acquisition Mode</Label>
          <div className="text-sm text-muted-foreground">
            Determine how to collect data from OPC UA server
          </div>
        </div>
        
        <Tabs defaultValue={subscriptionMode} onValueChange={(value) => setSubscriptionMode(value as 'polling' | 'subscription')} className="w-[250px]">
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
  );
};

export default SubscriptionSettings;

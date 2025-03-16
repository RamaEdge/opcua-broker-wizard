//import { Server, Network, Database, Shield, Cpu } from 'lucide-react';
import { useState } from 'react';

//import ConfigCard from '@/components/config/ConfigCard';
import ConfigWizard from '@/components/config/ConfigWizard';
import OpcUaObjectSelection from '@/components/config/OpcUaObjectSelection';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Config = () => {
  const [activeTab, setActiveTab] = useState('wizard');
  const [serverEndpoint, setServerEndpoint] = useState('opc.tcp://localhost:4840');
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-8 px-2">
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-muted-foreground mt-1">
            Configure your OPC UA broker connections and settings
          </p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-card mx-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="animate-slide-up space-y-6"
          >
            <TabsList className="border bg-muted/50">
              <TabsTrigger value="wizard">Configuration Wizard</TabsTrigger>
              <TabsTrigger value="existing">Existing Configurations</TabsTrigger>
              <TabsTrigger value="objects">OPC UA Objects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wizard" className="animate-fade-in flex justify-center py-6 border-t border-border/40 pt-6">
              <ConfigWizard />
            </TabsContent>
            
            <TabsContent value="existing" className="animate-fade-in border-t border-border/40 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No configurations found. Use the Configuration Wizard to create a new connection.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="objects" className="animate-fade-in border-t border-border/40 pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">OPC UA Server Endpoint</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to an OPC UA server to browse available objects
                    </p>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={serverEndpoint}
                      onChange={(e) => setServerEndpoint(e.target.value)}
                      placeholder="opc.tcp://server:port"
                      className="px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <OpcUaObjectSelection endpoint={serverEndpoint} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Config;

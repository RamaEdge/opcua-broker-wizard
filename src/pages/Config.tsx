
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Network, Database, Shield, Cpu } from 'lucide-react';
import ConfigWizard from '@/components/config/ConfigWizard';
import ConfigCard from '@/components/config/ConfigCard';
import OpcUaObjectSelection from '@/components/config/OpcUaObjectSelection';

const Config = () => {
  const [activeTab, setActiveTab] = useState('wizard');
  
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
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
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
              <div className="max-w-4xl mx-auto">
                <OpcUaObjectSelection endpoint="opc.tcp://localhost:4840" />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="animate-fade-in border-t border-border/40 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConfigCard
                  title="Network Settings"
                  description="Configure network parameters for the OPC UA connections"
                  icon={<Network className="h-5 w-5" />}
                  onEdit={() => {}}
                >
                  <div className="text-muted-foreground text-sm">
                    Configure timeout settings, reconnect behavior, and network parameters for your OPC UA connections.
                  </div>
                </ConfigCard>
                
                <ConfigCard
                  title="Security Settings"
                  description="Global security settings for OPC UA connections"
                  icon={<Shield className="h-5 w-5" />}
                  onEdit={() => {}}
                >
                  <div className="text-muted-foreground text-sm">
                    Configure certificate stores, trust lists, and global security policies for all your OPC UA connections.
                  </div>
                </ConfigCard>
                
                <ConfigCard
                  title="Data Storage"
                  description="Configure how data is stored and managed"
                  icon={<Database className="h-5 w-5" />}
                  onEdit={() => {}}
                >
                  <div className="text-muted-foreground text-sm">
                    Configure data retention policies, storage location, and database connections for your OPC UA data.
                  </div>
                </ConfigCard>
                
                <ConfigCard
                  title="Object Browser"
                  description="Browse and select OPC UA objects to monitor"
                  icon={<Cpu className="h-5 w-5" />}
                  onConfigure={() => setActiveTab('objects')}
                >
                  <div className="text-muted-foreground text-sm">
                    Explore the OPC UA address space and select objects, variables, and methods to monitor and interact with.
                  </div>
                </ConfigCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Config;

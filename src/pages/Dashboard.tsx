
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

import ServerConnectionsList from '@/components/dashboard/ServerConnectionsList';
import StatusPanel from '@/components/dashboard/StatusPanel';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force refresh by reloading the page
    window.location.reload();
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your OPC UA connections
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-card mx-2">
          <Tabs defaultValue="overview" className="animate-slide-up space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in space-y-6">
              <StatusPanel />
              <ServerConnectionsList />
            </TabsContent>
            
            <TabsContent value="connections">
              <div className="min-h-[300px]">
                <ServerConnectionsList />
              </div>
            </TabsContent>
            
            <TabsContent value="logs">
              <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                Server logs will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

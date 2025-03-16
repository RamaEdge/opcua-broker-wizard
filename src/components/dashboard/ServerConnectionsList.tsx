
import { useState, useEffect } from 'react';
import { Server, AlertTriangle } from 'lucide-react';
import { opcUaService } from '@/services/opcUa';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface ConnectedServer {
  endpoint: string;
  status: 'connected' | 'error';
  uptime?: number;
  message?: string;
}

export const ServerConnectionsList = () => {
  const [servers, setServers] = useState<ConnectedServer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConnections = async () => {
    setLoading(true);
    
    try {
      // For now, we're checking connections to localhost:4840
      // In a real app, you would fetch the list of configured servers from somewhere
      const defaultEndpoint = 'opc.tcp://localhost:4840';
      
      const connectionResult = await opcUaService.testConnection(defaultEndpoint);
      const serversList: ConnectedServer[] = [{
        endpoint: defaultEndpoint,
        status: connectionResult.status === 'connected' ? 'connected' : 'error',
        uptime: connectionResult.status === 'connected' ? 60 : undefined, // Just a placeholder, real uptime would come from the server
        message: connectionResult.message
      }];
      
      setServers(serversList);
    } catch (error) {
      console.error('Error loading server connections:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to load server connections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
    
    // Refresh connections every 30 seconds
    const interval = setInterval(() => {
      loadConnections();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Server Connections</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Spinner className="w-8 h-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (servers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Server Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Servers Connected</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              No OPC UA server connections found. Configure a connection in the Config page.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Server Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Uptime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servers.map((server, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <Badge variant={server.status === 'connected' ? 'default' : 'destructive'}>
                      {server.status === 'connected' ? 'Connected' : 'Error'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    {server.endpoint}
                  </div>
                </TableCell>
                <TableCell>
                  {server.status === 'connected' && server.uptime
                    ? `${server.uptime} minutes`
                    : server.message || 'Not available'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServerConnectionsList;

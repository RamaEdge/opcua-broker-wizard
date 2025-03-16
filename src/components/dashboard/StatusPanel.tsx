
import { Server, Activity, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { opcUaService } from '@/services/opcUa';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type ConnectionStatus = 'connected' | 'error' | 'checking';

const StatusPanel = () => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [lastStatusChange, setLastStatusChange] = useState<Date>(new Date());

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // In a real app, you'd check all configured connections
        // For demo purposes, we're just checking a standard endpoint
        const endpoint = 'opc.tcp://localhost:4840';
        const result = await opcUaService.testConnection(endpoint);
        
        // If status changed, update lastStatusChange
        if ((result.status === 'connected' && status !== 'connected') || 
            (result.status !== 'connected' && status === 'connected')) {
          setLastStatusChange(new Date());
        }
        
        setStatus(result.status === 'connected' ? 'connected' : 'error');
        setStatusMessage(result.message);
      } catch (error) {
        console.error('Error checking connection:', error);
        setStatus('error');
        setStatusMessage('Failed to check connection status');
      }
    };
    
    // Initial check
    checkConnection();
    
    // Set up interval to periodically check connection
    const interval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(interval);
  }, [status]);
  
  const getStatusColor = (status: ConnectionStatus) => {
    if (status === 'connected') {
      return 'bg-green-500';
    }
    if (status === 'checking') {
      return 'bg-yellow-500';
    }
    return 'bg-red-500';
  };
  
  const getStatusText = (status: ConnectionStatus) => {
    if (status === 'connected') {
      return 'Connected';
    }
    if (status === 'checking') {
      return 'Checking';
    }
    return 'Error';
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffMins > 0) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Server Status</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
            <div className="text-2xl font-bold">{getStatusText(status)}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last status change: {formatTimeAgo(lastStatusChange)}
          </p>
          {statusMessage && (
            <p className="text-xs text-muted-foreground mt-1">
              {statusMessage}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{status === 'connected' ? 0 : 1}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {status === 'connected' 
              ? 'No active alerts' 
              : status === 'checking' 
                ? 'Checking connection status' 
                : 'Connection error'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusPanel;

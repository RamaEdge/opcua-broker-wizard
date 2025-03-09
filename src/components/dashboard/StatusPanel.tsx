
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Server, Activity, Clock, AlertTriangle } from 'lucide-react';

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

const StatusPanel = () => {
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [uptime, setUptime] = useState<number>(0);
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [activeClients, setActiveClients] = useState<number>(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number>(0);

  useEffect(() => {
    // Simulate random status changes
    const interval = setInterval(() => {
      const statuses: ConnectionStatus[] = ['connected', 'disconnected', 'reconnecting'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);
      
      // Update mock metrics
      setUptime(prev => prev + 1);
      setCpuUsage(Math.random() * 100);
      setMemoryUsage(Math.random() * 100);
      setActiveClients(Math.floor(Math.random() * 20));
      setActiveSubscriptions(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: ConnectionStatus) => {
    if (status === 'connected') return 'bg-green-500';
    if (status === 'reconnecting') return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getStatusText = (status: ConnectionStatus) => {
    if (status === 'connected') return 'Connected';
    if (status === 'reconnecting') return 'Reconnecting';
    return 'Disconnected';
  };
  
  const formatUptime = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Last status change: 2 minutes ago
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatUptime(uptime)}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Since last restart
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">CPU</span>
            <span className="text-sm font-medium">{cpuUsage.toFixed(1)}%</span>
          </div>
          <Progress value={cpuUsage} className="h-2 mb-4" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Memory</span>
            <span className="text-sm font-medium">{memoryUsage.toFixed(1)}%</span>
          </div>
          <Progress value={memoryUsage} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connected Clients</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className="mr-1">Active</Badge>
            <span className="text-xs text-muted-foreground">
              {activeSubscriptions} active subscriptions
            </span>
          </div>
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
              : status === 'reconnecting'
                ? 'Connection unstable'
                : 'Connection lost'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusPanel;

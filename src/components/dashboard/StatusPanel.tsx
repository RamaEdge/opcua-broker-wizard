
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Clock, CheckCircle2, AlertCircle, Server } from 'lucide-react';

interface DataPoint {
  timestamp: string;
  value: number;
}

const mockTimeSeriesData: DataPoint[] = Array.from({ length: 10 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 60000).toLocaleTimeString(),
  value: 40 + Math.random() * 40,
}));

const StatusPanel = () => {
  const connectionStatus = 'connected'; // Can be 'connected', 'disconnected', 'reconnecting'
  const lastUpdated = new Date().toLocaleString();
  const uptime = '3d 12h 45m';
  const currentLoad = 67;
  const dataPoints = 1243;
  const activeSubscriptions = 7;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-subtle transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={connectionStatus === 'connected' 
                    ? 'bg-success/15 text-success hover:bg-success/20 border-success/30' 
                    : connectionStatus === 'reconnecting'
                    ? 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/30'
                    : 'bg-destructive/15 text-destructive hover:bg-destructive/20 border-destructive/30'
                  }
                >
                  {connectionStatus === 'connected' && (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  )}
                  {connectionStatus === 'reconnecting' && (
                    <Activity className="mr-1 h-3 w-3" />
                  )}
                  {connectionStatus === 'disconnected' && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated {lastUpdated}</span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Server Load</span>
                  <span className="font-medium">{currentLoad}%</span>
                </div>
                <Progress value={currentLoad} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-sm font-medium">{uptime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Data Points</p>
                  <p className="text-sm font-medium">{dataPoints.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Subscriptions</p>
                  <p className="text-sm font-medium">{activeSubscriptions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-sm font-medium">42ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-subtle transition-all duration-300 hover:shadow-md md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="cpu">
              <TabsList className="mb-4">
                <TabsTrigger value="cpu">CPU</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cpu" className="space-y-4">
                <div className="h-[120px] w-full relative">
                  <div className="absolute inset-0 flex items-end">
                    {mockTimeSeriesData.map((point, i) => (
                      <div 
                        key={i} 
                        className="flex-1 mx-0.5 flex items-end"
                      >
                        <div 
                          className="w-full bg-primary/70 rounded-sm transition-all duration-500 hover:bg-primary relative group"
                          style={{ height: `${point.value}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover p-1 rounded shadow-md text-xs whitespace-nowrap transition-opacity z-10">
                            {point.value.toFixed(1)}% at {point.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  {mockTimeSeriesData.slice(0, 5).reverse().map((point, i) => (
                    <div key={i}>{point.timestamp.split(':').slice(0, 2).join(':')}</div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="memory" className="h-[170px] flex items-center justify-center text-muted-foreground">
                Memory usage chart will appear here
              </TabsContent>
              
              <TabsContent value="requests" className="h-[170px] flex items-center justify-center text-muted-foreground">
                Request metrics chart will appear here
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border shadow-subtle transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Connections</CardTitle>
            <CardDescription>Currently connected clients</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Client {i + 1}</div>
                    <div className="text-xs text-muted-foreground">Connected for {10 + i * 5}m</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="ml-auto bg-success/15 text-success hover:bg-success/20 border-success/30 text-xs"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-subtle transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Event Log</CardTitle>
            <CardDescription>Recent server events</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 fade-mask-bottom">
              {[
                { level: 'info', message: 'Server started successfully', time: '12:45:03' },
                { level: 'info', message: 'New client connection established', time: '12:47:15' },
                { level: 'warning', message: 'High CPU usage detected', time: '13:02:45' },
                { level: 'info', message: 'Subscription created for Node1', time: '13:05:13' },
                { level: 'error', message: 'Failed to connect to external datasource', time: '13:10:22' },
                { level: 'info', message: 'Configuration updated', time: '13:15:07' },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-2 text-sm border-b border-border/50 pb-2 last:border-0">
                  <div 
                    className={`min-w-2 h-2 mt-1.5 rounded-full ${
                      event.level === 'info' 
                        ? 'bg-primary' 
                        : event.level === 'warning' 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium uppercase ${
                        event.level === 'info' 
                          ? 'text-primary' 
                          : event.level === 'warning' 
                          ? 'text-amber-500' 
                          : 'text-destructive'
                      }`}>
                        {event.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                    </div>
                    <p className="mt-0.5">{event.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusPanel;

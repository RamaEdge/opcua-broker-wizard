import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, ChevronLeft, Server, Network, Shield, Clock, Key, FileDigit, Database, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OpcUaObjectSelection from './OpcUaObjectSelection';
import { Spinner } from '@/components/ui/spinner';
import { opcUaService, type OpcUaNode, type ConnectionStatus } from '@/services/opcUa';

interface StepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Step = ({ title, description, children, icon }: StepProps) => (
  <div className="space-y-6">
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="space-y-6 pl-12">{children}</div>
  </div>
);

const ConfigWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: 'Production OPC UA Broker',
    endpoint: 'opc.tcp://localhost:4840',
    securityMode: 'sign',
    securityPolicy: 'Basic256Sha256',
    authenticationType: 'anonymous',
    username: '',
    password: '',
    refreshRate: '1000',
    enableAnonymous: true,
    enableDiagnostics: true,
    certificateValidation: 'accept-all',
    useCertificate: false,
    certificatePath: '',
    certificatePassword: '',
    selectedOpcUaNodes: [] as OpcUaNode[],
  });
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'endpoint') {
      setConnectionStatus(null);
      setConnectionMessage(null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleOpcUaNodesChange = (nodes: OpcUaNode[]) => {
    setFormData(prev => ({ ...prev, selectedOpcUaNodes: nodes }));
  };
  
  const validateConnection = async () => {
    setIsValidating(true);
    setConnectionStatus('validating');
    setConnectionMessage('Validating connection to server...');
    
    try {
      const result = await opcUaService.testConnection(formData.endpoint);
      setConnectionStatus(result.status);
      setConnectionMessage(result.message || null);
      
      if (result.status === 'connected') {
        toast({
          title: "Connection successful",
          description: "Successfully connected to the OPC UA server.",
        });
      } else if (result.status === 'error' && result.message) {
        toast({
          title: "Connection failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: "Connection error",
        description: "Failed to validate connection to the OPC UA server.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const securityPolicies = [
    { value: 'None', label: 'None (No Security)' },
    { value: 'Basic128Rsa15', label: 'Basic128Rsa15 (Legacy)' },
    { value: 'Basic256', label: 'Basic256 (Legacy)' },
    { value: 'Basic256Sha256', label: 'Basic256Sha256 (Recommended)' },
    { value: 'Aes128_Sha256_RsaOaep', label: 'Aes128_Sha256_RsaOaep' },
    { value: 'Aes256_Sha256_RsaPss', label: 'Aes256_Sha256_RsaPss (Highest)' },
  ];

  const steps = [
    {
      title: 'Server Configuration',
      description: 'Configure your OPC UA server endpoint and basic settings',
      icon: <Server className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Production OPC UA Server" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpoint">Server Endpoint</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      id="endpoint" 
                      name="endpoint"
                      placeholder="opc.tcp://server:4840" 
                      value={formData.endpoint}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={validateConnection}
                      disabled={isValidating || !formData.endpoint}
                    >
                      {isValidating ? (
                        <Spinner className="mr-2 h-4 w-4" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Validate
                    </Button>
                  </div>
                  
                  {connectionStatus && (
                    <div className="mt-2">
                      {connectionStatus === 'connected' ? (
                        <Alert variant="success" className="py-2">
                          <Check className="h-4 w-4 mr-2" />
                          <AlertDescription>
                            Successfully connected to the server.
                          </AlertDescription>
                        </Alert>
                      ) : connectionStatus === 'error' ? (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <AlertDescription>
                            {connectionMessage || "Failed to connect to the server."}
                          </AlertDescription>
                        </Alert>
                      ) : connectionStatus === 'validating' ? (
                        <Alert className="py-2 bg-muted">
                          <Spinner className="h-4 w-4 mr-2" />
                          <AlertDescription>
                            Validating connection to server...
                          </AlertDescription>
                        </Alert>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-rate">Refresh Rate (ms)</Label>
                <Input 
                  id="refresh-rate" 
                  name="refreshRate"
                  type="number" 
                  placeholder="1000" 
                  value={formData.refreshRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Security Configuration',
      description: 'Set up the security mode and authentication settings',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-mode">Security Mode</Label>
              <Select 
                value={formData.securityMode}
                onValueChange={(value) => handleSelectChange('securityMode', value)}
              >
                <SelectTrigger id="security-mode">
                  <SelectValue placeholder="Select security mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sign">Sign</SelectItem>
                  <SelectItem value="signandencrypt">Sign and Encrypt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.securityMode !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="security-policy">Security Policy</Label>
                <Select 
                  value={formData.securityPolicy}
                  onValueChange={(value) => handleSelectChange('securityPolicy', value)}
                >
                  <SelectTrigger id="security-policy">
                    <SelectValue placeholder="Select security policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityPolicies.map((policy) => (
                      <SelectItem key={policy.value} value={policy.value}>
                        {policy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Security policy defines the cryptographic algorithms used for encryption and signatures.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="auth-type">Authentication Type</Label>
              <Select 
                value={formData.authenticationType}
                onValueChange={(value) => handleSelectChange('authenticationType', value)}
              >
                <SelectTrigger id="auth-type">
                  <SelectValue placeholder="Select authentication type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anonymous">Anonymous</SelectItem>
                  <SelectItem value="username">Username/Password</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.authenticationType === 'username' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            {formData.authenticationType === 'certificate' && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div className="flex items-center gap-2 text-primary">
                  <Key size={16} />
                  <span className="font-medium">Certificate Authentication</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certificate-path">Certificate Path</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="certificate-path" 
                      name="certificatePath"
                      placeholder="/path/to/certificate.pfx" 
                      value={formData.certificatePath}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <Button variant="outline" type="button">
                      <FileDigit className="h-4 w-4 mr-1" />
                      Browse
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certificate-password">Certificate Password</Label>
                  <Input 
                    id="certificate-password" 
                    name="certificatePassword"
                    type="password" 
                    placeholder="Certificate password (if required)"
                    value={formData.certificatePassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Label className="mb-2 block">Certificate Validation</Label>
              <RadioGroup 
                value={formData.certificateValidation} 
                onValueChange={(value) => handleSelectChange('certificateValidation', value)}
                className="space-y-2 pt-1"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="accept-all" id="accept-all" />
                  <Label htmlFor="accept-all" className="font-normal cursor-pointer">
                    <span className="font-medium">Accept all certificates</span>
                    <p className="text-xs text-muted-foreground">Accept any server certificate (not recommended for production)</p>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="verify" id="verify" />
                  <Label htmlFor="verify" className="font-normal cursor-pointer">
                    <span className="font-medium">Verify certificate</span>
                    <p className="text-xs text-muted-foreground">Validate server certificate against trusted certificate authorities</p>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="trust-managed" id="trust-managed" />
                  <Label htmlFor="trust-managed" className="font-normal cursor-pointer">
                    <span className="font-medium">Managed trust list</span>
                    <p className="text-xs text-muted-foreground">Use a custom trust list to validate server certificates</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous">Allow Anonymous Access</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Enable access without authentication
                </p>
              </div>
              <Switch 
                id="anonymous" 
                checked={formData.enableAnonymous}
                onCheckedChange={(checked) => handleSwitchChange('enableAnonymous', checked)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Object Selection',
      description: 'Select the OPC UA objects you want to monitor',
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <OpcUaObjectSelection 
            onSelectionChange={handleOpcUaNodesChange} 
            endpoint={connectionStatus === 'connected' ? formData.endpoint : undefined}
          />
          
          {connectionStatus !== 'connected' && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                You need to validate the connection to the server in Step 1 before browsing objects.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ),
    },
    {
      title: 'Advanced Settings',
      description: 'Configure diagnostics and performance settings',
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="diagnostics">Enable Diagnostics</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Collect diagnostic information from the server
              </p>
            </div>
            <Switch 
              id="diagnostics" 
              checked={formData.enableDiagnostics}
              onCheckedChange={(checked) => handleSwitchChange('enableDiagnostics', checked)}
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Label>Performance Settings</Label>
            <Tabs defaultValue="normal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="low">Low</TabsTrigger>
                <TabsTrigger value="normal">Normal</TabsTrigger>
                <TabsTrigger value="high">High</TabsTrigger>
              </TabsList>
              <TabsContent value="low" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
                Low performance mode reduces resource usage but increases latency.
              </TabsContent>
              <TabsContent value="normal" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
                Balanced mode for most applications. Default setting.
              </TabsContent>
              <TabsContent value="high" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
                High performance mode optimizes for speed at the cost of increased resource usage.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ),
    },
    {
      title: 'Connection Review',
      description: 'Review your configuration before saving',
      icon: <Network className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Server Configuration</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Server Name:</span>
                <span className="font-medium">{formData.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Endpoint:</span>
                <span className="font-medium">{formData.endpoint}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Connection Status:</span>
                <span className="font-medium">
                  {connectionStatus === 'connected' ? (
                    <span className="text-green-600 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Connected
                    </span>
                  ) : (
                    <span className="text-amber-600">Not Validated</span>
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Refresh Rate:</span>
                <span className="font-medium">{formData.refreshRate} ms</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Security Configuration</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Security Mode:</span>
                <span className="font-medium capitalize">{formData.securityMode}</span>
              </li>
              {formData.securityMode !== 'none' && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Security Policy:</span>
                  <span className="font-medium">{formData.securityPolicy}</span>
                </li>
              )}
              <li className="flex justify-between">
                <span className="text-muted-foreground">Authentication:</span>
                <span className="font-medium capitalize">{formData.authenticationType}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Certificate Validation:</span>
                <span className="font-medium">
                  {formData.certificateValidation === 'accept-all' && 'Accept All'}
                  {formData.certificateValidation === 'verify' && 'Verify Certificate'}
                  {formData.certificateValidation === 'trust-managed' && 'Managed Trust List'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Anonymous Access:</span>
                <span className="font-medium">{formData.enableAnonymous ? 'Enabled' : 'Disabled'}</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Object Selection</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Selected Objects:</span>
                <span className="font-medium">{formData.selectedOpcUaNodes.length}</span>
              </li>
              {formData.selectedOpcUaNodes.length > 0 && (
                <li>
                  <span className="text-muted-foreground block mb-1">Selected Nodes:</span>
                  <div className="bg-background rounded p-2 mt-1 max-h-[100px] overflow-y-auto">
                    {formData.selectedOpcUaNodes.map((node) => (
                      <div key={node.id} className="text-xs py-1 flex justify-between">
                        <span>{node.name}</span>
                        <span className="text-muted-foreground">{node.nodeType}</span>
                      </div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Advanced Settings</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Diagnostics:</span>
                <span className="font-medium">{formData.enableDiagnostics ? 'Enabled' : 'Disabled'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Performance Mode:</span>
                <span className="font-medium">Normal</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep === 0 && connectionStatus !== 'connected') {
      toast({
        title: "Validation Required",
        description: "Please validate the connection to the OPC UA server before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Configuration Saved",
        description: `${formData.name} has been configured successfully.`,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Card className="w-full max-w-4xl border shadow-subtle animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Configure OPC UA Broker</CardTitle>
        <CardDescription>
          Complete the steps below to set up your OPC UA broker connection
        </CardDescription>
        
        <div className="mt-4 flex items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentStep 
                      ? 'bg-primary/15 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`
                    w-10 h-1 
                    ${index < currentStep ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <Step 
          title={currentStepData.title} 
          description={currentStepData.description}
          icon={currentStepData.icon}
        >
          {currentStepData.content}
        </Step>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Save Configuration' : 'Next'}
          {currentStep < steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigWizard;

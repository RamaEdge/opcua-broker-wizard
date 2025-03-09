
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Server, Network, Database } from 'lucide-react';

const Hero = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  
  // Subtle mouse follow effect for the gradient circle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return;
      
      const { clientX, clientY } = e;
      const moveX = clientX - window.innerWidth / 2;
      const moveY = clientY - window.innerHeight / 2;
      const offsetFactor = 20;
      
      circleRef.current.style.transform = `translate(${moveX / offsetFactor}px, ${moveY / offsetFactor}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-16 pb-24 px-6">
      {/* Background gradient */}
      <div 
        ref={circleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/10 to-transparent opacity-70 blur-3xl transition-transform duration-500"
      />
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="animate-fade-in">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm animate-slide-down">
            Simple. Powerful. Secure.
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight tracking-tight mb-6 animate-slide-up">
            Manage your <span className="text-gradient">OPC UA Broker</span> with elegance and precision
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up delay-75 text-balance">
            The most intuitive configuration manager for industrial communication. 
            Connect, configure, and control your OPC UA server with a seamless user experience.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-100">
          <Button size="lg" asChild>
            <Link to="/config">
              Start Configuring
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up delay-150">
          {[
            { 
              icon: Server, 
              title: 'Server Management', 
              description: 'Create and control OPC UA server instances with detailed configuration options.' 
            },
            { 
              icon: Network, 
              title: 'Connection Management', 
              description: 'Map and monitor all industrial communications through a unified interface.' 
            },
            { 
              icon: Database, 
              title: 'Data Visualization', 
              description: 'View and analyze your OPC UA data with real-time monitoring tools.' 
            },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 transition-all duration-300 hover:shadow-elevation hover:translate-y-[-2px]"
            >
              <div className="p-3 mb-4 rounded-lg bg-primary/10 w-fit">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom wave shape */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-accent/50 to-transparent" />
    </div>
  );
};

export default Hero;

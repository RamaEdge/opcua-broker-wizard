import { CheckCircle2, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigCardProps {
  title: string;
  description: string;
  status?: 'active' | 'inactive' | 'pending';
  icon?: ReactNode;
  onEdit?: () => void;
  onConfigure?: () => void;
  children?: ReactNode;
}

const ConfigCard = ({
  title,
  description,
  status,
  icon,
  onEdit,
  onConfigure,
  children
}: ConfigCardProps) => {
  const getBadgeProps = (status: 'active' | 'inactive' | 'pending') => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          className: 'ml-4 bg-success/15 text-success hover:bg-success/20 border-success/30'
        };
      case 'inactive':
        return {
          variant: 'outline' as const,
          className: 'ml-4 bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/30'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'ml-4'
        };
    }
  };

  const getStatusIcon = (status: 'active' | 'inactive' | 'pending') => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="mr-1 h-3 w-3" />;
      case 'inactive':
        return <XCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevation group border border-border/50">
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
            </div>
          </div>
          
          {status && (
            <Badge {...getBadgeProps(status)}>
              <span className="flex items-center">
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {children}
      </CardContent>

      {(onEdit || onConfigure) && (
        <CardFooter className="flex justify-end gap-2 pt-2 border-t border-border/50 bg-muted/30">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onConfigure && (
            <Button size="sm" onClick={onConfigure}>
              Configure
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ConfigCard;

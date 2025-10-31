import { Users, Clock, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelCardProps {
  name: string;
  color: string;
  cost: number;
  effort: number;
  duration: number;
  risk: 'low' | 'medium' | 'high';
  isRecommended?: boolean;
  currencySymbol: string;
}

export const ModelCard = ({
  name,
  color,
  cost,
  effort,
  duration,
  risk,
  isRecommended,
  currencySymbol
}: ModelCardProps) => {
  const getRiskColor = () => {
    switch (risk) {
      case 'low': return 'hsl(var(--success))';
      case 'medium': return 'hsl(var(--warning))';
      case 'high': return 'hsl(var(--error))';
    }
  };

  const getRiskWidth = () => {
    switch (risk) {
      case 'low': return '33%';
      case 'medium': return '66%';
      case 'high': return '100%';
    }
  };

  return (
    <Card 
      className="relative overflow-hidden transition-all duration-300 group"
      style={{ 
        borderTopWidth: '4px', 
        borderTopColor: color,
        boxShadow: '0 2px 8px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Animated background on hover */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 opacity-0 group-hover:opacity-100"
        style={{ 
          backgroundPosition: '0% 0%',
          backgroundSize: '200% 200%',
          zIndex: 0 
        }}
      />
      {isRecommended && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-success text-white gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
          <div 
            className="w-3 h-3 rounded-full group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: color }}
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-500">
            {name}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Cost Display */}
        <div className="text-center py-4 bg-muted/30 rounded-lg group-hover:bg-muted/50 transition-colors duration-300 shadow-sm group-hover:shadow-md">
          <div className="text-sm text-muted-foreground mb-1">Estimated Cost</div>
          <div className="text-3xl font-bold group-hover:scale-105 transition-transform duration-300" style={{ 
            color,
            textShadow: '0 2px 10px rgba(var(--primary) / 0.1)'
          }}>
            {currencySymbol}{cost.toLocaleString()}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 group-hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-start gap-2 group-hover:translate-x-1 transition-transform duration-300">
            <Users className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors duration-300" />
            <div className="group-hover:translate-x-0.5 transition-transform duration-300">
              <div className="text-xs text-muted-foreground">Effort</div>
              <div className="font-semibold">{effort.toFixed(1)} PM</div>
            </div>
          </div>
          <div className="flex items-start gap-2 group-hover:translate-x-1 transition-transform duration-300">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors duration-300" />
            <div className="group-hover:translate-x-0.5 transition-transform duration-300">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-semibold">{duration.toFixed(1)} mo</div>
            </div>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="space-y-2 group-hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Risk Level
            </span>
            <span className="font-medium capitalize">{risk}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: getRiskWidth(),
                backgroundColor: getRiskColor()
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

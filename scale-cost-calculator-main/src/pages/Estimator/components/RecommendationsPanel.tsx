import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, ArrowRight, Check, X } from 'lucide-react';
import { Tool } from '../types';

export type Suggestion = {
  id: string;
  type: 'cost' | 'duration' | 'tool' | 'template';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
};

interface RecommendationsPanelProps {
  totalMonthlyCost: number;
  projectDurationWeeks: number;
  selectedTools: Tool[];
  projectTemplate?: string;
  onToolSwap?: (fromToolId: string, toToolId: string) => void;
  onTemplateSelect?: (template: string) => void;
  className?: string;
}

export const RecommendationsPanel = ({
  totalMonthlyCost,
  projectDurationWeeks,
  selectedTools,
  projectTemplate = 'Custom',
  onToolSwap,
  onTemplateSelect,
  className
}: RecommendationsPanelProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Generate suggestions based on project state
  useEffect(() => {
    const newSuggestions: Suggestion[] = [];
    
    // Cost-related suggestions
    if (totalMonthlyCost > 300) {
      newSuggestions.push({
        id: 'high-cost',
        type: 'cost',
        title: 'High Monthly Cost',
        description: `Your monthly cost ($${totalMonthlyCost}) is on the higher side. Consider more affordable alternatives.`,
        action: {
          label: 'Show cheaper alternatives',
          onClick: () => {
            // This would be implemented to filter tools
            console.log('Showing cheaper alternatives');
          },
        },
        dismissible: true,
      });
    }

    // Duration-related suggestions
    if (projectDurationWeeks > 12 && projectTemplate !== 'Rapid MVP') {
      newSuggestions.push({
        id: 'long-duration',
        type: 'duration',
        title: 'Long Project Duration',
        description: 'Your project is estimated to take a while. Consider the Rapid MVP template to accelerate delivery.',
        action: onTemplateSelect ? {
          label: 'Switch to Rapid MVP',
          onClick: () => onTemplateSelect('Rapid MVP'),
        } : undefined,
        dismissible: true,
      });
    }

    // Tool-specific suggestions
    const expensiveTools = selectedTools.filter(tool => tool.monthlyPriceUSD > 50);
    expensiveTools.forEach(tool => {
      newSuggestions.push({
        id: `expensive-tool-${tool.id}`,
        type: 'tool',
        title: `Consider ${tool.name} Alternatives`,
        description: `${tool.name} costs $${tool.monthlyPriceUSD}/month. There might be more affordable options.`,
        action: onToolSwap ? {
          label: 'Show alternatives',
          onClick: () => {
            // This would show a modal with alternative tools
            console.log(`Showing alternatives for ${tool.name}`);
          },
        } : undefined,
        dismissible: true,
      });
    });

    // Free tier suggestions
    const toolsWithFreeTier = selectedTools.filter(tool => tool.hasFreePlan);
    if (toolsWithFreeTier.length > 0) {
      newSuggestions.push({
        id: 'free-tier',
        type: 'tool',
        title: 'View free plans',
        description: `${toolsWithFreeTier.length} of your selected tools offer free tiers.`,
        action: {
          label: 'View free plans',
          onClick: () => {
            // This would filter to show tools with free tiers
            console.log('Showing tools with free tiers');
          },
        },
        dismissible: true,
      });
    }

    // Filter out dismissed suggestions
    const filteredSuggestions = newSuggestions.filter(s => !dismissedIds.has(s.id));
    setSuggestions(filteredSuggestions);
  }, [totalMonthlyCost, projectDurationWeeks, selectedTools, projectTemplate, dismissedIds, onToolSwap, onTemplateSelect]);

  const handleDismiss = (id: string) => {
    setDismissedIds(new Set(dismissedIds).add(id));
  };

  if (suggestions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Optimization Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p className="font-medium">Looking good! 🎉</p>
            <p className="text-sm mt-1">No optimization suggestions at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <span>Optimization Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <Alert key={suggestion.id} variant={suggestion.type === 'cost' ? 'destructive' : 'default'}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <AlertTitle className="flex items-center gap-2">
                  {suggestion.type === 'cost' && <Zap className="h-4 w-4" />}
                  {suggestion.type === 'duration' && <ArrowRight className="h-4 w-4" />}
                  {suggestion.type === 'tool' && <Check className="h-4 w-4" />}
                  {suggestion.title}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {suggestion.description}
                </AlertDescription>
                {suggestion.action && (
                  <Button 
                    variant={suggestion.type === 'cost' ? 'destructive' : 'outline'} 
                    size="sm" 
                    className="mt-2"
                    onClick={suggestion.action.onClick}
                  >
                    {suggestion.action.label}
                  </Button>
                )}
              </div>
              {suggestion.dismissible && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 -mt-1 -mr-2"
                  onClick={() => handleDismiss(suggestion.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

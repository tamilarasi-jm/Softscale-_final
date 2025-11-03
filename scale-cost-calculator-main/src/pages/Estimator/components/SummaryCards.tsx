import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Box, Zap, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  totalMonthlyCost: number;
  projectDurationWeeks: number;
  selectedToolsCount: number;
  projectTemplate?: string;
  className?: string;
}

export const SummaryCards = ({
  totalMonthlyCost,
  projectDurationWeeks,
  selectedToolsCount,
  projectTemplate = 'Custom',
  className
}: SummaryCardsProps) => {
  // Determine cost severity for styling
  const getCostSeverity = (cost: number) => {
    if (cost < 100) return 'success';
    if (cost < 300) return 'warning';
    return 'danger';
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format duration
  const formatDuration = (weeks: number) => {
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'}`;
    const months = Math.round((weeks / 4.345) * 10) / 10;
    return `${months} month${months === 1 ? '' : 's'}`;
  };

  const costSeverity = getCostSeverity(totalMonthlyCost);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {/* Total Cost Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Monthly Cost
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalMonthlyCost)}
            <span className="text-xs text-muted-foreground">/month</span>
          </div>
          <p className={cn("text-xs mt-1", {
            'text-green-500': costSeverity === 'success',
            'text-yellow-500': costSeverity === 'warning',
            'text-red-500': costSeverity === 'danger',
          })}>
            {costSeverity === 'success' ? 'Budget Friendly' : 
             costSeverity === 'warning' ? 'Moderate Budget' : 'Premium Budget'}
          </p>
        </CardContent>
      </Card>

      {/* Project Duration */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Project Duration
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(projectDurationWeeks)}
          </div>
          <p className="text-xs text-muted-foreground">
            {projectDurationWeeks} weeks estimated
          </p>
        </CardContent>
      </Card>

      {/* Tools Count */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tools Selected
          </CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{selectedToolsCount}</div>
          <p className="text-xs text-muted-foreground">
            {selectedToolsCount === 0 ? 'No tools selected' : 
             selectedToolsCount === 1 ? '1 tool in use' : 
             `${selectedToolsCount} tools in use`}
          </p>
        </CardContent>
      </Card>

      {/* Project Type */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Project Type
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectTemplate}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            {projectDurationWeeks < 4 ? 'Rapid Prototype' : 
             projectDurationWeeks < 12 ? 'Standard Project' : 'Enterprise Project'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

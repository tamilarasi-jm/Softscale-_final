import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelResult {
  name: string;
  cost: number;
  effort: number;
  duration: number;
  risk?: string;
  additionalMetrics?: Record<string, any>;
}

interface UnifiedComparisonTableProps {
  results: ModelResult[];
  currencySymbol: string;
}

export const UnifiedComparisonTable = ({ results, currencySymbol }: UnifiedComparisonTableProps) => {
  const getRiskBadgeClass = (risk?: string) => {
    if (!risk) return '';
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'high':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unified Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Effort</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Risk</TableHead>
                <TableHead className="text-right">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {currencySymbol}{result.cost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.effort.toFixed(1)} {result.name === 'Story Points' ? 'PD' : 'PM'}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.duration.toFixed(1)} {result.name.includes('COCOMO') || result.name.includes('SLIM') || result.name.includes('RCA') ? 'mo' : 'days'}
                  </TableCell>
                  <TableCell className="text-right">
                    {result.risk && (
                      <Badge className={getRiskBadgeClass(result.risk)}>
                        {result.risk}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {result.additionalMetrics && Object.entries(result.additionalMetrics).map(([key, value]) => (
                      <div key={key}>{key}: {value}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Section */}
        <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Avg Cost</div>
            <div className="text-2xl font-bold text-primary">
              {currencySymbol}{Math.round(results.reduce((sum, r) => sum + r.cost, 0) / results.length).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Cost Range</div>
            <div className="text-lg font-semibold">
              {currencySymbol}{Math.min(...results.map(r => r.cost)).toLocaleString()} - {currencySymbol}{Math.max(...results.map(r => r.cost)).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Models Compared</div>
            <div className="text-2xl font-bold text-primary">{results.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

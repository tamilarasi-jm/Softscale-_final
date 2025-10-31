import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EstimationResult {
  name: string;
  cost: number;
  effort: number;
  duration: number;
  risk: string;
}

interface ComparisonTableProps {
  results: EstimationResult[];
  currencySymbol: string;
}

export const ComparisonTable = ({ results, currencySymbol }: ComparisonTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Effort (PM)</TableHead>
                <TableHead className="text-right">Duration (mo)</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.name}>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell className="text-right">{currencySymbol}{result.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{result.effort.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{result.duration.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      result.risk === 'low' 
                        ? 'bg-success/10 text-success' 
                        : result.risk === 'medium'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-error/10 text-error'
                    }`}>
                      {result.risk}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

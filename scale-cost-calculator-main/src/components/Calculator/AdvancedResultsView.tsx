import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeatureEstimationResult } from "@/utils/advancedEstimationModels";
import { TrendingUp, Clock, DollarSign, AlertTriangle } from "lucide-react";

interface AdvancedResultsViewProps {
  results: FeatureEstimationResult[];
  currencySymbol: string;
}

export const AdvancedResultsView = ({ results, currencySymbol }: AdvancedResultsViewProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Feature Estimation Results</h2>
      
      {results.map((result) => (
        <Card key={result.featureId}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{result.featureName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* FPA Results */}
              {result.fpa && (
                <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Function Point Analysis</h4>
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{currencySymbol}{result.fpa.cost.toLocaleString()}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Function Points:</span>
                        <span className="font-medium">{result.fpa.functionPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effort:</span>
                        <span className="font-medium">{result.fpa.effort} PD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{result.fpa.duration} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PERT Results */}
              {result.pert && (
                <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">PERT Analysis</h4>
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{currencySymbol}{result.pert.cost.toLocaleString()}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Effort:</span>
                        <span className="font-medium">{result.pert.expectedEffort} PD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Std Dev:</span>
                        <span className="font-medium">{result.pert.standardDeviation}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Risk:</span>
                        <Badge className={
                          result.pert.risk === 'low' ? 'bg-success/10 text-success' :
                          result.pert.risk === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }>
                          {result.pert.risk}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Story Points Results */}
              {result.storyPoints && (
                <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Agile Story Points</h4>
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{currencySymbol}{result.storyPoints.cost.toLocaleString()}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sprints:</span>
                        <span className="font-medium">{result.storyPoints.sprints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effort:</span>
                        <span className="font-medium">{result.storyPoints.effort} PD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{result.storyPoints.duration} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {results.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add features and calculate to see estimation results</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

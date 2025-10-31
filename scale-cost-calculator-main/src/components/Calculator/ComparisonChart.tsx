import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EstimationResult {
  name: string;
  cost: number;
  effort: number;
  duration: number;
  color: string;
}

interface ComparisonChartProps {
  results: EstimationResult[];
  currencySymbol: string;
}

export const ComparisonChart = ({ results, currencySymbol }: ComparisonChartProps) => {
  const costData = results.map(r => ({ name: r.name, value: r.cost }));
  const effortData = results.map(r => ({ name: r.name, value: r.effort }));
  const durationData = results.map(r => ({ name: r.name, value: r.duration }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].name === 'Cost' && `${currencySymbol}${payload[0].value.toLocaleString()}`}
            {payload[0].name === 'Effort' && `${payload[0].value.toFixed(1)} PM`}
            {payload[0].name === 'Duration' && `${payload[0].value.toFixed(1)} months`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cost" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="effort">Effort</TabsTrigger>
            <TabsTrigger value="duration">Duration</TabsTrigger>
          </TabsList>

          <TabsContent value="cost" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Cost" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="effort" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={effortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Effort" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="duration" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Duration" fill="hsl(var(--rca))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

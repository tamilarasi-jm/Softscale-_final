import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CostSummary() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample data - in real implementation, this would come from props or context
  const comparisonData = [
    { 
      metric: 'Total Effort',
      before: '120 PD',
      after: '108 PD',
      variance: '-10%',
      trend: 'down'
    },
    { 
      metric: 'Total Cost',
      before: '$180,000',
      after: '$162,000',
      variance: '-10%',
      trend: 'down'
    },
    { 
      metric: 'Duration',
      before: '6 months',
      after: '5.4 months',
      variance: '-10%',
      trend: 'down'
    },
    { 
      metric: 'Risk Factor',
      before: 'High',
      after: 'Medium',
      variance: '-',
      trend: 'down'
    },
  ];

  const chartData = [
    { model: 'COCOMO', effort: 120, cost: 180000, duration: 6 },
    { model: 'SLIM', effort: 110, cost: 165000, duration: 5.5 },
    { model: 'RCA', effort: 115, cost: 172500, duration: 5.8 },
    { model: 'FPA', effort: 105, cost: 157500, duration: 5.2 },
    { model: 'PERT', effort: 108, cost: 162000, duration: 5.4 },
    { model: 'Agile', effort: 100, cost: 150000, duration: 5 },
  ];

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text('Cost Summary Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Comparison Analysis', 14, 40);
      
      autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Before PERT', 'After PERT', 'Variance']],
        body: comparisonData.map(row => [
          row.metric,
          row.before,
          row.after,
          row.variance
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          fontStyle: 'bold',
        },
      });
      
      doc.save(`cost-summary-${Date.now()}.pdf`);
      
      toast({
        title: 'PDF Exported',
        description: 'Your cost summary has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error generating the PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleExportExcel = () => {
    toast({
      title: 'Exporting to Excel',
      description: 'Your spreadsheet is being generated...',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Cost Summary</h1>
            <p className="text-muted-foreground">Comprehensive cost analysis across all estimation models</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/pert-visualization')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to PERT
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Total Effort</div>
            </div>
            <div className="text-3xl font-bold">108 PD</div>
            <div className="flex items-center gap-1 mt-2 text-success text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>10% reduction</span>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 backdrop-blur border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
            <div className="text-3xl font-bold">$162,000</div>
            <div className="flex items-center gap-1 mt-2 text-success text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>$18,000 saved</span>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 backdrop-blur border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            <div className="text-3xl font-bold">5.4 mo</div>
            <div className="flex items-center gap-1 mt-2 text-success text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>0.6 months faster</span>
            </div>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
          <h2 className="text-xl font-semibold mb-4">Before & After PERT Variation</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Metric</TableHead>
                  <TableHead className="font-semibold">Before PERT</TableHead>
                  <TableHead className="font-semibold">After PERT</TableHead>
                  <TableHead className="font-semibold">Variance</TableHead>
                  <TableHead className="font-semibold">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    <TableCell>{row.before}</TableCell>
                    <TableCell>{row.after}</TableCell>
                    <TableCell>
                      <Badge variant={row.trend === 'down' ? 'default' : 'secondary'}>
                        {row.variance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.trend === 'down' ? (
                        <TrendingDown className="w-5 h-5 text-success" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Effort Comparison Chart */}
          <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold mb-4">Effort Comparison (Person-Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="model" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="effort" fill="hsl(var(--primary))" name="Effort (PD)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost Comparison Chart */}
          <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold mb-4">Cost Comparison ($)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="model" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="cost" fill="hsl(var(--success))" name="Cost ($)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Duration Line Chart */}
        <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
          <h3 className="text-lg font-semibold mb-4">Duration Comparison (Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="model" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                name="Duration (mo)"
                dot={{ fill: 'hsl(var(--warning))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 backdrop-blur border-success/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Recommendations
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>PERT analysis shows a 10% reduction in both effort and cost compared to initial estimates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Agile methodology offers the most optimized timeline with 5 months duration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Risk factor improved from High to Medium with better task scheduling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">⚠</span>
              <span>Monitor critical path activities closely to maintain the improved timeline</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

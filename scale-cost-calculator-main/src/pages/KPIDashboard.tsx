import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEVMData } from '@/contexts/EVMDataContext';
import { KPICard } from '@/components/kpi/KPICard';
import { PerformanceSummary } from '@/components/kpi/PerformanceSummary';
import { SCurveChart } from '@/components/kpi/SCurveChart';
import { VarianceChart } from '@/components/kpi/VarianceChart';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, RefreshCw, FileDown, DollarSign, Clock, 
  Target, Calendar, TrendingDown, AlertTriangle, 
  BarChart3, AlertCircle, ChevronDown, Info 
} from 'lucide-react';
import { formatCurrency, formatDecimal, getPerformanceStatus } from '@/utils/evmCalculations';
import { useToast } from '@/hooks/use-toast';

const KPIDashboard = () => {
  const navigate = useNavigate();
  const { data, metrics, calculateMetrics } = useEVMData();
  const { toast } = useToast();
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  const handleRefresh = () => {
    calculateMetrics();
    setLastUpdated(new Date().toLocaleString());
    toast({
      title: "Data Refreshed",
      description: "KPI metrics have been recalculated successfully.",
    });
  };

  const handleExportPDF = () => {
    window.print();
    toast({
      title: "Export PDF",
      description: "Opening print dialog for PDF export...",
    });
  };

  if (!metrics) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Project KPI Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time performance monitoring and insights
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/evm-calculator')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Calculator
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Cost Performance Index"
            value={formatDecimal(metrics.cpi, 3)}
            label="Cost Efficiency"
            sublabel={`Spending $${(1 / metrics.cpi).toFixed(2)} for every $1 of work`}
            icon={DollarSign}
            status={getPerformanceStatus(metrics.cpi, 'index')}
            interpretation={metrics.cpi >= 1 ? "Project is under budget" : "Project is over budget"}
            gradient={metrics.cpi >= 1 ? 'from-green-500/20 to-green-600/20' : metrics.cpi >= 0.9 ? 'from-yellow-500/20 to-yellow-600/20' : 'from-red-500/20 to-red-600/20'}
          />
          
          <KPICard
            title="Schedule Performance Index"
            value={formatDecimal(metrics.spi, 3)}
            label="Schedule Efficiency"
            sublabel={`Completing ${(metrics.spi * 100).toFixed(1)}% of planned work`}
            icon={Clock}
            status={metrics.spi >= 1 ? 'On Track' : metrics.spi >= 0.9 ? 'Warning' : 'Behind Schedule'}
            interpretation={metrics.spi >= 1 ? "Project is on schedule" : "Project is behind schedule"}
            gradient={metrics.spi >= 1 ? 'from-green-500/20 to-green-600/20' : metrics.spi >= 0.9 ? 'from-yellow-500/20 to-yellow-600/20' : 'from-red-500/20 to-red-600/20'}
          />
          
          <KPICard
            title="Project Completion"
            value={`${metrics.percentComplete.toFixed(1)}%`}
            label="Percent Complete"
            sublabel="Phase 2 of 4"
            icon={Target}
            interpretation={`${(100 - metrics.percentComplete).toFixed(0)}% remaining`}
            gradient="from-violet-500/20 to-purple-600/20"
          />
          
          <KPICard
            title="Schedule Variance"
            value={formatCurrency(metrics.sv)}
            label="Schedule Variance (SV)"
            sublabel={`${((metrics.sv / data.bac) * 100).toFixed(1)}% variance`}
            icon={Calendar}
            interpretation={metrics.sv >= 0 ? "Ahead of planned value" : `$${Math.abs(metrics.sv).toLocaleString()} behind planned value`}
            gradient={metrics.sv >= 0 ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20'}
          />
          
          <KPICard
            title="Cost Variance"
            value={formatCurrency(metrics.cv)}
            label="Cost Variance (CV)"
            sublabel={`${((metrics.cv / data.bac) * 100).toFixed(1)}% variance`}
            icon={TrendingDown}
            interpretation={metrics.cv >= 0 ? "Under budget" : `$${Math.abs(metrics.cv).toLocaleString()} over budget`}
            gradient={metrics.cv >= 0 ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20'}
          />
          
          <KPICard
            title="Estimate at Completion"
            value={formatCurrency(metrics.eac)}
            label="Forecast Final Cost (EAC)"
            sublabel={`BAC: ${formatCurrency(data.bac)}`}
            icon={AlertTriangle}
            status={metrics.vac >= 0 ? 'Under Budget' : 'Over Budget'}
            interpretation={`${formatCurrency(Math.abs(metrics.vac))} projected ${metrics.vac >= 0 ? 'under' : 'over'}run`}
            gradient={metrics.vac >= 0 ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20'}
          />
        </div>

        {/* Performance Summary */}
        <PerformanceSummary metrics={metrics} />

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <SCurveChart />
          <VarianceChart />
        </div>

        {/* Risk & Cost Analysis Placeholder */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-dashed border-violet-300 dark:border-violet-700">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <BarChart3 className="h-12 w-12 text-violet-600 dark:text-violet-400" />
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Advanced Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Coming Soon</p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-violet-600 dark:text-violet-400">✓</span>
                Risk Assessment Matrix
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-600 dark:text-violet-400">✓</span>
                Detailed Cost Breakdown
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-600 dark:text-violet-400">✓</span>
                What-If Forecasting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-600 dark:text-violet-400">✓</span>
                Resource Utilization Trends
              </li>
            </ul>
            <Button variant="secondary" disabled>
              Request Early Access
            </Button>
          </div>
        </div>

        {/* Educational Section */}
        <Collapsible open={isEducationOpen} onOpenChange={setIsEducationOpen} className="print:hidden">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-left">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                {isEducationOpen ? 'Hide Details' : 'Understanding Your Dashboard'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isEducationOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How to Read Your KPI Dashboard</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  This dashboard provides a comprehensive view of your project's health through key performance indicators.
                  Review these metrics weekly to stay informed about cost and schedule performance.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-violet-600 dark:text-violet-400">Color Coding System:</strong>
                  <ul className="mt-1 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>🟢 Green: Good performance, on track</li>
                    <li>🟡 Yellow: Warning, requires attention</li>
                    <li>🔴 Red: Critical, immediate action needed</li>
                  </ul>
                </div>
                
                <div>
                  <strong className="text-violet-600 dark:text-violet-400">S-Curve Chart:</strong>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    Shows cumulative values over time. The ideal scenario is when all three lines (PV, EV, AC) align closely.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default KPIDashboard;

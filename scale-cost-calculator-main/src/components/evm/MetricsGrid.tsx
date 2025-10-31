import React from 'react';
import { MetricCard } from './MetricCard';
import { DollarSign, Clock, TrendingDown, Calendar, Target, AlertTriangle } from 'lucide-react';
import { EVMMetrics } from '@/contexts/EVMDataContext';

interface MetricsGridProps {
  metrics: EVMMetrics;
  bac: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, bac }) => {
  const { cpi, spi, cv, sv, eac, vac } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Cost Performance Index (CPI)"
        value={cpi}
        type="index"
        icon={DollarSign}
        colorType="index"
        subtitle={cpi >= 1 ? "On budget" : "Over budget"}
      />
      
      <MetricCard
        title="Schedule Performance Index (SPI)"
        value={spi}
        type="index"
        icon={Clock}
        colorType="index"
        subtitle={spi >= 1 ? "On schedule" : "Behind schedule"}
      />
      
      <MetricCard
        title="Cost Variance (CV)"
        value={cv}
        type="currency"
        icon={TrendingDown}
        colorType="variance"
        subtitle={`${((cv / bac) * 100).toFixed(1)}% of budget`}
      />
      
      <MetricCard
        title="Schedule Variance (SV)"
        value={sv}
        type="currency"
        icon={Calendar}
        colorType="variance"
        subtitle={`${((sv / bac) * 100).toFixed(1)}% of planned`}
      />
      
      <MetricCard
        title="Estimate at Completion (EAC)"
        value={eac}
        type="currency"
        icon={Target}
        colorType="variance"
        subtitle={`Budget: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(bac)}`}
      />
      
      <MetricCard
        title="Variance at Completion (VAC)"
        value={vac}
        type="currency"
        icon={AlertTriangle}
        colorType="variance"
        subtitle={vac >= 0 ? "Under budget" : "Over budget"}
      />
    </div>
  );
};

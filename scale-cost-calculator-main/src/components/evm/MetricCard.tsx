import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDecimal, getPerformanceColor, getPerformanceBgColor, getTrendIcon } from '@/utils/evmCalculations';

interface MetricCardProps {
  title: string;
  value: number;
  type: 'index' | 'currency' | 'percentage';
  icon: LucideIcon;
  colorType: 'index' | 'variance';
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title, value, type, icon: Icon, colorType, subtitle
}) => {
  const formatValue = () => {
    if (type === 'index') return formatDecimal(value, 3);
    if (type === 'currency') {
      const sign = value >= 0 ? '+' : '';
      return sign + formatCurrency(value);
    }
    return formatDecimal(value, 1) + '%';
  };

  const bgGradient = getPerformanceBgColor(value, colorType);
  const textColor = getPerformanceColor(value, colorType);
  const showTrend = type === 'index';
  const TrendIcon = value >= (type === 'index' ? 1.0 : 0) ? TrendingUp : TrendingDown;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-white/50 dark:bg-gray-800/50`}>
          <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        {showTrend && (
          <TrendIcon className={`h-5 w-5 ${textColor}`} />
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${textColor} mb-2`}>
        {formatValue()}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { EVMMetrics } from '@/contexts/EVMDataContext';
import { getHealthScore } from '@/utils/evmCalculations';

interface PerformanceSummaryProps {
  metrics: EVMMetrics;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ metrics }) => {
  const healthScore = getHealthScore(metrics.cpi, metrics.spi);
  
  const getHealthColor = () => {
    if (healthScore >= 80) return 'text-green-600 dark:text-green-400';
    if (healthScore >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const getHealthStatus = () => {
    if (healthScore >= 80) return 'Excellent';
    if (healthScore >= 60) return 'Requires Attention';
    return 'Critical';
  };

  const getHealthIcon = () => {
    if (healthScore >= 80) return CheckCircle;
    if (healthScore >= 60) return AlertTriangle;
    return AlertCircle;
  };

  const HealthIcon = getHealthIcon();

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Performance Summary
        </h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - healthScore / 100)}`}
                className={`${getHealthColor()} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getHealthColor()}`}>
                {healthScore}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <HealthIcon className={`h-5 w-5 ${getHealthColor()}`} />
          <span className={`text-lg font-semibold ${getHealthColor()}`}>
            {getHealthStatus()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Key Findings
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Project is {((1 - metrics.cpi) * 100).toFixed(1)}% over budget with {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Math.abs(metrics.cv))} overrun
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Schedule delayed by {((1 - metrics.spi) * 100).toFixed(1)}%
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Forecasts {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Math.abs(metrics.vac))} budget overrun at completion
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              {metrics.percentComplete.toFixed(0)}% complete
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Recommended Actions
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Review resource allocation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Identify schedule risks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Consider scope adjustments
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-600 dark:text-violet-400">•</span>
              Increase monitoring frequency
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

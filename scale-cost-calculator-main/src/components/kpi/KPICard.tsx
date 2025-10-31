import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  status?: string;
  interpretation?: string;
  gradient: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title, value, label, sublabel, icon: Icon, status, interpretation, gradient
}) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
          <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
        </div>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status.includes('good') || status.includes('Track') ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
            status.includes('Warning') || status.includes('Budget') ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
            'bg-red-500/20 text-red-700 dark:text-red-300'
          }`}>
            {status}
          </span>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      
      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>
      
      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-1">
        {label}
      </p>
      
      {sublabel && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {sublabel}
        </p>
      )}
      
      {interpretation && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
          {interpretation}
        </p>
      )}
    </div>
  );
};

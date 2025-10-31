import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Completion
        </h3>
        <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-blue-600 transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {percentage >= 100 ? 'Project Complete!' : `${(100 - percentage).toFixed(1)}% remaining`}
      </p>
    </div>
  );
};

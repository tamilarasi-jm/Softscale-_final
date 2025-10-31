import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const varianceData = [
  { month: 'Month 1', CV: -3000, SV: -5000 },
  { month: 'Month 2', CV: -5000, SV: -10000 },
  { month: 'Month 3', CV: -10000, SV: -20000 },
  { month: 'Month 4', CV: -15000, SV: -30000 },
  { month: 'Month 5', CV: -20000, SV: -40000 },
  { month: 'Month 6', CV: -30000, SV: -50000 },
];

export const VarianceChart: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Cost & Schedule Variance Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={varianceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <ReferenceLine y={0} stroke="#6B7280" strokeWidth={2} />
          <Bar 
            dataKey="CV" 
            fill="#14B8A6" 
            name="Cost Variance (CV)"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="SV" 
            fill="#8B5CF6" 
            name="Schedule Variance (SV)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <strong>Warning:</strong> Variances are increasing month over month. Immediate corrective action is recommended to prevent further deterioration.
        </p>
      </div>
    </div>
  );
};

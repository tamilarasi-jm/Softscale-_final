import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const chartData = [
  { month: 'Month 1', PV: 100000, EV: 95000, AC: 98000 },
  { month: 'Month 2', PV: 200000, EV: 190000, AC: 195000 },
  { month: 'Month 3', PV: 300000, EV: 280000, AC: 290000 },
  { month: 'Month 4', PV: 400000, EV: 370000, AC: 385000 },
  { month: 'Month 5', PV: 500000, EV: 460000, AC: 480000 },
  { month: 'Month 6', PV: 600000, EV: 550000, AC: 580000 },
];

export const SCurveChart: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Project Performance S-Curve
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
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
          <ReferenceLine 
            y={1000000} 
            stroke="#9CA3AF" 
            strokeDasharray="5 5"
            label={{ value: 'BAC: $1M', position: 'right', fill: '#6B7280', fontSize: 12 }}
          />
          <Line 
            type="monotone" 
            dataKey="PV" 
            stroke="#3B82F6" 
            strokeWidth={2.5}
            strokeDasharray="5 5"
            name="Planned Value (PV)"
            dot={{ r: 4, fill: '#3B82F6' }}
          />
          <Line 
            type="monotone" 
            dataKey="EV" 
            stroke="#10B981" 
            strokeWidth={3}
            name="Earned Value (EV)"
            dot={{ r: 5, fill: '#10B981' }}
          />
          <Line 
            type="monotone" 
            dataKey="AC" 
            stroke="#EF4444" 
            strokeWidth={3}
            name="Actual Cost (AC)"
            dot={{ r: 5, fill: '#EF4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <strong>Insight:</strong> The gap between EV and AC indicates cost overruns, while the gap between EV and PV shows schedule delays. 
          Monitor these variances closely to bring the project back on track.
        </p>
      </div>
    </div>
  );
};

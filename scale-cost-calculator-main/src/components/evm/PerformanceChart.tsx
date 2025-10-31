import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Month 1', PV: 100000, EV: 95000, AC: 98000 },
  { month: 'Month 2', PV: 200000, EV: 190000, AC: 195000 },
  { month: 'Month 3', PV: 300000, EV: 280000, AC: 290000 },
  { month: 'Month 4', PV: 400000, EV: 370000, AC: 385000 },
  { month: 'Month 5', PV: 500000, EV: 460000, AC: 480000 },
  { month: 'Month 6', PV: 600000, EV: 550000, AC: 580000 },
];

export const PerformanceChart: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Trend Analysis
      </h3>
      <ResponsiveContainer width="100%" height={300}>
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
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Line 
            type="monotone" 
            dataKey="PV" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Planned Value"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="EV" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Earned Value"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="AC" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Actual Cost"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

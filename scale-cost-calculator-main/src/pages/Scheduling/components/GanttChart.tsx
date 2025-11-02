import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Rectangle } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttTask } from '../types';

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskClick?: (task: GanttTask) => void;
  viewMode?: 'day' | 'week' | 'month';
  columnWidth?: number;
}

// Helper function to calculate date range
const getDateRange = (tasks: GanttTask[]) => {
  if (!tasks.length) return { minDate: new Date(), maxDate: new Date() };
  
  let minDate = new Date(tasks[0].start);
  let maxDate = new Date(tasks[0].end);

  tasks.forEach(task => {
    const start = new Date(task.start);
    const end = new Date(task.end);
    
    if (start < minDate) minDate = start;
    if (end > maxDate) maxDate = end;
  });

  return { minDate, maxDate };
};

// Helper to format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  onTaskClick,
  viewMode = 'day',
  columnWidth = 30,
}) => {
  // Calculate date range for the entire project
  const { minDate, maxDate } = useMemo(() => getDateRange(tasks), [tasks]);
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24)) + 1;

  // Calculate chart dimensions
  const rowHeight = 40;
  const headerHeight = 50;
  const chartHeight = tasks.length * rowHeight + headerHeight;
  const chartWidth = Math.max(totalDays * columnWidth, 800); // Minimum width of 800px

  // Process tasks for the chart
  const processTasks = () => {
    return tasks.map((task, index) => {
      const startDate = new Date(task.start);
      const endDate = new Date(task.end);
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
      const offset = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
      
      return {
        ...task,
        id: task.id,
        name: task.name,
        start: task.start,
        end: task.end,
        duration,
        offset,
        progress: task.progress || 0,
        riskLevel: task.riskLevel || 'medium',
        y: index * rowHeight + headerHeight / 2,
        height: rowHeight - 8,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      };
    });
  };

  const processedTasks = processTasks();

  // Generate X-axis ticks
  const getXAxisTicks = () => {
    const ticks = [];
    const numTicks = Math.min(10, totalDays); // Max 10 ticks
    const step = Math.max(1, Math.ceil(totalDays / numTicks));
    
    for (let i = 0; i < totalDays; i += step) {
      const date = new Date(minDate);
      date.setDate(date.getDate() + i);
      ticks.push({
        value: i,
        label: formatDate(date)
      });
    }
    
    // Ensure the last date is included
    if (totalDays > 1) {
      ticks.push({
        value: totalDays - 1,
        label: formatDate(new Date(maxDate))
      });
    }
    
    return ticks;
  };

  const xAxisTicks = getXAxisTicks();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: `${chartWidth}px` }}>
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              Project Timeline: {formatDate(minDate)} to {formatDate(maxDate)} • {totalDays} days
            </div>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={processedTasks}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                barGap={0}
                barCategoryGap={0}
              >
                <XAxis 
                  type="number" 
                  domain={[0, totalDays - 1]}
                  ticks={xAxisTicks.map(t => t.value)}
                  tickFormatter={(value) => {
                    const tick = xAxisTicks.find(t => t.value === value);
                    return tick ? tick.label : '';
                  }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const task = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg text-sm">
                          <p className="font-semibold">{task.name}</p>
                          <p>Start: {task.startDate}</p>
                          <p>End: {task.endDate}</p>
                          <p>Duration: {task.duration} days</p>
                          <p>Progress: {task.progress}%</p>
                          <p className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            task.riskLevel === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : task.riskLevel === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {task.riskLevel} risk
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="duration"
                  stackId="gantt"
                  fill="#e5e7eb"
                  radius={[4, 4, 4, 4]}
                  onClick={(data) => onTaskClick?.(data.payload)}
                  xAxisId={0}
                  isAnimationActive={false}
                >
                  {processedTasks.map((task, index) => (
                    <Cell
                      key={`cell-bg-${index}`}
                      fill="#e5e7eb"
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="progress"
                  stackId="gantt"
                  fill="#8884d8"
                  radius={[4, 4, 4, 4]}
                  onClick={(data) => onTaskClick?.(data.payload)}
                  xAxisId={0}
                  isAnimationActive={false}
                  shape={({ x, y, width, height, ...rest }) => {
                    const task = rest.payload;
                    const progressWidth = (task.duration * (task.progress || 0)) / 100;
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={progressWidth || 0}
                          height={height}
                          rx="4"
                          ry="4"
                          fill={
                            task.riskLevel === 'high' 
                              ? '#ef4444' 
                              : task.riskLevel === 'medium' 
                                ? '#f59e0b' 
                                : '#10b981'
                          }
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        {progressWidth > 30 && (
                          <text
                            x={x + 8}
                            y={y + height / 2 + 5}
                            fill="white"
                            fontSize={12}
                            className="pointer-events-none"
                          >
                            {task.progress}%
                          </text>
                        )}
                      </g>
                    );
                  }}
                >
                  {processedTasks.map((task, index) => (
                    <Cell
                      key={`cell-progress-${index}`}
                      fill={
                        task.riskLevel === 'high' 
                          ? '#ef4444' 
                          : task.riskLevel === 'medium' 
                            ? '#f59e0b' 
                            : '#10b981'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

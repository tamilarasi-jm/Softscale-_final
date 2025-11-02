import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectPhase } from '../types';

interface GanttChartProps {
  phases: ProjectPhase[];
  onPhaseClick?: (phase: ProjectPhase) => void;
}

const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
];

export const GanttChart: React.FC<GanttChartProps> = ({ phases, onPhaseClick }) => {
  // Calculate the project timeline
  const { timeline, totalDays } = useMemo(() => {
    const calculatedPhases = [...phases];
    const startDate = new Date();
    
    // Set initial start and end dates for each phase
    calculatedPhases.forEach(phase => {
      if (phase.id === calculatedPhases[0]?.id) {
        // First phase starts today
        phase.startDate = new Date(startDate);
      } else {
        // Find the latest end date of all dependencies
        const dependencyEndDates = phase.dependencies
          .map(depId => {
            const depPhase = calculatedPhases.find(p => p.id === depId);
            return depPhase?.endDate ? new Date(depPhase.endDate) : null;
          })
          .filter(Boolean) as Date[];
          
        const latestDependencyEnd = dependencyEndDates.length > 0 
          ? new Date(Math.max(...dependencyEndDates.map(d => d.getTime()))) 
          : startDate;
          
        // Start the next business day after the latest dependency ends
        const nextDay = new Date(latestDependencyEnd);
        nextDay.setDate(nextDay.getDate() + 1);
        phase.startDate = nextDay;
      }
      
      // Set end date based on duration
      const endDate = new Date(phase.startDate);
      endDate.setDate(endDate.getDate() + (phase.duration || 1) - 1);
      phase.endDate = endDate;
      
      return phase;
    });
    
    // Find the total project duration
    const endDates = calculatedPhases.map(p => p.endDate?.getTime() || 0);
    const projectEndDate = new Date(Math.max(...endDates));
    const totalDays = Math.ceil((projectEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Format data for the chart
    const timeline = calculatedPhases.map((phase, index) => {
      const startDay = Math.ceil((phase.startDate!.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = phase.duration || 1;
      
      return {
        ...phase,
        name: phase.name || `Phase ${index + 1}`,
        startDay,
        duration,
        endDay: startDay + duration - 1,
        color: COLORS[index % COLORS.length],
      };
    });
    
    return { timeline, totalDays: Math.max(totalDays, 14) }; // Minimum 14 days for better visibility
  }, [phases]);

  // Generate X-axis ticks (weeks)
  const xAxisTicks = useMemo(() => {
    const ticks = [];
    const totalWeeks = Math.ceil(totalDays / 7);
    
    for (let i = 0; i <= totalWeeks; i++) {
      ticks.push(i * 7);
    }
    
    return ticks;
  }, [totalDays]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${Math.max(totalDays * 20, 800)}px` }}>
            <ResponsiveContainer width="100%" height={phases.length * 60 + 100}>
              <BarChart
                data={timeline}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                barGap={0}
                barCategoryGap={0}
              >
                <XAxis
                  type="number"
                  domain={[0, totalDays]}
                  ticks={xAxisTicks}
                  tickFormatter={(value) => `Week ${value / 7 + 1}`}
                  tick={{ fontSize: 12 }}
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
                      const phase = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg text-sm">
                          <p className="font-semibold">{phase.name}</p>
                          <p>Start: {formatDate(phase.startDate)}</p>
                          <p>End: {formatDate(phase.endDate)}</p>
                          <p>Duration: {phase.duration} days</p>
                          {phase.dependencies.length > 0 && (
                            <p className="mt-2">
                              Depends on: {phase.dependencies.length} phase(s)
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="startDay"
                  stackId="gantt"
                  fill="transparent"
                  xAxisId={0}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="duration"
                  stackId="gantt"
                  xAxisId={0}
                  isAnimationActive={false}
                  shape={({ x, y, width, height, ...rest }) => {
                    const phase = rest.payload;
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={Math.max(height - 8, 16)}
                          rx="4"
                          ry="4"
                          fill={phase.color}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onPhaseClick?.(phase)}
                        />
                        <text
                          x={x + 8}
                          y={y + height / 2 + 4}
                          fill="white"
                          fontSize={12}
                          className="pointer-events-none"
                        >
                          {phase.duration}d
                        </text>
                      </g>
                    );
                  }}
                >
                  {timeline.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onClick={() => onPhaseClick?.(entry)}
                      className="cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Timeline Legend */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground px-4">
              <span>{formatDate(new Date())}</span>
              <span>Project Duration: {totalDays} days</span>
              <span>
                {formatDate(new Date(new Date().setDate(new Date().getDate() + totalDays - 1)))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';

export interface AONActivity {
  id: string;
  label?: string;
  name?: string;
  description?: string;
  duration: number;
  es?: number;
  ef?: number;
  ls?: number;
  lf?: number;
  float?: number;
  x?: number;
  y?: number;
  isCritical?: boolean;
  predecessors?: string[];
}

interface AONDiagramProps {
  activities: AONActivity[];
  isEditMode: boolean;
  onActivityClick: (activity: AONActivity) => void;
}

interface Connection {
  from: string;
  to: string;
}

const connections: Connection[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
];

export const AONDiagram: React.FC<AONDiagramProps> = ({ activities, isEditMode, onActivityClick }) => {
  const getActivity = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) {
      console.warn(`Activity with id ${id} not found`);
      // Return a default positioned activity to prevent crashes
      return { 
        id, 
        x: 0, 
        y: 0, 
        name: id, 
        duration: 0, 
        predecessors: [],
        es: 0,
        ef: 0,
        ls: 0,
        lf: 0,
        float: 0
      };
    }
    return activity;
  };

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 600 400" className="w-full h-auto border border-green-200 rounded-lg bg-green-50/30">
        <defs>
          <marker
            id="arrowhead-aon"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#059669" />
          </marker>
        </defs>

        {/* Draw connections */}
        {connections.map((conn, idx) => {
          const fromActivity = getActivity(conn.from);
          const toActivity = getActivity(conn.to);
          
          // Skip rendering if either activity is not found
          if (!fromActivity || !toActivity) {
            console.warn(`Skipping connection ${conn.from} -> ${conn.to}: one or both activities not found`);
            return null;
          }

          // Ensure positions are defined, default to 0 if not
          const fromX = (fromActivity.x || 0) + 70;
          const fromY = (fromActivity.y || 0) + 30;
          const toX = toActivity.x || 0;
          const toY = (toActivity.y || 0) + 30;

          return (
            <line
              key={idx}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke="#059669"
              strokeWidth="2"
              markerEnd="url(#arrowhead-aon)"
            />
          );
        })}

        {/* Draw activity boxes */}
        {activities.map((activity) => {
          // Skip rendering if position is not defined
          if (activity.x === undefined || activity.y === undefined) {
            console.warn(`Skipping activity ${activity.id}: missing position data`);
            return null;
          }
          
          const isCritical = activity.float === 0;
          return (
            <g
              key={activity.id}
              className={`cursor-pointer transition-all ${isCritical ? 'scale-105' : 'hover:scale-105'}`}
              onClick={() => onActivityClick(activity)}
            >
              <rect
                x={activity.x}
                y={activity.y}
                width="140"
                height="60"
                rx="8"
                fill="white"
                stroke={isCritical ? '#EF4444' : '#10B981'}
                strokeWidth="2"
                className="shadow-md"
              />
              
              {/* Top section: Label | Duration */}
              <text x={activity.x + 10} y={activity.y + 12} className="text-xs font-bold fill-green-900">
                {activity.label}
              </text>
              <text x={activity.x + 45} y={activity.y + 12} className="text-xs fill-green-700">
                {activity.duration}d
              </text>
              <line x1={activity.x} y1={activity.y + 15} x2={activity.x + 140} y2={activity.y + 15} stroke="#059669" strokeWidth="1" />

              {/* Middle section: ES | Desc | EF */}
              <text x={activity.x + 5} y={activity.y + 28} className="text-xs fill-green-700">
                {activity.es}
              </text>
              <text x={activity.x + 35} y={activity.y + 28} textAnchor="middle" className="text-xs fill-green-800">
                {activity.description}
              </text>
              <text x={activity.x + 65} y={activity.y + 28} textAnchor="end" className="text-xs fill-green-700">
                {activity.ef}
              </text>
              <line x1={activity.x} y1={activity.y + 32} x2={activity.x + 140} y2={activity.y + 32} stroke="#059669" strokeWidth="1" />

              {/* Bottom section: LS | Float | LF */}
              <text x={activity.x + 5} y={activity.y + 45} className="text-xs fill-green-700">
                {activity.ls}
              </text>
              <text x={activity.x + 35} y={activity.y + 45} textAnchor="middle" className="text-xs fill-green-600">
                F:{activity.float}
              </text>
              <text x={activity.x + 65} y={activity.y + 45} textAnchor="end" className="text-xs fill-green-700">
                {activity.lf}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">AON Legend:</h4>
        <div className="space-y-1 text-sm text-green-800">
          <p>• <strong>Boxes</strong> = Activities (Top: Label | Duration)</p>
          <p>• <strong>Middle Row</strong> = ES | Description | EF</p>
          <p>• <strong>Bottom Row</strong> = LS | Float | LF</p>
          <p>• <strong>Red Border</strong> = Critical Path (Float = 0)</p>
          <p>• <strong>Arrows</strong> = Dependencies</p>
          {isEditMode && <p className="text-orange-600">• <strong>Click boxes</strong> to edit in Edit Mode</p>}
        </div>
      </div>
    </div>
  );
};

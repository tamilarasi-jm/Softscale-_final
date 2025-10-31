import React, { useMemo } from 'react';

export interface AOAEvent {
  id: string;
  eet?: number;
  let?: number;
  isCritical?: boolean;
}

export interface AOAActivityProps {
  id: string;
  from: string;
  to: string;
  name: string;
  duration: number;
  totalFloat?: number;
  freeFloat?: number;
  isCritical?: boolean;
}

interface AOADiagramProps {
  events: AOAEvent[];
  activities: AOAActivityProps[];
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  eet: number;
  let: number;
  isCritical: boolean;
}

export const AOADiagram: React.FC<AOADiagramProps> = ({ events = [], activities = [] }) => {
  console.log('AOADiagram rendering with:', { events, activities });
  
  // Memoize node positions to prevent unnecessary recalculations
  const nodePositions = useMemo(() => {
    return events.map((event, index) => ({
      id: event.id,
      x: 100 + (index * 200),
      y: 200,
      eet: event.eet || 0,
      let: event.let || 0,
      isCritical: event.isCritical || false
    } as NodePosition));
  }, [events]);

  // Add error boundary for rendering
  try {
    return (
      <div className="aoa-diagram" style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}>
        <svg width="100%" height="100%">
          <defs>
          <marker
            id="arrowhead-normal"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
          </marker>
          <marker
            id="arrowhead-critical"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
        </defs>
        {/* Render activities as arrows */}
        {activities.map((activity, index) => {
          const fromNode = nodePositions.find(n => n.id === activity.from);
          const toNode = nodePositions.find(n => n.id === activity.to);
          if (!fromNode || !toNode) return null;

          const isCritical = activity.isCritical;
          const arrowColor = isCritical ? 'red' : '#4f46e5';
          const textColor = isCritical ? 'red' : 'black';

          // Calculate control points for curved arrows
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          const cp1x = midX;
          const cp1y = fromNode.y;
          const cp2x = midX;
          const cp2y = toNode.y;

          return (
            <g key={index}>
              {/* Curved arrow */}
              <path
                d={`M${fromNode.x},${fromNode.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${toNode.x},${toNode.y}`}
                fill="none"
                stroke={arrowColor}
                strokeWidth={isCritical ? 3 : 2}
                markerEnd={`url(#arrowhead-${isCritical ? 'critical' : 'normal'})`}
              />
              
              {/* Activity label */}
              <text
                x={midX}
                y={midY - 10}
                textAnchor="middle"
                fill={textColor}
                fontWeight={isCritical ? 'bold' : 'normal'}
              >
                {activity.name} ({activity.duration})
              </text>
              
              {/* Float value */}
              <text
                x={midX}
                y={midY + 15}
                textAnchor="middle"
                fontSize="12px"
                fill="#666"
              >
                Float: {activity.totalFloat ?? 0}
              </text>
            </g>
          );
        })}

        {/* Render nodes */}
        {nodePositions.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="white"
              stroke={node.isCritical ? 'red' : '#4f46e5'}
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill={node.isCritical ? 'red' : 'black'}
              fontWeight={node.isCritical ? 'bold' : 'normal'}
            >
              {node.id}
            </text>
            <text
              x={node.x}
              y={node.y - 30}
              textAnchor="middle"
              fontSize="10px"
            >
              EET: {node.eet}
            </text>
            <text
              x={node.x}
              y={node.y + 30}
              textAnchor="middle"
              fontSize="10px"
            >
              LET: {node.let}
            </text>
          </g>
        ))}

        {/* Arrowhead definitions */}
        <defs>
          <marker
            id="arrowhead-normal"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
          </marker>
          <marker
            id="arrowhead-critical"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
          </defs>
          {/* Render activities as arrows */}
          {activities.map((activity, index) => {
            const fromNode = nodePositions.find(n => n.id === activity.from);
            const toNode = nodePositions.find(n => n.id === activity.to);
            
            if (!fromNode || !toNode) {
              console.warn(`Could not find nodes for activity ${activity.id}: from=${activity.from}, to=${activity.to}`);
              return null;
            }

            const isCritical = activity.isCritical;
            const arrowColor = isCritical ? 'red' : '#4f46e5';
            const textColor = isCritical ? 'red' : 'black';

            // Calculate control points for curved arrows
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const cp1x = midX;
            const cp1y = fromNode.y;
            const cp2x = midX;
            const cp2y = toNode.y;

            return (
              <g key={`activity-${index}`}>
                {/* Curved arrow */}
                <path
                  d={`M${fromNode.x},${fromNode.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${toNode.x},${toNode.y}`}
                  fill="none"
                  stroke={arrowColor}
                  strokeWidth={isCritical ? 3 : 2}
                  markerEnd={`url(#arrowhead-${isCritical ? 'critical' : 'normal'})`}
                />
                
                {/* Activity label */}
                <text
                  x={midX}
                  y={midY - 10}
                  textAnchor="middle"
                  fill={textColor}
                  fontWeight={isCritical ? 'bold' : 'normal'}
                >
                  {activity.name} ({activity.duration})
                </text>
                
                {/* Float value */}
                <text
                  x={midX}
                  y={midY + 15}
                  textAnchor="middle"
                  fontSize="12px"
                  fill="#666"
                >
                  Float: {activity.totalFloat ?? 0}
                </text>
              </g>
            );
          })}

          {/* Render nodes */}
          {nodePositions.map((node) => (
            <g key={`node-${node.id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="white"
                stroke={node.isCritical ? 'red' : '#4f46e5'}
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill={node.isCritical ? 'red' : 'black'}
                fontWeight={node.isCritical ? 'bold' : 'normal'}
              >
                {node.id}
              </text>
              <text
                x={node.x}
                y={node.y - 30}
                textAnchor="middle"
                fontSize="10px"
              >
                EET: {node.eet}
              </text>
              <text
                x={node.x}
                y={node.y + 30}
                textAnchor="middle"
                fontSize="10px"
              >
                LET: {node.let}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  } catch (error) {
    console.error('Error rendering AOADiagram:', error);
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-bold">Error rendering diagram</h3>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }
};

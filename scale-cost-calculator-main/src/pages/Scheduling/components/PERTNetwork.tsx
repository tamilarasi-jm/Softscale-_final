import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from '../types';
import { calculateExpectedTime } from '../utils/pertCalculations';

interface PERTNetworkProps {
  activities: Activity[];
  criticalPath: string[];
  onNodeClick?: (activity: Activity) => void;
  viewMode?: 'aon' | 'aoa';
}

const PERTNetwork: React.FC<PERTNetworkProps> = ({
  activities,
  criticalPath,
  onNodeClick,
  viewMode = 'aon',
}) => {
  // Calculate node positions for visualization
  const nodes = useMemo(() => {
    return activities.map(activity => {
      const isCritical = criticalPath.includes(activity.id);
      const expectedTime = calculateExpectedTime(
        activity.optimistic,
        activity.mostLikely,
        activity.pessimistic
      );

      return {
        ...activity,
        expectedTime,
        isCritical,
      };
    });
  }, [activities, criticalPath]);

  // Simple AON (Activity on Node) visualization
  const renderAON = () => {
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onNodeClick?.(node)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              node.isCritical 
                ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="font-semibold">{node.name}</div>
            <div className="text-sm text-gray-600">
              Duration: {node.expectedTime.toFixed(1)} days
            </div>
            <div className="text-xs mt-2">
              <div>ES: {node.earlyStart}</div>
              <div>EF: {node.earlyFinish}</div>
              <div>LS: {node.lateStart}</div>
              <div>LF: {node.lateFinish}</div>
              <div>Slack: {node.slack?.toFixed(1)}</div>
            </div>
            {node.isCritical && (
              <div className="mt-2 text-xs font-medium text-red-600">
                Critical Path
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Simple AOA (Activity on Arrow) visualization
  const renderAOA = () => {
    // This is a simplified AOA visualization
    // In a real app, you'd want to use a proper graph visualization library
    return (
      <div className="space-y-8">
        {nodes.map((node) => (
          <div key={node.id} className="relative">
            <div className="flex items-center">
              {/* Node */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  node.isCritical ? 'border-red-500' : 'border-gray-400'
                }`}
              >
                {node.id}
              </div>
              
              {/* Arrow */}
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-gray-500">
                    {node.expectedTime.toFixed(1)}d
                  </span>
                  <span className="text-sm font-medium">{node.name}</span>
                </div>
              </div>
              
              {/* Next node */}
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {node.successors?.[0]?.charAt(0) || 'End'}
              </div>
            </div>
            
            {/* Dependencies */}
            {node.predecessors.length > 0 && (
              <div className="text-xs text-gray-500 mt-1 ml-10">
                Depends on: {node.predecessors.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>PERT Network</CardTitle>
            <CardDescription>
              {viewMode === 'aon' ? 'Activity on Node (AON) Diagram' : 'Activity on Arrow (AOA) Diagram'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {}}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'aon' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              AON
            </button>
            <button
              onClick={() => {}}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'aoa' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              AOA
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {viewMode === 'aon' ? renderAON() : renderAOA()}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-500 mr-2"></div>
              <span className="text-sm">Critical Path</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400 mr-2"></div>
              <span className="text-sm">Non-Critical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-100 mr-2"></div>
              <span className="text-sm">Activity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PERTNetwork;

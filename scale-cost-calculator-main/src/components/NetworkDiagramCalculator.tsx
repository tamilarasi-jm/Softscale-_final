import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
  Panel,
  Position,
  Node,
  Edge,
  NodeProps,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';

type Activity = {
  id: string;
  name: string;
  duration: number;
  predecessors: string[];
  es?: number;
  ef?: number;
  ls?: number;
  lf?: number;
  float?: number;
};

type AOAEvent = {
  id: string;
  eet?: number;
  let?: number;
};

type AOAActivity = {
  from: string;
  to: string;
  duration: number;
  name: string;
  totalFloat?: number;
  freeFloat?: number;
};

// Custom Node Component for AON
const AONNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="p-2 border border-gray-300 rounded-md bg-white shadow-sm">
      <div className="text-center font-bold">{data.label}</div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div>ES: {data.es}</div>
        <div>EF: {data.ef}</div>
        <div>LS: {data.ls}</div>
        <div>LF: {data.lf}</div>
        <div className="col-span-2 text-center font-semibold">
          Float: <span className={data.float === 0 ? 'text-red-600 font-bold' : ''}>{data.float}</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Custom Node Component for AOA
const AOAEventNode = ({ data }: NodeProps) => {
  return (
    <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center font-bold">
      {data.label}
    </div>
  );
};

// Custom Edge Component for AOA
const AOAActivityEdge = (props: any) => {
  const { data } = props;
  return (
    <div className="relative">
      <div 
        className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs px-1 rounded ${
          data.isCritical ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}
      >
        {data.label} ({data.duration})
      </div>
      <div 
        className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs ${
          data.totalFloat === 0 ? 'text-red-600 font-bold' : 'text-gray-600'
        }`}
      >
        {data.totalFloat === 0 ? 'Critical' : `Float: ${data.totalFloat}`}
      </div>
    </div>
  );
};

const nodeTypes = {
  aonNode: AONNode,
  aoaEvent: AOAEventNode,
};

const edgeTypes = {
  aoaActivity: AOAActivityEdge,
};

const AONView = ({ activities, onCalculate }: { activities: Activity[], onCalculate: () => void }) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [layoutDirection, setLayoutDirection] = useState('TB'); // TB for top-to-bottom, LR for left-to-right

  // Generate nodes and edges for AON diagram
  const generateAONGraph = useCallback(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Position nodes in a hierarchical layout
    const nodePositions: Record<string, {x: number, y: number}> = {};
    const levels: Record<number, string[]> = {};
    
    // Simple level assignment (can be enhanced with a proper graph algorithm)
    activities.forEach(activity => {
      let level = 0;
      if (activity.predecessors.length > 0) {
        level = Math.max(...activity.predecessors.map(predId => {
          const pred = activities.find(a => a.id === predId);
          return pred ? (nodePositions[predId]?.y || 0) + 1 : 0;
        }));
      }
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(activity.id);
      
      const x = levels[level].length * 200;
      const y = level * 150;
      
      nodePositions[activity.id] = { x, y };
      
      newNodes.push({
        id: activity.id,
        type: 'aonNode',
        position: { x, y },
        data: {
          label: activity.name,
          es: activity.es ?? 0,
          ef: activity.ef ?? 0,
          ls: activity.ls ?? 0,
          lf: activity.lf ?? 0,
          float: activity.float ?? 0,
        },
      });
      
      // Create edges from predecessors
      activity.predecessors.forEach(predId => {
        newEdges.push({
          id: `e${predId}-${activity.id}`,
          source: predId,
          target: activity.id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#3b82f6',
          },
          style: {
            stroke: '#3b82f6',
            strokeWidth: 2,
          },
        });
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [activities, setNodes, setEdges]);

  // Re-generate graph when activities or layout changes
  React.useEffect(() => {
    generateAONGraph();
  }, [activities, layoutDirection, generateAONGraph]);

  return (
    <div className="h-[500px] w-full bg-gray-50 rounded-md border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
      >
        <Controls />
        <Background />
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant={layoutDirection === 'TB' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutDirection('TB')}
          >
            Top to Bottom
          </Button>
          <Button
            variant={layoutDirection === 'LR' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayoutDirection('LR')}
          >
            Left to Right
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const AOAView = ({ activities, onCalculate }: { activities: AOAActivity[], onCalculate: () => void }) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  
  // Generate nodes and edges for AOA diagram
  const generateAOAGraph = useCallback(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Collect all events (nodes)
    const events = new Set<string>();
    activities.forEach(activity => {
      events.add(activity.from);
      events.add(activity.to);
    });
    
    // Position events in a simple layout (can be enhanced)
    const eventPositions: Record<string, {x: number, y: number}> = {};
    const eventList = Array.from(events);
    
    // Simple layout: place events in a line
    eventList.forEach((eventId, index) => {
      eventPositions[eventId] = { x: index * 200, y: 100 };
      
      newNodes.push({
        id: eventId,
        type: 'aoaEvent',
        position: eventPositions[eventId],
        data: { label: eventId },
      });
    });
    
    // Add activities as edges
    activities.forEach((activity, index) => {
      const isCritical = activity.totalFloat === 0;
      
      newEdges.push({
        id: `a${activity.from}-${activity.to}-${index}`,
        source: activity.from,
        target: activity.to,
        type: 'aoaActivity',
        data: {
          label: activity.name,
          duration: activity.duration,
          totalFloat: activity.totalFloat ?? 0,
          isCritical,
        },
        style: {
          stroke: isCritical ? '#ef4444' : '#3b82f6',
          strokeWidth: isCritical ? 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isCritical ? '#ef4444' : '#3b82f6',
        },
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [activities, setNodes, setEdges]);
  
  // Re-generate graph when activities change
  React.useEffect(() => {
    generateAOAGraph();
  }, [activities, generateAOAGraph]);

  return (
    <div className="h-[500px] w-full bg-gray-50 rounded-md border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const NetworkDiagramCalculator = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'A', name: 'A', duration: 3, predecessors: [] },
    { id: 'B', name: 'B', duration: 4, predecessors: ['A'] },
    { id: 'C', name: 'C', duration: 2, predecessors: ['A'] },
    { id: 'D', name: 'D', duration: 5, predecessors: ['B', 'C'] },
  ]);
  
  const [aoaActivities, setAoaActivities] = useState<AOAActivity[]>([
    { from: '1', to: '2', duration: 3, name: 'A' },
    { from: '2', to: '3', duration: 4, name: 'B' },
    { from: '2', to: '4', duration: 2, name: 'C' },
    { from: '3', to: '5', duration: 5, name: 'D' },
    { from: '4', to: '5', duration: 5, name: 'D' },
  ]);

  const [showAON, setShowAON] = useState(true);
  const [showAOA, setShowAOA] = useState(false);

  // AON Calculations
  const calculateAON = () => {
    const updatedActivities = [...activities];
    
    // Forward Pass
    const forwardPass = (activityId: string) => {
      const activity = updatedActivities.find(a => a.id === activityId);
      if (!activity) return;

      if (activity.predecessors.length === 0) {
        activity.es = 0;
        activity.ef = activity.es + activity.duration;
      } else {
        const maxEF = Math.max(
          ...activity.predecessors
            .map(predId => updatedActivities.find(a => a.id === predId)?.ef ?? 0)
        );
        activity.es = maxEF;
        activity.ef = activity.es + activity.duration;
      }

      // Process successors
      const successors = updatedActivities.filter(a => a.predecessors.includes(activityId));
      successors.forEach(successor => forwardPass(successor.id));
    };

    // Find start activities (no predecessors)
    const startActivities = updatedActivities.filter(a => a.predecessors.length === 0);
    startActivities.forEach(activity => forwardPass(activity.id));

    // Backward Pass
    const projectDuration = Math.max(...updatedActivities.map(a => a.ef || 0));
    
    const backwardPass = (activityId: string) => {
      const activity = updatedActivities.find(a => a.id === activityId);
      if (!activity) return;

      const successors = updatedActivities.filter(a => a.predecessors.includes(activityId));
      
      if (successors.length === 0) {
        activity.lf = projectDuration;
        activity.ls = activity.lf - activity.duration;
      } else {
        const minLS = Math.min(
          ...successors.map(succ => succ.ls ?? projectDuration)
        );
        activity.lf = minLS;
        activity.ls = activity.lf - activity.duration;
      }

      // Calculate float
      activity.float = (activity.ls ?? 0) - (activity.es ?? 0);

      // Process predecessors
      activity.predecessors.forEach(predId => {
        const pred = updatedActivities.find(a => a.id === predId);
        if (pred) backwardPass(predId);
      });
    };

    // Find end activities (no successors)
    const endActivities = updatedActivities.filter(activity => {
      return !updatedActivities.some(a => a.predecessors.includes(activity.id));
    });
    endActivities.forEach(activity => backwardPass(activity.id));

    setActivities(updatedActivities);
  };

  // AOA Calculations
  const calculateAOA = () => {
    const events = new Set<string>();
    aoaActivities.forEach(activity => {
      events.add(activity.from);
      events.add(activity.to);
    });

    const eventList = Array.from(events);
    const eventsData: Record<string, AOAEvent> = {};
    eventList.forEach(eventId => {
      eventsData[eventId] = { id: eventId };
    });

    // Forward Pass (EET)
    eventsData['1'].eet = 0; // Assuming '1' is the start event
    
    const processEvent = (eventId: string) => {
      const incomingActivities = aoaActivities.filter(a => a.to === eventId);
      
      let maxEET = 0;
      incomingActivities.forEach(activity => {
        const fromEvent = eventsData[activity.from];
        if (fromEvent.eet === undefined) {
          processEvent(activity.from);
        }
        const eet = (fromEvent.eet || 0) + activity.duration;
        if (eet > maxEET) {
          maxEET = eet;
        }
      });
      
      eventsData[eventId].eet = maxEET;
    };

    // Process all events
    eventList.forEach(eventId => {
      if (eventsData[eventId].eet === undefined) {
        processEvent(eventId);
      }
    });

    // Backward Pass (LET)
    const projectDuration = Math.max(...Object.values(eventsData).map(e => e.eet || 0));
    eventList.forEach(eventId => {
      eventsData[eventId].let = projectDuration;
    });

    const processEventBackward = (eventId: string) => {
      const outgoingActivities = aoaActivities.filter(a => a.from === eventId);
      
      let minLET = projectDuration;
      outgoingActivities.forEach(activity => {
        const toEvent = eventsData[activity.to];
        if (toEvent.let === projectDuration) {
          processEventBackward(activity.to);
        }
        const letValue = (toEvent.let || projectDuration) - activity.duration;
        if (letValue < minLET) {
          minLET = letValue;
        }
      });
      
      if (outgoingActivities.length > 0) {
        eventsData[eventId].let = minLET;
      } else {
        eventsData[eventId].let = eventsData[eventId].eet;
      }
    };

    // Process all events in reverse order
    [...eventList].reverse().forEach(eventId => {
      processEventBackward(eventId);
    });

    // Calculate floats
    const updatedActivities = aoaActivities.map(activity => ({
      ...activity,
      totalFloat: (eventsData[activity.to].let || 0) - (eventsData[activity.from].eet || 0) - activity.duration,
      freeFloat: (eventsData[activity.to].eet || 0) - (eventsData[activity.from].eet || 0) - activity.duration,
    }));

    setAoaActivities(updatedActivities);
  };

  const handleAONCalculate = () => {
    calculateAON();
  };

  const handleAOACalculate = () => {
    calculateAOA();
  };

  const toggleView = (view: 'AON' | 'AOA') => {
    if (view === 'AON') {
      setShowAON(true);
      setShowAOA(false);
    } else {
      setShowAON(false);
      setShowAOA(true);
    }
  };

  // Main component render
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Network Diagram Calculator</h1>
      
      <div className="flex space-x-4 mb-6">
        <Button 
          variant={showAON ? "default" : "outline"}
          onClick={() => toggleView('AON')}
        >
          AON (Activity on Node)
        </Button>
        <Button 
          variant={showAOA ? "default" : "outline"}
          onClick={() => toggleView('AOA')}
        >
          AOA (Activity on Arrow)
        </Button>
      </div>

<div className="space-y-6">
        {showAON && (
          <Card>
            <CardHeader>
              <CardTitle>AON Diagram</CardTitle>
              <CardDescription>Interactive Activity on Node diagram showing the critical path</CardDescription>
            </CardHeader>
            <CardContent>
              <AONView activities={activities} onCalculate={handleAONCalculate} />
            </CardContent>
          </Card>
        )}
        
        {showAON && (
          <Card>
          <CardHeader>
            <CardTitle>Activity on Node (AON) Calculator</CardTitle>
            <CardDescription>
              Enter activity details and calculate ES, EF, LS, LF, and Float
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 font-medium">
                <div>Activity</div>
                <div>Duration</div>
                <div>Predecessors (comma-separated)</div>
                <div>Actions</div>
              </div>
              
              {activities.map((activity, index) => (
                <div key={activity.id} className="grid grid-cols-4 gap-4 items-center">
                  <Input
                    value={activity.name}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[index] = { ...activity, name: e.target.value };
                      setActivities(newActivities);
                    }}
                  />
                  <Input
                    type="number"
                    value={activity.duration}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[index] = { ...activity, duration: parseInt(e.target.value) || 0 };
                      setActivities(newActivities);
                    }}
                  />
                  <Input
                    value={activity.predecessors.join(',')}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[index] = { 
                        ...activity, 
                        predecessors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                      };
                      setActivities(newActivities);
                    }}
                    placeholder="A,B,C"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newActivities = activities.filter((_, i) => i !== index);
                      setActivities(newActivities);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => {
                  const newId = String.fromCharCode(65 + activities.length);
                  setActivities([
                    ...activities,
                    { id: newId, name: newId, duration: 1, predecessors: [] },
                  ]);
                }}
              >
                Add Activity
              </Button>

              <Button onClick={handleAONCalculate} className="ml-4">
                Calculate AON
              </Button>

              {activities[0]?.es !== undefined && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Results</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>ES</TableHead>
                        <TableHead>EF</TableHead>
                        <TableHead>LS</TableHead>
                        <TableHead>LF</TableHead>
                        <TableHead>Float</TableHead>
                        <TableHead>Critical?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow 
                          key={activity.id}
                          className={activity.float === 0 ? 'bg-yellow-50' : ''}
                        >
                          <TableCell>{activity.name}</TableCell>
                          <TableCell>{activity.duration}</TableCell>
                          <TableCell>{activity.es}</TableCell>
                          <TableCell>{activity.ef}</TableCell>
                          <TableCell>{activity.ls}</TableCell>
                          <TableCell>{activity.lf}</TableCell>
                          <TableCell>{activity.float}</TableCell>
                          <TableCell>{activity.float === 0 ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

{showAOA && (
          <Card>
            <CardHeader>
              <CardTitle>AOA Diagram</CardTitle>
              <CardDescription>Interactive Activity on Arrow diagram showing events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AOAView activities={aoaActivities} onCalculate={handleAOACalculate} />
            </CardContent>
          </Card>
        )}
        
        {showAOA && (
          <Card>
          <CardHeader>
            <CardTitle>Activity on Arrow (AOA) Calculator</CardTitle>
            <CardDescription>
              Enter activity details and calculate EET, LET, and Floats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 font-medium">
                <div>Activity</div>
                <div>From Event</div>
                <div>To Event</div>
                <div>Duration</div>
                <div>Actions</div>
              </div>
              
              {aoaActivities.map((activity, index) => (
                <div key={`${activity.from}-${activity.to}`} className="grid grid-cols-5 gap-4 items-center">
                  <Input
                    value={activity.name}
                    onChange={(e) => {
                      const newActivities = [...aoaActivities];
                      newActivities[index] = { ...activity, name: e.target.value };
                      setAoaActivities(newActivities);
                    }}
                  />
                  <Input
                    value={activity.from}
                    onChange={(e) => {
                      const newActivities = [...aoaActivities];
                      newActivities[index] = { ...activity, from: e.target.value };
                      setAoaActivities(newActivities);
                    }}
                  />
                  <Input
                    value={activity.to}
                    onChange={(e) => {
                      const newActivities = [...aoaActivities];
                      newActivities[index] = { ...activity, to: e.target.value };
                      setAoaActivities(newActivities);
                    }}
                  />
                  <Input
                    type="number"
                    value={activity.duration}
                    onChange={(e) => {
                      const newActivities = [...aoaActivities];
                      newActivities[index] = { 
                        ...activity, 
                        duration: parseInt(e.target.value) || 0 
                      };
                      setAoaActivities(newActivities);
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newActivities = aoaActivities.filter((_, i) => i !== index);
                      setAoaActivities(newActivities);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    const newActivity = {
                      name: `Activity ${aoaActivities.length + 1}`,
                      from: '1',
                      to: '2',
                      duration: 1,
                    };
                    setAoaActivities([...aoaActivities, newActivity]);
                  }}
                >
                  Add Activity
                </Button>

                <Button onClick={handleAOACalculate}>
                  Calculate AOA
                </Button>
              </div>

              {aoaActivities[0]?.totalFloat !== undefined && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Results</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>From Event</TableHead>
                        <TableHead>To Event</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Total Float</TableHead>
                        <TableHead>Free Float</TableHead>
                        <TableHead>Critical?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aoaActivities.map((activity, index) => (
                        <TableRow 
                          key={`${activity.from}-${activity.to}-${index}`}
                          className={activity.totalFloat === 0 ? 'bg-yellow-50' : ''}
                        >
                          <TableCell>{activity.name}</TableCell>
                          <TableCell>{activity.from}</TableCell>
                          <TableCell>{activity.to}</TableCell>
                          <TableCell>{activity.duration}</TableCell>
                          <TableCell>{activity.totalFloat}</TableCell>
                          <TableCell>{activity.freeFloat}</TableCell>
                          <TableCell>{activity.totalFloat === 0 ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Table, GanttChart as GanttChartIcon, Network } from 'lucide-react';
import { Activity } from './types';
import { calculatePERT, convertToGanttTasks, calculateExpectedTime } from './utils/pertCalculations';
import PERTNetwork from './components/PERTNetwork';
import { GanttChart } from './components/GanttChart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample initial data
const getDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

const getDefaultDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const initialActivities: Activity[] = [
  {
    id: 'A',
    name: 'Requirements',
    optimistic: 5,
    mostLikely: 7,
    pessimistic: 9,
    predecessors: [],
    progress: 30,
    riskLevel: 'medium',
    startDate: getDefaultDate(0),
    endDate: getDefaultDate(7),
    duration: 7
  },
  {
    id: 'B',
    name: 'Design',
    optimistic: 10,
    mostLikely: 14,
    pessimistic: 18,
    predecessors: ['A'],
    progress: 10,
    riskLevel: 'high',
    startDate: getDefaultDate(7),
    endDate: getDefaultDate(21),
    duration: 14
  },
  {
    id: 'C',
    name: 'Development',
    optimistic: 15,
    mostLikely: 20,
    pessimistic: 25,
    predecessors: ['B'],
    progress: 5,
    riskLevel: 'high',
    startDate: getDefaultDate(21),
    endDate: getDefaultDate(41),
    duration: 20
  },
  {
    id: 'D',
    name: 'Testing',
    optimistic: 8,
    mostLikely: 10,
    pessimistic: 12,
    predecessors: ['C'],
    progress: 0,
    riskLevel: 'medium',
    startDate: getDefaultDate(41),
    endDate: getDefaultDate(51),
    duration: 10
  },
  {
    id: 'E',
    name: 'Deployment',
    optimistic: 3,
    mostLikely: 4,
    pessimistic: 5,
    predecessors: ['D'],
    progress: 0,
    riskLevel: 'low',
    startDate: getDefaultDate(51),
    endDate: getDefaultDate(55),
    duration: 4
  },
];

const SchedulingPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activeTab, setActiveTab] = useState('pert');
  const [pertResult, setPertResult] = useState(calculatePERT(activities));
  const [ganttTasks, setGanttTasks] = useState(convertToGanttTasks(activities));
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    id: '',
    name: '',
    optimistic: 0,
    mostLikely: 0,
    pessimistic: 0,
    predecessors: [],
    progress: 0,
    riskLevel: 'medium',
    startDate: getDefaultDate(0),
    endDate: getDefaultDate(7),
    duration: 7
  });

  // Recalculate PERT and Gantt when activities change
  useEffect(() => {
    const result = calculatePERT(activities);
    setPertResult(result);
    setGanttTasks(convertToGanttTasks(activities));
  }, [activities]);

  const handleAddActivity = () => {
    if (
      !newActivity.id || 
      !newActivity.name || 
      !newActivity.mostLikely ||
      !newActivity.optimistic ||
      !newActivity.pessimistic
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate that the ID is unique
    if (activities.some(act => act.id === newActivity.id)) {
      alert('Activity ID must be unique');
      return;
    }

    // Add the new activity
    setActivities([
      ...activities,
      {
        id: newActivity.id,
        name: newActivity.name || `Activity ${activities.length + 1}`,
        optimistic: newActivity.optimistic || 0,
        mostLikely: newActivity.mostLikely || 0,
        pessimistic: newActivity.pessimistic || 0,
        predecessors: newActivity.predecessors || [],
        progress: newActivity.progress || 0,
        riskLevel: newActivity.riskLevel || 'medium',
      } as Activity
    ]);

    // Reset the form
    setNewActivity({
      id: '',
      name: '',
      optimistic: 0,
      mostLikely: 0,
      pessimistic: 0,
      predecessors: [],
      progress: 0,
      riskLevel: 'medium',
    });
    
    setIsAddingActivity(false);
  };

  const handleActivityUpdate = (id: string, updates: Partial<Activity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
    // You can implement edit functionality here
  };

  const handleNodeClick = (activity: Activity) => {
    console.log('Node clicked:', activity);
    // You can implement edit functionality here
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Scheduling</h1>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pert" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pert">
            <Network className="w-4 h-4 mr-2" />
            PERT Analysis
          </TabsTrigger>
          <TabsTrigger value="gantt">
            <GanttChartIcon className="w-4 h-4 mr-2" />
            Gantt Chart
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="pert">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">PERT Analysis</h2>
                      <p className="text-gray-600 mt-1">
                        Program Evaluation and Review Technique (PERT) helps analyze and represent the tasks involved in completing a project.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button onClick={() => setIsAddingActivity(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-700">Project Duration</div>
                      <div className="text-2xl font-bold text-blue-600">{pertResult.totalDuration.toFixed(1)} days</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-700">Critical Path</div>
                      <div className="text-2xl font-bold text-red-600">
                        {pertResult.criticalPath.length} activities
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-700">Total Activities</div>
                      <div className="text-2xl font-bold text-green-600">{activities.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Network Diagram</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-500 mr-1.5"></div>
                      <span>Critical Path</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-400 mr-1.5"></div>
                      <span>Non-Critical</span>
                    </div>
                  </div>
                </div>
              </div>

              {isAddingActivity && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityId">Activity ID *</Label>
                        <Input
                          id="activityId"
                          value={newActivity.id}
                          onChange={(e) => setNewActivity({...newActivity, id: e.target.value})}
                          placeholder="E.g., A, B, C"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityName">Activity Name *</Label>
                        <Input
                          id="activityName"
                          value={newActivity.name || ''}
                          onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                          placeholder="E.g., Requirements, Design, Development"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="predecessors">Predecessors (comma separated)</Label>
                        <Input
                          id="predecessors"
                          value={newActivity.predecessors?.join(', ') || ''}
                          onChange={(e) => {
                            const predecessors = e.target.value
                              .split(',')
                              .map(id => id.trim())
                              .filter(id => id);
                            setNewActivity({...newActivity, predecessors});
                          }}
                          placeholder="E.g., A, B, C"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newActivity.startDate || ''}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                startDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newActivity.endDate || ''}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                endDate: e.target.value,
                              })
                            }
                            min={newActivity.startDate}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="optimistic">Optimistic (days)</Label>
                          <Input
                            id="optimistic"
                            type="number"
                            value={newActivity.optimistic || 0}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                optimistic: parseFloat(e.target.value) || 0,
                              })
                            }
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mostLikely">Most Likely (days)</Label>
                          <Input
                            id="mostLikely"
                            type="number"
                            value={newActivity.mostLikely || 0}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                mostLikely: parseFloat(e.target.value) || 0,
                              })
                            }
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pessimistic">Pessimistic (days)</Label>
                          <Input
                            id="pessimistic"
                            type="number"
                            value={newActivity.pessimistic || 0}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                pessimistic: parseFloat(e.target.value) || 0,
                              })
                            }
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="progress">Progress (%)</Label>
                          <Input
                            id="progress"
                            type="number"
                            value={newActivity.progress || 0}
                            onChange={(e) =>
                              setNewActivity({
                                ...newActivity,
                                progress: parseInt(e.target.value) || 0,
                              })
                            }
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingActivity(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddActivity}>
                        Add Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <PERTNetwork 
                activities={pertResult.activities} 
                criticalPath={pertResult.criticalPath}
                onNodeClick={handleNodeClick}
                viewMode="aon"
              />

              <Card>
                <CardHeader>
                  <CardTitle>Critical Path Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total Project Duration: <span className="font-semibold">{pertResult.totalDuration.toFixed(1)} days</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Critical Path:</p>
                    <div className="flex flex-wrap gap-2">
                      {pertResult.criticalPath.map((activityId, index) => {
                        const activity = pertResult.activities.find(a => a.id === activityId);
                        return (
                          <React.Fragment key={activityId}>
                            {index > 0 && <span className="text-gray-400">→</span>}
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {activity?.name} ({activityId})
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gantt">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gantt Chart</h2>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Table className="w-4 h-4 mr-2" />
                    Export as Table
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export as Image
                  </Button>
                </div>
              </div>

              <GanttChart 
                tasks={ganttTasks} 
                onTaskClick={handleTaskClick} 
              />

              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pertResult.activities.map((activity) => (
                          <tr 
                            key={activity.id}
                            className={`hover:bg-gray-50 cursor-pointer ${activity.isCritical ? 'bg-red-50' : ''}`}
                            onClick={() => handleNodeClick(activity)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {activity.earlyStart?.toFixed(1)} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {activity.earlyFinish?.toFixed(1)} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {calculateExpectedTime(
                                  activity.optimistic,
                                  activity.mostLikely,
                                  activity.pessimistic
                                ).toFixed(1)} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${activity.progress || 0}%` }}
                                ></div>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">{activity.progress || 0}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                activity.riskLevel === 'high' 
                                  ? 'bg-red-100 text-red-800' 
                                  : activity.riskLevel === 'low' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {activity.riskLevel?.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SchedulingPage;

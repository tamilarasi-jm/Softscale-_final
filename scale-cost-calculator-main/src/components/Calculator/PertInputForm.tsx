import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, Plus, RotateCcw, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PertTask {
  id: string;
  taskName: string;
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
  dependencies: string[];
  expectedTime: number;
  variance: number;
}

interface PertInputFormProps {
  tasks: PertTask[];
  onTasksChange: (tasks: PertTask[]) => void;
}

export default function PertInputForm({ tasks, onTasksChange }: PertInputFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    taskName: '',
    optimistic: 0,
    mostLikely: 0,
    pessimistic: 0,
    dependencies: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.taskName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Task name is required',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.optimistic > formData.mostLikely || formData.mostLikely > formData.pessimistic) {
      toast({
        title: 'Validation Error',
        description: 'Values must satisfy: Optimistic ≤ Most Likely ≤ Pessimistic',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const calculateMetrics = () => {
    const { optimistic, mostLikely, pessimistic } = formData;
    const expectedTime = (optimistic + 4 * mostLikely + pessimistic) / 6;
    const variance = Math.pow((pessimistic - optimistic) / 6, 2);
    return { expectedTime, variance };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { expectedTime, variance } = calculateMetrics();
    const newTask: PertTask = {
      id: editingId || `task-${Date.now()}`,
      ...formData,
      expectedTime,
      variance,
    };

    if (editingId) {
      onTasksChange(tasks.map(task => task.id === editingId ? newTask : task));
      toast({ title: 'Task Updated', description: 'Task has been updated successfully' });
      setEditingId(null);
    } else {
      onTasksChange([...tasks, newTask]);
      toast({ title: 'Task Added', description: 'Task has been added successfully' });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      taskName: '',
      optimistic: 0,
      mostLikely: 0,
      pessimistic: 0,
      dependencies: [],
    });
    setEditingId(null);
  };

  const handleEdit = (task: PertTask) => {
    setFormData({
      taskName: task.taskName,
      optimistic: task.optimistic,
      mostLikely: task.mostLikely,
      pessimistic: task.pessimistic,
      dependencies: task.dependencies,
    });
    setEditingId(task.id);
  };

  const handleDelete = (id: string) => {
    onTasksChange(tasks.filter(task => task.id !== id));
    toast({ title: 'Task Deleted', description: 'Task has been removed' });
  };

  const loadSampleData = () => {
    const sampleTasks: PertTask[] = [
      {
        id: 'A',
        taskName: 'Requirements Analysis',
        optimistic: 3,
        mostLikely: 5,
        pessimistic: 8,
        dependencies: [],
        expectedTime: 5.17,
        variance: 0.69,
      },
      {
        id: 'B',
        taskName: 'System Design',
        optimistic: 5,
        mostLikely: 7,
        pessimistic: 10,
        dependencies: ['A'],
        expectedTime: 7.17,
        variance: 0.69,
      },
      {
        id: 'C',
        taskName: 'Development',
        optimistic: 10,
        mostLikely: 18,
        pessimistic: 25,
        dependencies: ['B'],
        expectedTime: 17.83,
        variance: 6.25,
      },
      {
        id: 'D',
        taskName: 'Testing',
        optimistic: 5,
        mostLikely: 8,
        pessimistic: 12,
        dependencies: ['C'],
        expectedTime: 8.17,
        variance: 1.36,
      },
      {
        id: 'E',
        taskName: 'Deployment',
        optimistic: 2,
        mostLikely: 4,
        pessimistic: 6,
        dependencies: ['D'],
        expectedTime: 4,
        variance: 0.44,
      },
    ];
    onTasksChange(sampleTasks);
    toast({ title: 'Sample Data Loaded', description: '5 sample tasks have been added' });
  };

  const clearAll = () => {
    onTasksChange([]);
    resetForm();
    toast({ title: 'Cleared', description: 'All tasks have been removed' });
  };

  const { expectedTime, variance } = formData.optimistic || formData.mostLikely || formData.pessimistic 
    ? calculateMetrics() 
    : { expectedTime: 0, variance: 0 };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Task' : 'Add New Task'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name *</Label>
              <Input
                id="taskName"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                placeholder="e.g., Requirements Analysis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependencies">Dependencies</Label>
              <Select
                value={formData.dependencies[0] || ''}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  dependencies: value ? [value] : [] 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dependency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.taskName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="optimistic">Optimistic (O) *</Label>
              <Input
                id="optimistic"
                type="number"
                min="0"
                step="0.1"
                value={formData.optimistic}
                onChange={(e) => setFormData({ ...formData, optimistic: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mostLikely">Most Likely (M) *</Label>
              <Input
                id="mostLikely"
                type="number"
                min="0"
                step="0.1"
                value={formData.mostLikely}
                onChange={(e) => setFormData({ ...formData, mostLikely: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pessimistic">Pessimistic (P) *</Label>
              <Input
                id="pessimistic"
                type="number"
                min="0"
                step="0.1"
                value={formData.pessimistic}
                onChange={(e) => setFormData({ ...formData, pessimistic: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Expected Time (Te)</div>
              <div className="text-2xl font-bold text-primary">{expectedTime.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Variance</div>
              <div className="text-2xl font-bold text-primary">{variance.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {editingId ? 'Update Task' : 'Add Task'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={loadSampleData} className="flex-1">
            <Database className="w-4 h-4 mr-2" />
            Load Sample Data
          </Button>
          <Button variant="outline" onClick={clearAll} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </Card>

      {/* Task Table */}
      {tasks.length > 0 && (
        <Card className="p-6 bg-card/95 backdrop-blur border-border/50">
          <h3 className="text-xl font-semibold mb-4">Tasks Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold">Task</th>
                  <th className="text-center p-2 font-semibold">O</th>
                  <th className="text-center p-2 font-semibold">M</th>
                  <th className="text-center p-2 font-semibold">P</th>
                  <th className="text-left p-2 font-semibold">Dependencies</th>
                  <th className="text-center p-2 font-semibold">Te</th>
                  <th className="text-center p-2 font-semibold">Variance</th>
                  <th className="text-center p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="p-2 font-medium">{task.taskName}</td>
                    <td className="text-center p-2">{task.optimistic}</td>
                    <td className="text-center p-2">{task.mostLikely}</td>
                    <td className="text-center p-2">{task.pessimistic}</td>
                    <td className="p-2">
                      {task.dependencies.length > 0 
                        ? task.dependencies.map(dep => 
                            tasks.find(t => t.id === dep)?.taskName || dep
                          ).join(', ')
                        : 'None'}
                    </td>
                    <td className="text-center p-2 font-semibold text-primary">{task.expectedTime.toFixed(2)}</td>
                    <td className="text-center p-2 font-semibold text-primary">{task.variance.toFixed(2)}</td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

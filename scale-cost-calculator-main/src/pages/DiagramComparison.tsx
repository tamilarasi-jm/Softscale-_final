import React, { useState, useRef, useEffect } from 'react';
import { Info, Download, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AOADiagram } from '@/components/DiagramComparison/AOADiagram';
import { AONDiagram } from '@/components/DiagramComparison/AONDiagram';
import { ComparisonModal } from '@/components/DiagramComparison/ComparisonModal';
import { useToast } from '@/hooks/use-toast';
import { calculateAON, calculateAOA, Activity, AOAEvent, AOAActivity } from '@/utils/networkCalculations';

type ViewMode = 'both' | 'aoa' | 'aon';

type ActivityInput = {
  id: string;
  name: string;
  duration: number;
  predecessors: string;
  description?: string;
};

export default function DiagramComparison() {
  console.log('DiagramComparison component rendering...');
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Debug mount
  useEffect(() => {
    console.log('DiagramComparison mounted');
    return () => {
      console.log('DiagramComparison unmounting');
    };
  }, []);

  const aoaDiagramRef = useRef<HTMLDivElement>(null);
  const aonDiagramRef = useRef<HTMLDivElement>(null);

  // Input state
  const [activities, setActivities] = useState<ActivityInput[]>([
    { id: 'A', name: 'A', duration: 3, predecessors: '', description: 'Start' },
    { id: 'B', name: 'B', duration: 4, predecessors: 'A', description: 'Design' },
    { id: 'C', name: 'C', duration: 3, predecessors: 'A', description: 'Plan' },
    { id: 'D', name: 'D', duration: 5, predecessors: 'B', description: 'Build' },
    { id: 'E', name: 'E', duration: 4, predecessors: 'C', description: 'Review' },
    { id: 'F', name: 'F', duration: 2, predecessors: 'D,E', description: 'Deploy' },
  ]);

  // Calculated data
  const [aonData, setAonData] = useState<Activity[]>([]);
  const [aoaData, setAoaData] = useState<{
    events: AOAEvent[];
    activities: AOAActivity[];
    projectDuration: number;
  }>({ events: [], activities: [], projectDuration: 0 });

  // Calculate AON and AOA data when activities change
  useEffect(() => {
    console.log('Activities changed, recalculating...', activities);
    try {
      // Convert input to AON format
      const aonActivities = activities.map(act => ({
        id: act.id,
        name: act.name,
        duration: act.duration,
        predecessors: act.predecessors.split(',').filter(Boolean).map(p => p.trim()),
        description: act.description
      }));

      // Calculate AON
      const aonResult = calculateAON(aonActivities);
      console.log('AON Calculation Result:', aonResult);
      setAonData(aonResult);

      try {
        // Convert to AOA format
        const aoaActivities: AOAActivity[] = aonActivities.map(act => ({
          id: act.id,
          name: act.name,
          duration: act.duration,
          from: act.predecessors[0] || '1',
          to: act.id === 'A' ? '2' : (parseInt(act.id) + 1).toString()
        }));
        
        const aoaResult = calculateAOA(aoaActivities);
        console.log('AOA Result:', aoaResult);
        setAoaData(aoaResult);
      } catch (error) {
        console.error('Error in AOA calculation:', error);
        toast({
          title: 'Error',
          description: 'Failed to calculate AOA diagram. Please check your activity dependencies.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in calculations:', error);
      toast({
        title: 'Calculation Error',
        description: 'There was an error calculating the network diagram. Please check your inputs.',
        variant: 'destructive',
      });
    }
  }, [activities, toast]);

  // Handle activity changes
  const handleActivityChange = (index: number, field: keyof ActivityInput, value: string | number) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  // Add new activity
  const addActivity = () => {
    const newId = String.fromCharCode(65 + activities.length); // A, B, C, ...
    setActivities([
      ...activities,
      { id: newId, name: newId, duration: 1, predecessors: '', description: '' }
    ]);
  };

  // Remove activity
  const removeActivity = (index: number) => {
    if (activities.length <= 1) return;
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const handleExport = async (type: 'aoa' | 'aon' | 'both') => {
    try {
      const exportDiagram = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
        if (!ref.current) return;
        
        const svgElement = ref.current.querySelector('svg');
        if (!svgElement) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = svgElement.clientWidth * 2;
          canvas.height = svgElement.clientHeight * 2;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob(blob => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `${name}-diagram-${new Date().getTime()}.png`;
              link.href = URL.createObjectURL(blob);
              link.click();
              URL.revokeObjectURL(link.href);
            }
          });
          URL.revokeObjectURL(url);
        };
        img.src = url;
      };

      if (type === 'both' || type === 'aoa') {
        await exportDiagram(aoaDiagramRef, 'aoa');
      }
      if (type === 'both' || type === 'aon') {
        await exportDiagram(aonDiagramRef, 'aon');
      }

      toast({
        title: "Export Successful",
        description: `Diagram(s) exported as PNG successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the diagram.",
        variant: "destructive",
      });
    }
  };

  // Toggle view mode
  const toggleViewMode = (mode: ViewMode) => setViewMode(mode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold gradient-text">
              AOA vs AON Network Diagram Calculator
            </CardTitle>
            <CardDescription>
              Input your activities and visualize both AOA and AON network diagrams with automatic calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={viewMode === 'both' ? 'default' : 'outline'}
                onClick={() => toggleViewMode('both')}
                className={viewMode === 'both' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Both Diagrams
              </Button>
              <Button
                variant={viewMode === 'aoa' ? 'default' : 'outline'}
                onClick={() => toggleViewMode('aoa')}
                className={viewMode === 'aoa' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                AOA Diagram
              </Button>
              <Button
                variant={viewMode === 'aon' ? 'default' : 'outline'}
                onClick={() => toggleViewMode('aon')}
                className={viewMode === 'aon' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                AON Diagram
              </Button>
              
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => addActivity()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Info className="w-4 h-4 mr-2" />
                  Formulas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Enter activity information and dependencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Predecessors (comma separated)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={activity.id}
                          onChange={(e) => handleActivityChange(index, 'id', e.target.value)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={activity.name}
                          onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={activity.description || ''}
                          onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={activity.duration}
                          onChange={(e) => handleActivityChange(index, 'duration', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={activity.predecessors}
                          onChange={(e) => handleActivityChange(index, 'predecessors', e.target.value)}
                          placeholder="A,B,C"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeActivity(index)}
                          disabled={activities.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Calculated Values</CardTitle>
            <CardDescription>Calculated values based on your inputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>ES</TableHead>
                    <TableHead>EF</TableHead>
                    <TableHead>LS</TableHead>
                    <TableHead>LF</TableHead>
                    <TableHead>Float</TableHead>
                    <TableHead>Critical?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aonData.map((activity, index) => (
                    <TableRow 
                      key={index}
                      className={activity.isCritical ? 'bg-red-50' : ''}
                    >
                      <TableCell className="font-medium">{activity.id}</TableCell>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell>{activity.es}</TableCell>
                      <TableCell>{activity.ef}</TableCell>
                      <TableCell>{activity.ls}</TableCell>
                      <TableCell>{activity.lf}</TableCell>
                      <TableCell className={activity.isCritical ? 'font-bold text-red-600' : ''}>
                        {activity.float}
                        {activity.isCritical && ' (Critical)'}
                      </TableCell>
                      <TableCell>{activity.isCritical ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Diagrams Display */}
        <div className={`grid gap-6 ${viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {(viewMode === 'both' || viewMode === 'aoa') && (
            <Card ref={aoaDiagramRef}>
              <CardHeader>
                <CardTitle className="text-blue-900">AOA (Activity on Arrow)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Project Duration: {aoaData.projectDuration} days | 
                  Critical Path: {aoaData.activities.filter(a => a.isCritical).map(a => a.name).join(' → ')}
                </p>
              </CardHeader>
              <CardContent>
                <AOADiagram 
                  events={aoaData.events || []} 
                  activities={aoaData.activities || []} 
                />
              </CardContent>
            </Card>
          )}

          {(viewMode === 'both' || viewMode === 'aon') && (
            <Card ref={aonDiagramRef}>
              <CardHeader>
                <CardTitle className="text-green-900">AON (Activity on Node)</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Project Duration: {Math.max(...aonData.map(a => a.ef || 0))} days | 
                  Critical Path: {aonData.filter(a => a.isCritical).map(a => a.name).join(' → ')}
                </p>
              </CardHeader>
              <CardContent>
                <AONDiagram 
                  activities={aonData.map(activity => ({
                    ...activity,
                    label: activity.name,
                    description: '', // Default empty description since it's not in the Activity type
                    x: 0, // These should be calculated based on layout
                    y: 0  // These should be calculated based on layout
                  }))} 
                  isEditMode={false}
                  onActivityClick={() => {}}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Info Modal */}
      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
} 

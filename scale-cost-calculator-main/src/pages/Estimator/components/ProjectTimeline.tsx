import { useState, useEffect } from 'react';
import { ProjectPhase, ProjectTemplate } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GanttChartSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectTimelineProps {
  templates: ProjectTemplate[];
  phases: ProjectPhase[];
  onPhasesChange: (phases: ProjectPhase[]) => void;
  onTemplateSelect: (template: ProjectTemplate) => void;
}

export const ProjectTimeline = ({
  templates,
  phases,
  onPhasesChange,
  onTemplateSelect,
}: ProjectTimelineProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleAddPhase = () => {
    const newPhase: ProjectPhase = {
      id: `phase-${Date.now()}`,
      name: '',
      duration: 1,
      dependencies: [],
    };
    onPhasesChange([...phases, newPhase]);
  };

  const handleRemovePhase = (id: string) => {
    onPhasesChange(phases.filter(phase => phase.id !== id));
    
    // Remove this phase from any dependencies
    onPhasesChange(phases.map(phase => ({
      ...phase,
      dependencies: phase.dependencies.filter(depId => depId !== id)
    })));
  };

  const handlePhaseChange = (id: string, field: keyof ProjectPhase, value: any) => {
    onPhasesChange(
      phases.map(phase =>
        phase.id === id ? { ...phase, [field]: value } : phase
      )
    );
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      onTemplateSelect(template);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Project Timeline</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAddPhase}>
              <Plus className="h-4 w-4 mr-1" /> Add Phase
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <div key={phase.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor={`phase-name-${phase.id}`}>Phase Name</Label>
                    <Input
                      id={`phase-name-${phase.id}`}
                      value={phase.name}
                      onChange={(e) =>
                        handlePhaseChange(phase.id, 'name', e.target.value)
                      }
                      placeholder="E.g., Design, Development, Testing"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`duration-${phase.id}`}>Duration (days)</Label>
                      <Input
                        id={`duration-${phase.id}`}
                        type="number"
                        min="1"
                        value={phase.duration}
                        onChange={(e) =>
                          handlePhaseChange(phase.id, 'duration', parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                    <div>
                      <Label>Depends On</Label>
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !phase.dependencies.includes(value)) {
                            handlePhaseChange(phase.id, 'dependencies', [...phase.dependencies, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dependency" />
                        </SelectTrigger>
                        <SelectContent>
                          {phases
                            .filter(p => p.id !== phase.id && !phase.dependencies.includes(p.id))
                            .map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name || `Phase ${phases.indexOf(p) + 1}`}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {phase.dependencies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {phase.dependencies.map(depId => {
                        const depPhase = phases.find(p => p.id === depId);
                        if (!depPhase) return null;
                        return (
                          <span
                            key={depId}
                            className="inline-flex items-center px-2 py-1 text-xs rounded bg-accent text-accent-foreground"
                          >
                            {depPhase.name || `Phase ${phases.findIndex(p => p.id === depId) + 1}`}
                            <button
                              type="button"
                              onClick={() =>
                                handlePhaseChange(
                                  phase.id,
                                  'dependencies',
                                  phase.dependencies.filter(id => id !== depId)
                                )
                              }
                              className="ml-1.5 text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemovePhase(phase.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {phases.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <GanttChartSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No phases added</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first phase or select a template.
              </p>
              <Button className="mt-4" onClick={handleAddPhase}>
                <Plus className="h-4 w-4 mr-2" /> Add Phase
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

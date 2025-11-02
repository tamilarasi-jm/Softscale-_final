import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ToolSelector } from './components/ToolSelector';
import { ProjectTimeline } from './components/ProjectTimeline';
import { GanttChart } from './components/GanttChart';
import { TOOLS, PROJECT_TEMPLATES } from './data';
import { Tool, ProjectPhase, ProjectTemplate } from './types';

export const EstimatorPage = () => {
  // State for tools selection
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  
  // State for project phases
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  
  // Calculate costs
  const { baseCost, overhead, totalMonthlyCost } = useMemo(() => {
    const base = selectedTools.reduce((sum, tool) => sum + tool.monthlyPriceUSD, 0);
    const overhead = selectedTools.length > 3 ? base * 0.1 : 0;
    const total = base + overhead;
    
    return {
      baseCost: parseFloat(base.toFixed(2)),
      overhead: parseFloat(overhead.toFixed(2)),
      totalMonthlyCost: parseFloat(total.toFixed(2)),
    };
  }, [selectedTools]);
  
  // Calculate project duration in weeks
  const projectDurationWeeks = useMemo(() => {
    if (phases.length === 0) return 0;
    const totalDays = phases.reduce((max, phase) => {
      const endDay = (phase.startDate ? 0 : 0) + (phase.duration || 0);
      return Math.max(max, endDay);
    }, 0);
    return Math.ceil(totalDays / 7);
  }, [phases]);
  
  // Calculate total project cost
  const totalProjectCost = useMemo(() => {
    const months = projectDurationWeeks / 4.345; // Average weeks per month
    return parseFloat((totalMonthlyCost * months).toFixed(2));
  }, [totalMonthlyCost, projectDurationWeeks]);
  
  // Handle template selection
  const handleTemplateSelect = (template: ProjectTemplate) => {
    setPhases(JSON.parse(JSON.stringify(template.phases)));
  };
  
  // Export to PDF
  const handleExportPDF = () => {
    // Implementation for PDF export
    alert('Export to PDF functionality will be implemented here');
  };
  
  // Export to CSV
  const handleExportCSV = () => {
    // Implementation for CSV export
    alert('Export to CSV functionality will be implemented here');
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SoftScale</h1>
          <p className="text-muted-foreground">
            Measure. Predict. Compare. Get precise project estimates for cost and timeline.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="cost" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cost">Cost Estimator</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Planner</TabsTrigger>
          <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cost" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ToolSelector 
                tools={TOOLS} 
                selectedTools={selectedTools}
                onSelectionChange={setSelectedTools}
              />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Base Tool Costs:</span>
                      <span>${baseCost}/mo</span>
                    </div>
                    {overhead > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Multi-tool Overhead (10%):</span>
                        <span className="text-amber-500">+${overhead}/mo</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Monthly Total:</span>
                        <span>${totalMonthlyCost}/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Project Duration:</span>
                      <span>{projectDurationWeeks} weeks</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Estimated Project Cost:</span>
                      <span className="text-primary">${totalProjectCost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on {Math.round(projectDurationWeeks / 4.345)} months of tool usage
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Selected Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedTools.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tools selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedTools.map(tool => (
                        <div key={tool.id} className="flex justify-between items-center p-2 rounded-md hover:bg-accent">
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.category}</p>
                          </div>
                          <span className="font-medium">${tool.monthlyPriceUSD}/mo</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <ProjectTimeline
            templates={PROJECT_TEMPLATES}
            phases={phases}
            onPhasesChange={setPhases}
            onTemplateSelect={handleTemplateSelect}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                {phases.length} phases • {projectDurationWeeks} weeks • ${totalProjectCost} estimated cost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Project Duration</h3>
                  <p className="text-2xl font-bold">{projectDurationWeeks} weeks</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(projectDurationWeeks / 4.345)} months
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Monthly Tooling Cost</h3>
                  <p className="text-2xl font-bold">${totalMonthlyCost}/mo</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTools.length} tools selected
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h3 className="font-medium">Total Project Budget</h3>
                  <p className="text-2xl font-bold text-primary">${totalProjectCost}</p>
                  <p className="text-sm text-muted-foreground">
                    Based on {Math.round(projectDurationWeeks / 4.345)} months
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          {phases.length > 0 ? (
            <GanttChart 
              phases={phases} 
              onPhaseClick={(phase) => {
                // Handle phase click (e.g., scroll to phase in editor)
                const element = document.getElementById(`phase-${phase.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                  setTimeout(() => {
                    element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                  }, 2000);
                }
              }}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Add project phases in the Schedule Planner tab to see the timeline
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstimatorPage;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { FeatureInput as FeatureInputType } from "@/utils/advancedEstimationModels";
import { Textarea } from "@/components/ui/textarea";

interface FeatureInputProps {
  feature: FeatureInputType;
  onUpdate: (feature: FeatureInputType) => void;
  onDelete: () => void;
}

export const FeatureInputCard = ({ feature, onUpdate, onDelete }: FeatureInputProps) => {
  const [openSections, setOpenSections] = useState({
    fpa: false,
    pert: false,
    storyPoints: false,
    rca: false
  });

  const updateField = <K extends keyof FeatureInputType>(field: K, value: FeatureInputType[K]) => {
    onUpdate({ ...feature, [field]: value });
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{feature.name || "New Feature"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-error" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Feature Name</Label>
            <Input
              value={feature.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g., User Authentication"
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={feature.priority}
              onValueChange={(value: 'high' | 'medium' | 'low') => updateField('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* FPA Section */}
        <Collapsible
          open={openSections.fpa}
          onOpenChange={(open) => setOpenSections({ ...openSections, fpa: open })}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Function Point Analysis (FPA)
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.fpa ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Feature Type</Label>
                <Select
                  value={feature.fpa?.type}
                  onValueChange={(value: any) => updateField('fpa', { ...feature.fpa!, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="output">Output</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="interface">Interface</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Complexity</Label>
                <Select
                  value={feature.fpa?.complexity}
                  onValueChange={(value: any) => updateField('fpa', { ...feature.fpa!, complexity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Elements</Label>
                <Input
                  type="number"
                  value={feature.fpa?.numberOfElements || ''}
                  onChange={(e) => updateField('fpa', { ...feature.fpa!, numberOfElements: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 10"
                />
              </div>
              <div className="space-y-2">
                <Label>Technical Factor (0-14)</Label>
                <Input
                  type="number"
                  min="0"
                  max="14"
                  value={feature.fpa?.technicalFactor || ''}
                  onChange={(e) => updateField('fpa', { ...feature.fpa!, technicalFactor: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 7"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* PERT Section */}
        <Collapsible
          open={openSections.pert}
          onOpenChange={(open) => setOpenSections({ ...openSections, pert: open })}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Three-Point / PERT
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.pert ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Optimistic (days)</Label>
                <Input
                  type="number"
                  value={feature.pert?.optimistic || ''}
                  onChange={(e) => updateField('pert', { ...feature.pert!, optimistic: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="space-y-2">
                <Label>Most Likely (days)</Label>
                <Input
                  type="number"
                  value={feature.pert?.mostLikely || ''}
                  onChange={(e) => updateField('pert', { ...feature.pert!, mostLikely: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 10"
                />
              </div>
              <div className="space-y-2">
                <Label>Pessimistic (days)</Label>
                <Input
                  type="number"
                  value={feature.pert?.pessimistic || ''}
                  onChange={(e) => updateField('pert', { ...feature.pert!, pessimistic: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Story Points Section */}
        <Collapsible
          open={openSections.storyPoints}
          onOpenChange={(open) => setOpenSections({ ...openSections, storyPoints: open })}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Agile Story Points
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.storyPoints ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Story Description</Label>
              <Textarea
                value={feature.storyPoints?.description || ''}
                onChange={(e) => updateField('storyPoints', { ...feature.storyPoints!, description: e.target.value })}
                placeholder="As a user, I want to..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Story Points</Label>
                <Input
                  type="number"
                  value={feature.storyPoints?.points || ''}
                  onChange={(e) => updateField('storyPoints', { ...feature.storyPoints!, points: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 8"
                />
              </div>
              <div className="space-y-2">
                <Label>Team Velocity (pts/sprint)</Label>
                <Input
                  type="number"
                  value={feature.storyPoints?.teamVelocity || ''}
                  onChange={(e) => updateField('storyPoints', { ...feature.storyPoints!, teamVelocity: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label>Team Size</Label>
                <Input
                  type="number"
                  value={feature.storyPoints?.teamSize || ''}
                  onChange={(e) => updateField('storyPoints', { ...feature.storyPoints!, teamSize: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="space-y-2">
                <Label>Sprint Length (days)</Label>
                <Input
                  type="number"
                  value={feature.storyPoints?.sprintLength || ''}
                  onChange={(e) => updateField('storyPoints', { ...feature.storyPoints!, sprintLength: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 14"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

interface FeatureListProps {
  features: FeatureInputType[];
  onFeaturesChange: (features: FeatureInputType[]) => void;
}

export const FeatureList = ({ features, onFeaturesChange }: FeatureListProps) => {
  const addFeature = () => {
    const newFeature: FeatureInputType = {
      id: `feature-${Date.now()}`,
      name: '',
      priority: 'medium',
      dependencies: [],
      fpa: {
        type: 'input',
        complexity: 'medium',
        numberOfElements: 0,
        technicalFactor: 7
      },
      pert: {
        optimistic: 0,
        mostLikely: 0,
        pessimistic: 0
      },
      storyPoints: {
        description: '',
        points: 0,
        teamVelocity: 20,
        teamSize: 5,
        sprintLength: 14
      }
    };
    onFeaturesChange([...features, newFeature]);
  };

  const updateFeature = (index: number, updatedFeature: FeatureInputType) => {
    const newFeatures = [...features];
    newFeatures[index] = updatedFeature;
    onFeaturesChange(newFeatures);
  };

  const deleteFeature = (index: number) => {
    onFeaturesChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feature-Based Estimation</h2>
        <Button onClick={addFeature}>
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <FeatureInputCard
            key={feature.id}
            feature={feature}
            onUpdate={(updated) => updateFeature(index, updated)}
            onDelete={() => deleteFeature(index)}
          />
        ))}
        {features.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No features added yet. Click "Add Feature" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

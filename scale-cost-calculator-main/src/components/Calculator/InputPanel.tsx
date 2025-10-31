import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calculator, Info, Flame, Layers, Leaf, DollarSign, IndianRupee } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InputPanelProps {
  projectSize: number;
  teamSize: number;
  timeline: number;
  complexity: string;
  currency: 'USD' | 'INR';
  onProjectSizeChange: (value: number) => void;
  onTeamSizeChange: (value: number) => void;
  onTimelineChange: (value: number) => void;
  onComplexityChange: (value: string) => void;
  onCurrencyChange: (value: 'USD' | 'INR') => void;
  onCalculate: () => void;
}

export const InputPanel = ({
  projectSize,
  teamSize,
  timeline,
  complexity,
  currency,
  onProjectSizeChange,
  onTeamSizeChange,
  onTimelineChange,
  onComplexityChange,
  onCurrencyChange,
  onCalculate
}: InputPanelProps) => {
  return (
    <div className="w-full lg:w-80 bg-card border-r border-border p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Project Parameters
        </h2>
      </div>

      <div className="space-y-6">
        {/* Project Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Project Size (KLOC)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Lines of code in thousands. 50 KLOC = 50,000 lines of code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={[projectSize]}
            onValueChange={(values) => onProjectSizeChange(values[0])}
            min={10}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span className="font-semibold text-foreground">{projectSize} KLOC</span>
            <span>100</span>
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Team Size</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Number of developers working on the project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={[teamSize]}
            onValueChange={(values) => onTeamSizeChange(values[0])}
            min={2}
            max={20}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2</span>
            <span className="font-semibold text-foreground">{teamSize} people</span>
            <span>20</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Timeline (Months)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Expected project duration from start to completion</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={[timeline]}
            onValueChange={(values) => onTimelineChange(values[0])}
            min={3}
            max={24}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3</span>
            <span className="font-semibold text-foreground">{timeline} months</span>
            <span>24</span>
          </div>
        </div>

        {/* Complexity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Complexity Level</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Low: Simple CRUD apps. Medium: Standard business apps. High: Complex AI/ML systems</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup value={complexity} onValueChange={onComplexityChange}>
            <div className="grid grid-cols-3 gap-2">
              <Label
                htmlFor="low"
                className={`flex flex-col items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  complexity === 'low'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="low" id="low" className="sr-only" />
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-medium">Low</span>
              </Label>
              <Label
                htmlFor="medium"
                className={`flex flex-col items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  complexity === 'medium'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="medium" id="medium" className="sr-only" />
                <Layers className="w-5 h-5" />
                <span className="text-xs font-medium">Medium</span>
              </Label>
              <Label
                htmlFor="high"
                className={`flex flex-col items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  complexity === 'high'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="high" id="high" className="sr-only" />
                <Flame className="w-5 h-5" />
                <span className="text-xs font-medium">High</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Currency Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Currency</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>Select currency for cost estimation (1 USD ≈ 83 INR)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup value={currency} onValueChange={(value) => onCurrencyChange(value as 'USD' | 'INR')}>
            <div className="grid grid-cols-2 gap-2">
              <Label
                htmlFor="usd"
                className={`flex items-center justify-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  currency === 'USD'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="USD" id="usd" className="sr-only" />
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">USD ($)</span>
              </Label>
              <Label
                htmlFor="inr"
                className={`flex items-center justify-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  currency === 'INR'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="INR" id="inr" className="sr-only" />
                <IndianRupee className="w-5 h-5" />
                <span className="text-sm font-medium">INR (₹)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Calculate Button */}
        <Button onClick={onCalculate} className="w-full" size="lg">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Estimates
        </Button>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Tool, TOOL_CATEGORIES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToolSelectorProps {
  tools: Tool[];
  selectedTools: Tool[];
  onSelectionChange: (tools: Tool[]) => void;
}

export const ToolSelector = ({ tools, selectedTools, onSelectionChange }: ToolSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState<Record<string, Tool[]>>({});

  useEffect(() => {
    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by category
    const grouped = filtered.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);

    setFilteredTools(grouped);
  }, [tools, searchTerm]);

  const handleToolToggle = (tool: Tool) => {
    const isSelected = selectedTools.some(t => t.id === tool.id);
    
    if (isSelected) {
      onSelectionChange(selectedTools.filter(t => t.id !== tool.id));
    } else {
      onSelectionChange([...selectedTools, tool]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Tools</CardTitle>
        <div className="relative">
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(filteredTools).map(([category, categoryTools]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-medium">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryTools.map((tool) => {
                const isSelected = selectedTools.some(t => t.id === tool.id);
                return (
                  <div
                    key={tool.id}
                    className={cn(
                      'flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'
                    )}
                    onClick={() => handleToolToggle(tool)}
                  >
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleToolToggle(tool)}
                      className="h-5 w-5 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <Label
                          htmlFor={`tool-${tool.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tool.name}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          ${tool.monthlyPriceUSD}/mo
                        </span>
                      </div>
                      {tool.hasFreePlan && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Free plan available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

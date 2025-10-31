import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface InputSectionProps {
  bac: number;
  pv: number;
  ev: number;
  ac: number;
  onBacChange: (value: number) => void;
  onPvChange: (value: number) => void;
  onEvChange: (value: number) => void;
  onAcChange: (value: number) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  bac, pv, ev, ac,
  onBacChange, onPvChange, onEvChange, onAcChange
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(Number(value) || 0);
  };

  const formatValue = (value: number): string => {
    return value.toLocaleString('en-US');
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Project Inputs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bac" className="text-gray-700 dark:text-gray-300">
            Budget at Completion (BAC)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="bac"
              type="text"
              value={formatValue(bac)}
              onChange={(e) => handleInputChange(e, onBacChange)}
              className="pl-10 focus:ring-2 focus:ring-violet-500"
              placeholder="1,000,000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pv" className="text-gray-700 dark:text-gray-300">
            Planned Value (PV)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="pv"
              type="text"
              value={formatValue(pv)}
              onChange={(e) => handleInputChange(e, onPvChange)}
              className="pl-10 focus:ring-2 focus:ring-violet-500"
              placeholder="600,000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ev" className="text-gray-700 dark:text-gray-300">
            Earned Value (EV)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="ev"
              type="text"
              value={formatValue(ev)}
              onChange={(e) => handleInputChange(e, onEvChange)}
              className="pl-10 focus:ring-2 focus:ring-violet-500"
              placeholder="550,000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ac" className="text-gray-700 dark:text-gray-300">
            Actual Cost (AC)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="ac"
              type="text"
              value={formatValue(ac)}
              onChange={(e) => handleInputChange(e, onAcChange)}
              className="pl-10 focus:ring-2 focus:ring-violet-500"
              placeholder="580,000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

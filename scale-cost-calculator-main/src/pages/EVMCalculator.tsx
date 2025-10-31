import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEVMData } from '@/contexts/EVMDataContext';
import { InputSection } from '@/components/evm/InputSection';
import { MetricsGrid } from '@/components/evm/MetricsGrid';
import { ProgressBar } from '@/components/evm/ProgressBar';
import { PerformanceChart } from '@/components/evm/PerformanceChart';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ArrowRight, BookOpen } from 'lucide-react';

const EVMCalculator = () => {
  const navigate = useNavigate();
  const { data, metrics, updateData } = useEVMData();
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  const [localData, setLocalData] = useState(data);

  const handleDataChange = (field: keyof typeof localData, value: number) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Earned Value Management Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track project performance with real-time EVM metrics
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Monitor cost and schedule performance to keep your projects on track
          </p>
        </div>

        {/* Input Section */}
        <InputSection
          bac={localData.bac}
          pv={localData.pv}
          ev={localData.ev}
          ac={localData.ac}
          onBacChange={(value) => handleDataChange('bac', value)}
          onPvChange={(value) => handleDataChange('pv', value)}
          onEvChange={(value) => handleDataChange('ev', value)}
          onAcChange={(value) => handleDataChange('ac', value)}
        />

        {/* Metrics Grid */}
        {metrics && (
          <>
            <MetricsGrid metrics={metrics} bac={localData.bac} />
            
            {/* Progress Bar */}
            <ProgressBar percentage={metrics.percentComplete} />
            
            {/* Performance Chart */}
            <PerformanceChart />
          </>
        )}

        {/* Educational Section */}
        <Collapsible open={isEducationOpen} onOpenChange={setIsEducationOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-left">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {isEducationOpen ? 'Hide Details' : 'Learn More'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isEducationOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What is Earned Value Management?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Earned Value Management (EVM) is a project management technique that integrates scope, schedule, and cost to measure project performance. 
                  It helps project managers identify potential issues early and make data-driven decisions to keep projects on track.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Understanding Key Metrics:</h4>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-violet-600 dark:text-violet-400">CPI (Cost Performance Index):</strong>
                    <p className="text-gray-700 dark:text-gray-300">CPI = EV ÷ AC. Values &gt; 1.0 indicate under budget, &lt; 1.0 means over budget.</p>
                  </div>
                  
                  <div>
                    <strong className="text-violet-600 dark:text-violet-400">SPI (Schedule Performance Index):</strong>
                    <p className="text-gray-700 dark:text-gray-300">SPI = EV ÷ PV. Values &gt; 1.0 indicate ahead of schedule, &lt; 1.0 means behind schedule.</p>
                  </div>
                  
                  <div>
                    <strong className="text-violet-600 dark:text-violet-400">EAC (Estimate at Completion):</strong>
                    <p className="text-gray-700 dark:text-gray-300">EAC = BAC ÷ CPI. Forecasts the total project cost based on current performance.</p>
                  </div>
                  
                  <div>
                    <strong className="text-violet-600 dark:text-violet-400">CV & SV (Cost/Schedule Variance):</strong>
                    <p className="text-gray-700 dark:text-gray-300">Positive values indicate better performance, negative values indicate issues.</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Navigation to KPI Dashboard */}
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/kpi-dashboard')}
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View KPI Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EVMCalculator;

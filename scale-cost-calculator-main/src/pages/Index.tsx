import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LoadingScreen } from "@/components/LoadingScreen";
import { InputPanel } from "@/components/Calculator/InputPanel";
import { ModelCard } from "@/components/Calculator/ModelCard";
import { ComparisonChart } from "@/components/Calculator/ComparisonChart";
import { ComparisonTable } from "@/components/Calculator/ComparisonTable";
import { calculateAllModels, getRecommendedModel } from "@/utils/estimationModels";
import { FeatureList } from "@/components/Calculator/FeatureInput";
import { AdvancedResultsView } from "@/components/Calculator/AdvancedResultsView";
import { UnifiedComparisonTable } from "@/components/Calculator/UnifiedComparisonTable";
import { calculateFeatureEstimations, aggregateFeatureEstimations, FeatureInput as FeatureInputType } from "@/utils/advancedEstimationModels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ListTree } from "lucide-react";

type AppState = 'landing' | 'loading' | 'app';

interface IndexProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Index = ({ darkMode, onToggleDarkMode }: IndexProps) => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [estimationMode, setEstimationMode] = useState<'project' | 'feature'>('project');
  
  // Project parameters
  const [projectSize, setProjectSize] = useState(50);
  const [teamSize, setTeamSize] = useState(5);
  const [timeline, setTimeline] = useState(12);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  
  // Feature-based estimation
  const [features, setFeatures] = useState<FeatureInputType[]>([]);
  
  // Calculation results
  const [results, setResults] = useState(() => {
    const initial = calculateAllModels({
      projectSize: 50,
      teamSize: 5,
      timeline: 12,
      complexity: 'medium'
    });
    return initial;
  });
  
  const [recommendedModel, setRecommendedModel] = useState<'cocomo' | 'slim' | 'rca'>('cocomo');

  const handleGetStarted = () => {
    setAppState('loading');
  };

  // State to track loading completion
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  
  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoadingComplete(true);
    setAppState('app');
  };

  const handleCalculate = () => {
    const params = { projectSize, teamSize, timeline, complexity };
    const newResults = calculateAllModels(params);
    setResults(newResults);
    setRecommendedModel(getRecommendedModel(params));
  };

  // Auto-calculate when parameters change
  useEffect(() => {
    handleCalculate();
  }, [projectSize, teamSize, timeline, complexity]);

  // Currency conversion rate (1 USD = 83 INR approximately)
  const convertCurrency = (usdAmount: number) => {
    return currency === 'INR' ? Math.round(usdAmount * 83) : usdAmount;
  };

  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : '₹';
  };

  // Calculate feature-level results
  const featureResults = features.map(calculateFeatureEstimations);
  const aggregatedResults = features.length > 0 ? aggregateFeatureEstimations(features) : null;

  // Show landing page
  if (appState === 'landing') {
    return <LandingPage onGetStarted={() => setAppState('loading')} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />;
  }

  // Show loading screen until loading is complete
  if (appState === 'loading' || !isLoadingComplete) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const chartData = [
    {
      name: 'COCOMO II',
      cost: convertCurrency(results.cocomo.cost),
      effort: results.cocomo.effort,
      duration: results.cocomo.duration,
      color: 'hsl(var(--cocomo))'
    },
    {
      name: 'SLIM',
      cost: convertCurrency(results.slim.cost),
      effort: results.slim.effort,
      duration: results.slim.duration,
      color: 'hsl(var(--slim))'
    },
    {
      name: 'RCA Price',
      cost: convertCurrency(results.rca.cost),
      effort: results.rca.effort,
      duration: results.rca.duration,
      color: 'hsl(var(--rca))'
    }
  ];

  const tableData = [
    {
      name: 'COCOMO II',
      cost: convertCurrency(results.cocomo.cost),
      effort: results.cocomo.effort,
      duration: results.cocomo.duration,
      risk: results.cocomo.risk
    },
    {
      name: 'SLIM',
      cost: convertCurrency(results.slim.cost),
      effort: results.slim.effort,
      duration: results.slim.duration,
      risk: results.slim.risk
    },
    {
      name: 'RCA Price',
      cost: convertCurrency(results.rca.cost),
      effort: results.rca.effort,
      duration: results.rca.duration,
      risk: results.rca.risk
    }
  ];

  // Unified comparison data (all 6 models)
  const unifiedTableData = aggregatedResults ? [
    ...tableData,
    {
      name: 'FPA',
      cost: convertCurrency(aggregatedResults.fpa.totalCost),
      effort: aggregatedResults.fpa.totalEffort,
      duration: aggregatedResults.fpa.totalDuration / 30, // Convert days to months
      risk: 'medium',
      additionalMetrics: {}
    },
    {
      name: 'PERT',
      cost: convertCurrency(aggregatedResults.pert.totalCost),
      effort: aggregatedResults.pert.totalEffort,
      duration: aggregatedResults.pert.totalDuration / 30, // Convert days to months
      risk: aggregatedResults.pert.avgRisk,
      additionalMetrics: {}
    },
    {
      name: 'Story Points',
      cost: convertCurrency(aggregatedResults.storyPoints.totalCost),
      effort: aggregatedResults.storyPoints.totalEffort,
      duration: aggregatedResults.storyPoints.totalDuration / 30, // Convert days to months
      risk: 'low',
      additionalMetrics: { sprints: aggregatedResults.storyPoints.totalSprints }
    }
  ] : tableData;

  // Show loading screen until loading is complete
  if (appState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  // Only show main content in app state
  if (appState !== 'app') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-16" /> {/* Spacer for fixed header */}
      
      <div className="flex flex-col lg:flex-row">
        <InputPanel
          projectSize={projectSize}
          teamSize={teamSize}
          timeline={timeline}
          complexity={complexity}
          currency={currency}
          onProjectSizeChange={setProjectSize}
          onTeamSizeChange={setTeamSize}
          onTimelineChange={setTimeline}
          onComplexityChange={(value) => setComplexity(value as 'low' | 'medium' | 'high')}
          onCurrencyChange={setCurrency}
          onCalculate={handleCalculate}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Tabs value={estimationMode} onValueChange={(value) => setEstimationMode(value as 'project' | 'feature')}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="project" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Project-Level
                </TabsTrigger>
                <TabsTrigger value="feature" className="flex items-center gap-2">
                  <ListTree className="w-4 h-4" />
                  Feature-Based (All 6 Models)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="project" className="space-y-6">
                {/* Model Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ModelCard
                    name="COCOMO II"
                    color="hsl(var(--cocomo))"
                    cost={convertCurrency(results.cocomo.cost)}
                    effort={results.cocomo.effort}
                    duration={results.cocomo.duration}
                    risk={results.cocomo.risk}
                    isRecommended={recommendedModel === 'cocomo'}
                    currencySymbol={getCurrencySymbol()}
                  />
                  <ModelCard
                    name="SLIM"
                    color="hsl(var(--slim))"
                    cost={convertCurrency(results.slim.cost)}
                    effort={results.slim.effort}
                    duration={results.slim.duration}
                    risk={results.slim.risk}
                    isRecommended={recommendedModel === 'slim'}
                    currencySymbol={getCurrencySymbol()}
                  />
                  <ModelCard
                    name="RCA Price"
                    color="hsl(var(--rca))"
                    cost={convertCurrency(results.rca.cost)}
                    effort={results.rca.effort}
                    duration={results.rca.duration}
                    risk={results.rca.risk}
                    isRecommended={recommendedModel === 'rca'}
                    currencySymbol={getCurrencySymbol()}
                  />
                </div>

                {/* Comparison Chart */}
                <ComparisonChart results={chartData} currencySymbol={getCurrencySymbol()} />

                {/* Comparison Table */}
                <ComparisonTable results={tableData} currencySymbol={getCurrencySymbol()} />
              </TabsContent>

              <TabsContent value="feature" className="space-y-6">
                <FeatureList features={features} onFeaturesChange={setFeatures} />
                
                {features.length > 0 && (
                  <>
                    <AdvancedResultsView results={featureResults} currencySymbol={getCurrencySymbol()} />
                    {aggregatedResults && (
                      <UnifiedComparisonTable results={unifiedTableData} currencySymbol={getCurrencySymbol()} />
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

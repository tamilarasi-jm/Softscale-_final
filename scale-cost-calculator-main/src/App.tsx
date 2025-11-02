import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { EVMDataProvider } from "@/contexts/EVMDataContext";
import Index from "./pages/Index";
import { LandingPage } from "@/components/LandingPage";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import CostSummary from "./pages/CostSummary";
import EVMCalculator from "./pages/EVMCalculator";
import KPIDashboard from "./pages/KPIDashboard";
import DiagramComparison from "./pages/DiagramComparison";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Scheduling from "./pages/Scheduling/SchedulingPage";
import EstimatorPage from "./pages/Estimator/EstimatorPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleBackToHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <AppHeader
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onBackToHome={handleBackToHome}
        />
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <LandingPage 
              onGetStarted={() => navigate('/estimation-tool')} 
              darkMode={darkMode} 
              onToggleDarkMode={handleToggleDarkMode} 
            />
          } />
          <Route path="/estimation-tool" element={<Index darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/cost-summary" element={<CostSummary />} />
          <Route path="/evm-calculator" element={<EVMCalculator />} />
          <Route path="/kpi-dashboard" element={<KPIDashboard />} />
          <Route 
            path="/diagram-comparison" 
            element={
              <ErrorBoundary>
                <DiagramComparison />
              </ErrorBoundary>
            } 
          />
          <Route path="/scheduling" 
            element={
              <ErrorBoundary>
                <Scheduling />
              </ErrorBoundary>
            } 
          />
          <Route path="/estimator" 
            element={
              <ErrorBoundary>
                <EstimatorPage />
              </ErrorBoundary>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EVMDataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </EVMDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

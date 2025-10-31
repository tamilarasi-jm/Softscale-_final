import { ArrowLeft, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2 font-bold text-xl">
            <Calculator className="w-6 h-6 text-primary" />
            <span>Cost Estimator</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Estimation Models</h1>
        <p className="mb-8">This application provides cost estimation using industry-standard models.</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">COCOMO II</h2>
            <p className="text-sm text-muted-foreground">Suitable for large-scale enterprise projects.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">SLIM</h2>
            <p className="text-sm text-muted-foreground">Optimized for agile development teams.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">RCA Price</h2>
            <p className="text-sm text-muted-foreground">Designed for projects with fixed constraints.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

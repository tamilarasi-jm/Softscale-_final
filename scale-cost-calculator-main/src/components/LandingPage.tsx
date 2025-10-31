import { ArrowRight, Calculator, BarChart3, Download, Save, Moon, Smartphone, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  onGetStarted: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage = ({ onGetStarted, darkMode, onToggleDarkMode }: LandingPageProps) => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "3 Estimation Models",
      description: "COCOMO II, SLIM, and RCA Price for comprehensive analysis"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Instant recalculation as you adjust parameters"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Reports",
      description: "Professional PDF and Excel reports ready to share"
    },
    {
      icon: <Save className="w-6 h-6" />,
      title: "Save Projects",
      description: "Store multiple estimates and compare them"
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: "Dark Mode",
      description: "Eye-friendly interface for long sessions"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Fully Responsive",
      description: "Works seamlessly on all devices"
    }
  ];

  const models = [
    {
      name: "COCOMO II",
      color: "hsl(var(--cocomo))",
      icon: "🟣",
      bestFor: "Enterprise Projects",
      description: "Constructive Cost Model - industry standard for large-scale software development with detailed effort estimation"
    },
    {
      name: "SLIM",
      color: "hsl(var(--slim))",
      icon: "🟢",
      bestFor: "Agile Iterations",
      description: "Software Lifecycle Management - optimized for iterative development and continuous delivery environments"
    },
    {
      name: "RCA Price",
      color: "hsl(var(--rca))",
      icon: "🟠",
      bestFor: "Fixed Constraints",
      description: "Resource Constraint Analysis - ideal when working with fixed budgets, timelines, or team sizes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Calculator className="w-6 h-6 text-primary" />
            <span className="gradient-text">Cost Estimator Pro</span>
          </div>
          <Button onClick={onGetStarted} size="sm">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-slide-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Estimate Your Software
              <br />
              <span className="gradient-text">Project Costs</span>
              <br />
              with Confidence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Professional cost estimation using 3 industry-standard models.
              Fast, accurate, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={onGetStarted} size="lg" className="text-lg px-8 py-6">
                Start Estimating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/learn-more")}
              >
                Learn More
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>3 Models</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>5min Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span>100% Free</span>
              </div>
            </div>
          </div>

          {/* Floating Card Animation */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50 animate-float" />
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">$45K</div>
                  <div className="text-sm text-muted-foreground">Avg. Estimate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">12mo</div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-rca">5</div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Explained */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Estimation Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <div
                key={index}
                className="bg-card border-2 rounded-xl p-8 hover:shadow-xl transition-all duration-300"
                style={{ borderTopColor: model.color }}
              >
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-4">
                  Best for: {model.bestFor}
                </div>
                <p className="text-muted-foreground">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Estimate Your Project?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get accurate cost estimates in minutes with our professional tools
          </p>
          <Button onClick={onGetStarted} size="lg" className="text-lg px-12 py-6">
            Get Started - It's Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>Made with ❤️ for project managers and developers everywhere</p>
        </div>
      </footer>
    </div>
  );
};

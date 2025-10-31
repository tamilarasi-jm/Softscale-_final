import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Loading libraries", delay: 300 },
    { label: "Initializing models", delay: 800 },
    { label: "Setting up workspace", delay: 1300 },
    { label: "Ready!", delay: 1800 }
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Step completion
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });

    // Complete loading
    setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <Calculator className="w-24 h-24 text-primary mx-auto animate-float relative" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 gradient-text">
          Initializing Calculator...
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">{progress}%</div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                index < currentStep
                  ? 'border-primary bg-primary'
                  : index === currentStep
                  ? 'border-primary animate-pulse'
                  : 'border-muted'
              }`}>
                {index < currentStep && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === currentStep && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-1 mt-8">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

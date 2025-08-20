import React, { useState, useEffect } from 'react';

interface EnhancedLoadingSpinnerProps {
  idea?: string;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({ idea }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: '🔍', text: 'Analyzing idea context...', duration: 2000 },
    { icon: '🌱', text: 'Identifying micro-communities...', duration: 2000 },
    { icon: '🌍', text: 'Mapping cultural gaps...', duration: 2000 },
    { icon: '⏰', text: 'Evaluating timing factors...', duration: 2000 },
    { icon: '📱', text: 'Analyzing platform dynamics...', duration: 2000 },
    { icon: '🚀', text: 'Calculating arbitrage potential...', duration: 2000 },
    { icon: '✨', text: 'Finalizing insights...', duration: 1000 }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let currentTime = 0;

    const interval = setInterval(() => {
      currentTime += 100;
      const newProgress = Math.min((currentTime / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on progress
      let stepProgress = 0;
      for (let i = 0; i < steps.length; i++) {
        stepProgress += (steps[i].duration / totalDuration) * 100;
        if (newProgress <= stepProgress) {
          setCurrentStep(i);
          break;
        }
      }

      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-2xl mx-auto text-center p-8">
        
        {/* Main Loading Animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            
            {/* Progress Ring */}
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ 
                transform: 'rotate(-90deg)',
                background: `conic-gradient(from 0deg, #8b5cf6 ${progress * 3.6}deg, transparent 0deg)`
              }}
            ></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-pulse">
                {steps[currentStep]?.icon || '🔮'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {steps[currentStep]?.text || 'Analyzing...'}
          </h3>
          <p className="text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Progress Percentage */}
        <div className="text-3xl font-bold text-purple-400 mb-6">
          {Math.round(progress)}%
        </div>

        {/* Idea Display */}
        {idea && (
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
            <p className="text-slate-300 text-sm">
              <span className="text-purple-400 font-semibold">Analyzing:</span> {idea}
            </p>
          </div>
        )}

        {/* Loading Tips */}
        <div className="mt-8 text-slate-400 text-sm">
          <p>💡 This analysis uses Social Arbitrage Theory to identify hidden opportunities</p>
          <p>⏱️ Usually takes 15-20 seconds for comprehensive insights</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStep % 3 ? 'bg-purple-500' : 'bg-slate-600'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
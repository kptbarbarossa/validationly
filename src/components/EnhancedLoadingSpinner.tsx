import React, { useState, useEffect } from 'react';

interface LoadingStep {
    title: string;
    description: string;
    duration: number;
}

const analysisSteps: LoadingStep[] = [
    { title: "Analyzing your idea", description: "Processing your business concept...", duration: 2000 },
    { title: "Scanning social media", description: "Checking X, Reddit, and LinkedIn...", duration: 3000 },
    { title: "Generating strategies", description: "Creating validation roadmap...", duration: 2000 },
    { title: "Finalizing report", description: "Preparing your results...", duration: 1000 }
];

const EnhancedLoadingSpinner: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        if (currentStepIndex < analysisSteps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, analysisSteps[currentStepIndex].duration);

            return () => clearTimeout(timer);
        }
    }, [currentStepIndex]);

    const currentStep = analysisSteps[currentStepIndex];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 p-3">
                        <img 
                            src="/logo.png" 
                            alt="Validationly Logo"
                            className="w-full h-full object-contain animate-pulse"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {currentStep.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {currentStep.description}
                    </p>
                </div>
                
                {/* Progress steps */}
                <div className="space-y-3">
                    {analysisSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                index < currentStepIndex ? 'bg-green-500' : 
                                index === currentStepIndex ? 'bg-indigo-500 animate-pulse' : 'bg-gray-200'
                            }`}>
                                {index < currentStepIndex ? (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <span className={`text-sm transition-colors duration-300 ${
                                index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnhancedLoadingSpinner;
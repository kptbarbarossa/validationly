import React, { useState, useEffect } from 'react';

interface LoadingStep {
    title: string;
    description: string;
    duration: number;
}

const analysisSteps: LoadingStep[] = [
    { title: "Analyzing your idea", description: "Processing your business concept...", duration: 2000 },
    { title: "Scanning platforms", description: "Checking X, Reddit, LinkedIn, Instagram, TikTok...", duration: 3000 },
    { title: "Content quality analysis", description: "Evaluating writing, engagement, and virality...", duration: 2000 },
    { title: "Finalizing report", description: "Preparing your comprehensive results...", duration: 1000 }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-3xl glass glass-border p-8 text-slate-100">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-2xl bg-white/10 border border-white/10">
                        <img
                            src="/logo.png"
                            alt="Validationly Logo"
                            className="w-8 h-8 object-contain animate-pulse-subtle"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {currentStep.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                        {currentStep.description}
                    </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-3">
                    {analysisSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    index < currentStepIndex
                                        ? 'bg-emerald-500 text-white'
                                        : index === currentStepIndex
                                        ? 'bg-indigo-500/30 ring-2 ring-indigo-400/50 text-white'
                                        : 'bg-white/10 text-slate-300'
                                }`}
                            >
                                {index < currentStepIndex ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : index === currentStepIndex ? (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                ) : (
                                    <div className="w-2 h-2 bg-slate-300/60 rounded-full"></div>
                                )}
                            </div>
                            <span
                                className={`text-sm transition-colors duration-300 ${
                                    index <= currentStepIndex ? 'text-slate-100' : 'text-slate-400'
                                }`}
                            >
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
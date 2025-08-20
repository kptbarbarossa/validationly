import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SmartIdeaFormProps {
  onSubmit: (data: IdeaFormData) => void;
  isLoading: boolean;
}

interface IdeaFormData {
  idea: string;
  audience: string;
  goal: string;
  industry: string;
  stage: string;
}

const SmartIdeaForm: React.FC<SmartIdeaFormProps> = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IdeaFormData>({
    idea: '',
    audience: '',
    goal: '',
    industry: '',
    stage: ''
  });

  const [ideaLength, setIdeaLength] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-advance to next step when current field is filled
  useEffect(() => {
    if (currentStep === 1 && formData.idea.length > 20) {
      setTimeout(() => setCurrentStep(2), 500);
    }
    if (currentStep === 2 && formData.audience) {
      setTimeout(() => setCurrentStep(3), 500);
    }
    if (currentStep === 3 && formData.goal) {
      setTimeout(() => setCurrentStep(4), 500);
    }
  }, [formData, currentStep]);

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'idea') {
      setIdeaLength(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idea.trim()) {
      onSubmit(formData);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '🎯';
      default: return '⭕';
    }
  };

  const getStepColor = (step: number) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const audienceOptions = [
    'B2B SaaS',
    'Consumer App',
    'E-commerce',
    'Hardware/IoT',
    'Fintech',
    'Healthtech',
    'Edtech',
    'Other'
  ];

  const goalOptions = [
    'Investor pitch',
    'MVP validation',
    'Market research',
    'Competitor analysis',
    'Just exploring'
  ];

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Services',
    'Other'
  ];

  const stageOptions = [
    'Idea stage',
    'MVP development',
    'Early users',
    'Product-market fit',
    'Scaling'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-center items-center gap-4 mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`text-2xl ${getStepColor(step)}`}>
                {getStepIcon(step)}
              </div>
              <span className={`text-sm font-medium ${getStepColor(step)}`}>
                Step {step}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Idea Input */}
        <div className={`transition-all duration-500 ${currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-white mb-2">What's Your Big Idea?</h2>
              <p className="text-slate-300">Describe your business idea in simple terms</p>
            </div>
            
            <div className="relative">
              <textarea
                value={formData.idea}
                onChange={(e) => handleInputChange('idea', e.target.value)}
                placeholder="e.g., An AI-powered app that helps people find the perfect coffee based on their mood, weather, and time of day..."
                className="w-full h-32 bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-500/50 transition-colors text-lg"
                required
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-4 right-4">
                <span className={`text-sm ${ideaLength > 100 ? 'text-green-400' : ideaLength > 50 ? 'text-yellow-400' : 'text-slate-400'}`}>
                  {ideaLength}/200
                </span>
              </div>
            </div>

            {/* Smart Suggestions */}
            {ideaLength > 30 && (
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-purple-300 text-sm">
                  💡 <strong>Tip:</strong> {ideaLength < 100 ? 'Add more details about your target market and unique value proposition' : 'Great! Your idea is well-described'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Audience Selection */}
        <div className={`transition-all duration-500 ${currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">Who's Your Target?</h2>
              <p className="text-slate-300">Select your primary business model</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {audienceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange('audience', option)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    formData.audience === option
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-900/50 border-white/20 text-slate-300 hover:border-white/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Goal Selection */}
        <div className={`transition-all duration-500 ${currentStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">What's Your Goal?</h2>
              <p className="text-slate-300">Why are you analyzing this idea?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange('goal', option)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    formData.goal === option
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-900/50 border-white/20 text-slate-300 hover:border-white/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Additional Context */}
        <div className={`transition-all duration-500 ${currentStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <div className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">Additional Context</h2>
              <p className="text-slate-300">Help us provide more accurate analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                  aria-label="Select industry"
                >
                  <option value="">Select industry...</option>
                  {industryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-white mb-3">Development Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/20 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                  aria-label="Select development stage"
                >
                  <option value="">Select stage...</option>
                  {stageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || !formData.idea.trim()}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold text-xl transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                🔍 AI Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                🚀 Get Social Arbitrage Analysis
              </div>
            )}
          </button>
          
          {!formData.idea.trim() && (
            <p className="text-slate-400 text-sm mt-3">
              Please describe your idea to continue
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SmartIdeaForm;

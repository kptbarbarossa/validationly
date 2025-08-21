import React, { useState } from 'react';

interface ActionStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface ActionPlanSectionProps {
  score: number;
}

const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({ score }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const getActionSteps = (score: number): ActionStep[] => {
    if (score >= 80) {
      return [
        {
          id: 'mvp',
          icon: '🚀',
          title: 'Build MVP',
          description: 'Start building your minimum viable product',
          timeframe: 'Next 2 weeks',
          priority: 'high'
        },
        {
          id: 'funding',
          icon: '💰',
          title: 'Seek Funding',
          description: 'Prepare pitch deck and approach investors',
          timeframe: 'Next month',
          priority: 'high'
        },
        {
          id: 'team',
          icon: '👥',
          title: 'Build Team',
          description: 'Recruit key team members',
          timeframe: 'Next 6 weeks',
          priority: 'medium'
        }
      ];
    } else if (score >= 60) {
      return [
        {
          id: 'landing',
          icon: '🌐',
          title: 'Create Landing Page',
          description: 'Build a landing page to collect early interest',
          timeframe: 'Next 48 hours',
          priority: 'high'
        },
        {
          id: 'social',
          icon: '📱',
          title: 'Social Validation',
          description: 'Post on social media to gather feedback',
          timeframe: 'This week',
          priority: 'high'
        },
        {
          id: 'research',
          icon: '🔍',
          title: 'Market Research',
          description: 'Conduct deeper market analysis',
          timeframe: 'Next 2 weeks',
          priority: 'medium'
        }
      ];
    } else {
      return [
        {
          id: 'pivot',
          icon: '🔄',
          title: 'Refine Concept',
          description: 'Iterate on your idea based on insights',
          timeframe: 'This week',
          priority: 'high'
        },
        {
          id: 'feedback',
          icon: '💬',
          title: 'Gather Feedback',
          description: 'Talk to potential customers',
          timeframe: 'Next 2 weeks',
          priority: 'high'
        },
        {
          id: 'alternatives',
          icon: '💡',
          title: 'Explore Alternatives',
          description: 'Consider different approaches or markets',
          timeframe: 'Next month',
          priority: 'medium'
        }
      ];
    }
  };

  const actionSteps = getActionSteps(score);

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-400/10';
      case 'medium': return 'border-yellow-400 bg-yellow-400/10';
      case 'low': return 'border-green-400 bg-green-400/10';
      default: return 'border-gray-400 bg-gray-400/10';
    }
  };

  const completionRate = (completedSteps.size / actionSteps.length) * 100;

  return (
    <div className="glass glass-border p-6 sm:p-8 rounded-3xl mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🎯 Your Action Plan
        </h2>
        <p className="text-slate-400 mb-6">
          {score >= 80 
            ? "Time to execute! Your idea has strong validation."
            : score >= 60 
            ? "Build momentum with these strategic steps."
            : "Let's refine and strengthen your concept."
          }
        </p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Action Steps */}
      <div className="grid gap-4 sm:gap-6">
        {actionSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`glass glass-border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
              completedSteps.has(step.id) ? 'opacity-75 bg-green-500/10' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Step Icon & Number */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="text-3xl">{step.icon}</div>
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{step.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(step.priority)}`}>
                      {step.priority} priority
                    </span>
                    <span className="text-sm text-slate-400">{step.timeframe}</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm sm:text-base mb-4">{step.description}</p>
                
                {/* Action Button */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all ${
                    completedSteps.has(step.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105'
                  }`}
                >
                  {completedSteps.has(step.id) ? '✅ Completed' : '🚀 Start This Step'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Motivational Footer */}
      {completionRate > 0 && (
        <div className="text-center mt-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl">
          <p className="text-green-400 font-semibold">
            🎉 Great progress! You've completed {completedSteps.size} out of {actionSteps.length} steps.
          </p>
          {completionRate === 100 && (
            <p className="text-yellow-400 mt-2">
              🚀 Amazing! You're ready for the next phase of your startup journey!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionPlanSection;
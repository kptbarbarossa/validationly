import React, { useState } from 'react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  timeframe: '24h' | '1week' | '1month';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  resources?: {
    type: 'template' | 'tool' | 'guide';
    name: string;
    url: string;
  }[];
}

interface ActionPlanProps {
  score: number;
  category: string;
}

export const ActionPlanSection: React.FC<ActionPlanProps> = ({ score, category }) => {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'24h' | '1week' | '1month'>('24h');

  const generateActions = (score: number, category: string): ActionItem[] => {
    const baseActions: ActionItem[] = [
      {
        id: '1',
        title: 'Create Landing Page',
        description: 'Build a simple landing page to test demand and collect emails',
        timeframe: '24h',
        priority: 'high',
        completed: false,
        resources: [
          { type: 'template', name: 'Landing Page Template', url: '/templates/landing' },
          { type: 'tool', name: 'Carrd.co', url: 'https://carrd.co' }
        ]
      },
      {
        id: '2',
        title: 'Social Media Validation',
        description: 'Post on relevant social platforms to gauge interest',
        timeframe: '24h',
        priority: 'high',
        completed: false,
        resources: [
          { type: 'template', name: 'Social Post Templates', url: '/templates/social' }
        ]
      },
      {
        id: '3',
        title: 'Customer Interviews',
        description: 'Conduct 5-10 interviews with potential customers',
        timeframe: '1week',
        priority: 'high',
        completed: false,
        resources: [
          { type: 'guide', name: 'Interview Guide', url: '/guides/interviews' }
        ]
      }
    ];

    // Customize based on score
    if (score >= 80) {
      baseActions.push({
        id: '4',
        title: 'MVP Development',
        description: 'Start building your minimum viable product',
        timeframe: '1month',
        priority: 'high',
        completed: false
      });
    } else if (score < 50) {
      baseActions.push({
        id: '4',
        title: 'Pivot Analysis',
        description: 'Explore alternative approaches or target markets',
        timeframe: '1week',
        priority: 'medium',
        completed: false
      });
    }

    return baseActions;
  };

  const actions = generateActions(score, category);
  const filteredActions = actions.filter(action => action.timeframe === activeTab);

  const toggleAction = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getTimeframeEmoji = (timeframe: string) => {
    switch (timeframe) {
      case '24h': return '⚡';
      case '1week': return '📅';
      case '1month': return '🗓️';
      default: return '⏰';
    }
  };

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🚀 Your Action Plan
        </h2>
        <p className="text-slate-400">Prioritized steps to validate and launch your idea</p>
      </div>

      {/* Timeframe Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-800/50 rounded-2xl p-1 border border-slate-700">
          {(['24h', '1week', '1month'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setActiveTab(timeframe)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === timeframe
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{getTimeframeEmoji(timeframe)}</span>
              <span>{timeframe === '24h' ? 'Next 24h' : timeframe === '1week' ? 'This Week' : 'This Month'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`p-6 rounded-2xl border transition-all ${
              completedActions.has(action.id)
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleAction(action.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  completedActions.has(action.id)
                    ? 'bg-green-500 border-green-500'
                    : 'border-slate-500 hover:border-slate-400'
                }`}
              >
                {completedActions.has(action.id) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-semibold ${
                    completedActions.has(action.id) ? 'text-green-400 line-through' : 'text-white'
                  }`}>
                    {action.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-4">{action.description}</p>

                {/* Resources */}
                {action.resources && action.resources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {action.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm hover:bg-blue-500/30 transition-all"
                      >
                        <span>
                          {resource.type === 'template' && '📄'}
                          {resource.type === 'tool' && '🛠️'}
                          {resource.type === 'guide' && '📚'}
                        </span>
                        <span>{resource.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-semibold">
            {completedActions.size} / {filteredActions.length} completed
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedActions.size / filteredActions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
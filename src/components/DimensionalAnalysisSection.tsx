import React, { useState } from 'react';
import DimensionalScoresGrid from './DimensionalScoresGrid';
import DimensionalScoreComparison from './DimensionalScoreComparison';
import DimensionalScoresSummary from './DimensionalScoresSummary';
import type { DimensionalScores } from '../types';

interface DimensionalAnalysisSectionProps {
  scores: DimensionalScores;
  overallScore: number;
  className?: string;
}

const DimensionalAnalysisSection: React.FC<DimensionalAnalysisSectionProps> = ({ 
  scores, 
  overallScore,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'detailed', label: 'Detailed', icon: '🔍' },
    { id: 'comparison', label: 'Compare', icon: '📈' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Multi-Dimensional Analysis
        </h2>
        <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
          Your idea analyzed across 5 critical business dimensions using advanced AI methodology
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <DimensionalScoresSummary 
              scores={scores} 
              overallScore={overallScore}
            />
            <DimensionalScoreComparison scores={scores} />
          </div>
        )}

        {activeTab === 'detailed' && (
          <DimensionalScoresGrid scores={scores} />
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <DimensionalScoreComparison scores={scores} />
            
            {/* Additional Comparison Insights */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dimensional Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Score Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(scores).map(([key, score]) => {
                      const labels = {
                        marketSize: 'Market Size',
                        competitionIntensity: 'Competition',
                        technicalFeasibility: 'Technical',
                        monetizationPotential: 'Monetization',
                        timingTrend: 'Timing'
                      };
                      
                      return (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {labels[key as keyof typeof labels]}
                          </span>
                          <span className="font-medium text-gray-900">
                            {score.score}/100
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Recommendations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Key Recommendations</h4>
                  <div className="space-y-2">
                    {Object.entries(scores)
                      .sort(([,a], [,b]) => b.score - a.score)
                      .slice(0, 3)
                      .map(([key]) => {
                        const labels = {
                          marketSize: 'Leverage market opportunity',
                          competitionIntensity: 'Differentiate from competitors',
                          technicalFeasibility: 'Focus on technical execution',
                          monetizationPotential: 'Optimize revenue model',
                          timingTrend: 'Capitalize on market timing'
                        };
                        
                        return (
                          <div key={key} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span className="text-gray-600">
                              {labels[key as keyof typeof labels]}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile-friendly Bottom Summary */}
      <div className="lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">Overall Score</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overallScore}/100</div>
          <div className="text-sm text-gray-600">
            Based on {Object.keys(scores).length} dimensional analysis
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionalAnalysisSection;
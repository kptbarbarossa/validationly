import React from 'react';
import type { DimensionalScores } from '../types';

interface DimensionalScoresSummaryProps {
  scores: DimensionalScores;
  overallScore: number;
  className?: string;
}

const DimensionalScoresSummary: React.FC<DimensionalScoresSummaryProps> = ({ 
  scores, 
  overallScore,
  className = '' 
}) => {
  const dimensionData = [
    {
      key: 'marketSize' as keyof DimensionalScores,
      label: 'Market Size',
      score: scores.marketSize.score,
      icon: '📊',
      color: 'blue'
    },
    {
      key: 'competitionIntensity' as keyof DimensionalScores,
      label: 'Competition',
      score: scores.competitionIntensity.score,
      icon: '⚔️',
      color: 'orange'
    },
    {
      key: 'technicalFeasibility' as keyof DimensionalScores,
      label: 'Technical',
      score: scores.technicalFeasibility.score,
      icon: '🛠️',
      color: 'purple'
    },
    {
      key: 'monetizationPotential' as keyof DimensionalScores,
      label: 'Monetization',
      score: scores.monetizationPotential.score,
      icon: '💰',
      color: 'green'
    },
    {
      key: 'timingTrend' as keyof DimensionalScores,
      label: 'Timing',
      score: scores.timingTrend.score,
      icon: '⏰',
      color: 'pink'
    }
  ];

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Needs Work', color: 'text-red-600' };
  };

  const getOverallStatus = (score: number) => {
    if (score >= 80) return {
      status: 'Strong Potential',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🚀',
      description: 'Your idea shows excellent potential across multiple dimensions'
    };
    if (score >= 60) return {
      status: 'Good Potential',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '⭐',
      description: 'Your idea has solid potential with some areas for improvement'
    };
    if (score >= 40) return {
      status: 'Moderate Potential',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⚡',
      description: 'Your idea has potential but needs strengthening in key areas'
    };
    return {
      status: 'Needs Development',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '🔧',
      description: 'Your idea needs significant development before moving forward'
    };
  };

  const overallStatus = getOverallStatus(overallScore);
  const strongestDimension = dimensionData.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );
  const weakestDimension = dimensionData.reduce((prev, current) => 
    prev.score < current.score ? prev : current
  );

  return (
    <div className={`bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Overall Status */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-3 ${overallStatus.color}`}>
          <span>{overallStatus.icon}</span>
          {overallStatus.status}
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          {overallStatus.description}
        </p>
      </div>

      {/* Dimensional Scores Mini Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {dimensionData.map((dimension) => {
          const status = getScoreStatus(dimension.score);
          return (
            <div key={dimension.key} className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-lg">{dimension.icon}</span>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {dimension.score}
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {dimension.label}
              </div>
              <div className={`text-xs font-medium ${status.color}`}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">{strongestDimension.icon}</span>
            <span className="text-sm font-medium text-green-800">Strongest Area</span>
          </div>
          <div className="text-sm text-green-700">
            <span className="font-semibold">{strongestDimension.label}</span> ({strongestDimension.score}/100)
          </div>
          <div className="text-xs text-green-600 mt-1">
            {scores[strongestDimension.key].keyFactors?.[0] || 'This is your competitive advantage'}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600">{weakestDimension.icon}</span>
            <span className="text-sm font-medium text-orange-800">Focus Area</span>
          </div>
          <div className="text-sm text-orange-700">
            <span className="font-semibold">{weakestDimension.label}</span> ({weakestDimension.score}/100)
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {scores[weakestDimension.key].improvementAreas?.[0] || 'Needs attention for better results'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">Recommended Next Steps</div>
        <div className="flex flex-wrap gap-2">
          {overallScore >= 70 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
              🚀 Start building MVP
            </span>
          )}
          {strongestDimension.score >= 80 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
              💪 Leverage {strongestDimension.label.toLowerCase()}
            </span>
          )}
          {weakestDimension.score < 50 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md">
              🔧 Improve {weakestDimension.label.toLowerCase()}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
            📊 Validate assumptions
          </span>
        </div>
      </div>
    </div>
  );
};

export default DimensionalScoresSummary;
import React from 'react';
import DimensionalScoreBar from './DimensionalScoreBar';
import type { DimensionalScores } from '../types';

interface DimensionalScoresGridProps {
  scores: DimensionalScores;
  className?: string;
}

const DimensionalScoresGrid: React.FC<DimensionalScoresGridProps> = ({ 
  scores, 
  className = '' 
}) => {
  const dimensionConfig = [
    {
      key: 'marketSize' as keyof DimensionalScores,
      title: 'Market Size',
      icon: '📊',
      color: 'blue' as const
    },
    {
      key: 'competitionIntensity' as keyof DimensionalScores,
      title: 'Competition',
      icon: '⚔️',
      color: 'orange' as const
    },
    {
      key: 'technicalFeasibility' as keyof DimensionalScores,
      title: 'Technical Feasibility',
      icon: '🛠️',
      color: 'purple' as const
    },
    {
      key: 'monetizationPotential' as keyof DimensionalScores,
      title: 'Monetization',
      icon: '💰',
      color: 'green' as const
    },
    {
      key: 'timingTrend' as keyof DimensionalScores,
      title: 'Market Timing',
      icon: '⏰',
      color: 'pink' as const
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          Multi-Dimensional Analysis
        </h2>
        <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
          Your idea analyzed across 5 critical dimensions to provide comprehensive insights
        </p>
      </div>

      {/* Grid Layout - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {dimensionConfig.map((dimension) => (
          <DimensionalScoreBar
            key={dimension.key}
            title={dimension.title}
            score={scores[dimension.key]}
            icon={dimension.icon}
            color={dimension.color}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};

export default DimensionalScoresGrid;
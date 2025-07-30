
import React from 'react';

interface ScoreBarProps {
  score: number;
  text: string;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, text, className = '' }) => {
  // Ensure score is within valid range
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  const getColorClass = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{normalizedScore}</span>
        <span className="text-sm font-medium text-gray-600">
          {getScoreLabel(normalizedScore)}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${getColorClass(normalizedScore)}`}
            style={{ width: `${normalizedScore}%` }}
            role="progressbar"
            aria-label={`Demand score: ${normalizedScore} out of 100`}
          />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default ScoreBar;

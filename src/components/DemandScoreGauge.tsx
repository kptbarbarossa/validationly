import React from 'react';

interface DemandScoreGaugeProps {
  score: number;
}

const DemandScoreGauge: React.FC<DemandScoreGaugeProps> = ({ score }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green-500
    if (score >= 60) return '#F59E0B'; // yellow-500
    if (score >= 40) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg
          className="transform -rotate-90 w-40 h-40"
          viewBox="0 0 160 160"
        >
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${getScoreTextColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-gray-400">/100</div>
          <div className={`text-xs font-medium ${getScoreTextColor(score)} mt-1`}>
            {getScoreLabel(score)}
          </div>
        </div>
      </div>
      
      {/* Score description */}
      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm">
          {score >= 80 && "High demand potential with strong market signals"}
          {score >= 60 && score < 80 && "Good demand potential with positive indicators"}
          {score >= 40 && score < 60 && "Moderate demand potential with mixed signals"}
          {score < 40 && "Low demand potential, consider pivoting or further research"}
        </p>
      </div>
    </div>
  );
};

export default DemandScoreGauge;

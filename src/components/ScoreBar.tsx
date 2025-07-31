
import React from 'react';
import CountUp from './CountUp';

interface ScoreBarProps {
  score: number;
  text: string;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, text, className = '' }) => {
  // Ensure score is within valid range
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  const getStrokeColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#eab308'; // yellow-500
    if (score >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '✅';
    if (score >= 40) return '⚠️';
    return '❌';
  };

  const circumference = 2 * Math.PI * 56; // radius = 56
  const strokeDasharray = `${(normalizedScore / 100) * circumference} ${circumference}`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Circular progress */}
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getStrokeColor(normalizedScore)} />
              <stop offset="100%" stopColor={getStrokeColor(normalizedScore)} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="64" cy="64" r="56"
            fill="none" stroke="#f3f4f6" strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="64" cy="64" r="56"
            fill="none" 
            stroke="url(#scoreGradient)" 
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-2000 ease-out"
            style={{
              animation: 'drawCircle 2s ease-out forwards'
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              <CountUp end={normalizedScore} duration={2000} />
            </div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
        </div>
      </div>
      
      {/* Score interpretation */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          normalizedScore >= 80 ? 'bg-green-100 text-green-800' :
          normalizedScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
          normalizedScore >= 40 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          <span>{getScoreIcon(normalizedScore)}</span>
          {getScoreLabel(normalizedScore)}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mt-4 max-w-md">
          {text}
        </p>
      </div>
      
      <style jsx>{`
        @keyframes drawCircle {
          from {
            stroke-dasharray: 0 ${circumference};
          }
          to {
            stroke-dasharray: ${strokeDasharray};
          }
        }
      `}</style>
    </div>
  );
};

export default ScoreBar;

import React from 'react';
import CountUp from './CountUp';
import type { DimensionalScore } from '../types';

interface DimensionalScoreBarProps {
  title: string;
  score: DimensionalScore;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  className?: string;
}

const DimensionalScoreBar: React.FC<DimensionalScoreBarProps> = ({ 
  title, 
  score, 
  icon, 
  color, 
  className = '' 
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score.score));
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      progress: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      progress: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      progress: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      progress: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      progress: 'bg-pink-500',
      gradient: 'from-pink-500 to-pink-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
            <span className={`${colors.text} text-lg`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">0-100 scale</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl lg:text-3xl font-bold text-gray-900">
            <CountUp end={normalizedScore} duration={1500} />
          </div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-2000 ease-out`}
            style={{ 
              width: `${normalizedScore}%`,
              animation: 'progressFill 2s ease-out forwards'
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Score Reasoning */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {score.reasoning}
        </p>
      </div>

      {/* Key Factors */}
      {score.keyFactors && score.keyFactors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Key Factors</h4>
          <div className="flex flex-wrap gap-1">
            {score.keyFactors.slice(0, 3).map((factor, index) => (
              <span 
                key={index}
                className={`inline-block px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-md`}
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Areas */}
      {score.improvementAreas && score.improvementAreas.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Improvement Areas</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {score.improvementAreas.slice(0, 2).map((area, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-gray-400 mt-0.5">•</span>
                <span className="line-clamp-1">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: ${normalizedScore}%;
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DimensionalScoreBar;
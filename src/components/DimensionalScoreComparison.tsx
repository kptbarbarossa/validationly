import React, { useState } from 'react';
import type { DimensionalScores } from '../types';

interface DimensionalScoreComparisonProps {
  scores: DimensionalScores;
  className?: string;
}

const DimensionalScoreComparison: React.FC<DimensionalScoreComparisonProps> = ({ 
  scores, 
  className = '' 
}) => {
  const [activeView, setActiveView] = useState<'radar' | 'bar'>('radar');

  const dimensionData = [
    {
      key: 'marketSize' as keyof DimensionalScores,
      label: 'Market Size',
      shortLabel: 'Market',
      score: scores.marketSize.score,
      color: '#3b82f6' // blue-500
    },
    {
      key: 'competitionIntensity' as keyof DimensionalScores,
      label: 'Competition Intensity',
      shortLabel: 'Competition',
      score: scores.competitionIntensity.score,
      color: '#f97316' // orange-500
    },
    {
      key: 'technicalFeasibility' as keyof DimensionalScores,
      label: 'Technical Feasibility',
      shortLabel: 'Technical',
      score: scores.technicalFeasibility.score,
      color: '#8b5cf6' // purple-500
    },
    {
      key: 'monetizationPotential' as keyof DimensionalScores,
      label: 'Monetization Potential',
      shortLabel: 'Monetization',
      score: scores.monetizationPotential.score,
      color: '#10b981' // green-500
    },
    {
      key: 'timingTrend' as keyof DimensionalScores,
      label: 'Market Timing',
      shortLabel: 'Timing',
      score: scores.timingTrend.score,
      color: '#ec4899' // pink-500
    }
  ];

  const maxScore = Math.max(...dimensionData.map(d => d.score));
  const averageScore = dimensionData.reduce((sum, d) => sum + d.score, 0) / dimensionData.length;

  // Radar Chart Component
  const RadarChart = () => {
    const size = 280;
    const center = size / 2;
    const radius = 100;
    const levels = 5;

    // Generate pentagon points for radar chart
    const getPoint = (angle: number, distance: number) => {
      const radian = (angle - 90) * (Math.PI / 180);
      return {
        x: center + Math.cos(radian) * distance,
        y: center + Math.sin(radian) * distance
      };
    };

    const angles = dimensionData.map((_, index) => (index * 360) / dimensionData.length);

    return (
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background grid */}
          {Array.from({ length: levels }, (_, i) => {
            const levelRadius = radius * ((i + 1) / levels);
            const points = angles.map(angle => getPoint(angle, levelRadius));
            return (
              <polygon
                key={i}
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Axis lines */}
          {angles.map((angle, index) => {
            const point = getPoint(angle, radius);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={dimensionData.map((d, index) => {
              const point = getPoint(angles[index], (d.score / 100) * radius);
              return `${point.x},${point.y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {dimensionData.map((d, index) => {
            const point = getPoint(angles[index], (d.score / 100) * radius);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={d.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Labels */}
          {dimensionData.map((d, index) => {
            const labelPoint = getPoint(angles[index], radius + 25);
            return (
              <text
                key={index}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {d.shortLabel}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  // Bar Chart Component
  const BarChart = () => (
    <div className="space-y-3">
      {dimensionData.map((dimension) => (
        <div key={dimension.key} className="flex items-center gap-3">
          <div className="w-20 text-xs font-medium text-gray-700 text-right">
            {dimension.shortLabel}
          </div>
          <div className="flex-1 relative">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1500 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${dimension.score}%`,
                  backgroundColor: dimension.color,
                  animation: `barFill-${dimension.key} 1.5s ease-out forwards`
                }}
              >
                <span className="text-xs font-medium text-white">
                  {dimension.score}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Score Comparison
          </h3>
          <p className="text-sm text-gray-600">
            Visual comparison across all dimensions
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('radar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeView === 'radar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setActiveView('bar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeView === 'bar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bars
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="mb-6">
        {activeView === 'radar' ? <RadarChart /> : <BarChart />}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(averageScore)}
          </div>
          <div className="text-xs text-gray-600">Average Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {maxScore}
          </div>
          <div className="text-xs text-gray-600">Highest Score</div>
        </div>
        <div className="text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-purple-600">
            {dimensionData.find(d => d.score === maxScore)?.shortLabel || 'N/A'}
          </div>
          <div className="text-xs text-gray-600">Strongest Area</div>
        </div>
      </div>

      {/* Dynamic styles for bar animations */}
      <style>{`
        ${dimensionData.map(d => `
          @keyframes barFill-${d.key} {
            from { width: 0%; }
            to { width: ${d.score}%; }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
};

export default DimensionalScoreComparison;
import React, { useState, useEffect } from 'react';

interface ScoreSectionProps {
  score: number;
  maxScore?: number;
  classification?: {
    primaryCategory: string;
    confidence?: number;
  };
  justification: string;
}

export const ImprovedScoreSection: React.FC<ScoreSectionProps> = ({
  score,
  maxScore = 100,
  classification,
  justification
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '👍';
    if (score >= 40) return '⚠️';
    return '🔄';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent potential! Ready to launch.';
    if (score >= 60) return 'Good potential with some optimization needed.';
    if (score >= 40) return 'Moderate potential, consider pivoting.';
    return 'Low potential, significant changes recommended.';
  };

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Your Validation Score
        </h2>
        <p className="text-slate-400">AI-powered analysis across 7 platforms</p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(animatedScore / maxScore) * 283} 283`}
              className="transition-all duration-2000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {score >= 80 ? (
                  <>
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </>
                ) : score >= 60 ? (
                  <>
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </>
                ) : score >= 40 ? (
                  <>
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </>
                )}
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-white mb-2">
              {animatedScore}
            </div>
            <div className="text-xl text-slate-400">/ {maxScore}</div>
            <div className="text-3xl mt-2">{getScoreEmoji(score)}</div>
          </div>
        </div>
      </div>

      {/* Score Message */}
      <div className="text-center mb-6">
        <p className={`text-xl font-semibold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
          {getScoreMessage(score)}
        </p>
      </div>

      {/* Classification Badge */}
      {classification && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 font-semibold">{classification.primaryCategory}</span>
            {classification.confidence && (
              <span className="text-slate-400 text-sm">
                ({classification.confidence}% confidence)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toggle Details */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl transition-all"
        >
          <span>View Details</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Detailed Justification */}
      {showDetails && (
        <div className="mt-6 p-6 bg-slate-800/30 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Score Breakdown</h3>
          <p className="text-slate-300 leading-relaxed">{justification}</p>
        </div>
      )}
    </div>
  );
};
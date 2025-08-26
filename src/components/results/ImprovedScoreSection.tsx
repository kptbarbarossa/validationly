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
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '👍';
    if (score >= 40) return '⚠️';
    return '🔄';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Mükemmel potansiyel! Lansmanı başlatabilirsiniz.';
    if (score >= 60) return 'İyi potansiyel, bazı optimizasyonlar gerekli.';
    if (score >= 40) return 'Orta potansiyel, pivot düşünülebilir.';
    return 'Düşük potansiyel, önemli değişiklikler öneriliyor.';
  };

  return (
    <div className="space-y-6">
      {/* Large Score Display */}
      <div className="text-center">
        <div className="relative inline-block">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle with gradient */}
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
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </>
                ) : score >= 60 ? (
                  <>
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </>
                ) : score >= 40 ? (
                  <>
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#f87171" />
                  </>
                )}
              </linearGradient>
            </defs>
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {animatedScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">/{maxScore}</div>
          </div>
        </div>
      </div>

      {/* Score Message */}
      <div className="text-center">
        <div className="text-3xl mb-2">{getScoreEmoji(score)}</div>
        <p className={`text-sm font-semibold ${getScoreColor(score)}`}>
          {getScoreMessage(score)}
        </p>
      </div>

      {/* Classification Badge */}
      {classification && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 rounded-full">
            <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{classification.primaryCategory}</span>
            {classification.confidence && (
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {classification.confidence}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toggle Details */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
        >
          <span>Detaylı Analiz</span>
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
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Skor Açıklaması
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{justification}</p>
        </div>
      )}
    </div>
  );
};
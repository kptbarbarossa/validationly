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
    <div className="space-y-4">
      {/* Score Circle - Compact Dashboard Style */}
      <div className="flex justify-center">
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(animatedScore / maxScore) * 283} 283`}
              className={`transition-all duration-2000 ease-out ${score >= 80 ? 'text-green-500' :
                score >= 60 ? 'text-yellow-500' :
                  score >= 40 ? 'text-orange-500' : 'text-red-500'
                }`}
            />
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-xl font-bold ${getScoreColor(score)}`}>
              {animatedScore}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">/{maxScore}</div>
          </div>
        </div>
      </div>

      {/* Score Message */}
      <div className="text-center">
        <div className="text-lg mb-1">{getScoreEmoji(score)}</div>
        <p className={`text-xs font-medium ${getScoreColor(score)}`}>
          {getScoreMessage(score)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-green-500' :
            score >= 60 ? 'bg-yellow-500' :
              score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
          style={{ width: `${animatedScore}%` }}
        />
      </div>

      {/* Toggle Details */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <span>Detaylar</span>
          <svg
            className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`}
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
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Skor Açıklaması</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{justification}</p>
        </div>
      )}
    </div>
  );
};
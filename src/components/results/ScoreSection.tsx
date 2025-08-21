import React from 'react';

interface ScoreSectionProps {
  score: number;
  justification: string;
  confidence: 'high' | 'medium' | 'low';
}

const ScoreSection: React.FC<ScoreSectionProps> = ({ score, justification, confidence }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '📈';
    return '⚠️';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="text-center mb-12 animate-fade-in">
      {/* Score Display */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative glass glass-border p-8 rounded-3xl max-w-md mx-auto">
          <div className="text-6xl md:text-8xl font-bold mb-4">
            <span className={getScoreColor(score)}>
              {score}%
            </span>
            <span className="text-4xl md:text-6xl ml-4">{getScoreEmoji(score)}</span>
          </div>
          
          {/* Confidence Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${getConfidenceColor(confidence)}`}></div>
            <span className="text-sm text-slate-400 capitalize">
              {confidence} Confidence
            </span>
          </div>
          
          {/* Score Ring */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#ef4444'}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${score * 3.5} 350`}
                className="transition-all duration-2000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{score}</div>
                <div className="text-xs text-slate-400">Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Message */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        {score >= 80 ? 'AMAZING!' : score >= 60 ? 'GREAT JOB!' : 'GOOD START!'}
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-4xl mx-auto">
        Your idea has a <span className="font-bold text-yellow-400">validation score</span> of {score}%
      </p>
      
      <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
        {score >= 80 
          ? "🚀 Outstanding potential! This idea shows strong market demand signals."
          : score >= 60 
          ? "📈 Solid foundation with optimization opportunities ahead."
          : "💡 Interesting concept that needs refinement and market research."
        }
      </p>

      {/* Justification */}
      <div className="glass glass-border p-6 rounded-2xl max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-green-400">Why This Score?</h3>
        <p className="text-slate-300 leading-relaxed text-left">{justification}</p>
      </div>
    </div>
  );
};

export default ScoreSection;
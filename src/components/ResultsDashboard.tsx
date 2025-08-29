import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import DemandScoreGauge from './DemandScoreGauge';
import InterestChart from './InterestChart';
import PlatformCard from './PlatformCard';
import AICoFounderChat from './AICoFounderChat';
import { PLATFORMS } from '../constants';
import { ShareIcon } from './icons';

interface ResultsDashboardProps {
  result: AnalysisResult;
  idea: string;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, idea, onReset }) => {
  const platformDataMap = new Map(PLATFORMS.map(p => [p.name, p]));
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  
  // Generate a simple user ID for demo purposes
  const userId = `user_${Date.now()}`;

  const handleShare = async () => {
    const platformDetails = result.platformAnalyses
        .map(p => `- ${p.platform}: ${p.interestLevel}/10 interest`)
        .join('\n');

    const summaryText = `
🚀 TrendPulse Analysis for: "${idea}"

📈 Overall Demand Score: ${result.overallScore}/100

📝 Summary:
${result.summary}

📊 Platform Breakdown:
${platformDetails}

Analyzed with TrendPulse AI.
    `.trim();

    if (navigator.share) {
        try {
            await navigator.share({
                title: `AI Analysis for "${idea}"`,
                text: summaryText,
            });
        } catch (error) {
            console.log('Share was cancelled or failed', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(summaryText);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy results to clipboard.');
        }
    }
  };

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-gray-300">Analysis for:</h2>
        <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mt-1">
          "{idea}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Overall Demand Score</h3>
          <DemandScoreGauge score={result.overallScore} />
        </div>
        <div className="lg:col-span-2 p-6 bg-gray-800/50 rounded-xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-blue-300">Executive Summary</h3>
            <p className="mt-2 text-gray-300">{result.summary}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-300">Potential Market</h3>
            <p className="mt-2 text-gray-300">{result.potentialMarket}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-300">Potential Risks</h3>
            <p className="mt-2 text-gray-300">{result.risks}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <h3 className="text-2xl font-bold mb-4 text-center">Platform Interest Levels</h3>
        <div className="h-80">
          <InterestChart data={result.platformAnalyses} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-center mb-6">Platform-by-Platform Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {result.platformAnalyses.map(analysis => {
            const platformInfo = platformDataMap.get(analysis.platform);
            if (!platformInfo) return null;
            return <PlatformCard key={analysis.platform} analysis={analysis} platformInfo={platformInfo} />;
          })}
        </div>
      </div>

      {/* AI Co-founder Chat Section */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">🤖 AI Co-founder</h3>
          <p className="text-gray-400">Get personalized business advice based on your validation results</p>
        </div>
        <AICoFounderChat 
          userId={userId}
          currentIdea={idea}
          className="max-w-4xl mx-auto"
        />
      </div>

      <div className="text-center pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg text-lg shadow-md hover:scale-105 transform transition-transform duration-200 ease-in-out"
        >
          Analyze Another Idea
        </button>
        <button
            onClick={handleShare}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-400 font-semibold rounded-lg text-lg shadow-md hover:bg-blue-500/10 hover:scale-105 transform transition-all duration-200 ease-in-out"
        >
            <ShareIcon className="w-5 h-5" />
            <span>{shareStatus === 'copied' ? 'Copied!' : 'Share Results'}</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;

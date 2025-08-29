import React, { useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import type { CrossPlatformAnalysis, PlatformInsight } from '../types/platformScanner';
import DemandScoreGauge from './DemandScoreGauge';
import InterestChart from './InterestChart';
import SmartPlatformCard from './SmartPlatformCard';
import AICoFounderChat from './AICoFounderChat';
import { PLATFORMS } from '../constants';
import { ShareIcon } from './icons';
import { platformScannerService } from '../services/platformScannerService';
import { aiAnalyzerService } from '../services/aiAnalyzerService';

interface ResultsDashboardProps {
  result: AnalysisResult;
  idea: string;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, idea, onReset }) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [crossPlatformAnalysis, setCrossPlatformAnalysis] = useState<CrossPlatformAnalysis | null>(null);
  
  // Generate a simple user ID for demo purposes
  const userId = `user_${Date.now()}`;

  // Extract keywords from the idea
  const extractKeywords = (idea: string): string[] => {
    const words = idea.toLowerCase().split(' ');
    return words.filter(word => word.length > 3);
  };

  // Start platform scanning
  const startPlatformScanning = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const keywords = extractKeywords(idea);
      console.log('🔍 Starting platform scan for:', idea);
      console.log('📝 Keywords:', keywords);
      
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      // Scan all platforms
      const scanResults = await platformScannerService.scanAllPlatforms(idea, keywords);
      console.log('📊 Platform scan results:', scanResults);
      
      // Analyze results with AI
      const analysis = await aiAnalyzerService.analyzePlatformResults(scanResults, idea, keywords);
      console.log('🤖 AI analysis results:', analysis);
      
      setCrossPlatformAnalysis(analysis);
      setScanProgress(100);
      
      clearInterval(progressInterval);
      
    } catch (error) {
      console.error('❌ Error during platform scanning:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-start scanning when component mounts
  useEffect(() => {
    startPlatformScanning();
  }, [idea]);

  const handleShare = async () => {
    const platformDetails = result.platformAnalyses
        .map(p => `- ${p.platform}: ${p.interestLevel}/10 interest`)
        .join('\n');

    const summaryText = `
🚀 AI-Powered Platform Analysis for: "${idea}"

📈 Overall Demand Score: ${crossPlatformAnalysis?.overallDemand || result.overallScore}/100

📝 Summary:
${result.summary}

📊 Platform Breakdown:
${platformDetails}

🔍 AI Insights:
${crossPlatformAnalysis?.marketOpportunities.slice(0, 3).join('\n')}

Analyzed with Validationly AI.
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
      {/* Header */}
      <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold text-gray-300">AI-Powered Platform Analysis for:</h2>
        <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mt-1">
          "{idea}"
        </p>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <h3 className="text-xl font-bold text-white">Scanning Platforms with AI...</h3>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">{scanProgress}% Complete</p>
          </div>
        </div>
      )}

      {/* Overall Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">AI Demand Score</h3>
          <DemandScoreGauge score={crossPlatformAnalysis?.overallDemand || result.overallScore} />
        </div>
        <div className="lg:col-span-2 p-6 bg-gray-800/50 rounded-xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-blue-300">AI Market Analysis</h3>
            <p className="mt-2 text-gray-300">
              {crossPlatformAnalysis ? 
                `AI analysis shows ${crossPlatformAnalysis.overallDemand >= 70 ? 'strong' : crossPlatformAnalysis.overallDemand >= 40 ? 'moderate' : 'limited'} market demand across all platforms.` :
                result.summary
              }
            </p>
          </div>
          {crossPlatformAnalysis && (
            <>
              <div>
                <h3 className="text-xl font-bold text-green-300">Market Opportunities</h3>
                <div className="mt-2 space-y-2">
                  {crossPlatformAnalysis.marketOpportunities.slice(0, 2).map((opportunity, index) => (
                    <div key={index} className="text-gray-300 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                      {opportunity}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-300">Risk Factors</h3>
                <div className="mt-2 space-y-2">
                  {crossPlatformAnalysis.riskFactors.slice(0, 2).map((risk, index) => (
                    <div key={index} className="text-gray-300 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Platform Interest Chart */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <h3 className="text-2xl font-bold mb-4 text-center">Platform Interest Levels</h3>
        <div className="h-80">
          <InterestChart data={result.platformAnalyses} />
        </div>
      </div>

      {/* AI-Powered Platform Cards */}
      {crossPlatformAnalysis && (
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">🤖 AI-Powered Platform Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {crossPlatformAnalysis.platformStrengths.map((platformInsight) => (
              <SmartPlatformCard 
                key={platformInsight.platform} 
                platformInsight={platformInsight} 
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Co-founder Chat Section */}
      <div className="p-6 bg-gray-800/50 rounded-xl border border-white/10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">🤖 AI Co-founder</h3>
          <p className="text-gray-400">Get personalized business advice based on AI platform analysis</p>
        </div>
        <AICoFounderChat 
          userId={userId}
          currentIdea={idea}
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Action Buttons */}
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

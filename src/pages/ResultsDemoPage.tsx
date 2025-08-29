import React from 'react';
import ResultsDashboard from '../components/ResultsDashboard';
import type { AnalysisResult } from '../types';

const ResultsDemoPage: React.FC = () => {
  // Sample data for demonstration
  const sampleResult: AnalysisResult = {
    overallScore: 78,
    summary: "This idea shows strong market potential with clear demand signals across multiple platforms. The concept addresses a genuine pain point in the productivity space and has demonstrated user interest through various validation channels.",
    potentialMarket: "The target market includes remote workers, small business owners, and productivity enthusiasts aged 25-45. Estimated market size is $2.3B with 15% annual growth rate.",
    risks: "Main risks include high competition from established players, potential regulatory changes in the productivity software space, and dependency on third-party integrations.",
    platformAnalyses: [
      { platform: 'twitter', interestLevel: 8 },
      { platform: 'reddit', interestLevel: 9 },
      { platform: 'linkedin', interestLevel: 7 },
      { platform: 'producthunt', interestLevel: 8 },
      { platform: 'github', interestLevel: 6 },
      { platform: 'stackoverflow', interestLevel: 5 },
      { platform: 'youtube', interestLevel: 7 },
      { platform: 'instagram', interestLevel: 4 },
      { platform: 'tiktok', interestLevel: 3 },
      { platform: 'facebook', interestLevel: 5 }
    ]
  };

  const handleReset = () => {
    alert('Reset functionality would navigate back to the analysis form');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Results Dashboard Demo
          </h1>
          <p className="text-gray-400 mt-2">
            This is a demonstration of the ResultsDashboard component
          </p>
        </div>
        
        <ResultsDashboard 
          result={sampleResult}
          idea="AI-powered productivity assistant for remote teams"
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

export default ResultsDemoPage;

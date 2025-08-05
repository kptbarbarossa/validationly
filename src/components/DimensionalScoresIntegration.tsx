import React from 'react';
import DimensionalAnalysisSection from './DimensionalAnalysisSection';
import type { EnhancedValidationResult } from '../types';

interface DimensionalScoresIntegrationProps {
  result: EnhancedValidationResult;
  className?: string;
}

/**
 * Integration component that shows how to use dimensional scores in the results page
 * This component demonstrates the integration with the enhanced validation result
 */
const DimensionalScoresIntegration: React.FC<DimensionalScoresIntegrationProps> = ({ 
  result, 
  className = '' 
}) => {
  // Check if dimensional scores are available
  if (!result.dimensionalScores) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-yellow-600 text-2xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Dimensional Analysis Not Available
          </h3>
          <p className="text-sm text-yellow-700">
            This analysis was performed with the basic validation system. 
            Upgrade to enhanced analysis for multi-dimensional insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Enhanced Analysis Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Enhanced Multi-Dimensional Analysis
            </h2>
            <p className="text-sm text-gray-600">
              AI-powered analysis across 5 critical business dimensions
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {result.overallScore}/100
            </div>
            <div className="text-xs text-gray-500">Overall Score</div>
          </div>
        </div>
        
        {/* Analysis Metadata */}
        {result.analysisMetadata && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">AI Model</div>
                <div className="font-medium text-gray-900">
                  {result.analysisMetadata.aiModel}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Confidence</div>
                <div className="font-medium text-gray-900">
                  {result.analysisMetadata.confidence}%
                </div>
              </div>
              <div>
                <div className="text-gray-600">Completeness</div>
                <div className="font-medium text-gray-900">
                  {result.analysisMetadata.completeness}%
                </div>
              </div>
              <div>
                <div className="text-gray-600">Language</div>
                <div className="font-medium text-gray-900">
                  {result.analysisMetadata.language.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Dimensional Analysis */}
      <DimensionalAnalysisSection 
        scores={result.dimensionalScores}
        overallScore={result.overallScore}
      />

      {/* Industry Context */}
      {result.industryFramework && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Industry Context: {result.industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Industry Considerations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.industryFramework.specificConsiderations.slice(0, 3).map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Success Patterns</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.industryFramework.successPatterns.slice(0, 3).map((pattern, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Industry Confidence */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Industry Classification Confidence</span>
              <span className="font-medium text-gray-900">{result.industryConfidence}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DimensionalScoresIntegration;
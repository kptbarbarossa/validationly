import React from 'react';
import DimensionalAnalysisSection from './DimensionalAnalysisSection';
import type { DimensionalScores } from '../types';

// Demo data for testing the components
const mockDimensionalScores: DimensionalScores = {
  marketSize: {
    score: 85,
    reasoning: 'Large addressable market with millions of potential customers globally. The market shows strong growth trends and has significant untapped segments.',
    keyFactors: ['Global market reach', 'Growing user demand', 'Underserved segments', 'Market expansion potential'],
    improvementAreas: ['Better market segmentation needed', 'Competitive landscape analysis required']
  },
  competitionIntensity: {
    score: 60,
    reasoning: 'Moderate competition with several established players, but opportunities exist for differentiation through unique value propositions.',
    keyFactors: ['Few direct competitors', 'Market gaps identified', 'Differentiation opportunities', 'Barrier to entry moderate'],
    improvementAreas: ['Stronger competitive moat needed', 'Value proposition refinement', 'Competitive analysis depth']
  },
  technicalFeasibility: {
    score: 70,
    reasoning: 'Technically achievable with current technology stack and available resources. Some complexity exists but manageable with proper planning.',
    keyFactors: ['Proven technology stack', 'Available development resources', 'Scalable architecture possible', 'Technical expertise accessible'],
    improvementAreas: ['Technical complexity assessment', 'Resource allocation planning', 'Scalability considerations']
  },
  monetizationPotential: {
    score: 80,
    reasoning: 'Strong monetization potential with multiple revenue streams possible. High willingness to pay observed in target market segments.',
    keyFactors: ['Multiple revenue models', 'High customer lifetime value', 'Recurring revenue potential', 'Premium pricing viable'],
    improvementAreas: ['Pricing model optimization', 'Customer acquisition cost reduction', 'Revenue stream validation']
  },
  timingTrend: {
    score: 65,
    reasoning: 'Good market timing with positive industry trends and favorable conditions. Technology readiness aligns with market needs.',
    keyFactors: ['Positive market trends', 'Technology maturity', 'Consumer behavior shifts', 'Economic conditions favorable'],
    improvementAreas: ['Market timing precision', 'Trend sustainability analysis', 'Competitive timing considerations']
  }
};

const DimensionalScoresDemo: React.FC = () => {
  const overallScore = 72; // Calculated weighted average

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dimensional Scores UI Components Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive demonstration of the multi-dimensional scoring system with responsive design and visual comparisons.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <span>🎯</span>
            Task 2.3: Dimensional Scores UI Components
          </div>
        </div>

        {/* Main Demo Component */}
        <DimensionalAnalysisSection 
          scores={mockDimensionalScores}
          overallScore={overallScore}
        />

        {/* Feature Highlights */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Component Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Progress Bars</h3>
              <p className="text-sm text-gray-600">
                Animated progress bars with smooth transitions and visual feedback for each dimension.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visual Comparisons</h3>
              <p className="text-sm text-gray-600">
                Radar and bar charts for comparing scores across all dimensions with interactive toggles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-sm text-gray-600">
                Fully responsive layout that adapts to mobile, tablet, and desktop screen sizes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 text-xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Color-Coded System</h3>
              <p className="text-sm text-gray-600">
                Each dimension has distinct colors and icons for easy identification and visual appeal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-pink-600 text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smooth Animations</h3>
              <p className="text-sm text-gray-600">
                Engaging animations and transitions that enhance user experience without being distracting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Insights</h3>
              <p className="text-sm text-gray-600">
                Rich contextual information including reasoning, key factors, and improvement areas.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Implementation Notes */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Components Created:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• DimensionalScoreBar - Individual score display</li>
                <li>• DimensionalScoresGrid - Grid layout for all scores</li>
                <li>• DimensionalScoreComparison - Radar & bar charts</li>
                <li>• DimensionalScoresSummary - Overview with insights</li>
                <li>• DimensionalAnalysisSection - Main container</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-300 mb-2">Features Implemented:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Responsive grid layouts (1-3 columns)</li>
                <li>• Interactive tab navigation</li>
                <li>• Animated progress bars and charts</li>
                <li>• Mobile-optimized touch interfaces</li>
                <li>• Accessibility-compliant design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionalScoresDemo;
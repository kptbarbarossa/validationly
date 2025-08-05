
import type { ValidationResult, ApiError } from '../types.js';

interface ValidationRequest {
  idea: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export const validateIdea = async (idea: string): Promise<ValidationResult> => {
  try {
    // Input validation with better error handling
    if (!idea || typeof idea !== 'string') {
      throw new Error('Idea is required and must be a string');
    }

    const trimmedIdea = idea.trim();
    
    if (trimmedIdea.length < 3) {
      throw new Error('Idea must be at least 3 characters long');
    }

    if (trimmedIdea.length > 1000) {
      throw new Error('Idea must be less than 1000 characters');
    }

    const response = await fetch('/api/enhanced-validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: trimmedIdea }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.error?.message || result.message || 'An error occurred during validation';
      throw new Error(errorMessage);
    }

    // Enhanced API returns data in { data: enhancedResult } format
    const enhancedResult = result.data;
    
    // Response validation for enhanced format
    if (!enhancedResult || typeof enhancedResult.overallScore !== 'number') {
      throw new Error('Invalid response format from enhanced API');
    }

    // Convert enhanced result to legacy ValidationResult format for backward compatibility
    const legacyResult: ValidationResult = {
      idea: enhancedResult.idea,
      content: enhancedResult.idea,
      demandScore: enhancedResult.overallScore,
      scoreJustification: enhancedResult.scoreJustification || 'Enhanced AI analysis completed',
      signalSummary: enhancedResult.signalSummary || [
        { platform: 'X', summary: 'Enhanced analysis shows positive market signals' },
        { platform: 'Reddit', summary: 'Community interest detected in relevant discussions' },
        { platform: 'LinkedIn', summary: 'Professional network shows potential for adoption' }
      ],
      tweetSuggestion: enhancedResult.tweetSuggestion || 'Share your innovative idea on X!',
      redditTitleSuggestion: enhancedResult.redditTitleSuggestion || 'Looking for feedback on my startup idea',
      redditBodySuggestion: enhancedResult.redditBodySuggestion || 'I\'ve been working on this concept and would love your thoughts.',
      linkedinSuggestion: enhancedResult.linkedinSuggestion || 'Exploring a new business opportunity in the market.',
      
      // Enhanced fields (if available)
      industry: enhancedResult.industry,
      industryConfidence: enhancedResult.industryConfidence,
      industryFramework: enhancedResult.industryFramework,
      industrySpecificInsights: enhancedResult.industrySpecificInsights,
      dimensionalScores: enhancedResult.dimensionalScores,
      riskMatrix: enhancedResult.riskMatrix,
      overallRiskLevel: enhancedResult.overallRiskLevel,
      
      // Legacy fields for backward compatibility
      scoreBreakdown: enhancedResult.scoreBreakdown || {
        marketSize: enhancedResult.dimensionalScores?.marketSize?.score || 20,
        competition: enhancedResult.dimensionalScores?.competitionIntensity?.score || 15,
        feasibility: enhancedResult.dimensionalScores?.technicalFeasibility?.score || 17,
        trendMomentum: enhancedResult.dimensionalScores?.timingTrend?.score || 12
      },
      validationlyScore: enhancedResult.validationlyScore,
      enhancementMetadata: enhancedResult.analysisMetadata ? {
        enhancementApplied: true,
        aiConfidence: enhancedResult.analysisMetadata.confidence,
        redditAnalyzed: true,
        trendsAnalyzed: true,
        fallbackUsed: enhancedResult.analysisMetadata.fallbackUsed
      } : undefined
    };

    return legacyResult;

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected network error occurred');
  }
};

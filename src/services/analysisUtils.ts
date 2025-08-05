import { 
  IndustryCategory, 
  RiskLevel, 
  DimensionalScores,
  RiskMatrix,
  EnhancedValidationResult,
  ValidationResult
} from '../types';

/**
 * Analysis utility functions and constants
 * Supporting enhanced analysis methodology requirements
 */

// Analysis version for tracking and compatibility
export const ANALYSIS_VERSION = '2.0.0';

// Default analysis configuration
export const DEFAULT_ANALYSIS_CONFIG = {
  language: 'en',
  aiModel: 'gemini-2.0-flash-experimental',
  fallbackModel: 'gemini-1.5-flash',
  timeout: 30000, // 30 seconds
  maxRetries: 3
};

// Score validation constants
export const SCORE_BOUNDS = {
  MIN: 0,
  MAX: 100,
  DEFAULT: 50
};

// Risk level mappings
export const RISK_LEVEL_SCORES = {
  Low: { min: 1, max: 3 },
  Medium: { min: 4, max: 6 },
  High: { min: 7, max: 10 }
} as const;

/**
 * Validates and normalizes a score to be within bounds
 */
export function validateScore(score: number): number {
  if (isNaN(score) || score < SCORE_BOUNDS.MIN) {
    return SCORE_BOUNDS.MIN;
  }
  if (score > SCORE_BOUNDS.MAX) {
    return SCORE_BOUNDS.MAX;
  }
  return Math.round(score);
}

/**
 * Calculates overall score from dimensional scores with industry weights
 */
export function calculateWeightedScore(
  scores: DimensionalScores,
  weights: Record<string, number>
): number {
  const weightedSum = 
    scores.marketSize.score * weights.marketSize +
    scores.competitionIntensity.score * weights.competition +
    scores.technicalFeasibility.score * weights.technical +
    scores.monetizationPotential.score * weights.monetization +
    scores.timingTrend.score * weights.timing;
  
  return validateScore(weightedSum);
}

/**
 * Determines overall risk level from risk matrix
 */
export function calculateOverallRiskLevel(riskMatrix: RiskMatrix): RiskLevel {
  const riskScores = Object.values(riskMatrix).map(risk => {
    switch (risk.level) {
      case 'Low': return 1;
      case 'Medium': return 2;
      case 'High': return 3;
      default: return 2;
    }
  });
  
  const averageRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
  
  if (averageRisk <= 1.5) return 'Low';
  if (averageRisk <= 2.5) return 'Medium';
  return 'High';
}

/**
 * Generates a confidence score based on analysis completeness
 */
export function calculateAnalysisConfidence(
  industryConfidence: number,
  dimensionalScores: DimensionalScores,
  hasRiskAssessment: boolean,
  hasCompetitorAnalysis: boolean,
  hasFinancialProjections: boolean
): number {
  let confidence = industryConfidence * 0.2; // 20% weight for industry classification
  
  // 30% weight for dimensional scores quality
  const avgScoreConfidence = Object.values(dimensionalScores).reduce((sum, score) => {
    return sum + (score.keyFactors.length > 0 ? 100 : 50);
  }, 0) / 5;
  confidence += avgScoreConfidence * 0.3;
  
  // 50% weight for analysis completeness
  const completenessScore = [
    hasRiskAssessment,
    hasCompetitorAnalysis,
    hasFinancialProjections
  ].filter(Boolean).length / 3 * 100;
  confidence += completenessScore * 0.5;
  
  return validateScore(confidence);
}

/**
 * Calculates analysis completeness percentage
 */
export function calculateAnalysisCompleteness(result: Partial<EnhancedValidationResult>): number {
  const requiredComponents = [
    'dimensionalScores',
    'riskMatrix',
    'competitorAnalysis',
    'financialProjections',
    'platformAnalysis',
    'personaAnalysis',
    'validationRoadmap',
    'nextSteps',
    'timingAnalysis'
  ];
  
  const completedComponents = requiredComponents.filter(component => {
    return result[component as keyof EnhancedValidationResult] !== undefined;
  }).length;
  
  return Math.round((completedComponents / requiredComponents.length) * 100);
}

/**
 * Converts enhanced result to legacy format for backward compatibility
 */
export function convertToLegacyFormat(enhanced: EnhancedValidationResult): ValidationResult {
  return {
    idea: enhanced.idea,
    demandScore: enhanced.overallScore,
    scoreJustification: enhanced.dimensionalScores.marketSize.reasoning,
    signalSummary: [
      {
        platform: 'X',
        summary: enhanced.platformAnalysis.twitter.recommendedApproach
      },
      {
        platform: 'Reddit',
        summary: enhanced.platformAnalysis.reddit.recommendedApproach
      },
      {
        platform: 'LinkedIn',
        summary: enhanced.platformAnalysis.linkedin.recommendedApproach
      }
    ],
    tweetSuggestion: enhanced.tweetSuggestion,
    redditTitleSuggestion: enhanced.redditTitleSuggestion,
    redditBodySuggestion: enhanced.redditBodySuggestion,
    linkedinSuggestion: enhanced.linkedinSuggestion,
    contentType: 'startup_idea',
    confidenceLevel: enhanced.analysisMetadata.confidence,
    scoreBreakdown: {
      marketSize: enhanced.dimensionalScores.marketSize.score,
      competition: enhanced.dimensionalScores.competitionIntensity.score,
      trendMomentum: enhanced.dimensionalScores.timingTrend.score,
      feasibility: enhanced.dimensionalScores.technicalFeasibility.score
    },
    marketTiming: {
      readiness: enhanced.timingAnalysis.currentReadiness,
      trendDirection: enhanced.timingAnalysis.currentReadiness > 70 ? 'Rising' : 
                     enhanced.timingAnalysis.currentReadiness > 40 ? 'Stable' : 'Declining',
      optimalWindow: enhanced.timingAnalysis.optimalTiming
    }
  };
}

/**
 * Generates analysis metadata
 */
export function generateAnalysisMetadata(
  aiModel: string,
  fallbackUsed: boolean,
  processingTime: number,
  confidence: number,
  language: string,
  completeness: number
) {
  return {
    analysisDate: new Date().toISOString(),
    aiModel,
    fallbackUsed,
    analysisVersion: ANALYSIS_VERSION,
    processingTime,
    confidence: validateScore(confidence),
    language,
    completeness: validateScore(completeness)
  };
}

/**
 * Industry category display names for UI
 */
export const INDUSTRY_DISPLAY_NAMES: Record<IndustryCategory, string> = {
  [IndustryCategory.SAAS_TECH]: 'SaaS & Technology',
  [IndustryCategory.ECOMMERCE]: 'E-commerce & Retail',
  [IndustryCategory.HEALTH_FITNESS]: 'Health & Fitness',
  [IndustryCategory.EDUCATION]: 'Education & Learning',
  [IndustryCategory.FINTECH]: 'Financial Technology',
  [IndustryCategory.MARKETPLACE]: 'Marketplace & Platform',
  [IndustryCategory.CONSUMER_APP]: 'Consumer Mobile App',
  [IndustryCategory.B2B_SERVICES]: 'B2B Services',
  [IndustryCategory.HARDWARE]: 'Hardware & IoT',
  [IndustryCategory.CONTENT_MEDIA]: 'Content & Media'
};

/**
 * Risk level display information for UI
 */
export const RISK_LEVEL_DISPLAY = {
  Low: {
    color: 'green',
    icon: '✅',
    description: 'Low risk - manageable challenges'
  },
  Medium: {
    color: 'yellow',
    icon: '⚠️',
    description: 'Medium risk - requires attention'
  },
  High: {
    color: 'red',
    icon: '🚨',
    description: 'High risk - significant challenges'
  }
} as const;

/**
 * Validates that an object has all required properties for enhanced analysis
 */
export function validateEnhancedResult(result: any): result is EnhancedValidationResult {
  const requiredFields = [
    'idea',
    'industry',
    'overallScore',
    'dimensionalScores',
    'riskMatrix',
    'analysisMetadata'
  ];
  
  return requiredFields.every(field => result[field] !== undefined);
}

/**
 * Creates a default enhanced validation result structure
 */
export function createDefaultEnhancedResult(idea: string, industry: IndustryCategory): Partial<EnhancedValidationResult> {
  return {
    idea,
    industry,
    industryConfidence: 50,
    overallScore: 50,
    overallRiskLevel: 'Medium',
    analysisMetadata: generateAnalysisMetadata(
      DEFAULT_ANALYSIS_CONFIG.aiModel,
      false,
      0,
      50,
      DEFAULT_ANALYSIS_CONFIG.language,
      0
    ),
    // Backward compatibility fields
    demandScore: 50,
    scoreJustification: 'Analysis in progress...',
    signalSummary: [],
    tweetSuggestion: '',
    redditTitleSuggestion: '',
    redditBodySuggestion: '',
    linkedinSuggestion: ''
  };
}

/**
 * Error handling utilities for analysis components
 */
export class AnalysisError extends Error {
  constructor(
    message: string,
    public component: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export function handleAnalysisError(error: unknown, component: string): AnalysisError {
  if (error instanceof AnalysisError) {
    return error;
  }
  
  const message = error instanceof Error ? error.message : 'Unknown analysis error';
  return new AnalysisError(message, component, error instanceof Error ? error : undefined);
}
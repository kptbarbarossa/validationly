import { AdvancedValidationResponse, AdvancedValidationAnalysis } from '../types';

export class AdvancedValidationService {
  private baseUrl: string;

  constructor() {
    // Use relative URL to avoid CSP issues
    this.baseUrl = '';
  }

  async analyzeIdea(idea: string): Promise<AdvancedValidationAnalysis> {
    try {
      console.log('🚀 Starting advanced validation analysis for:', idea.substring(0, 50) + '...');
      
      const response = await fetch(`${this.baseUrl}/api/v1/advanced-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AdvancedValidationResponse = await response.json();
      
      if (!data.success || !data.analysis) {
        throw new Error('Invalid response format from advanced validation API');
      }

      console.log('✅ Advanced validation analysis completed successfully');
      return data.analysis;

    } catch (error) {
      console.error('❌ Advanced validation analysis failed:', error);
      
      // Return a fallback analysis structure
      return this.createFallbackAnalysis(idea, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private createFallbackAnalysis(idea: string, errorMessage: string): AdvancedValidationAnalysis {
    return {
      knowledgeCutoffNotice: "Analysis temporarily unavailable - using fallback system",
      problemAnalysis: {
        coreProblem: "Unable to analyze core problem due to API connection issues",
        jobToBeDone: "Analysis temporarily unavailable",
        problemSeverity: "Unknown",
        problemFrequency: "Unknown", 
        costOfInaction: "Unable to determine at this time"
      },
      targetAudience: {
        primaryArchetypes: [{
          name: "Analysis Unavailable",
          demographics: "Unable to determine",
          psychographics: "Unable to determine",
          motivations: "Unable to determine",
          painPoints: "Unable to determine",
          wateringHoles: ["Analysis temporarily unavailable"]
        }],
        marketSizing: {
          tam: "Unable to estimate",
          sam: "Unable to estimate", 
          disclaimer: "Market sizing analysis temporarily unavailable"
        }
      },
      demandAnalysis: {
        searchAndSocialSignals: "Unable to analyze demand signals at this time",
        proxyProducts: "Proxy product analysis temporarily unavailable",
        willingnessToPay: "Unable to determine willingness to pay",
        demandVerdict: "Moderate",
        antiSignals: ["API connection temporarily unavailable"]
      },
      competitiveLandscape: {
        directCompetitors: ["Analysis temporarily unavailable"],
        indirectCompetitors: ["Analysis temporarily unavailable"],
        nonMarketAlternatives: "Unable to analyze alternatives at this time",
        swotAnalysis: [{
          competitor: "Analysis Unavailable",
          strengths: ["Unable to determine"],
          weaknesses: ["Unable to determine"],
          opportunities: ["Unable to determine"],
          threats: ["Unable to determine"]
        }]
      },
      differentiation: {
        coreDifferentiator: "Unable to determine differentiation strategy",
        valueProposition: "Value proposition analysis temporarily unavailable",
        defensibleMoat: "Moat analysis temporarily unavailable"
      },
      risks: {
        marketRisk: "Risk analysis temporarily unavailable",
        executionRisk: "Risk analysis temporarily unavailable", 
        adoptionRisk: "Risk analysis temporarily unavailable",
        regulatoryRisk: "Risk analysis temporarily unavailable"
      },
      monetization: {
        revenueStreams: ["Monetization analysis temporarily unavailable"],
        pricingHypothesis: "Pricing analysis temporarily unavailable",
        pathToFirstRevenue: "Revenue path analysis temporarily unavailable"
      },
      mvpRecommendation: {
        coreFeatures: ["MVP analysis temporarily unavailable"],
        userJourney: "User journey analysis temporarily unavailable",
        validationMetrics: ["Metrics analysis temporarily unavailable"]
      },
      growthStrategy: {
        earlyAdopterAcquisition: "Growth strategy analysis temporarily unavailable",
        scalableChannels: ["Channel analysis temporarily unavailable"],
        longTermVision: "Vision analysis temporarily unavailable"
      },
      validationScorecard: {
        validationResult: "Moderate",
        validationScore: 50,
        demandResult: "Moderate",
        executiveSummary: `Advanced analysis for "${idea}" is temporarily unavailable due to: ${errorMessage}. Please try again later.`,
        biggestRisk: "API connectivity issues preventing full analysis",
        biggestOpportunity: "Retry analysis when connection is restored"
      },
      metadata: {
        analysisId: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        model: "fallback-system",
        version: "1.0-fallback",
        processingTime: Date.now()
      }
    };
  }

  // Helper method to get validation score color
  getValidationScoreColor(score: number): string {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  }

  // Helper method to get validation result color
  getValidationResultColor(result: string): string {
    switch (result.toLowerCase()) {
      case 'strong': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'weak': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  }

  // Helper method to get demand result color
  getDemandResultColor(result: string): string {
    switch (result.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'niche': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'low': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  }
}

export const advancedValidationService = new AdvancedValidationService();
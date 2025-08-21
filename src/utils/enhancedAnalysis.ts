// Enhanced Analysis System - Sequential Prompts for Premium Users
import { GoogleGenAI } from "@google/genai";
import { IdeaClassification } from './ideaClassifier';

export interface EnhancedAnalysisResult {
  basicAnalysis: any;
  deepDiveAnalysis?: any;
  competitorAnalysis?: any;
  marketTimingAnalysis?: any;
  overallEnhancement: {
    confidenceBoost: number;
    additionalInsights: string[];
    premiumValue: string[];
  };
}

export class EnhancedAnalysisEngine {
  private gemini: GoogleGenAI;
  
  constructor(apiKey: string) {
    this.gemini = new GoogleGenAI(apiKey);
  }

  // Step 1: Identify weak areas from basic analysis
  private identifyWeakAreas(basicResult: any): string[] {
    const weakAreas = [];
    
    if (basicResult.dimensionScores?.marketOpportunity?.score < 70) {
      weakAreas.push('market-opportunity');
    }
    if (basicResult.dimensionScores?.executionFeasibility?.score < 70) {
      weakAreas.push('execution-feasibility');
    }
    if (basicResult.dimensionScores?.businessModelViability?.score < 70) {
      weakAreas.push('business-model');
    }
    if (basicResult.dimensionScores?.goToMarketStrategy?.score < 70) {
      weakAreas.push('go-to-market');
    }
    
    return weakAreas;
  }

  // Step 2: Deep dive analysis on weak areas
  async performDeepDive(
    idea: string, 
    classification: IdeaClassification, 
    basicResult: any, 
    weakAreas: string[]
  ): Promise<any> {
    
    if (weakAreas.length === 0) {
      return { message: "No weak areas identified - strong overall analysis" };
    }

    const deepDivePrompt = `You are a Senior ${classification.primaryCategory} Consultant conducting a DEEP DIVE analysis.

ORIGINAL IDEA: "${idea}"
CLASSIFICATION: ${classification.primaryCategory} | ${classification.businessModel} | ${classification.targetMarket}

BASIC ANALYSIS RESULTS:
- Overall Score: ${basicResult.demandScore}/100
- Market Score: ${basicResult.dimensionScores?.marketOpportunity?.score || 'N/A'}
- Execution Score: ${basicResult.dimensionScores?.executionFeasibility?.score || 'N/A'}
- Business Model Score: ${basicResult.dimensionScores?.businessModelViability?.score || 'N/A'}
- GTM Score: ${basicResult.dimensionScores?.goToMarketStrategy?.score || 'N/A'}

WEAK AREAS IDENTIFIED: ${weakAreas.join(', ')}

DEEP DIVE TASK:
Provide detailed analysis and improvement strategies for the weak areas. Focus on:

${weakAreas.includes('market-opportunity') ? `
1. MARKET OPPORTUNITY DEEP DIVE:
   - Specific market segments with highest potential
   - Underserved niches within the market
   - Market entry timing optimization
   - Geographic expansion opportunities
   - Customer persona refinement
` : ''}

${weakAreas.includes('execution-feasibility') ? `
2. EXECUTION FEASIBILITY DEEP DIVE:
   - Technical implementation roadmap
   - Resource optimization strategies
   - Risk mitigation for technical challenges
   - Team building recommendations
   - Development timeline optimization
` : ''}

${weakAreas.includes('business-model') ? `
3. BUSINESS MODEL DEEP DIVE:
   - Revenue model optimization
   - Pricing strategy alternatives
   - Unit economics improvement
   - Scalability enhancement
   - Monetization timeline acceleration
` : ''}

${weakAreas.includes('go-to-market') ? `
4. GO-TO-MARKET DEEP DIVE:
   - Customer acquisition channel optimization
   - Product-market fit acceleration
   - Competitive positioning refinement
   - Launch strategy enhancement
   - Growth hacking opportunities
` : ''}

RETURN JSON:
{
  "deepDiveInsights": {
    ${weakAreas.map(area => `"${area}": {
      "improvedScore": 0-100,
      "keyImprovements": ["improvement1", "improvement2", "improvement3"],
      "actionableSteps": ["step1", "step2", "step3"],
      "successMetrics": ["metric1", "metric2"],
      "timeframe": "estimated timeline",
      "resourcesNeeded": ["resource1", "resource2"]
    }`).join(',\n    ')}
  },
  "overallImprovementPotential": {
    "scoreIncrease": "potential score increase",
    "confidenceBoost": 0-100,
    "keyLeverages": ["leverage1", "leverage2", "leverage3"]
  },
  "premiumRecommendations": {
    "priorityActions": ["action1", "action2", "action3"],
    "quickWins": ["win1", "win2"],
    "longTermStrategy": ["strategy1", "strategy2"]
  }
}

Focus on actionable, specific improvements that can realistically boost the weak dimension scores.`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: deepDivePrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  }

  // Step 3: Competitor research and analysis
  async performCompetitorAnalysis(
    idea: string, 
    classification: IdeaClassification
  ): Promise<any> {
    
    const competitorPrompt = `You are a Competitive Intelligence Expert specializing in ${classification.primaryCategory} market research.

STARTUP IDEA: "${idea}"
CATEGORY: ${classification.primaryCategory}
BUSINESS MODEL: ${classification.businessModel}
TARGET MARKET: ${classification.targetMarket}

COMPETITIVE ANALYSIS TASK:
Conduct comprehensive competitor research and provide strategic insights.

ANALYSIS FRAMEWORK:

1. COMPETITOR IDENTIFICATION:
   - Direct competitors (same solution, same market)
   - Indirect competitors (different solution, same problem)
   - Adjacent competitors (same solution, different market)
   - Emerging threats (new technologies/approaches)

2. COMPETITIVE LANDSCAPE MAPPING:
   - Market leaders and their strategies
   - Funding levels and investor backing
   - Product feature comparison
   - Pricing strategy analysis
   - Market positioning assessment

3. COMPETITIVE GAPS & OPPORTUNITIES:
   - Underserved market segments
   - Feature gaps in existing solutions
   - Pricing opportunities
   - Geographic expansion gaps
   - Technology advancement opportunities

4. COMPETITIVE STRATEGY RECOMMENDATIONS:
   - Differentiation strategies
   - Competitive positioning
   - Market entry tactics
   - Defensive strategies
   - Partnership opportunities

RETURN JSON:
{
  "competitorAnalysis": {
    "directCompetitors": [
      {
        "name": "competitor name",
        "description": "what they do",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "marketShare": "estimated %",
        "fundingLevel": "funding stage/amount"
      }
    ],
    "indirectCompetitors": [
      {
        "name": "competitor name", 
        "approach": "their solution approach",
        "threatLevel": "Low/Medium/High"
      }
    ],
    "marketGaps": [
      {
        "gap": "market gap description",
        "opportunity": "opportunity description",
        "difficulty": "Low/Medium/High"
      }
    ]
  },
  "competitiveStrategy": {
    "differentiationStrategy": "recommended differentiation approach",
    "competitiveAdvantages": ["advantage1", "advantage2", "advantage3"],
    "marketPositioning": "recommended positioning",
    "entryStrategy": "market entry approach",
    "defensiveStrategies": ["defense1", "defense2"]
  },
  "competitiveScore": 0-100,
  "competitiveRisks": ["risk1", "risk2", "risk3"],
  "competitiveOpportunities": ["opportunity1", "opportunity2", "opportunity3"]
}

Be realistic about competition but identify genuine opportunities for differentiation.`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: competitorPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  }

  // Step 4: Market timing analysis
  async performMarketTimingAnalysis(
    idea: string,
    classification: IdeaClassification
  ): Promise<any> {
    
    const timingPrompt = `You are a Market Timing Expert and Trend Analyst specializing in ${classification.primaryCategory} industry.

STARTUP IDEA: "${idea}"
INDUSTRY: ${classification.primaryCategory}
TARGET MARKET: ${classification.targetMarket}

MARKET TIMING ANALYSIS:
Analyze the optimal timing for launching this startup idea.

TIMING FACTORS TO ANALYZE:

1. INDUSTRY LIFECYCLE STAGE:
   - Where is the ${classification.primaryCategory} industry in its lifecycle?
   - Growth phase, maturity, disruption potential
   - Technology adoption curves
   - Regulatory environment evolution

2. MARKET READINESS:
   - Customer behavior trends
   - Technology infrastructure readiness
   - Economic conditions impact
   - Social/cultural shifts supporting the idea

3. COMPETITIVE TIMING:
   - Competitive landscape maturity
   - Market saturation levels
   - Innovation cycles in the industry
   - Funding environment for ${classification.primaryCategory}

4. EXTERNAL FACTORS:
   - Economic trends affecting ${classification.targetMarket}
   - Regulatory changes on the horizon
   - Technology trends enabling/disrupting
   - Social trends supporting adoption

RETURN JSON:
{
  "marketTiming": {
    "overallTimingScore": 0-100,
    "timingAssessment": "Perfect/Good/Fair/Poor",
    "industryLifecycleStage": "Early/Growth/Mature/Declining",
    "marketReadinessFactors": [
      {
        "factor": "factor name",
        "status": "Supporting/Neutral/Hindering",
        "impact": "High/Medium/Low"
      }
    ]
  },
  "timingRecommendations": {
    "launchTiming": "Immediate/3-6 months/6-12 months/Wait",
    "reasoningForTiming": "detailed explanation",
    "preparationSteps": ["step1", "step2", "step3"],
    "marketEntryStrategy": "timing-optimized strategy"
  },
  "trendAnalysis": {
    "supportingTrends": ["trend1", "trend2", "trend3"],
    "challengingTrends": ["challenge1", "challenge2"],
    "emergingOpportunities": ["opportunity1", "opportunity2"],
    "timingRisks": ["risk1", "risk2"]
  },
  "seasonalConsiderations": {
    "bestLaunchMonths": ["month1", "month2"],
    "seasonalFactors": "seasonal considerations",
    "cyclicalPatterns": "industry cycles to consider"
  }
}

Focus on actionable timing insights that can optimize market entry success.`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: timingPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 2500
      }
    });

    return JSON.parse(result.text || '{}');
  }

  // Main enhanced analysis method
  async performEnhancedAnalysis(
    idea: string,
    classification: IdeaClassification,
    basicResult: any,
    userTier: 'pro' | 'business' | 'enterprise' = 'pro'
  ): Promise<EnhancedAnalysisResult> {
    
    console.log('🚀 Starting enhanced analysis for', userTier, 'user');
    
    const weakAreas = this.identifyWeakAreas(basicResult);
    console.log('📊 Weak areas identified:', weakAreas);
    
    const enhancedResult: EnhancedAnalysisResult = {
      basicAnalysis: basicResult,
      overallEnhancement: {
        confidenceBoost: 0,
        additionalInsights: [],
        premiumValue: []
      }
    };

    // Step 1: Deep dive analysis (all tiers)
    if (weakAreas.length > 0) {
      console.log('🔍 Performing deep dive analysis...');
      enhancedResult.deepDiveAnalysis = await this.performDeepDive(
        idea, classification, basicResult, weakAreas
      );
      enhancedResult.overallEnhancement.confidenceBoost += 20;
      enhancedResult.overallEnhancement.premiumValue.push('Deep dive analysis on weak areas');
    }

    // Step 2: Competitor analysis (business+ tiers)
    if (userTier === 'business' || userTier === 'enterprise') {
      console.log('🕵️ Performing competitor analysis...');
      enhancedResult.competitorAnalysis = await this.performCompetitorAnalysis(
        idea, classification
      );
      enhancedResult.overallEnhancement.confidenceBoost += 25;
      enhancedResult.overallEnhancement.premiumValue.push('Comprehensive competitor intelligence');
    }

    // Step 3: Market timing analysis (enterprise tier)
    if (userTier === 'enterprise') {
      console.log('⏰ Performing market timing analysis...');
      enhancedResult.marketTimingAnalysis = await this.performMarketTimingAnalysis(
        idea, classification
      );
      enhancedResult.overallEnhancement.confidenceBoost += 15;
      enhancedResult.overallEnhancement.premiumValue.push('Market timing optimization');
    }

    // Calculate additional insights
    enhancedResult.overallEnhancement.additionalInsights = [
      `Enhanced analysis completed with ${enhancedResult.overallEnhancement.confidenceBoost}% confidence boost`,
      `Identified ${weakAreas.length} areas for improvement with specific action plans`,
      ...(enhancedResult.competitorAnalysis ? ['Competitive landscape mapped with strategic recommendations'] : []),
      ...(enhancedResult.marketTimingAnalysis ? ['Market timing optimized for maximum success probability'] : [])
    ];

    console.log('✅ Enhanced analysis completed');
    return enhancedResult;
  }
}

// Export utility function for API integration
export const performEnhancedValidation = async (
  idea: string,
  classification: IdeaClassification,
  basicResult: any,
  userTier: 'pro' | 'business' | 'enterprise',
  apiKey: string
): Promise<EnhancedAnalysisResult> => {
  const engine = new EnhancedAnalysisEngine(apiKey);
  return await engine.performEnhancedAnalysis(idea, classification, basicResult, userTier);
};
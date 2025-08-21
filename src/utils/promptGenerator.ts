import { IdeaClassification, getIndustryContext } from './ideaClassifier';

export interface PromptConfig {
  temperature: number;
  maxTokens: number;
  model: string;
}

export const generateEnhancedPrompt = (
  idea: string, 
  classification: IdeaClassification,
  analysisType: 'fast' | 'standard' | 'deep' = 'standard'
): { systemPrompt: string; userPrompt: string; config: PromptConfig } => {
  
  const industryContext = getIndustryContext(classification.primaryCategory);
  
  const systemPrompt = `You are a Senior Startup Validation Expert with deep expertise in ${classification.primaryCategory} industry and ${classification.businessModel} business models.

INDUSTRY EXPERTISE:
- ${classification.primaryCategory} market dynamics and trends
- ${classification.businessModel} revenue models and unit economics
- ${classification.targetMarket} customer behavior and acquisition
- Regulatory landscape: ${industryContext.regulations.join(', ')}
- Key success metrics: ${industryContext.keyMetrics.join(', ')}
- Major competitors: ${industryContext.competitors.slice(0, 3).join(', ')}
- Current trends: ${industryContext.trends.slice(0, 3).join(', ')}

ANALYSIS FRAMEWORK:
You will evaluate this ${classification.primaryCategory} startup idea across four critical dimensions:

1. MARKET OPPORTUNITY (Weight: 30%)
   - Market size and growth potential in ${classification.primaryCategory}
   - Customer pain point severity and urgency
   - Competitive landscape and market saturation
   - Market timing and trend alignment
   - Regulatory environment impact

2. EXECUTION FEASIBILITY (Weight: 25%)
   - Technical complexity and development timeline
   - Required resources and team expertise
   - Capital requirements and funding needs
   - Operational complexity and scalability
   - Risk factors and mitigation strategies

3. BUSINESS MODEL VIABILITY (Weight: 25%)
   - Revenue model strength and predictability
   - Unit economics and profitability potential
   - Customer acquisition cost and lifetime value
   - Pricing power and market positioning
   - Scalability and network effects

4. GO-TO-MARKET STRATEGY (Weight: 20%)
   - Customer acquisition channels effectiveness
   - Product-market fit validation approach
   - Competitive differentiation and positioning
   - Launch strategy and market entry barriers
   - Growth potential and viral mechanics

SCORING METHODOLOGY:
- 90-100: Exceptional opportunity with strong validation signals
- 75-89: Strong opportunity with good market potential
- 60-74: Viable opportunity with moderate potential
- 45-59: Challenging opportunity requiring significant iteration
- 30-44: Weak opportunity with major concerns
- 0-29: Poor opportunity with fundamental flaws

INDUSTRY-SPECIFIC CONSIDERATIONS:
- ${classification.primaryCategory} regulatory requirements
- Typical ${classification.businessModel} success patterns
- ${classification.targetMarket} acquisition strategies
- Common ${classification.primaryCategory} failure modes

Be realistic and data-driven. Consider both opportunities and risks. Provide actionable insights specific to ${classification.primaryCategory} industry.`;

  const userPrompt = `STARTUP IDEA ANALYSIS REQUEST

IDEA: "${idea}"

CLASSIFICATION:
- Category: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}
- Target Market: ${classification.targetMarket}
- Complexity: ${classification.complexity}

ANALYSIS REQUIREMENTS:
Provide comprehensive validation analysis in the following JSON structure:

{
  "overallScore": 0-100,
  "confidence": 0-100,
  "analysisDepth": "${analysisType}",
  
  "dimensionScores": {
    "marketOpportunity": {
      "score": 0-100,
      "justification": "detailed explanation",
      "keyInsights": ["insight1", "insight2", "insight3"],
      "risks": ["risk1", "risk2"],
      "opportunities": ["opportunity1", "opportunity2"]
    },
    "executionFeasibility": {
      "score": 0-100,
      "justification": "detailed explanation",
      "technicalComplexity": "Low/Medium/High",
      "timeToMarket": "estimated months",
      "resourceRequirements": ["requirement1", "requirement2"],
      "keyRisks": ["risk1", "risk2"]
    },
    "businessModelViability": {
      "score": 0-100,
      "justification": "detailed explanation",
      "revenueModel": "primary revenue stream",
      "unitEconomics": "LTV/CAC assessment",
      "monetizationTimeline": "months to revenue",
      "scalabilityFactors": ["factor1", "factor2"]
    },
    "goToMarketStrategy": {
      "score": 0-100,
      "justification": "detailed explanation",
      "primaryChannels": ["channel1", "channel2"],
      "customerAcquisitionStrategy": "strategy description",
      "competitiveDifferentiation": "key differentiators",
      "launchStrategy": "recommended approach"
    }
  },
  
  "industrySpecificInsights": {
    "regulatoryConsiderations": ["consideration1", "consideration2"],
    "industryTrends": ["trend1", "trend2"],
    "competitiveLandscape": "landscape assessment",
    "successFactors": ["factor1", "factor2", "factor3"]
  },
  
  "actionableRecommendations": {
    "immediateNextSteps": ["step1", "step2", "step3"],
    "validationMethods": ["method1", "method2"],
    "pivotOpportunities": ["pivot1", "pivot2"],
    "riskMitigation": ["mitigation1", "mitigation2"]
  },
  
  "socialMediaSuggestions": {
    "tweetSuggestion": "optimized tweet for ${classification.targetMarket}",
    "linkedinSuggestion": "professional LinkedIn post",
    "redditTitleSuggestion": "engaging Reddit title",
    "redditBodySuggestion": "detailed Reddit post body"
  },
  
  "marketData": {
    "estimatedMarketSize": "TAM estimation",
    "growthRate": "annual growth percentage",
    "competitorCount": "number of direct competitors",
    "marketMaturity": "Early/Growth/Mature/Declining"
  }
}

Focus on ${classification.primaryCategory}-specific insights and ${classification.businessModel} best practices. Be realistic about challenges while identifying genuine opportunities.`;

  // Configure based on analysis type
  const configs = {
    fast: { temperature: 0.3, maxTokens: 2000, model: 'gemini-1.5-flash' },
    standard: { temperature: 0.4, maxTokens: 3000, model: 'gemini-1.5-flash' },
    deep: { temperature: 0.5, maxTokens: 4000, model: 'gemini-1.5-pro' }
  };

  return {
    systemPrompt,
    userPrompt,
    config: configs[analysisType]
  };
};

// Generate follow-up prompts for deeper analysis
export const generateFollowUpPrompt = (
  idea: string,
  classification: IdeaClassification,
  initialResult: any,
  focusArea: 'market' | 'technical' | 'financial' | 'gtm'
): string => {
  
  const focusPrompts = {
    market: `Based on the initial analysis showing a market score of ${initialResult.dimensionScores?.marketOpportunity?.score || 'N/A'}, provide deeper market research for this ${classification.primaryCategory} idea:

DEEP MARKET ANALYSIS:
1. Detailed competitive landscape mapping
2. Customer segment analysis and personas
3. Market entry strategy recommendations
4. Pricing strategy and positioning
5. Market timing and trend analysis

Focus on actionable market insights and competitive advantages.`,

    technical: `Given the technical complexity assessment, provide detailed technical feasibility analysis:

TECHNICAL DEEP DIVE:
1. Recommended technology stack and architecture
2. Development timeline and milestones
3. Technical risk assessment and mitigation
4. Scalability planning and infrastructure needs
5. Security and compliance requirements

Provide specific technical recommendations for ${classification.primaryCategory} solutions.`,

    financial: `Expand on the financial viability analysis with detailed business model assessment:

FINANCIAL MODELING:
1. Revenue model optimization
2. Unit economics breakdown (CAC, LTV, margins)
3. Funding requirements and timeline
4. Financial projections (3-year)
5. Profitability pathway and key metrics

Focus on ${classification.businessModel} best practices and realistic projections.`,

    gtm: `Develop comprehensive go-to-market strategy based on ${classification.targetMarket} characteristics:

GTM STRATEGY DEEP DIVE:
1. Customer acquisition channel optimization
2. Product-market fit validation framework
3. Launch sequence and timing
4. Partnership and distribution strategies
5. Growth hacking and viral mechanics

Provide specific tactics for ${classification.primaryCategory} customer acquisition.`
  };

  return focusPrompts[focusArea];
};
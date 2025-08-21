import { GoogleGenAI } from "@google/genai";

// Advanced Multi-Agent Validation System
interface IdeaClassification {
  primaryCategory: string;
  businessModel: string;
  targetMarket: string;
  complexity: string;
  technicalComplexity: string;
  capitalRequirement: string;
}

interface AgentAnalysis {
  agent: string;
  score: number;
  insights: any;
  confidence: number;
  processingTime: number;
}

interface ValidationResult {
  overallScore: number;
  agentAnalyses: AgentAnalysis[];
  synthesis: string;
  recommendations: string[];
  riskFactors: string[];
  nextSteps: string[];
}

class AdvancedValidationEngine {
  private gemini: GoogleGenAI;
  
  constructor(apiKey: string) {
    this.gemini = new GoogleGenAI(apiKey);
  }

  // Step 1: Classify the idea for targeted analysis
  async classifyIdea(idea: string): Promise<IdeaClassification> {
    const classificationPrompt = `
You are an AI Startup Idea Classifier with deep expertise in business categorization.

TASK: Analyze and classify this startup idea for targeted validation.

IDEA: "${idea}"

CLASSIFICATION FRAMEWORK:
1. PRIMARY CATEGORY: Identify the main industry vertical
   - SaaS, E-commerce, Marketplace, FinTech, HealthTech, EdTech, Gaming, Social, Hardware, AI/ML, Other

2. BUSINESS MODEL: How does it make money?
   - B2B, B2C, B2B2C, Marketplace, Subscription, Freemium, Transaction, Hardware, Advertising

3. TARGET MARKET: Who is the primary customer?
   - SMB, Enterprise, Consumer, Developer, Creator, Student, Professional, Healthcare, Finance

4. COMPLEXITY: Overall execution difficulty
   - Simple (MVP in weeks), Medium (MVP in months), Complex (6+ months), Very Complex (1+ years)

5. TECHNICAL COMPLEXITY: Development difficulty
   - Low (basic web/mobile), Medium (APIs, databases), High (AI/ML, real-time), Very High (hardware, deep tech)

6. CAPITAL REQUIREMENT: Funding needs to reach profitability
   - Low (<$100K), Medium ($100K-$1M), High ($1M-$10M), Very High (>$10M)

RETURN ONLY JSON:
{
  "primaryCategory": "category",
  "businessModel": "model", 
  "targetMarket": "market",
  "complexity": "level",
  "technicalComplexity": "level",
  "capitalRequirement": "level",
  "reasoning": "Brief explanation of classification decisions"
}

Be precise and realistic. Consider market realities and execution challenges.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: classificationPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 1000
      }
    });

    return JSON.parse(result.text || '{}');
  }

  // Step 2: Market Research Agent
  async analyzeMarket(idea: string, classification: IdeaClassification): Promise<AgentAnalysis> {
    const startTime = Date.now();
    
    const marketPrompt = `
You are a Senior Market Research Analyst with 15+ years experience in ${classification.primaryCategory} industry.

EXPERTISE: Market sizing, competitive analysis, customer behavior, industry trends, regulatory landscape.

TASK: Conduct comprehensive market analysis for this ${classification.primaryCategory} startup idea.

IDEA: "${idea}"
CATEGORY: ${classification.primaryCategory}
BUSINESS MODEL: ${classification.businessModel}
TARGET MARKET: ${classification.targetMarket}

ANALYSIS FRAMEWORK:

1. MARKET OPPORTUNITY (Weight: 30%)
   - Total Addressable Market (TAM) estimation
   - Serviceable Addressable Market (SAM)
   - Market growth rate and trajectory
   - Market maturity and saturation level

2. COMPETITIVE LANDSCAPE (Weight: 25%)
   - Direct competitors (identify top 3-5)
   - Indirect competitors and substitutes
   - Market leaders and their strategies
   - Competitive gaps and opportunities
   - Barriers to entry

3. CUSTOMER ANALYSIS (Weight: 25%)
   - Primary customer segments
   - Customer pain points and urgency
   - Buying behavior and decision process
   - Price sensitivity and willingness to pay
   - Adoption barriers and switching costs

4. INDUSTRY DYNAMICS (Weight: 20%)
   - Key industry trends (supporting/opposing)
   - Regulatory environment and changes
   - Technology disruptions
   - Economic factors impact

SCORING CRITERIA:
- 90-100: Massive market opportunity, weak competition, urgent customer need
- 70-89: Large market, manageable competition, clear customer demand
- 50-69: Moderate market, competitive landscape, some customer interest
- 30-49: Small market, strong competition, unclear demand
- 0-29: Minimal market, saturated competition, weak customer need

RETURN JSON:
{
  "marketScore": 0-100,
  "marketSize": "TAM/SAM estimates",
  "growthRate": "annual percentage",
  "competitiveIntensity": "Low/Medium/High",
  "customerDemand": "Weak/Moderate/Strong/Urgent",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "opportunities": ["opportunity1", "opportunity2"],
  "threats": ["threat1", "threat2"],
  "confidence": 0-100
}

Be realistic and data-driven. Avoid over-optimistic projections.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: marketPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const analysis = JSON.parse(result.text || '{}');
    
    return {
      agent: 'market-research',
      score: analysis.marketScore || 50,
      insights: analysis,
      confidence: analysis.confidence || 70,
      processingTime: Date.now() - startTime
    };
  }

  // Step 3: Technical Feasibility Agent
  async analyzeTechnical(idea: string, classification: IdeaClassification): Promise<AgentAnalysis> {
    const startTime = Date.now();
    
    const technicalPrompt = `
You are a Senior Technical Architect and CTO with expertise in ${classification.primaryCategory} solutions.

TECHNICAL EXPERTISE: System architecture, scalability, security, development timelines, technology selection.

TASK: Assess technical feasibility and implementation complexity.

IDEA: "${idea}"
TECHNICAL COMPLEXITY: ${classification.technicalComplexity}
CATEGORY: ${classification.primaryCategory}

TECHNICAL ASSESSMENT:

1. ARCHITECTURE COMPLEXITY (Weight: 25%)
   - System architecture requirements
   - Database design complexity
   - API design and integrations
   - Real-time processing needs
   - Scalability requirements

2. DEVELOPMENT EFFORT (Weight: 25%)
   - Core features complexity (1-10)
   - Advanced features complexity (1-10)
   - UI/UX complexity (1-10)
   - Integration complexity (1-10)
   - Testing and QA requirements

3. TECHNOLOGY STACK (Weight: 20%)
   - Recommended tech stack
   - Technology maturity and stability
   - Developer talent availability
   - Learning curve for team
   - Technology risks

4. SECURITY & COMPLIANCE (Weight: 15%)
   - Security requirements level
   - Data privacy considerations
   - Regulatory compliance needs
   - Risk assessment and mitigation

5. SCALABILITY & PERFORMANCE (Weight: 15%)
   - Initial capacity requirements
   - Scaling bottlenecks identification
   - Performance optimization needs
   - Infrastructure requirements

SCORING CRITERIA:
- 90-100: Simple implementation, proven technologies, minimal risks
- 70-89: Moderate complexity, standard technologies, manageable risks
- 50-69: Complex but feasible, some new technologies, moderate risks
- 30-49: Very complex, cutting-edge tech required, high risks
- 0-29: Extremely complex, unproven tech, major technical barriers

RETURN JSON:
{
  "technicalScore": 0-100,
  "developmentTimeline": "MVP timeline in weeks",
  "teamSizeRequired": "number of developers",
  "technologyRisk": "Low/Medium/High",
  "scalabilityScore": 0-100,
  "securityComplexity": "Low/Medium/High",
  "keyTechnicalChallenges": ["challenge1", "challenge2"],
  "recommendedStack": ["tech1", "tech2", "tech3"],
  "confidence": 0-100
}

Be realistic about development timelines and technical challenges.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: technicalPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const analysis = JSON.parse(result.text || '{}');
    
    return {
      agent: 'technical-feasibility',
      score: analysis.technicalScore || 50,
      insights: analysis,
      confidence: analysis.confidence || 70,
      processingTime: Date.now() - startTime
    };
  }

  // Step 4: Financial Viability Agent
  async analyzeFinancial(idea: string, classification: IdeaClassification): Promise<AgentAnalysis> {
    const startTime = Date.now();
    
    const financialPrompt = `
You are a Senior Financial Analyst and Startup CFO with expertise in ${classification.businessModel} business models.

FINANCIAL EXPERTISE: Revenue modeling, unit economics, funding requirements, financial projections, valuation.

TASK: Analyze financial viability and business model strength.

IDEA: "${idea}"
BUSINESS MODEL: ${classification.businessModel}
CAPITAL REQUIREMENT: ${classification.capitalRequirement}

FINANCIAL ANALYSIS:

1. REVENUE MODEL STRENGTH (Weight: 30%)
   - Revenue stream clarity and diversity
   - Pricing power and strategy
   - Revenue predictability and recurring nature
   - Monetization timeline and ramp

2. UNIT ECONOMICS (Weight: 25%)
   - Customer Acquisition Cost (CAC) estimation
   - Customer Lifetime Value (LTV) projection
   - LTV/CAC ratio analysis
   - Gross margin potential
   - Contribution margin analysis

3. FUNDING REQUIREMENTS (Weight: 20%)
   - Capital efficiency assessment
   - Funding stages and amounts needed
   - Time to profitability
   - Cash burn rate projections

4. MARKET DYNAMICS (Weight: 15%)
   - Market size impact on revenue potential
   - Competitive pricing pressure
   - Customer willingness to pay
   - Economic sensitivity

5. SCALABILITY (Weight: 10%)
   - Revenue scalability potential
   - Cost structure scalability
   - Operational leverage opportunities

SCORING CRITERIA:
- 90-100: Strong recurring revenue, excellent unit economics, capital efficient
- 70-89: Good revenue model, positive unit economics, reasonable funding needs
- 50-69: Viable revenue model, break-even unit economics, moderate funding
- 30-49: Unclear revenue model, challenging unit economics, high funding needs
- 0-29: Weak revenue model, poor unit economics, excessive funding requirements

RETURN JSON:
{
  "financialScore": 0-100,
  "revenueModelStrength": "Weak/Moderate/Strong",
  "unitEconomicsViability": "Poor/Fair/Good/Excellent",
  "fundingRequirement": "estimated amount in USD",
  "timeToBreakeven": "months",
  "ltvcacRatio": "estimated ratio",
  "keyFinancialRisks": ["risk1", "risk2"],
  "monetizationStrategy": "primary strategy",
  "confidence": 0-100
}

Be conservative in financial projections and realistic about market dynamics.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: financialPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const analysis = JSON.parse(result.text || '{}');
    
    return {
      agent: 'financial-viability',
      score: analysis.financialScore || 50,
      insights: analysis,
      confidence: analysis.confidence || 70,
      processingTime: Date.now() - startTime
    };
  }

  // Step 5: Go-to-Market Agent
  async analyzeGTM(idea: string, classification: IdeaClassification): Promise<AgentAnalysis> {
    const startTime = Date.now();
    
    const gtmPrompt = `
You are a Senior Growth Marketing Expert specializing in ${classification.targetMarket} customer acquisition.

MARKETING EXPERTISE: Customer acquisition, growth hacking, product-market fit, channel optimization, brand positioning.

TASK: Design and evaluate go-to-market strategy effectiveness.

IDEA: "${idea}"
TARGET MARKET: ${classification.targetMarket}
BUSINESS MODEL: ${classification.businessModel}

GTM ANALYSIS:

1. CUSTOMER ACQUISITION (Weight: 30%)
   - Primary acquisition channels effectiveness
   - Customer acquisition cost efficiency
   - Channel scalability and sustainability
   - Conversion funnel optimization potential

2. PRODUCT-MARKET FIT (Weight: 25%)
   - PMF validation approach
   - Customer feedback mechanisms
   - Iteration and pivot capabilities
   - Market timing assessment

3. POSITIONING & DIFFERENTIATION (Weight: 20%)
   - Value proposition clarity and strength
   - Competitive differentiation
   - Brand positioning potential
   - Messaging effectiveness

4. LAUNCH STRATEGY (Weight: 15%)
   - Go-to-market sequence and timing
   - Launch channel selection
   - Early adopter identification
   - Viral/network effects potential

5. GROWTH SCALABILITY (Weight: 10%)
   - Organic growth potential
   - Paid acquisition scalability
   - Partnership opportunities
   - Content and community building

SCORING CRITERIA:
- 90-100: Clear acquisition channels, strong PMF signals, excellent positioning
- 70-89: Good acquisition strategy, promising PMF, solid differentiation
- 50-69: Viable acquisition plan, moderate PMF, some differentiation
- 30-49: Challenging acquisition, unclear PMF, weak positioning
- 0-29: No clear acquisition path, poor PMF, no differentiation

RETURN JSON:
{
  "gtmScore": 0-100,
  "primaryAcquisitionChannel": "channel name",
  "customerAcquisitionDifficulty": "Easy/Moderate/Hard/Very Hard",
  "pmfPotential": "Low/Medium/High",
  "competitiveDifferentiation": "Weak/Moderate/Strong",
  "viralPotential": "Low/Medium/High",
  "keyGTMChallenges": ["challenge1", "challenge2"],
  "recommendedChannels": ["channel1", "channel2", "channel3"],
  "confidence": 0-100
}

Focus on realistic customer acquisition strategies and market entry challenges.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: gtmPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const analysis = JSON.parse(result.text || '{}');
    
    return {
      agent: 'go-to-market',
      score: analysis.gtmScore || 50,
      insights: analysis,
      confidence: analysis.confidence || 70,
      processingTime: Date.now() - startTime
    };
  }

  // Step 6: Synthesis Agent - Combines all analyses
  async synthesizeAnalysis(
    idea: string, 
    classification: IdeaClassification, 
    agentAnalyses: AgentAnalysis[]
  ): Promise<ValidationResult> {
    const synthesisPrompt = `
You are a Senior Strategy Consultant synthesizing multiple expert analyses for startup validation.

TASK: Combine expert analyses into comprehensive validation assessment.

IDEA: "${idea}"
CLASSIFICATION: ${JSON.stringify(classification)}

EXPERT ANALYSES:
${agentAnalyses.map(analysis => `
${analysis.agent.toUpperCase()}: Score ${analysis.score}/100 (Confidence: ${analysis.confidence}%)
Key Insights: ${JSON.stringify(analysis.insights)}
`).join('\n')}

SYNTHESIS FRAMEWORK:

1. WEIGHTED SCORING:
   - Market Research: 30% weight
   - Technical Feasibility: 25% weight  
   - Financial Viability: 25% weight
   - Go-to-Market: 20% weight

2. CONFIDENCE ADJUSTMENT:
   - Adjust scores based on confidence levels
   - Identify areas of uncertainty
   - Flag conflicting assessments

3. HOLISTIC ASSESSMENT:
   - Overall startup viability
   - Key success factors
   - Critical risk factors
   - Execution priorities

4. STRATEGIC RECOMMENDATIONS:
   - Immediate next steps (0-30 days)
   - Short-term milestones (1-6 months)
   - Long-term strategy (6+ months)

RETURN JSON:
{
  "overallScore": 0-100,
  "confidenceLevel": 0-100,
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "criticalRisks": ["risk1", "risk2", "risk3"],
  "successFactors": ["factor1", "factor2", "factor3"],
  "immediateNextSteps": ["step1", "step2", "step3"],
  "shortTermMilestones": ["milestone1", "milestone2"],
  "longTermStrategy": ["strategy1", "strategy2"],
  "pivotRecommendations": ["pivot1", "pivot2"],
  "fundingReadiness": "Not Ready/Seed Ready/Series A Ready",
  "timeToMarket": "estimated months",
  "executionComplexity": "Low/Medium/High/Very High"
}

Provide balanced, actionable insights that help entrepreneurs make informed decisions.
`;

    const result = await this.gemini.models.generateContent({
      model: "gemini-1.5-pro",
      contents: synthesisPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        maxOutputTokens: 3000
      }
    });

    const synthesis = JSON.parse(result.text || '{}');
    
    return {
      overallScore: synthesis.overallScore || 50,
      agentAnalyses,
      synthesis: JSON.stringify(synthesis),
      recommendations: synthesis.immediateNextSteps || [],
      riskFactors: synthesis.criticalRisks || [],
      nextSteps: synthesis.shortTermMilestones || []
    };
  }

  // Main validation method
  async validateIdea(idea: string): Promise<ValidationResult> {
    try {
      console.log('🔍 Starting advanced validation for:', idea);
      
      // Step 1: Classify the idea
      const classification = await this.classifyIdea(idea);
      console.log('📊 Classification complete:', classification);
      
      // Step 2: Run parallel agent analyses
      const agentPromises = [
        this.analyzeMarket(idea, classification),
        this.analyzeTechnical(idea, classification),
        this.analyzeFinancial(idea, classification),
        this.analyzeGTM(idea, classification)
      ];
      
      const agentAnalyses = await Promise.all(agentPromises);
      console.log('🤖 Agent analyses complete');
      
      // Step 3: Synthesize results
      const result = await this.synthesizeAnalysis(idea, classification, agentAnalyses);
      console.log('🎯 Synthesis complete, overall score:', result.overallScore);
      
      return result;
      
    } catch (error) {
      console.error('❌ Advanced validation failed:', error);
      throw error;
    }
  }
}

export default AdvancedValidationEngine;
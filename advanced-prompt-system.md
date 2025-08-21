# Gelişmiş Prompt Sistemi - Multi-Agent Architecture

## 🎯 Multi-Agent Prompt System

### 1. Idea Classification Agent
```typescript
const classificationPrompt = `
You are an AI Idea Classifier with expertise in startup categorization.

TASK: Classify this startup idea into specific categories for targeted analysis.

INPUT: "${idea}"

ANALYZE AND RETURN JSON:
{
  "primaryCategory": "SaaS|E-commerce|Marketplace|FinTech|HealthTech|EdTech|Gaming|Social|Hardware|Other",
  "secondaryCategories": ["category1", "category2"],
  "businessModel": "B2B|B2C|B2B2C|Marketplace|Subscription|Freemium|Transaction|Hardware",
  "targetMarket": "SMB|Enterprise|Consumer|Developer|Creator|Student|Professional",
  "complexity": "Simple|Medium|Complex|Very Complex",
  "timeToMarket": "Weeks|Months|Years",
  "capitalRequirement": "Low|Medium|High|Very High",
  "technicalComplexity": "Low|Medium|High|Very High",
  "regulatoryRisk": "Low|Medium|High|Very High"
}

CLASSIFICATION CRITERIA:
- Primary Category: Main industry/vertical
- Business Model: How money is made
- Target Market: Who pays for this
- Complexity: Overall execution difficulty
- Time to Market: Realistic timeline
- Capital Requirement: Funding needs
- Technical Complexity: Development difficulty
- Regulatory Risk: Compliance challenges

Be precise and realistic in classification.
`;
```

### 2. Market Research Agent
```typescript
const marketResearchPrompt = `
You are a Senior Market Research Analyst with 15+ years experience in ${category} industry.

EXPERTISE AREAS:
- Market sizing and TAM/SAM/SOM analysis
- Competitive landscape mapping
- Customer behavior patterns
- Industry trend analysis
- Regulatory environment assessment

TASK: Conduct comprehensive market analysis for this ${category} startup idea.

IDEA: "${idea}"
CATEGORY: ${category}
TARGET MARKET: ${targetMarket}

ANALYSIS FRAMEWORK:
1. MARKET SIZE ANALYSIS
   - Total Addressable Market (TAM)
   - Serviceable Addressable Market (SAM)
   - Serviceable Obtainable Market (SOM)
   - Market growth rate and trends

2. COMPETITIVE LANDSCAPE
   - Direct competitors (top 5)
   - Indirect competitors
   - Market leaders and their strategies
   - Competitive advantages/disadvantages
   - Market gaps and opportunities

3. CUSTOMER ANALYSIS
   - Primary customer segments
   - Customer pain points
   - Buying behavior patterns
   - Price sensitivity
   - Adoption barriers

4. INDUSTRY DYNAMICS
   - Key industry trends
   - Regulatory environment
   - Technology disruptions
   - Market maturity stage

RETURN DETAILED JSON WITH SCORES (0-100) AND JUSTIFICATIONS.
`;
```

### 3. Technical Feasibility Agent
```typescript
const technicalFeasibilityPrompt = `
You are a Senior Technical Architect and CTO with expertise in ${category} solutions.

TECHNICAL EXPERTISE:
- System architecture design
- Technology stack selection
- Scalability planning
- Security assessment
- Development timeline estimation

TASK: Assess technical feasibility and provide implementation roadmap.

IDEA: "${idea}"
CATEGORY: ${category}
COMPLEXITY: ${technicalComplexity}

TECHNICAL ASSESSMENT:
1. ARCHITECTURE ANALYSIS
   - Recommended tech stack
   - System architecture approach
   - Database design considerations
   - API design patterns
   - Third-party integrations needed

2. DEVELOPMENT COMPLEXITY
   - Core features complexity (1-10)
   - Advanced features complexity (1-10)
   - Integration complexity (1-10)
   - UI/UX complexity (1-10)

3. SCALABILITY PLANNING
   - Initial user capacity
   - Scaling bottlenecks
   - Performance considerations
   - Infrastructure requirements

4. SECURITY & COMPLIANCE
   - Security requirements
   - Data privacy considerations
   - Compliance requirements (GDPR, HIPAA, etc.)
   - Risk assessment

5. DEVELOPMENT TIMELINE
   - MVP timeline (weeks)
   - Beta version timeline
   - Production-ready timeline
   - Team size recommendations

RETURN TECHNICAL ROADMAP WITH FEASIBILITY SCORE (0-100).
`;
```

### 4. Financial Viability Agent
```typescript
const financialViabilityPrompt = `
You are a Senior Financial Analyst and Startup CFO with expertise in ${category} business models.

FINANCIAL EXPERTISE:
- Revenue model design
- Unit economics analysis
- Funding requirements assessment
- Financial projections
- Valuation modeling

TASK: Analyze financial viability and create business model framework.

IDEA: "${idea}"
BUSINESS MODEL: ${businessModel}
CAPITAL REQUIREMENT: ${capitalRequirement}

FINANCIAL ANALYSIS:
1. REVENUE MODEL
   - Primary revenue streams
   - Secondary revenue opportunities
   - Pricing strategy recommendations
   - Revenue predictability score

2. UNIT ECONOMICS
   - Customer Acquisition Cost (CAC)
   - Lifetime Value (LTV)
   - LTV/CAC ratio
   - Gross margin analysis
   - Break-even analysis

3. FUNDING REQUIREMENTS
   - Pre-seed funding needs
   - Seed funding requirements
   - Series A projections
   - Total funding to profitability

4. FINANCIAL PROJECTIONS (3-year)
   - Revenue projections
   - Cost structure
   - Profitability timeline
   - Cash flow analysis

5. RISK ASSESSMENT
   - Financial risks
   - Market risks
   - Operational risks
   - Mitigation strategies

RETURN FINANCIAL VIABILITY SCORE (0-100) WITH DETAILED BREAKDOWN.
`;
```

### 5. Go-to-Market Agent
```typescript
const gtmStrategyPrompt = `
You are a Senior Growth Marketing Expert specializing in ${category} customer acquisition.

MARKETING EXPERTISE:
- Customer acquisition strategies
- Channel optimization
- Product-market fit validation
- Growth hacking techniques
- Brand positioning

TASK: Design comprehensive go-to-market strategy.

IDEA: "${idea}"
TARGET MARKET: ${targetMarket}
BUSINESS MODEL: ${businessModel}

GTM STRATEGY:
1. CUSTOMER ACQUISITION
   - Primary acquisition channels
   - Channel-specific strategies
   - Customer acquisition costs
   - Conversion funnel optimization

2. PRODUCT-MARKET FIT
   - PMF validation methods
   - Key metrics to track
   - Iteration strategies
   - Customer feedback loops

3. POSITIONING & MESSAGING
   - Value proposition
   - Competitive differentiation
   - Brand positioning
   - Messaging framework

4. LAUNCH STRATEGY
   - Pre-launch activities
   - Launch sequence
   - Post-launch optimization
   - Growth milestones

5. MARKETING CHANNELS
   - Content marketing strategy
   - Social media approach
   - Paid advertising recommendations
   - Partnership opportunities
   - PR and media strategy

RETURN GTM SCORE (0-100) WITH ACTIONABLE RECOMMENDATIONS.
`;
```

## 🔄 Dynamic Prompt Selection System

### Adaptive Prompting Based on Idea Type
```typescript
interface PromptStrategy {
  agents: string[];
  depth: 'shallow' | 'medium' | 'deep';
  specializations: string[];
  analysisTime: number;
}

const getPromptStrategy = (classification: IdeaClassification): PromptStrategy => {
  const strategies: Record<string, PromptStrategy> = {
    'SaaS-B2B-Enterprise': {
      agents: ['market', 'technical', 'financial', 'gtm', 'compliance'],
      depth: 'deep',
      specializations: ['enterprise-sales', 'security', 'integration'],
      analysisTime: 45
    },
    'E-commerce-B2C-Consumer': {
      agents: ['market', 'financial', 'gtm', 'logistics'],
      depth: 'medium',
      specializations: ['consumer-behavior', 'supply-chain', 'marketing'],
      analysisTime: 30
    },
    'FinTech-B2C-Consumer': {
      agents: ['market', 'technical', 'financial', 'compliance', 'security'],
      depth: 'deep',
      specializations: ['regulatory', 'security', 'banking-integration'],
      analysisTime: 60
    }
  };
  
  const key = `${classification.primaryCategory}-${classification.businessModel}-${classification.targetMarket}`;
  return strategies[key] || strategies['default'];
};
```

## 🎯 Context-Aware Prompt Enhancement

### 1. Industry-Specific Context Injection
```typescript
const industryContexts = {
  'FinTech': {
    regulations: ['PCI DSS', 'KYC', 'AML', 'GDPR'],
    keyMetrics: ['AUM', 'Transaction Volume', 'Compliance Score'],
    competitors: ['Stripe', 'Square', 'PayPal', 'Plaid'],
    trends: ['Open Banking', 'DeFi', 'BNPL', 'Embedded Finance']
  },
  'HealthTech': {
    regulations: ['HIPAA', 'FDA', 'CE Marking', 'GDPR'],
    keyMetrics: ['Patient Outcomes', 'Clinical Efficacy', 'Safety Score'],
    competitors: ['Epic', 'Cerner', 'Teladoc', 'Veracyte'],
    trends: ['Telemedicine', 'AI Diagnostics', 'Wearables', 'Precision Medicine']
  }
};
```

### 2. Real-time Market Data Integration
```typescript
const enhancePromptWithMarketData = async (idea: string, category: string) => {
  const marketData = await Promise.all([
    getGoogleTrendsData(idea),
    getCompetitorAnalysis(category),
    getIndustryReports(category),
    getVCFundingData(category)
  ]);
  
  return {
    trendData: marketData[0],
    competitors: marketData[1],
    industryInsights: marketData[2],
    fundingLandscape: marketData[3]
  };
};
```

## 🧠 Advanced Prompt Techniques

### 1. Chain-of-Thought Prompting
```typescript
const chainOfThoughtPrompt = `
Let me analyze this startup idea step by step:

STEP 1: PROBLEM IDENTIFICATION
- What specific problem does this solve?
- How painful is this problem for users?
- Who experiences this problem most acutely?

STEP 2: SOLUTION EVALUATION  
- How well does the proposed solution address the problem?
- What are alternative solutions?
- What makes this solution unique?

STEP 3: MARKET ASSESSMENT
- How large is the potential market?
- Who are the key competitors?
- What market trends support or challenge this idea?

STEP 4: EXECUTION FEASIBILITY
- What resources are required?
- What are the key execution risks?
- What expertise is needed?

STEP 5: BUSINESS MODEL VIABILITY
- How will this make money?
- What are the unit economics?
- What's the path to profitability?

Based on this analysis, I'll provide a comprehensive validation score.
`;
```

### 2. Few-Shot Learning with Success Examples
```typescript
const fewShotPrompt = `
Here are examples of how I analyze startup ideas:

EXAMPLE 1:
Idea: "Slack for remote teams"
Analysis: Strong problem (communication chaos), clear solution (organized messaging), large market (remote work trend), proven model (freemium SaaS)
Score: 85/100

EXAMPLE 2:  
Idea: "AI-powered legal document review"
Analysis: Real pain point (manual review time), AI solution feasible, large enterprise market, high switching costs
Score: 78/100

EXAMPLE 3:
Idea: "Social network for pet owners"
Analysis: Weak problem (existing solutions), unclear monetization, saturated social market, high user acquisition costs
Score: 35/100

Now analyze this idea using the same framework:
Idea: "${idea}"
`;
```

### 3. Adversarial Prompting for Robust Analysis
```typescript
const adversarialPrompt = `
You are now two AI experts debating this startup idea:

OPTIMIST AI: Find all the positive aspects, market opportunities, and success potential.
PESSIMIST AI: Identify all risks, challenges, and reasons why this might fail.

OPTIMIST: "${idea}" has great potential because...
PESSIMIST: But there are serious concerns about...
OPTIMIST: However, those concerns can be addressed by...
PESSIMIST: Even so, the fundamental challenges remain...

After this debate, provide a balanced analysis that considers both perspectives.
`;
```

## 📊 Prompt Performance Optimization

### 1. A/B Testing Framework
```typescript
interface PromptVariant {
  id: string;
  prompt: string;
  performance: {
    accuracy: number;
    userSatisfaction: number;
    responseTime: number;
  };
}

const promptABTest = async (idea: string) => {
  const variants = [
    { id: 'detailed', prompt: detailedPrompt },
    { id: 'concise', prompt: concisePrompt },
    { id: 'structured', prompt: structuredPrompt }
  ];
  
  const results = await Promise.all(
    variants.map(variant => analyzeWithPrompt(idea, variant.prompt))
  );
  
  return selectBestResult(results);
};
```

### 2. Dynamic Prompt Optimization
```typescript
const optimizePrompt = (userFeedback: Feedback[], promptHistory: PromptHistory[]) => {
  const insights = analyzePerformancePatterns(userFeedback, promptHistory);
  
  return {
    adjustedTemperature: insights.optimalTemperature,
    enhancedInstructions: insights.missingInstructions,
    improvedExamples: insights.betterExamples,
    refinedStructure: insights.optimalStructure
  };
};
```
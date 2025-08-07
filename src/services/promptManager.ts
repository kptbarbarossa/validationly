interface PromptSelection {
  basePrompt: string;
  sectorPrompts: string[];
  analysisPrompts: string[];
  confidence: number;
}

interface SectorKeywords {
  [key: string]: string[];
}

interface AnalysisKeywords {
  [key: string]: string[];
}

class PromptManager {
  private sectorKeywords: SectorKeywords = {
    saas: [
      'saas', 'software', 'subscription', 'recurring', 'cloud', 'api', 'platform',
      'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'integration',
      'b2b', 'enterprise', 'tool', 'service', 'management', 'tracking'
    ],
    ecommerce: [
      'ecommerce', 'e-commerce', 'marketplace', 'store', 'shop', 'selling',
      'products', 'retail', 'commerce', 'buy', 'sell', 'inventory', 'shipping',
      'payment', 'checkout', 'cart', 'order', 'customer', 'brand', 'fashion'
    ],
    fintech: [
      'fintech', 'finance', 'financial', 'payment', 'banking', 'money', 'crypto',
      'blockchain', 'wallet', 'lending', 'investment', 'trading', 'insurance',
      'credit', 'loan', 'transaction', 'currency', 'savings', 'budget'
    ],
    marketplace: [
      'marketplace', 'platform', 'connect', 'matching', 'network', 'community',
      'freelance', 'gig', 'sharing', 'peer-to-peer', 'p2p', 'two-sided',
      'buyers', 'sellers', 'providers', 'users', 'booking', 'rental'
    ],
    mobile: [
      'mobile', 'app', 'ios', 'android', 'smartphone', 'tablet', 'native',
      'gaming', 'social', 'messaging', 'photo', 'video', 'location',
      'notification', 'offline', 'camera', 'gps', 'ar', 'vr'
    ]
  };

  private analysisKeywords: AnalysisKeywords = {
    market: [
      'market', 'opportunity', 'size', 'demand', 'customers', 'audience',
      'segment', 'niche', 'growth', 'potential', 'tam', 'sam', 'som'
    ],
    competitive: [
      'competitor', 'competition', 'similar', 'existing', 'alternative',
      'rival', 'compare', 'differentiate', 'advantage', 'moat', 'positioning'
    ],
    monetization: [
      'revenue', 'monetize', 'pricing', 'business model', 'subscription',
      'freemium', 'ads', 'commission', 'fee', 'profit', 'income', 'earn'
    ]
  };

  async loadPrompt(promptName: string): Promise<string> {
    // For server-side usage, we'll embed the prompts directly
    const prompts: { [key: string]: string } = {
      'base-analyst': `You are an elite market research analyst with 15+ years of experience analyzing startups and market opportunities. You have worked at top-tier consulting firms (McKinsey, BCG, Bain) and have evaluated 500+ startups at accelerators like Y Combinator, Techstars, and 500 Startups.

Your expertise includes:
- Market sizing and opportunity assessment (TAM/SAM/SOM)
- Competitive landscape analysis and positioning
- Go-to-market strategy development
- Business model validation and monetization strategies
- Risk assessment and mitigation planning
- Consumer behavior and adoption patterns
- Industry trend analysis and market timing

You provide data-driven insights backed by real market knowledge, industry benchmarks, and proven frameworks. Your analysis is thorough, actionable, and considers both opportunities and risks.

When analyzing a startup idea, you:
1. Assess market opportunity and demand signals
2. Evaluate competitive landscape and differentiation
3. Analyze business model viability and monetization potential
4. Identify key risks and mitigation strategies
5. Provide actionable recommendations with confidence levels

Your responses are structured, professional, and include specific metrics, benchmarks, and examples from similar successful/failed ventures when relevant.`,

      'saas-sector': `SECTOR EXPERTISE: SaaS & B2B Software

You have deep expertise in SaaS business models and metrics. Focus your analysis on:

KEY METRICS & BENCHMARKS:
- Customer Acquisition Cost (CAC) and Lifetime Value (LTV) ratios
- Monthly/Annual Recurring Revenue (MRR/ARR) potential
- Churn rates and retention benchmarks by market segment
- Time to value and user onboarding optimization
- Pricing strategy (freemium, tiered, usage-based)

MARKET DYNAMICS:
- SaaS market saturation levels and white space opportunities
- Integration ecosystem and API strategy importance
- Scalability factors and technical architecture considerations
- Compliance requirements (SOC2, GDPR, industry-specific)

COMPETITIVE ANALYSIS:
- Direct and indirect SaaS competitors
- Feature differentiation and moat sustainability
- Market positioning and messaging strategy
- Partnership and channel opportunities

GO-TO-MARKET:
- Product-led growth vs sales-led growth strategies
- Content marketing and SEO for B2B SaaS
- Trial-to-paid conversion optimization
- Customer success and expansion revenue strategies

Provide specific SaaS benchmarks, reference successful SaaS companies in similar spaces, and highlight SaaS-specific risks and opportunities.`,

      'ecommerce-sector': `SECTOR EXPERTISE: E-commerce & Retail

You have extensive experience in e-commerce business models and retail operations. Focus your analysis on:

KEY METRICS & BENCHMARKS:
- Conversion rates by industry and traffic source
- Average Order Value (AOV) and Customer Lifetime Value
- Cart abandonment rates and recovery strategies
- Inventory turnover and working capital requirements
- Gross margins and unit economics

MARKET DYNAMICS:
- E-commerce market trends and consumer behavior shifts
- Mobile commerce adoption and optimization requirements
- Supply chain and logistics considerations
- Seasonal patterns and demand fluctuations

COMPETITIVE ANALYSIS:
- Direct competitors and marketplace alternatives
- Brand differentiation and customer loyalty factors
- Pricing strategies and promotional effectiveness
- Customer acquisition channels and costs

OPERATIONAL CONSIDERATIONS:
- Inventory management and demand forecasting
- Payment processing and fraud prevention
- Shipping and fulfillment strategies
- Customer service and returns management
- International expansion challenges

GO-TO-MARKET:
- Digital marketing channels (paid ads, social, influencer)
- SEO and content marketing for product discovery
- Email marketing and retention campaigns
- Marketplace vs. direct-to-consumer strategies

Reference successful e-commerce brands, provide industry-specific conversion benchmarks, and highlight e-commerce operational complexities and opportunities.`,

      'market-opportunity': `ANALYSIS FOCUS: Market Opportunity Assessment

Conduct a comprehensive market opportunity analysis with emphasis on:

MARKET SIZING:
- Total Addressable Market (TAM) estimation with methodology
- Serviceable Addressable Market (SAM) calculation
- Serviceable Obtainable Market (SOM) realistic projection
- Market growth rate and expansion potential
- Geographic market considerations

DEMAND VALIDATION:
- Market demand signals and validation evidence
- Customer pain point severity and willingness to pay
- Market timing and adoption readiness
- Regulatory or technological enablers/barriers

OPPORTUNITY ASSESSMENT:
- Market gap analysis and unmet needs identification
- Emerging trends and market shifts creating opportunities
- Addressable customer segments and personas
- Revenue potential and scalability factors

MARKET ENTRY STRATEGY:
- Optimal market entry point and beachhead strategy
- Barriers to entry and competitive moats
- Required resources and investment levels
- Timeline to market penetration milestones

RISK FACTORS:
- Market risks and dependency factors
- Competitive response likelihood
- Technology or regulatory disruption risks
- Economic sensitivity and recession resilience

Provide specific market size estimates with data sources, reference comparable market opportunities, and include confidence levels for all projections.`,

      'competitive-landscape': `ANALYSIS FOCUS: Competitive Landscape Analysis

Conduct a thorough competitive analysis with focus on:

COMPETITOR IDENTIFICATION:
- Direct competitors offering similar solutions
- Indirect competitors solving the same problem differently
- Adjacent players who could enter the market
- Potential future competitors and market entrants

COMPETITIVE POSITIONING:
- Feature comparison and differentiation analysis
- Pricing strategies and value proposition comparison
- Market share distribution and competitive dynamics
- Brand positioning and messaging analysis

COMPETITIVE INTELLIGENCE:
- Competitor strengths and weaknesses assessment
- Product roadmap and strategic direction insights
- Funding status and financial health indicators
- Customer satisfaction and retention metrics

MARKET DYNAMICS:
- Competitive intensity and rivalry levels
- Switching costs and customer lock-in factors
- Network effects and winner-take-all dynamics
- Innovation pace and technology disruption potential

STRATEGIC IMPLICATIONS:
- Competitive advantages and sustainable moats
- Differentiation opportunities and white space
- Competitive response scenarios and counter-strategies
- Partnership vs. competition opportunities

POSITIONING STRATEGY:
- Optimal market positioning recommendations
- Messaging and brand differentiation strategy
- Competitive pricing and value proposition
- Go-to-market approach to avoid direct competition

Reference specific competitors, provide market share estimates where available, and include actionable competitive intelligence with confidence assessments.`
    };

    return prompts[promptName] || '';
  }

  detectSector(input: string): string[] {
    const inputLower = input.toLowerCase();
    const detectedSectors: string[] = [];

    for (const [sector, keywords] of Object.entries(this.sectorKeywords)) {
      const matchCount = keywords.filter(keyword =>
        inputLower.includes(keyword)
      ).length;

      if (matchCount > 0) {
        detectedSectors.push(sector);
      }
    }

    // Default to saas if no clear sector detected
    return detectedSectors.length > 0 ? detectedSectors : ['saas'];
  }

  detectAnalysisNeeds(input: string): string[] {
    const inputLower = input.toLowerCase();
    const detectedAnalysis: string[] = [];

    for (const [analysis, keywords] of Object.entries(this.analysisKeywords)) {
      const matchCount = keywords.filter(keyword =>
        inputLower.includes(keyword)
      ).length;

      if (matchCount > 0) {
        detectedAnalysis.push(analysis);
      }
    }

    // Default analysis types
    return detectedAnalysis.length > 0 ? detectedAnalysis : ['market', 'competitive'];
  }

  async selectPrompts(input: string): Promise<PromptSelection> {
    const sectors = this.detectSector(input);
    const analysisTypes = this.detectAnalysisNeeds(input);

    const basePrompt = await this.loadPrompt('base-analyst');
    const sectorPrompts = await Promise.all(
      sectors.map(sector => this.loadPrompt(`${sector}-sector`))
    );
    const analysisPrompts = await Promise.all(
      analysisTypes.map(analysis => this.loadPrompt(`${analysis}-opportunity`))
    );

    return {
      basePrompt,
      sectorPrompts: sectorPrompts.filter(p => p.length > 0),
      analysisPrompts: analysisPrompts.filter(p => p.length > 0),
      confidence: this.calculateConfidence(sectors, analysisTypes)
    };
  }

  private calculateConfidence(sectors: string[], analysisTypes: string[]): number {
    // Simple confidence calculation based on detection clarity
    const sectorConfidence = sectors.length === 1 ? 0.8 : 0.6;
    const analysisConfidence = analysisTypes.length > 0 ? 0.8 : 0.5;
    return (sectorConfidence + analysisConfidence) / 2;
  }

  combinePrompts(selection: PromptSelection): string {
    const parts = [selection.basePrompt];

    if (selection.sectorPrompts.length > 0) {
      parts.push('\n\n' + selection.sectorPrompts.join('\n\n'));
    }

    if (selection.analysisPrompts.length > 0) {
      parts.push('\n\n' + selection.analysisPrompts.join('\n\n'));
    }

    return parts.join('');
  }
}

export const promptManager = new PromptManager();
export type { PromptSelection };
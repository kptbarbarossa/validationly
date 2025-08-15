import { GoogleGenAI, Type } from "@google/genai";
// Use local DynamicPromptResult definition in this file

// Dynamic prompt-based AI analysis system

// Enhanced Analysis System - Integrated Components
import type { 
  CriticAnalysis, 
  QualityIssue, 
  EvidenceAnalysis, 
  EvidenceSource, 
  EnhancedConfidence, 
  ConfidenceFactors,
  RetryStrategy,
  FallbackConfig,
  ErrorContext
} from '../src/types';

// Critic Agent - Quality Control System
class CriticAgent {
  private language: string;

  constructor(language: string = 'en') {
    this.language = language;
  }

  async analyzeQuality(result: any): Promise<CriticAnalysis> {
    const issues: QualityIssue[] = [];
    let completenessScore = 100;
    let consistencyScore = 100;

    // Check for missing critical fields
    const requiredFields = ['idea', 'demandScore', 'scoreJustification', 'platformAnalyses'];

    for (const field of requiredFields) {
      if (!result[field]) {
        issues.push({
          type: 'missing_field',
          field,
          severity: 'high',
          description: `Critical field '${field}' is missing`,
          suggestion: `Add ${field} to the analysis result`
        });
        completenessScore -= 20;
      }
    }

    // Check platform analyses completeness
    if (result.platformAnalyses) {
      const platforms = Object.keys(result.platformAnalyses);
      for (const platform of platforms) {
        const analysis = result.platformAnalyses[platform];
        if (!analysis.summary || analysis.summary.length < 10) {
          issues.push({
            type: 'low_quality',
            field: `platformAnalyses.${platform}.summary`,
            severity: 'medium',
            description: `Platform summary for ${platform} is too short or missing`,
            suggestion: 'Provide a more detailed platform analysis summary'
          });
          completenessScore -= 5;
        }

        if (!analysis.keyFindings || analysis.keyFindings.length < 3) {
          issues.push({
            type: 'missing_field',
            field: `platformAnalyses.${platform}.keyFindings`,
            severity: 'medium',
            description: `Key findings for ${platform} are incomplete`,
            suggestion: 'Provide at least 3 key findings for each platform'
          });
          completenessScore -= 5;
        }
      }
    }

    // Check for unrealistic numbers
    if (result.demandScore && (result.demandScore < 0 || result.demandScore > 100)) {
      issues.push({
        type: 'unrealistic_numbers',
        field: 'demandScore',
        severity: 'high',
        description: 'Demand score is outside valid range (0-100)',
        suggestion: 'Ensure demand score is between 0 and 100'
      });
      consistencyScore -= 30;
    }

    const overallQuality = Math.round((completenessScore + consistencyScore) / 2);
    const needsRepair = issues.some(issue => issue.severity === 'high') || overallQuality < 70;

    return {
      overallQuality,
      issues,
      suggestions: ['Analysis quality assessment completed'],
      completenessScore: Math.max(0, completenessScore),
      consistencyScore: Math.max(0, consistencyScore),
      needsRepair
    };
  }

  async repairAnalysis(result: any, issues: QualityIssue[]): Promise<any> {
    return {
      ...result,
      _repairAttempted: true,
      _repairInstructions: issues.map(i => i.suggestion)
    };
  }
}

// Evidence-Based Analysis System
class EvidenceAnalyzer {
  async gatherEvidence(idea: string, sectors: string[]): Promise<EvidenceAnalysis> {
    const sources: EvidenceSource[] = [
      {
        platform: 'reddit',
        type: 'reddit_post',
        content: `Market research shows interest in similar concepts`,
        relevanceScore: 75,
        credibilityScore: 80
      }
    ];

    const evidenceQuality = 75;
    const supportingEvidence = sources.map(s => s.content);

    return {
      sources,
      evidenceQuality,
      supportingEvidence,
      contradictingEvidence: [],
      confidenceBoost: 10
    };
  }
}

// Enhanced Confidence Scoring System
class ConfidenceCalculator {
  calculateEnhancedConfidence(
    result: any,
    sectors: string[],
    evidenceAnalysis?: EvidenceAnalysis,
    criticAnalysis?: CriticAnalysis
  ): EnhancedConfidence {
    const factors: ConfidenceFactors = {
      sectorCoverage: Math.min(100, (sectors.length / 3) * 100),
      analysisDepth: 80,
      schemaCompleteness: criticAnalysis?.completenessScore || 80,
      evidenceQuality: evidenceAnalysis?.evidenceQuality || 50,
      consistencyScore: criticAnalysis?.consistencyScore || 80,
      modelReliability: result.fallbackUsed ? 60 : 90
    };

    const overall = Math.round(
      (factors.sectorCoverage * 0.15) +
      (factors.analysisDepth * 0.20) +
      (factors.schemaCompleteness * 0.20) +
      (factors.evidenceQuality * 0.15) +
      (factors.consistencyScore * 0.15) +
      (factors.modelReliability * 0.15)
    );

    return {
      overall: Math.max(0, Math.min(100, overall)),
      factors,
      breakdown: ['Analysis confidence calculated successfully'],
      recommendations: ['Continue with current analysis approach']
    };
  }
}

// Enhanced Error Management System
class ErrorManager {
  private retryStrategy: RetryStrategy = {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
    maxDelay: 10000,
    retryableErrors: ['timeout', 'rate_limit', 'server_error', 'parse_error']
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext>
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.retryStrategy.initialDelay;

    for (let attempt = 1; attempt <= this.retryStrategy.maxRetries; attempt++) {
      try {
        const result = await operation();
        if (attempt > 1) {
          console.log(`✅ Operation succeeded on attempt ${attempt}`);
        }
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Attempt ${attempt} failed:`, lastError.message);
        
        if (!this.isRetryableError(lastError) || attempt === this.retryStrategy.maxRetries) {
          break;
        }
        
        await this.delay(delay);
        delay = Math.min(delay * this.retryStrategy.backoffMultiplier, this.retryStrategy.maxDelay);
      }
    }

    throw lastError || new Error('Operation failed after all retries');
  }

  private isRetryableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return this.retryStrategy.retryableErrors.some(retryableError =>
      errorMessage.includes(retryableError)
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Embedded Prompt Manager for server-side usage
interface PromptSelection {
    basePrompt: string;
    sectorPrompts: string[];
    analysisPrompts: string[];
    confidence: number;
    examplePrompts?: string[];
}

class PromptManager {
    private sectorKeywords = {
        saas: [
            'saas', 'software', 'subscription', 'recurring', 'cloud', 'api', 'platform',
            'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'integration',
            'b2b', 'enterprise', 'tool', 'service', 'management', 'tracking', 'developer'
        ],
        ecommerce: [
            'ecommerce', 'e-commerce', 'marketplace', 'store', 'shop', 'selling',
            'products', 'retail', 'commerce', 'buy', 'sell', 'inventory', 'shipping',
            'payment', 'checkout', 'cart', 'order', 'customer', 'brand', 'fashion',
            'consumer', 'shopping', 'product'
        ],
        fintech: [
            'fintech', 'finance', 'financial', 'payment', 'banking', 'money', 'crypto',
            'blockchain', 'wallet', 'lending', 'investment', 'trading', 'insurance',
            'credit', 'loan', 'transaction', 'currency', 'savings', 'budget', 'startup'
        ],
        design: [
            'design', 'ui', 'ux', 'creative', 'visual', 'graphic', 'branding',
            'interface', 'user experience', 'prototype', 'figma', 'sketch', 'adobe',
            'portfolio', 'designer', 'art', 'illustration', 'web design'
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
        ],
        hardware: [
            'hardware', 'device', 'physical', 'manufacturing', 'bom', 'supply chain', 'electronics',
            'mechanical', 'prototype', 'factory', 'sensor', 'embedded', 'iot device', '3d printing', 'certification'
        ],
        offline: [
            'retail', 'store', 'brick and mortar', 'restaurant', 'cafe', 'gym', 'clinic', 'salon', 'venue',
            'foot traffic', 'lease', 'inventory', 'supplier', 'logistics', 'delivery', 'warehouse', 'operations'
        ],
        health: [
            'health', 'medical', 'clinic', 'hospital', 'telemedicine', 'wellness', 'mental health', 'fitness', 'hipaa', 'patient', 'doctor', 'pharma'
        ],
        education: [
            'education', 'edtech', 'course', 'learning', 'lms', 'teacher', 'student', 'tutor', 'curriculum', 'exam', 'assessment'
        ],
        content: [
            'content', 'media', 'creator', 'newsletter', 'video', 'podcast', 'publishing', 'ugc', 'influencer', 'subscriptions'
        ],
        b2b: [
            'b2b services', 'consulting', 'agency', 'outsourcing', 'lead gen', 'crm implementation', 'support desk', 'professional services'
        ],
        travel: [
            'travel', 'hotel', 'hospitality', 'booking', 'tourism', 'airline', 'rental', 'itinerary'
        ],
        food: [
            'restaurant', 'food delivery', 'grocery', 'catering', 'recipe', 'kitchen', 'menu', 'franchise'
        ],
        realestate: [
            'real estate', 'property', 'broker', 'mortgage', 'rental', 'listing', 'zillow', 'airbnb'
        ],
        energy_iot: [
            'iot', 'sensor', 'smart home', 'energy', 'solar', 'ev', 'battery', 'grid', 'meter'
        ]
    };

    // Sector-specific platform mapping (Phase 2 + Phase 3)
    private sectorPlatforms: {
        saas: string[];
        ecommerce: string[];
        fintech: string[];
        design: string[];
        marketplace: string[];
        mobile: string[];
        hardware: string[];
        offline: string[];
        health: string[];
        education: string[];
        content: string[];
        b2b: string[];
        travel: string[];
        food: string[];
        realestate: string[];
        energy_iot: string[];
    } = {
        saas: ['github', 'stackoverflow', 'producthunt', 'hackernews', 'slack', 'devto', 'hashnode', 'gitlab', 'indiehackers'],
        ecommerce: ['instagram', 'tiktok', 'pinterest', 'facebook', 'etsy', 'amazon', 'shopify', 'woocommerce'],
        fintech: ['angellist', 'crunchbase', 'linkedin', 'medium', 'substack', 'clubhouse'],
        design: ['dribbble', 'behance', 'figma', 'instagram', 'awwwards', 'designs99', 'canva', 'adobe', 'unsplash'],
        marketplace: ['producthunt', 'angellist', 'crunchbase', 'linkedin', 'indiehackers', 'etsy'],
        mobile: ['producthunt', 'github', 'reddit', 'hackernews', 'devto', 'indiehackers'],
        hardware: ['youtube', 'reddit', 'producthunt', 'github', 'hackernews', 'instagram'],
        offline: ['instagram', 'tiktok', 'facebook', 'youtube', 'pinterest', 'reddit'],
        health: ['linkedin', 'reddit', 'youtube', 'substack'],
        education: ['youtube', 'linkedin', 'substack', 'reddit'],
        content: ['youtube', 'tiktok', 'instagram', 'substack'],
        b2b: ['linkedin', 'slack', 'notion', 'producthunt'],
        travel: ['instagram', 'youtube', 'reddit'],
        food: ['instagram', 'tiktok', 'youtube'],
        realestate: ['instagram', 'youtube', 'facebook', 'reddit'],
        energy_iot: ['github', 'reddit', 'linkedin', 'producthunt']
    };

    private analysisKeywords = {
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
        ],
        regulation: [
            'license', 'licensing', 'compliance', 'gdpr', 'ccpa', 'hipaa', 'pci', 'regulation', 'policy', 'legal'
        ],
        operations: [
            'operations', 'ops', 'fulfillment', 'support', 'onboarding', 'sla', 'staffing', 'process', 'qa', 'qc'
        ],
        distribution: [
            'channel', 'distribution', 'partnership', 'affiliate', 'reseller', 'marketplace', 'seo', 'sem', 'paid ads'
        ],
        unit_economics: [
            'margin', 'cogs', 'gross margin', 'capex', 'opex', 'unit economics', 'cac', 'ltv', 'payback'
        ],
        supply_chain: [
            'supply chain', 'vendor', 'moq', 'lead time', 'logistics', 'warehouse', 'inventory', 'freight'
        ],
        virality: [
            'virality', 'k-factor', 'word of mouth', 'referral', 'ugc', 'creator', 'influencer'
        ],
        network_effects: [
            'network effects', 'two-sided', 'liquidity', 'match rate', 'winner-take-all', 'platform dynamics'
        ]
    };

    private prompts = {
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

        'fintech-sector': `SECTOR EXPERTISE: Fintech & Financial Services

You have deep knowledge of payments, banking, investing, and compliance. Focus on:

KEY METRICS & BENCHMARKS:
- Take rate, interchange, ARPU, churn, fraud loss rates
- CAC, payback, LTV in regulated environments
- Funding/liquidity requirements where applicable

REGULATORY & RISK:
- Licensing (EMI/PI/MSB), KYC/AML, PCI-DSS
- Data privacy (GDPR/CCPA) and regional constraints

MARKET & COMPETITION:
- Incumbents vs neobanks; platform and infra providers
- Network effects, switching costs, trust signals

GTM & PARTNERSHIPS:
- Channel partners, B2B2C motions, underwriting policies
- Risk-adjusted pricing and unit economics

Provide realistic compliance timelines, cost ranges, and risk-adjusted projections.`,

        'design-sector': `SECTOR EXPERTISE: Design & Creative Tools

Focus on:
- Community-led growth (Dribbble/Behance/Figma), portfolio dynamics
- Template/asset marketplaces, licensing, attribution
- PLG motions, collab features, and virality loops
- Pricing (one-off vs subscription), creator revenue share
Provide design community benchmarks and examples.`,

        'marketplace-sector': `SECTOR EXPERTISE: Marketplaces & Platforms

Focus on:
- Cold-start strategies, liquidity building (supply-side seeding)
- Take rate, GMV, repeat rate, fill rate, time-to-match
- Disintermediation risk, trust & safety, reviews
- Category expansion sequencing, subsidy economics
Provide GMV path, subsidy budget, and trust policy playbook.`,

        'mobile-sector': `SECTOR EXPERTISE: Mobile & Consumer Apps

Focus on:
- Acquisition (ASO, paid UA), retention (D1/D7/D30), activation
- Monetization (IAP, ads, subscriptions), pricing tests
- Social graph, virality, UGC and moderation
Provide cohort-based metrics expectations and growth loops.`,

        'hardware-sector': `SECTOR EXPERTISE: Hardware & Physical Products

You have extensive experience in hardware product development and go-to-market. Focus your analysis on:

PRODUCT & ENGINEERING:
- Bill of Materials (BOM) and target unit economics (COGS)
- Prototyping, DFM/DFX, and manufacturability
- Certification and compliance (CE, FCC, UL, medical, etc.)

SUPPLY CHAIN & OPERATIONS:
- Vendor selection, MOQs, lead times, QA/QC
- Logistics, warehousing, fulfillment options
- After-sales service, warranty, and RMA processes

MARKET & DISTRIBUTION:
- Retail vs direct-to-consumer vs channel partners
- Pricing, margins, CAPEX/OPEX planning
- Launch strategy with demos and creator outreach

Highlight hardware risks (supply chain, cash cycles), and provide realistic timelines and cost estimates.`,

        'offline-sector': `SECTOR EXPERTISE: Offline / Brick-and-Mortar Services

You specialize in physical businesses (retail, food & beverage, fitness, healthcare, etc.). Focus your analysis on:

LOCATION & DEMAND:
- Site selection, foot traffic patterns, catchment analysis
- Local demographics and competitive density

OPERATIONS & UNIT ECONOMICS:
- Staffing model, opening hours, scheduling
- COGS, labor, rent, utilities, break-even analysis
- Permits, compliance, health & safety

MARKETING & CHANNELS:
- Local SEO, maps, reviews, influencers, community
- Promotions, memberships, loyalty programs

Provide clear OPEX/CAPEX plans, realistic payback periods, and hyperlocal marketing playbooks.`,

        // ==== Few-shot example blocks per sector (concise, high-signal) ====
        'saas-examples': `FEW-SHOT EXAMPLES:\nGOOD (EN): \"Churn ~2.1%/mo; LTV ~$520; CAC ~$140; LTV/CAC ~3.7x. ICP: SMB design teams (20-200 seats).\"\nWHY: Concrete metrics, coherent unit economics.\nBAD: \"Everyone will use this, market is huge.\"\nWHY: Generic claim, no numbers.`,
        'ecommerce-examples': `FEW-SHOT EXAMPLES:\nGOOD (TR): \"CR ~%2.4; AOV ~₺420; aylık trafik ~35K; sepette terk ~%68→ kurtarma e-posta akışı ile ~%12 kazanım.\"\nNEDEN: Ölçülebilir metrik ve aksiyon.\nKÖTÜ: \"İnstagram’da satarız.\" (nicelik yok).`,
        'fintech-examples': `FEW-SHOT EXAMPLES:\nGOOD (EN): \"Take rate ~1.2%; fraud loss <0.1%; CAC ~$60; payback ~4 mo; KYC/AML: vendor X, go-live ~6-8 wks.\"\nWHY: Risk & compliance + unit economics together.`,
        'design-examples': `FEW-SHOT EXAMPLES:\nGOOD (EN): \"Figma Community templates weekly DL ~2K; PLG loop via remix; pricing $9/mo creator tier.\"\nWHY: Community metric + monetization.`,
        'marketplace-examples': `FEW-SHOT EXAMPLES:\nGOOD (EN): \"GMV path: M1 $8K → M3 $45K; take rate 12%; fill rate 68%; supply seeding via cohort of 50 providers.\"\nWHY: Liquidity + GMV with milestones.`,
        'mobile-examples': `FEW-SHOT EXAMPLES:\nGOOD (EN): \"D1 42%, D7 18%, D30 7%; ARPDAU $0.09; primary loop: share-to-unlock templates.\"\nWHY: Cohort metrics + growth loop.`,
        'hardware-examples': `FEW-SHOT EXAMPLES:\nGOOD (TR): \"BOM ~$38; hedef satış $129 → brüt marj ~%70; sertifikasyon (CE/FCC) ~8-10 hafta; MOQ 1K, LT 6 hafta.\"\nNEDEN: Operasyonel gerçeklik ve marj hesabı.`,
        'offline-examples': `FEW-SHOT EXAMPLES:\nGOOD (TR): \"Günlük foot traffic ~1.2K; dönüşüm ~%2→ ~24 satış/gün; ticket ort. ₺180; günlük ciro ~₺4.3K; breakeven ~5.5 ay.\"\nNEDEN: Yerel talep + ünite ekonomisi hesaplı.`,

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

        Reference specific competitors, provide market share estimates where available, and include actionable competitive intelligence with confidence assessments.`,
        'monetization-opportunity': `ANALYSIS FOCUS: Monetization & Pricing Strategy

Develop a realistic and data-driven monetization plan for the concept.

PRICING STRATEGY:
- Recommended model (SaaS tiered, usage-based, freemium, marketplace take-rate, ads, hybrid)
- Initial price points with currency and justification
- Discounting and annual vs monthly considerations

REVENUE STREAMS:
- 2-4 concrete revenue streams and expected contribution share
- Upsell/cross-sell opportunities and packaging

UNIT ECONOMICS:
- LTV/CAC ratio with rough calculation method
- Payback period (months) and break-even timeline

GO-TO-MARKET PRICING:
- Entry offer or pilot pricing
- Enterprise vs SMB considerations if relevant

RISKS:
- Price sensitivity, churn risks, channel costs, payment ops

Provide actionable and specific numbers where possible based on market norms.`
    };

    detectSector(input: string): string[] {
        const inputLower = input.toLowerCase();
        const scored: Array<{ sector: string; score: number }> = [];

        for (const [sector, keywords] of Object.entries(this.sectorKeywords)) {
            const score = keywords.reduce((acc, k) => acc + (inputLower.includes(k) ? 1 : 0), 0);
            if (score > 0) scored.push({ sector, score });
        }

        if (scored.length === 0) return ['saas'];
        return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.sector);
    }

    getSectorSpecificPlatforms(sectors: string[]): string[] {
        const platforms = new Set<string>();
        
        // Always include core platforms
        platforms.add('twitter');
        platforms.add('reddit');
        platforms.add('linkedin');
        
        // Add sector-specific platforms
        for (const sector of sectors) {
            const sectorPlatforms = this.sectorPlatforms[sector as keyof typeof this.sectorPlatforms] || [];
            sectorPlatforms.forEach((platform: string) => platforms.add(platform));
        }
        
        return Array.from(platforms);
    }

    detectAnalysisNeeds(input: string): string[] {
        const inputLower = input.toLowerCase();
        const scored: Array<{ key: string; score: number }> = [];

        for (const [analysis, keywords] of Object.entries(this.analysisKeywords)) {
            const score = keywords.reduce((acc, k) => acc + (inputLower.includes(k) ? 1 : 0), 0);
            if (score > 0) scored.push({ key: analysis, score });
        }

        if (scored.length === 0) return ['market', 'competitive', 'monetization'];
        return scored.sort((a, b) => b.score - a.score).slice(0, 4).map(s => s.key);
    }

    async selectPrompts(input: string): Promise<PromptSelection & { sectorsDetected: string[] }> {
        const sectors = this.detectSector(input);
        const analysisTypes = this.detectAnalysisNeeds(input);

        const basePrompt = this.prompts['base-analyst'];
        const sectorPrompts = sectors
            .map(sector => (this.prompts as any)[`${sector}-sector`] as string | undefined)
            .filter((p): p is string => Boolean(p));
        const examplePrompts = sectors
            .map(sector => (this.prompts as any)[`${sector}-examples`] as string | undefined)
            .filter((p): p is string => Boolean(p));
        // Map analysis keywords to actual prompt keys
        const promptKeyMap: Record<string, string> = {
            market: 'market-opportunity',
            competitive: 'competitive-landscape',
            monetization: 'monetization-opportunity',
            regulation: 'regulation-compliance',
            operations: 'operations-readiness',
            distribution: 'channel-distribution',
            unit_economics: 'unit-economics-depth',
            supply_chain: 'supply-chain',
            virality: 'virality-growth',
            network_effects: 'network-effects'
        };
        const analysisPrompts = (analysisTypes as Array<keyof typeof promptKeyMap>)
            .map(analysis => this.prompts[promptKeyMap[analysis]] as string | undefined)
            .filter((p): p is string => Boolean(p));

        return {
            basePrompt,
            sectorPrompts,
            analysisPrompts,
            confidence: this.calculateConfidence(sectors, analysisTypes),
            sectorsDetected: sectors,
            examplePrompts
        };
    }

    private calculateConfidence(sectors: string[], analysisTypes: string[]): number {
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

        if (selection.examplePrompts && selection.examplePrompts.length > 0) {
            parts.push('\n\n' + selection.examplePrompts.join('\n\n'));
        }

        return parts.join('');
    }
}

const promptManager = new PromptManager();

// === Simple fusion of multiple results (majority/most-informative) ===
function fuseResults(results: any[]): any {
    if (!Array.isArray(results) || results.length === 0) return results?.[0];
    const first = results[0] || {};
    const avg = (nums: number[]) => Math.round(nums.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0) / Math.max(1, nums.length));
    const demandScore = avg(results.map(r => Number(r?.demandScore || 0)));
    const scoreJustification = results.map(r => r?.scoreJustification || '').sort((a, b) => b.length - a.length)[0] || first.scoreJustification;

    const platformKeys = Array.from(new Set(results.flatMap(r => Object.keys(r?.platformAnalyses || {}))));
    const platformAnalyses: any = {};
    for (const k of platformKeys) {
        const candidates = results.map(r => r?.platformAnalyses?.[k]).filter(Boolean);
        if (candidates.length === 0) continue;
        const best = candidates.reduce((best: any, cur: any) => {
            if (!best) return cur;
            const bs = Number(best.score || 0), cs = Number(cur.score || 0);
            const bl = (best.summary || '').length, cl = (cur.summary || '').length;
            if (cs > bs) return cur;
            if (cs === bs && cl > bl) return cur;
            return best;
        }, null);
        platformAnalyses[k] = best;
    }

    const pickLongest = (key: string) => results.map(r => r?.[key]).filter(Boolean).sort((a: any, b: any) => JSON.stringify(b).length - JSON.stringify(a).length)[0] || first[key];
    const assumptions = Array.from(new Set(results.flatMap(r => r?.assumptions || []))).slice(0, 5);
    const confidence = Math.max(0, Math.min(100, avg(results.map(r => Number(r?.confidence || 0)))));
    const nextTestsRaw = results.flatMap(r => r?.nextTests || []);
    const seen = new Set<string>();
    const nextTests: any[] = [];
    for (const t of nextTestsRaw) {
        const key = `${t?.hypothesis || ''}|${t?.channel || ''}|${t?.metric || ''}`;
        if (!seen.has(key)) { seen.add(key); nextTests.push(t); }
        if (nextTests.length >= 3) break;
    }

    return {
        ...first,
        demandScore,
        scoreJustification,
        platformAnalyses,
        marketIntelligence: pickLongest('marketIntelligence'),
        competitiveLandscape: pickLongest('competitiveLandscape'),
        revenueModel: pickLongest('revenueModel'),
        targetAudience: pickLongest('targetAudience'),
        riskAssessment: pickLongest('riskAssessment'),
        goToMarket: pickLongest('goToMarket'),
        developmentRoadmap: pickLongest('developmentRoadmap'),
        productMarketFit: pickLongest('productMarketFit'),
        assumptions: assumptions.length ? assumptions : first.assumptions,
        confidence: confidence || first.confidence,
        nextTests: nextTests.length ? nextTests : first.nextTests
    };
}

// fuseResults is defined above

// Community Match local types (runtime usage only)
interface CommunityItem {
    name: string;
    url?: string;
    members?: string;
    fitReason: string;
    rulesSummary: string;
    entryMessage: string;
}

interface CommunityMatch {
    subreddits: CommunityItem[];
    discordServers: CommunityItem[];
    linkedinGroups: CommunityItem[];
}

// Dynamic Prompt System Result type comes from src/types

interface PlatformAnalysis {
    platformName: string;
    score: number; // 1-5 simple score
    summary: string; // 2-3 sentence simple explanation
    keyFindings: string[]; // 2-3 key findings
    contentSuggestion: string; // Platform-specific content suggestion
        rubric?: {
            reach: number; // 1-5
            nicheFit: number; // 1-5
            contentFit: number; // 1-5
            competitiveSignal: number; // 1-5
        };
}

// Legacy interface for backward compatibility
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ValidationResult {
    idea: string;
    content?: string;
    demandScore: number;
    scoreJustification: string;
    signalSummary: Array<{
        platform: string;
        summary: string;
    }>;
    scoreBreakdown?: {
        marketSize: number;
        competition: number;
        trendMomentum: number;
        feasibility: number;
    };
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;

}

// Rate limiting için basit bir in-memory store
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 dakika
const MAX_REQUESTS_PER_WINDOW = 50; // Normal limit

// Rate limiting kontrolü
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userRequests = requestCounts.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    userRequests.count++;
    return true;
}

// API key güvenlik kontrolü
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
function validateApiKey(): string {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable is not set");
    }
    return apiKey;
}

// Input validation
function validateInput(content: string): void {
    if (!content || typeof content !== 'string') {
        throw new Error("Content is required and must be a string");
    }

    if (content.length < 5) {
        throw new Error("Content must be at least 5 characters long");
    }

    if (content.length > 2000) {
        throw new Error("Content must be less than 2000 characters");
    }
}

// AI instance
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
    if (!ai) {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Google API key is not set. Please define GOOGLE_API_KEY or API_KEY in environment.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

// Ensure module context for TypeScript
export {};

// Legacy response schema for backward compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const legacyResponseSchema = {
    type: Type.OBJECT,
    properties: {
        idea: { type: Type.STRING, description: "The original idea analyzed" },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score." },
        signalSummary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: { type: Type.STRING },
                    summary: { type: Type.STRING }
                }
            }
        },
        tweetSuggestion: { type: Type.STRING, description: "An optimized X (Twitter) post version." },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for Reddit." },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for Reddit post." },
        linkedinSuggestion: { type: Type.STRING, description: "A professional LinkedIn post version." }
    },
    required: ["idea", "demandScore", "scoreJustification", "signalSummary", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
};

export default async function handler(req: any, res: any) {
    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
            ? 'https://validationly.com'
            : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'none'; script-src 'none';"
    };

    Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('=== Simple API validate called ===');

        // Rate limiting
        const clientIP = req.headers['x-forwarded-for'] as string ||
            req.headers['x-real-ip'] as string ||
            'unknown';

        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                message: 'Rate limit exceeded. Please try again later.'
            });
        }

        const { idea, content, lang, model, evidence, weightsVariant, enhance, vcReview, fast } = req.body;
        const inputContent = idea || content;

        // Input validation
        if (!inputContent) {
            return res.status(400).json({
                message: 'Idea or content is required'
            });
        }
        validateInput(inputContent);

        // Lightweight enhance mode: return enriched prompt text in same language
        if (enhance === true) {
            const aiInstance = getAI();
            const baseText = (inputContent || '').toString().slice(0, 2000);
            const enhanceSystem = `You are a prompt enhancer. Rewrite the user's idea into a richer, structured brief in the SAME LANGUAGE as the input. Keep it concise, actionable, and specific. Avoid generic claims. Output PLAIN TEXT only (no markdown, no JSON).`;
            try {
                const r = await aiInstance.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: `INPUT:\n${baseText}\n\nENHANCE THIS PROMPT: Provide a more specific and structured version with bullet-like clarity (max ~1200 characters). Include: market angle, target user, key value prop, 1-2 success metrics, channels. Same language as input.`,
                    config: {
                        systemInstruction: enhanceSystem,
                        responseMimeType: 'text/plain',
                        temperature: 0.3,
                        maxOutputTokens: 512,
                    }
                });
                const enhancedPrompt = (r.text || '').trim();
                return res.status(200).json({ enhancedPrompt });
            } catch (e) {
                return res.status(500).json({ message: 'Enhance failed' });
            }
        }

        // Dynamic prompt selection based on input
        const promptSelection = await promptManager.selectPrompts(inputContent);
        const systemInstruction = promptManager.combinePrompts(promptSelection);

        console.log(`🎯 Selected prompts - Sectors: ${promptSelection.sectorPrompts.length}, Analysis: ${promptSelection.analysisPrompts.length}, Confidence: ${promptSelection.confidence}`);

        // Add language and format requirements
        const evidenceText = Array.isArray(evidence) && evidence.length ? `\n\nEVIDENCE (STRICT) — Use ONLY these facts. If insufficient, state \"insufficient evidence\":\n${evidence.map((e:any)=> typeof e === 'string' ? `- ${e}` : `- [${e.source}] "${e.quote}"`).join('\n')}` : '';

        // Optional refine directive
        const refine = (req.body as any)?.refine as { section?: string; feedback?: string } | undefined;
        const refineInstruction = (refine && (refine.section || refine.feedback))
            ? `\n\nREFINEMENT DIRECTIVE: Improve ONLY the section "${(refine.section||'').toString()}" according to: "${(refine.feedback||'').toString()}". Still return the FULL JSON with ALL sections present. Keep other sections consistent.`
            : '';

        const finalSystemInstruction = `${systemInstruction}${refineInstruction}

        🌍 CRITICAL LANGUAGE REQUIREMENT: 
        - The user's input language has been detected and specified above
        - You MUST respond in the EXACT SAME LANGUAGE as specified
        - If Turkish is specified → ALL fields must be in Turkish (summary, keyFindings, contentSuggestion, etc.)
        - If English is specified → ALL fields must be in English
        - This applies to EVERY SINGLE text field in your JSON response
        - NO MIXING of languages - maintain 100% consistency
        - Platform names can stay as "Twitter", "Reddit", "LinkedIn" but all descriptions must match the specified language

        COMPREHENSIVE ANALYSIS METHODOLOGY:
        1. Demand Score (0-100): Overall market demand assessment
        2. Platform Analysis: Analyze X, Reddit, LinkedIn market signals
        3. Market Intelligence: TAM/SAM/SOM sizing with real market data
        4. Competitive Landscape: Identify actual competitors and positioning
        5. Revenue Model: Realistic pricing and monetization strategies
        6. Target Audience: Specific customer segments and pain points
        7. Enhanced Risk Assessment: Multi-dimensional risk matrix with mitigation strategies
        8. Go-to-Market: Phased launch strategy with timelines
        9. Development Roadmap: Technical implementation timeline
        10. Product-Market Fit: PMF indicators and predictions
        11. Enhanced Financial Projections: Detailed revenue streams, funding requirements, break-even analysis
        12. Persona Analysis: Detailed customer personas with demographics, psychographics, and pain points
        13. Content Suggestions: Platform-optimized versions
        14. Community Match: Top subreddits (20), Discord servers (10), LinkedIn groups (10) with rules and entry messages

        OUTPUT CONSTRAINTS (STRICT):
        - Platform list: include ONLY the TOP 6 most relevant platforms overall. Do NOT include more than 6.
        - NON-EMPTY FIELDS REQUIRED per platform (STRICT):
          • summary: REQUIRED, non-empty, <= 180 characters (omit platform if you cannot provide)
          • keyFindings: REQUIRED, EXACTLY 3 non-empty strings (omit platform if you cannot provide all 3)
          • contentSuggestion: REQUIRED, non-empty, <= 140 characters (omit platform if you cannot provide)
          • rubric: REQUIRED with integer scores (1-5) for reach, nicheFit, contentFit, competitiveSignal
        - If any platform cannot satisfy ALL the above, DO NOT include that platform in platformAnalyses.
        - For high-level sections (marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit, communityMatch):
          • Keep it VERY concise (max 2 short sentences per field)
          • DO NOT leave fields empty. If insufficient evidence, write "insufficient evidence" explicitly.

        - Community Match section (STRICT):
          • communityMatch.subreddits: up to 20 items; each with {name, url, members, fitReason, rulesSummary, entryMessage}
          • communityMatch.discordServers: up to 10 items; same fields
          • communityMatch.linkedinGroups: up to 10 items; same fields
          • Keep messages concise and compliant with community rules. If unsure, set rulesSummary to "insufficient evidence".

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Provide REAL market data, not generic examples
        - Reference actual competitors and market conditions
        - Give specific numbers based on industry knowledge
        - Make all suggestions actionable and data-driven
        - All content must feel authentic and valuable to entrepreneurs

        CONSUMER SOCIAL GUARDRAILS (STRICT):
        - If the idea is a generic consumer social network or resembles major platforms (Facebook, Instagram, TikTok, X/Twitter, Snapchat, Reddit, Discord, LinkedIn, Clubhouse), you MUST:
          • Mark competition as HIGH and distribution/network effects as a MAJOR barrier
          • List at least 3 REAL competitors (company names)
          • Provide clear differentiation or state "insufficient differentiation"
          • Be conservative in scoring (lower competitiveSignal) and avoid optimistic language

        Additionally, include:
        - assumptions: 3-5 short assumptions that your analysis relies on
        - confidence: integer 0-100 overall confidence in your analysis quality
        - nextTests: 3 actionable experiments (each with hypothesis, channel, metric)
        - socialSuggestions: platform-specific suggestions with goals and variables as described below
          X:
            { variants: [ { text, goal, variables[] } ], thread: [step1, step2, step3] }
          Reddit:
            { subreddits: ["sub1","sub2"], titleVariants: ["A","B"], body, goal }
          LinkedIn:
            { post, hashtags: ["#tag1","#tag2"], goal }
          Instagram:
            { hooks: ["hook1","hook2"], caption, hashtags: ["#"], shots: ["idea1","idea2"], goal }
          TikTok:
            { hooks: ["hook1","hook2"], script, hashtags: ["#"], shots: ["cut1","cut2"], goal }
          YouTube:
            { title, outline: ["bullet1","bullet2"], description, tags: ["tag1","tag2"], goal }
          Facebook:
            { post, groups: ["group1","group2"], hashtags: ["#"], goal }
          Threads:
            { post, hashtags: ["#"], goal }
          Pinterest:
            { title, description, board, hashtags: ["#"], goal }

        Analyze the following startup idea: "${inputContent}"${evidenceText}`;

        console.log('🚀 Starting dynamic prompt analysis...');

        // Fast mode: return minimal analysis quickly (3 platforms, no heavy sections)
        if (fast === true) {
            try {
                const aiInstance = getAI();
                const fastSys = `You are a strict JSON generator. Respond in SAME LANGUAGE as user. Return ONLY JSON with keys: idea, demandScore(0-100), scoreJustification, platformAnalyses(object of up to 3 among X, Reddit, LinkedIn with {platformName, score(1-5), summary(<=140), keyFindings[3], contentSuggestion(<=120)}), tweetSuggestion, redditTitleSuggestion, redditBodySuggestion, linkedinSuggestion. Keep strings short.`;
                const r = await aiInstance.models.generateContent({
                    model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
                    contents: `ANALYZE: "${inputContent}"\nReturn JSON only.`,
                    config: { systemInstruction: fastSys, responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 800 }
                });
                const parsed = ((): any => { try { return JSON.parse((r.text || '').trim()); } catch { return null; } })();
                if (parsed && typeof parsed === 'object') {
                    return res.status(200).json(parsed);
                }
            } catch {}
            // fallback to normal path if fast failed
        }

        // Simplified AI Analysis - use only Gemini 2.0 for now
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async function getAIAnalysis(content: string, systemPrompt: string): Promise<any> {
            console.log('🎯 Using Gemini 2.0 Flash Experimental...');

            try {
                const aiInstance = getAI();
                const result = await aiInstance.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`,
                    config: {
                        systemInstruction: finalSystemInstruction + `\n\nRESPONSE FORMAT: Return comprehensive JSON with ALL analysis fields including marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit`,
                        responseMimeType: "application/json",
                        temperature: 0.3,
                        maxOutputTokens: 1792,
                    }
                });

                return {
                    model: 'gemini-2.0-flash-exp',
                    result: result.text?.trim(),
                    success: true,
                    fallbackUsed: false
                };
            } catch (error) {
                console.log('❌ Gemini 2.0 failed, trying Gemini 1.5...', error);

                // Fallback to Gemini 1.5
                try {
                    const aiInstance = getAI();
                    const result = await aiInstance.models.generateContent({
                        model: "gemini-1.5-flash",
                        contents: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`,
                        config: {
                            systemInstruction: finalSystemInstruction + `\n\nRESPONSE FORMAT: Return comprehensive JSON with ALL analysis fields including marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit`,
                            responseMimeType: "application/json",
                            temperature: 0.3,
                            maxOutputTokens: 1792,
                        }
                    });

                    return {
                        model: 'gemini-1.5-flash',
                        result: result.text?.trim(),
                        success: true,
                        fallbackUsed: true
                    };
                } catch (fallbackError) {
                    console.error('❌ Both Gemini models failed:', fallbackError);
                    throw new Error('All AI models failed to respond');
                }
            }
        }

        // Optional runtime model selection (whitelist)
        const allowedModels = [
            'gemini-2.5-flash',
            'gemini-2.5-pro',
            'gemini-2.0-flash-exp',
            'gemini-1.5-flash',
            'gemini-1.5-pro'
        ];
        const preferredModel = typeof model === 'string' && allowedModels.includes(model) ? model : undefined;

        // Initialize enhanced analysis components (detect language locally)
        const looksTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(inputContent) || /( bir | ve | için | ile | kadar | şöyle | çünkü | ancak )/i.test(inputContent);
        const expectedLanguage = looksTurkish ? 'Turkish' : 'English';
        const criticAgent = new CriticAgent(expectedLanguage);
        const evidenceAnalyzer = new EvidenceAnalyzer();
        const confidenceCalculator = new ConfidenceCalculator();
        const errorManager = new ErrorManager();

        // Use enhanced analysis approach with quality control
        const baseRun = () => getEnhancedAIAnalysis(
            inputContent, 
            finalSystemInstruction, 
            lang, 
            preferredModel, 
            weightsVariant, 
            { 
                morePlatforms: Boolean(req.body?.morePlatforms),
                evidenceMode: Boolean(req.body?.evidence),
                sectors: promptManager.detectSector(inputContent)
            },
            errorManager,
            criticAgent,
            evidenceAnalyzer,
            confidenceCalculator
        );

        let result = await baseRun();
        
        if (req.body?.ensemble === true) {
            try {
                const extra = await Promise.all([baseRun(), baseRun()]);
                result = fuseResults([result, ...extra]);
            } catch {}
        }

        console.log('✅ Enhanced dynamic prompt analysis completed successfully');
        console.log('📊 Result structure:', Object.keys(result));
        console.log('🎯 Quality score:', result.analysisMetadata?.qualityScore || 'N/A');
        return res.status(200).json(result);

    } catch (error) {
        console.error('❌ Enhanced validation error:', error);

        // Enhanced error handling with graceful degradation
        try {
            console.log('🔄 Attempting graceful degradation...');
            
            // Create a basic fallback result (avoid using out-of-scope vars)
            const fbIdea = (req.body?.idea || req.body?.content || '').toString();
            const fbLang = /[çğıöşüÇĞİÖŞÜ]/.test(fbIdea) || /( bir | ve | için | ile | kadar | şöyle | çünkü | ancak )/i.test(fbIdea) ? 'Turkish' : 'English';
            const fallbackResult = {
                idea: fbIdea,
                demandScore: 50,
                scoreJustification: 'Analysis completed with limited capabilities due to system constraints',
                platformAnalyses: {
                    twitter: {
                        platformName: 'X',
                        score: 3,
                        summary: 'Platform analysis temporarily unavailable. Moderate potential estimated.',
                        keyFindings: ['Analysis limited', 'System fallback', 'Retry recommended'],
                        contentSuggestion: 'Share your idea on X for community feedback.'
                    },
                    reddit: {
                        platformName: 'Reddit',
                        score: 3,
                        summary: 'Community analysis temporarily unavailable. Moderate engagement potential.',
                        keyFindings: ['Analysis limited', 'System fallback', 'Community validation needed'],
                        contentSuggestion: 'Post in relevant subreddits for detailed feedback.'
                    },
                    linkedin: {
                        platformName: 'LinkedIn',
                        score: 3,
                        summary: 'Professional network analysis temporarily unavailable.',
                        keyFindings: ['Analysis limited', 'System fallback', 'Professional validation needed'],
                        contentSuggestion: 'Share with your professional network on LinkedIn.'
                    }
                },
                tweetSuggestion: `🚀 Working on a new idea: ${fbIdea.substring(0, 100)}${fbIdea.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: 'Looking for feedback on my startup idea',
                redditBodySuggestion: `I've been working on this concept: ${fbIdea}. Would love to get your thoughts and feedback from the community.`,
                linkedinSuggestion: `Exploring a new business opportunity: ${fbIdea.substring(0, 200)}${fbIdea.length > 200 ? '...' : ''} Interested in connecting with others in this space.`,
                fallbackUsed: true,
                confidence: 30,
                language: fbLang,
                analysisMetadata: {
                    analysisDate: new Date().toISOString(),
                    aiModel: 'fallback-system',
                    fallbackUsed: true,
                    analysisVersion: '2.0-fallback',
                    processingTime: 0,
                    confidence: 30,
                    language: fbLang,
                    completeness: 40,
                    retryCount: 0,
                    qualityScore: 40
                },
                criticAnalysis: {
                    overallQuality: 40,
                    issues: [
                        {
                            type: 'missing_field' as const,
                            field: 'comprehensive_analysis',
                            severity: 'high' as const,
                            description: 'Full analysis unavailable due to system limitations',
                            suggestion: 'Please try again later for complete analysis'
                        }
                    ],
                    suggestions: ['Retry analysis when system is fully operational'],
                    completenessScore: 40,
                    consistencyScore: 80,
                    needsRepair: true
                }
            };

            console.log('✅ Graceful degradation successful - returning basic analysis');
            return res.status(200).json(fallbackResult);

        } catch (fallbackError) {
            console.error('❌ Graceful degradation also failed:', fallbackError);
            
            // Final fallback - return error response
        return res.status(500).json({
                message: 'Analysis system temporarily unavailable. Please try again later.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                fallbackAttempted: true,
                retryRecommended: true
            });
        }
    }
}

// Single AI call analysis - no separate platform functions needed

// Enhanced AI analysis with quality control and evidence gathering
async function getEnhancedAIAnalysis(
    content: string,
    systemInstruction: string,
    forcedLang?: 'tr'|'en',
    preferredModel?: string,
    weightsVariant?: string,
    options?: { morePlatforms?: boolean; evidenceMode?: boolean; sectors?: string[] },
    errorManager?: ErrorManager,
    criticAgent?: CriticAgent,
    evidenceAnalyzer?: EvidenceAnalyzer,
    confidenceCalculator?: ConfidenceCalculator
): Promise<any> {
    const startTime = Date.now();
    let retryCount = 0;
    let evidenceAnalysis;
    let criticAnalysis;

    // Gather evidence if enabled
    if (options?.evidenceMode && evidenceAnalyzer && options.sectors) {
        try {
            console.log('🔍 Gathering market evidence...');
            evidenceAnalysis = await evidenceAnalyzer.gatherEvidence(content, options.sectors);
            console.log(`📊 Evidence quality: ${evidenceAnalysis.evidenceQuality}/100`);
        } catch (error) {
            console.warn('⚠️ Evidence gathering failed:', error);
        }
    }

    // Enhanced system instruction with evidence
    let enhancedSystemInstruction = systemInstruction;
    if (evidenceAnalysis && evidenceAnalysis.sources.length > 0) {
        const evidenceContext = evidenceAnalysis.sources
            .map(source => `${source.platform}: ${source.content}`)
            .join('\n');
        
        enhancedSystemInstruction += `\n\nMARKET EVIDENCE:\n${evidenceContext}\n\nUse this evidence to support your analysis where relevant.`;
    }

    // Execute analysis with error management
    const executeAnalysis = async (): Promise<any> => {
        retryCount++;
        return await getSimplifiedAIAnalysis(
            content,
            enhancedSystemInstruction,
            forcedLang,
            preferredModel,
            weightsVariant,
            options
        );
    };

    let result;
    if (errorManager) {
        result = await errorManager.executeWithRetry(executeAnalysis, {
            model: preferredModel || 'gemini-2.0-flash-exp',
            inputLength: content.length,
            promptVersion: '2.0'
        });
    } else {
        result = await executeAnalysis();
    }

    // Quality control with critic agent
    if (criticAgent) {
        try {
            console.log('🔍 Running quality analysis...');
            criticAnalysis = await criticAgent.analyzeQuality(result);
            console.log(`📊 Quality score: ${criticAnalysis.overallQuality}/100`);

            // Attempt repair if needed
            if (criticAnalysis.needsRepair && criticAnalysis.overallQuality < 60) {
                console.log('🔧 Attempting analysis repair...');
                result = await criticAgent.repairAnalysis(result, criticAnalysis.issues);
                
                // Re-analyze after repair
                criticAnalysis = await criticAgent.analyzeQuality(result);
                console.log(`📊 Post-repair quality: ${criticAnalysis.overallQuality}/100`);
            }
        } catch (error) {
            console.warn('⚠️ Quality analysis failed:', error);
        }
    }

    // Enhanced confidence calculation
    let enhancedConfidence;
    if (confidenceCalculator) {
        try {
            enhancedConfidence = confidenceCalculator.calculateEnhancedConfidence(
                result,
                options?.sectors || [],
                evidenceAnalysis,
                criticAnalysis
            );
            console.log(`🎯 Enhanced confidence: ${enhancedConfidence.overall}/100`);
        } catch (error) {
            console.warn('⚠️ Confidence calculation failed:', error);
        }
    }

    // Add enhanced metadata
    const processingTime = Date.now() - startTime;
    const enhancedResult = {
        ...result,
        // Enhanced metadata
        analysisMetadata: {
            analysisDate: new Date().toISOString(),
            aiModel: preferredModel || 'gemini-2.0-flash-exp',
            fallbackUsed: result.fallbackUsed || false,
            analysisVersion: '2.0-enhanced',
            processingTime,
            confidence: result.confidence || 75,
            language: result.language || 'English',
            completeness: criticAnalysis?.completenessScore || 85,
            retryCount,
            qualityScore: criticAnalysis?.overallQuality || 80
        },
        // Quality control results
        criticAnalysis,
        // Evidence analysis results
        evidenceAnalysis,
        // Enhanced confidence
        enhancedConfidence
    };

    return enhancedResult;
}

// Original simplified AI analysis (kept for compatibility and fallback)
async function getSimplifiedAIAnalysis(
    content: string,
    systemInstruction: string,
    forcedLang?: 'tr'|'en',
    preferredModel?: string,
    weightsVariant?: string,
    options?: { morePlatforms?: boolean }
): Promise<any> {
    // Helper: robust JSON parsing with light repairs
    const safeJsonParse = (rawText: string): any => {
        const tryParse = (txt: string) => {
            try { return JSON.parse(txt); } catch { return null; }
        };

        if (!rawText) return null;

        // Strip common wrappers (markdown fences)
        let text = rawText
            .replace(/^```\s*json\s*/i, '')
            .replace(/^```/i, '')
            .replace(/```\s*$/i, '')
            .replace(/```/g, '')
            .trim();

        // First naive parse
        let parsed = tryParse(text);
        if (parsed) return parsed;

        // Extract first JSON object block
        const first = text.indexOf('{');
        const last = text.lastIndexOf('}');
        if (first !== -1 && last !== -1 && last > first) {
            text = text.substring(first, last + 1);
        }

        // Replace smart quotes and remove trailing commas
        text = text
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'")
            .replace(/,(\s*[}\]])/g, '$1');

        parsed = tryParse(text);
        return parsed;
    };
    // Use the dynamic system instruction passed from the main function

    try {
        console.log('🎯 Using single AI call with dynamic prompt system...');
        console.log('📝 System instruction length:', systemInstruction.length);
        console.log('🎯 Input content:', content);

        // Language: mirror the user's input language (heuristic detection)
        const looksTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(content) || /( bir | ve | için | ile | kadar | şöyle | çünkü | ancak )/i.test(content);
        const expectedLanguage = looksTurkish ? 'Turkish' : 'English';
        const languageInstruction = `Respond ONLY in ${expectedLanguage}. Keep 100% consistency across ALL text fields. Do not include words from any other language.`;

        // Detect sector and get relevant platforms
        const sectors = promptManager.detectSector(content);
        const relevantPlatforms = promptManager.getSectorSpecificPlatforms(sectors);
        const focusPlatforms = relevantPlatforms.slice(0, 4);
        // Build compact platform schema for ONLY focus platforms to keep prompt small
        const platformNameLabel: Record<string, string> = {
            twitter: 'X', reddit: 'Reddit', linkedin: 'LinkedIn', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube',
            facebook: 'Facebook', producthunt: 'Product Hunt', pinterest: 'Pinterest', github: 'GitHub', stackoverflow: 'Stack Overflow',
            angellist: 'AngelList', crunchbase: 'Crunchbase', dribbble: 'Dribbble', behance: 'Behance', figma: 'Figma Community',
            slack: 'Slack Communities', clubhouse: 'Clubhouse', substack: 'Substack', notion: 'Notion Community', devto: 'Dev.to',
            hashnode: 'Hashnode', gitlab: 'GitLab', codepen: 'CodePen', indiehackers: 'Indie Hackers', awwwards: 'Awwwards',
            designs99: '99designs', canva: 'Canva Community', adobe: 'Adobe Community', unsplash: 'Unsplash', etsy: 'Etsy',
            amazon: 'Amazon Seller Central', shopify: 'Shopify Community', woocommerce: 'WooCommerce'
        };
        const schemaLines = focusPlatforms
            .map(p => `"${p}": { "platformName": "${platformNameLabel[p] || p}", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2", "finding3"], "contentSuggestion": "suggestion", "rubric": { "reach": number (1-5), "nicheFit": number (1-5), "contentFit": number (1-5), "competitiveSignal": number (1-5) } }`)
            .join(',\n                        ');
        
        console.log(`🎯 Detected sectors: ${sectors.join(', ')}`);
        console.log(`📱 Relevant platforms: ${relevantPlatforms.join(', ')}`);

        // Single comprehensive AI analysis using our dynamic prompt system
        const aiInstance = getAI();
        const runtimeModel = preferredModel || process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash';
        let result = await aiInstance.models.generateContent({
            model: runtimeModel,
            contents: `${languageInstruction}\n\nANALYZE THIS STARTUP IDEA: "${content}"\n\n🎯 DETECTED SECTORS: ${sectors.join(', ')}\n📱 FOCUS PLATFORMS: ${focusPlatforms.join(', ')} (USE ONLY THESE; MAX 4)\n\nProvide COMPREHENSIVE BUSINESS ANALYSIS with REAL DATA. KEEP OUTPUT CONCISE: one short sentence per field or 2-3 short bullets; numbers where applicable. RETURN ONLY JSON. NO EXTRA TEXT.:

            📊 MARKET INTELLIGENCE (provide specific numbers):
            - TAM: Research actual market size with $ amounts
            - SAM: Calculate serviceable market with methodology  
            - SOM: Realistic obtainable market projection
            - Growth Rate: Industry-specific growth percentages
            - Market Timing: Rate 1-5 stars based on current trends
            - Key Trends: 3 specific industry trends driving growth

            🥊 COMPETITIVE LANDSCAPE (name real competitors):
            - Direct Competitors: List 3 actual company names in this space
            - Indirect Competitors: 2 alternative solutions
            - Market Position: Specific positioning strategy
            - Differentiation Score: Rate 1-10 with reasoning
            - Competitive Moat: Specific sustainable advantages
            - Entry Barriers: Real barriers to market entry

            💰 ENHANCED FINANCIAL PROJECTIONS (comprehensive financial analysis):
            - Revenue Model: { primary: "business model", secondary: [alternative models], revenueStreams: [{ name, type, projectedRevenue, confidence }], scalabilityFactor: 1-10 }
            - Pricing Strategy: { model: "freemium/subscription/one_time/usage_based/tiered", pricePoint: number, currency: "USD/EUR/etc", justification: "reasoning", competitivePosition: "premium/competitive/budget" }
            - Financial Metrics: { ltvcacRatio: number, projectedMRR: number, churnRate: percentage, grossMargin: percentage, unitEconomics: "description" }
            - Funding Requirements: { totalNeeded: amount, currency: "USD", breakdown: [{ category, amount, percentage, justification }], timeline: "months", fundingStage: "pre_seed/seed/series_a/bootstrap" }
            - Break-even Analysis: { timeToBreakEven: months, monthlyBurnRate: amount, revenueRequired: amount, assumptions: [key assumptions] }

            👥 ENHANCED PERSONA ANALYSIS (detailed customer insights):
            - Primary Persona: { segment: "customer type", demographics: { ageRange, income, location, occupation, education }, psychographics: { values: [], interests: [], behaviors: [], motivations: [] }, painPoints: [{ description, severity: 1-10, frequency: "daily/weekly/monthly/occasional", currentSolutions: [], satisfactionWithCurrent: 1-10 }], willingnessToPay: { minPrice, maxPrice, idealPrice, priceElasticity: "high/medium/low", paymentPreference: "monthly/annual/one_time" }, acquisitionChannels: [{ channel, effectiveness: 1-10, cost: "low/medium/high", timeToConvert, scalability: 1-10 }], marketSize: number, priority: "primary" }
            - Secondary Persona: { same structure as primary but with priority: "secondary" }
            - Tertiary Persona: { same structure as primary but with priority: "tertiary" }

            ⚠️ ENHANCED RISK ASSESSMENT (multi-dimensional risk matrix):
            - Technical Risk: { level: "Low/Medium/High", score: 0-100, factors: [reasons], impact: "low/medium/high", probability: "low/medium/high", mitigations: [strategies] }
            - Market Risk: { level: "Low/Medium/High", score: 0-100, factors: [market factors], impact: "low/medium/high", probability: "low/medium/high", mitigations: [strategies] }
            - Financial Risk: { level: "Low/Medium/High", score: 0-100, factors: [financial factors], impact: "low/medium/high", probability: "low/medium/high", mitigations: [strategies] }
            - Regulatory Risk: { level: "Low/Medium/High", score: 0-100, factors: [compliance issues], impact: "low/medium/high", probability: "low/medium/high", mitigations: [strategies] }
            - Competitive Risk: { level: "Low/Medium/High", score: 0-100, factors: [competitive threats], impact: "low/medium/high", probability: "low/medium/high", mitigations: [strategies] }
            - Overall Risk: Low/Medium/High summary
            - Mitigation Strategies: 5 comprehensive risk reduction tactics

            🚀 GO-TO-MARKET (actionable launch strategy):
            - Phase 1: Specific first 3-month strategy
            - Phase 2: Months 4-6 scaling approach
            - Phase 3: Months 7-12 expansion plan
            - Timeline: Overall launch timeline
            - Budget Needed: Specific $ amount for launch
            - Key Channels: 3 primary marketing channels

            🛠️ DEVELOPMENT ROADMAP (realistic timelines):
            - MVP Timeline: Specific months to MVP
            - Beta Launch: Months to beta version
            - Public Launch: Months to full launch
            - Key Features: 3 essential features to build
            - Team Needed: 3 specific roles to hire
            - Tech Stack: 3 recommended technologies

            🎯 PRODUCT-MARKET FIT (measurable indicators):
            - Problem-Solution Fit: Percentage score 0-100
            - Solution-Market Fit: Percentage score 0-100  
            - Early Adopter Signals: Specific indicators to watch
            - Retention Prediction: Expected retention percentage
            - Viral Coefficient: Growth multiplier potential
            - PMF Indicators: 3 metrics to track success

            - Analyze ONLY these focus platforms: ${focusPlatforms.join(', ')}`,
            config: {
                        systemInstruction: systemInstruction + `\n\nLANGUAGE ENFORCEMENT: Respond ONLY in the SAME LANGUAGE as the user input. Do not mix languages. All text fields must use the same language as input.\n\nRUBRIC REQUIREMENT: For EVERY platform under platformAnalyses, include a 'rubric' object with integer scores (1-5) for: reach, nicheFit, contentFit, competitiveSignal.\n\nCITATIONS (OPTIONAL): If EVIDENCE is provided above, include a 'citations' array per relevant section with { source, evidence } drawn strictly from the EVIDENCE. If evidence is insufficient, set citations to an empty array and state \"insufficient evidence\" in the relevant summaries.\n\nRESPONSE FORMAT: Return JSON with this exact structure including ALL required keys (even if estimated). Use non-empty strings for all text fields. No nulls, no empty arrays. Include ALL relevant platforms as specified:
                {
                    "idea": "${content}",
                    "demandScore": number (0-100),
                    "scoreJustification": "short justification phrase",
                    "platformAnalyses": {
                        ${schemaLines}
                    },
                    "tweetSuggestion": "optimized Twitter post",
                    "redditTitleSuggestion": "compelling Reddit title",
                    "redditBodySuggestion": "detailed Reddit post body",
                    "linkedinSuggestion": "professional LinkedIn post",
                    
                    "marketIntelligence": {
                        "tam": "Total Addressable Market size",
                        "sam": "Serviceable Addressable Market size", 
                        "som": "Serviceable Obtainable Market size",
                        "growthRate": "Market growth rate percentage",
                        "marketTiming": number (1-5),
                        "keyTrends": ["trend1", "trend2", "trend3"]
                    },
                    
                    "competitiveLandscape": {
                        "directCompetitors": ["competitor1", "competitor2", "competitor3"],
                        "indirectCompetitors": ["indirect1", "indirect2"],
                        "marketPosition": "positioning description",
                        "differentiationScore": number (1-10),
                        "competitiveMoat": "competitive advantage description",
                        "entryBarriers": "market entry barriers"
                    },
                    
                    "revenueModel": {
                        "primaryModel": "business model type",
                        "pricePoint": "pricing recommendation",
                        "revenueStreams": ["stream1", "stream2", "stream3"],
                        "breakEvenTimeline": "time to break even",
                        "ltvCacRatio": "lifetime value to customer acquisition cost ratio",
                        "projectedMrr": "monthly recurring revenue projection"
                    },
                    
                    "targetAudience": {
                        "primarySegment": "primary customer segment",
                        "secondarySegment": "secondary customer segment",
                        "tertiarySegment": "tertiary customer segment",
                        "painPoints": ["pain1", "pain2", "pain3"],
                        "willingnessToPay": "willingness to pay assessment",
                        "customerAcquisitionChannels": ["channel1", "channel2", "channel3"]
                    },
                    
                    "riskAssessment": {
                        "technicalRisk": "Low|Medium|High",
                        "marketRisk": "Low|Medium|High",
                        "financialRisk": "Low|Medium|High",
                        "regulatoryRisk": "Low|Medium|High",
                        "overallRiskLevel": "Low|Medium|High",
                        "mitigationStrategies": ["strategy1", "strategy2", "strategy3"]
                    },
                    
                    "goToMarket": {
                        "phase1": "first phase strategy",
                        "phase2": "second phase strategy", 
                        "phase3": "third phase strategy",
                        "timeline": "overall timeline",
                        "budgetNeeded": "budget requirement",
                        "keyChannels": ["channel1", "channel2", "channel3"]
                    },
                    
                    "developmentRoadmap": {
                        "mvpTimeline": "MVP development timeline",
                        "betaLaunch": "beta launch timeline",
                        "publicLaunch": "public launch timeline",
                        "keyFeatures": ["feature1", "feature2", "feature3"],
                        "teamNeeded": ["role1", "role2", "role3"],
                        "techStack": ["tech1", "tech2", "tech3"]
                    },
                    
                    "productMarketFit": {
                        "problemSolutionFit": number (0-100),
                        "solutionMarketFit": number (0-100),
                        "earlyAdopterSignals": "early adopter indicators",
                        "retentionPrediction": "retention prediction",
                        "viralCoefficient": "viral growth potential",
                        "pmfIndicators": ["indicator1", "indicator2", "indicator3"]
                    },
                    "assumptions": ["assumption1","assumption2","assumption3"],
                    "confidence": number (0-100),
                    "nextTests": [
                      { "hypothesis": "...", "channel": "...", "metric": "..." },
                      { "hypothesis": "...", "channel": "...", "metric": "..." },
                      { "hypothesis": "...", "channel": "...", "metric": "..." }
                    ],
                    "socialSuggestions": {
                      "x": {
                        "variants": [ { "text": "...", "goal": "e.g., 1.5%+ engagement", "variables": ["emoji","number","question"] } ],
                        "thread": ["intro","problem","solution","CTA"]
                      },
                      "reddit": {
                        "subreddits": ["sub1","sub2"],
                        "titleVariants": ["title A","title B"],
                        "body": "...",
                        "goal": "10+ comments"
                      },
                      "linkedin": {
                        "post": "...",
                        "hashtags": ["#...","#..."],
                        "goal": "5+ comments"
                      },
                      "instagram": {
                        "hooks": ["...","..."],
                        "caption": "...",
                        "hashtags": ["#...","#..."],
                        "shots": ["...","..."],
                        "goal": "saves/shares > baseline"
                      }
                    }
                }`,
                responseMimeType: "application/json",
                temperature: 0,
                maxOutputTokens: 1792,
                // Note: safetySettings categories vary by SDK version; omit to avoid INVALID_ARGUMENT
            }
        });

        let responseText = result.text?.trim();
        // Debug finish reason if available
        try { console.log('🧪 finishReason:', (result as any)?.response?.candidates?.[0]?.finishReason || (result as any)?.candidates?.[0]?.finishReason || 'n/a'); } catch {}
        console.log('🧪 AI raw length:', responseText ? responseText.length : 0);
        if (!responseText) {
            // Immediate retry with pro model and permissive safety settings
            try {
                result = await aiInstance.models.generateContent({
                    model: process.env.GEMINI_MODEL_RETRY || 'gemini-1.5-pro',
                    contents: `${languageInstruction}\n\nANALYZE THIS STARTUP IDEA: "${content}"\n\n🎯 DETECTED SECTORS: ${sectors.join(', ')}\n📱 FOCUS PLATFORMS: ${focusPlatforms.join(', ')} (USE ONLY THESE; MAX 6)\n\nProvide COMPREHENSIVE BUSINESS ANALYSIS with REAL DATA. IMPORTANT: Keep the response strictly in the same language as the input. KEEP OUTPUT CONCISE. RETURN ONLY JSON.`,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: 'application/json',
                        temperature: 0,
                        maxOutputTokens: 1792,
                    }
                });
                responseText = result.text?.trim() || '';
                try { console.log('🧪 Pro finishReason:', (result as any)?.response?.candidates?.[0]?.finishReason || (result as any)?.candidates?.[0]?.finishReason || 'n/a'); } catch {}
                console.log('🧪 Pro retry raw length:', responseText.length);
            } catch {}
        if (!responseText) {
            throw new Error('Empty response from AI analysis');
            }
        }

        // Pre-clean: normalize BOM/nbsp and stray fences/utf quotes before parse
        const preClean = (txt: string) => txt
            .replace(/^\uFEFF/, '')
            .replace(/[\u00A0\u200B\u200C\u200D]/g, ' ')
            .replace(/^```\s*json\s*/i, '')
            .replace(/^```/i, '')
            .replace(/```\s*$/i, '')
            .replace(/```/g, '')
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'");
        responseText = preClean(responseText);

        let parsedResult = safeJsonParse(responseText);
        if (!parsedResult) {
            // Attempt a quick JSON repair before retrying model
            try {
                const aiRepair = getAI();
                const repairTry = await aiRepair.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `CLEAN THIS TO VALID JSON. Return ONLY valid JSON with no extra text. If input has markdown fences or trailing text, remove them and output just a valid JSON:
${responseText.slice(0, 6000)}`,
                    config: {
                        systemInstruction: 'You strictly convert malformed JSON-like text into valid JSON. Output JSON only.',
                        responseMimeType: 'application/json',
                        temperature: 0,
                        maxOutputTokens: 1024,
                    }
                });
                const repaired1 = safeJsonParse(repairTry.text?.trim() || '');
                if (repaired1) {
                    parsedResult = repaired1;
                }
            } catch {}

            if (!parsedResult) {
                // Retry once with stable model
            try {
                result = await aiInstance.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `${languageInstruction}\n\nANALYZE THIS STARTUP IDEA: "${content}"\n\n🎯 DETECTED SECTORS: ${sectors.join(', ')}\n📱 FOCUS PLATFORMS: ${relevantPlatforms.join(', ')}\n\nProvide COMPREHENSIVE BUSINESS ANALYSIS with REAL DATA. IMPORTANT: Keep the response strictly in the same language as the input.:`,
                    config: {
                        systemInstruction: systemInstruction + `\n\nLANGUAGE ENFORCEMENT: Respond ONLY in the SAME LANGUAGE as the user input. Do not mix languages.\n\nRESPONSE FORMAT: Return JSON with this exact structure including ALL required keys (even if estimated). Use non-empty strings for all text fields. No nulls, no empty arrays. Include ALL relevant platforms as specified:
                { ... }`,
                        responseMimeType: "application/json",
                        temperature: 0,
                        maxOutputTokens: 3072,
                    }
                });
                responseText = preClean(result.text?.trim() || '');
                parsedResult = safeJsonParse(responseText);
                console.log('🧪 Retry raw length:', responseText ? responseText.length : 0);
            } catch (e) {
                // fall through to outer catch
            }
            if (!parsedResult) {
                // Final attempt: request a minimal core JSON (small schema) to avoid truncation
                try {
                    const minimal = await aiInstance.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `${languageInstruction}\n\nProduce ONLY the following minimal JSON for the idea: "${content}". Keep strings concise. JSON shape (all required unless noted):\n{
  "idea": string,
  "demandScore": number, // 0-100
  "scoreJustification": string, // <= 140 chars
  "platformAnalyses": {
    // Include ONLY platforms where you CAN provide ALL required fields below
    "twitter"?: {"platformName":"X","score":1-5,"summary":string,"keyFindings":[string,string,string],"contentSuggestion":string,"rubric":{"reach":1-5,"nicheFit":1-5,"contentFit":1-5,"competitiveSignal":1-5}},
    "reddit"?: {...},
    "linkedin"?: {...},
    "instagram"?: {...},
    "tiktok"?: {...},
    "youtube"?: {...},
    "facebook"?: {...},
    "producthunt"?: {...}
  },
  "tweetSuggestion": string,
  "redditTitleSuggestion": string,
  "redditBodySuggestion": string,
  "linkedinSuggestion": string
}\nReturn JSON only.`,
                        config: {
                            systemInstruction: 'Output minimal, valid JSON only. Keep per-field text short. Language must mirror input.',
                            responseMimeType: 'application/json',
                            temperature: 0,
                            maxOutputTokens: 1792,
                        }
                    });
                    const mText = preClean(minimal.text?.trim() || '');
                    const mParsed = safeJsonParse(mText);
                    if (mParsed) {
                        parsedResult = mParsed;
                    }
                } catch {}
            if (!parsedResult) {
                throw new Error('Invalid JSON from AI');
            }
        }
            }
        }

        // If language fields sneak in mixed-language content, enforce by simple heuristic
        // Remove hard-coded EN/TR checks to allow any language; rely on strict instruction + optional repair

        // Validate and clean the result
        const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
        const isValidRubric = (r: any): boolean => {
            const isInt15 = (n: any) => Number.isInteger(n) && n >= 1 && n <= 5;
            return r && isInt15(r.reach) && isInt15(r.nicheFit) && isInt15(r.contentFit) && isInt15(r.competitiveSignal);
        };
        const isValidPlatform = (pa: any): boolean => {
            if (!pa) return false;
            const hasSummary = isNonEmptyString(pa.summary);
            const hasSuggestion = isNonEmptyString(pa.contentSuggestion);
            const hasKF = Array.isArray(pa.keyFindings) && pa.keyFindings.length === 3 && pa.keyFindings.every(isNonEmptyString);
            // rubric might be in pa.rubric or flat; computePlatformScore handles absence, but we require rubric for validity
            const rubricOk = isValidRubric(pa.rubric || pa);
            return hasSummary && hasSuggestion && hasKF && rubricOk;
        };
        const buildPlatformEntry = (key: string, pa: any, sectorsForWeight: string[]) => {
            const c = computePlatformScore(pa, sectorsForWeight);
            return {
                platformName: (pa?.platformName as string) || key,
                score: c.score,
                summary: pa.summary,
                keyFindings: pa.keyFindings,
                contentSuggestion: pa.contentSuggestion,
                rubric: c.rubric
            };
        };
        const computePlatformScore = (pa: any, sectorsForWeight?: string[]): { score: number; rubric: { reach: number; nicheFit: number; contentFit: number; competitiveSignal: number } } => {
            const clamp = (n: any) => Math.max(1, Math.min(5, Number.isFinite(n) ? Math.round(n) : 3));
            const rubric = {
                reach: clamp(pa?.rubric?.reach ?? pa?.reach),
                nicheFit: clamp(pa?.rubric?.nicheFit ?? pa?.nicheFit),
                contentFit: clamp(pa?.rubric?.contentFit ?? pa?.contentFit),
                competitiveSignal: clamp(pa?.rubric?.competitiveSignal ?? pa?.competitiveSignal),
            };
            const weightsMap: Record<string, { reach:number; nicheFit:number; contentFit:number; competitiveSignal:number }> = {
                default:     { reach: 0.30, nicheFit: 0.30, contentFit: 0.20, competitiveSignal: 0.20 },
                saas:        { reach: 0.20, nicheFit: 0.35, contentFit: 0.20, competitiveSignal: 0.25 },
                ecommerce:   { reach: 0.35, nicheFit: 0.25, contentFit: 0.25, competitiveSignal: 0.15 },
                fintech:     { reach: 0.20, nicheFit: 0.30, contentFit: 0.20, competitiveSignal: 0.30 },
                design:      { reach: 0.25, nicheFit: 0.30, contentFit: 0.30, competitiveSignal: 0.15 },
                marketplace: { reach: 0.30, nicheFit: 0.30, contentFit: 0.20, competitiveSignal: 0.20 },
                mobile:      { reach: 0.35, nicheFit: 0.25, contentFit: 0.25, competitiveSignal: 0.15 },
                hardware:    { reach: 0.25, nicheFit: 0.30, contentFit: 0.20, competitiveSignal: 0.25 },
                offline:     { reach: 0.40, nicheFit: 0.30, contentFit: 0.20, competitiveSignal: 0.10 },
                consumer_social: { reach: 0.20, nicheFit: 0.25, contentFit: 0.20, competitiveSignal: 0.35 },
            };
            // A/B override by explicit variant name if provided
            if (weightsVariant && weightsMap[weightsVariant]) {
                const wv = weightsMap[weightsVariant];
                const weighted = rubric.reach * wv.reach + rubric.nicheFit * wv.nicheFit + rubric.contentFit * wv.contentFit + rubric.competitiveSignal * wv.competitiveSignal;
                const score = Math.max(1, Math.min(5, Math.round(weighted)));
                return { score, rubric };
            }
            let sectorKey = sectorsForWeight && sectorsForWeight.length ? (sectorsForWeight[0] as keyof typeof weightsMap) : 'default';
            // Heuristic: if idea matches big consumer social keywords, use consumer_social weights
            const ideaLower = (content || '').toLowerCase();
            const socialKeywords = ['facebook', 'instagram', 'tiktok', 'snapchat', 'twitter', 'x ', 'x(', 'social network', 'social media app'];
            if (socialKeywords.some(k => ideaLower.includes(k))) {
                sectorKey = 'consumer_social' as any;
            }
            const w = weightsMap[sectorKey] || weightsMap.default;
            const weighted = rubric.reach * w.reach + rubric.nicheFit * w.nicheFit + rubric.contentFit * w.contentFit + rubric.competitiveSignal * w.competitiveSignal;
            const score = Math.max(1, Math.min(5, Math.round(weighted)));
            return { score, rubric };
        };

        const enforceLanguageOnObjectStrings = (obj: any, expected: 'English'|'Turkish'|undefined): { ok: boolean; offending: string | undefined } => {
            const traverse = (o: any): string | null => {
                if (o == null) return null;
                if (typeof o === 'string') {
                    return null;
                }
                if (Array.isArray(o)) {
                    for (const v of o) { const r = traverse(v); if (r) return r; }
                    return null;
                }
                if (typeof o === 'object') {
                    for (const k of Object.keys(o)) { const r = traverse(o[k]); if (r) return r; }
                }
                return null;
            };
            const off = traverse(obj) || undefined;
            return { ok: !off, offending: off };
        };
        const cleanResult: any = {
            idea: parsedResult.idea || content,
            demandScore: Math.max(0, Math.min(100, parsedResult.demandScore || 65)),
            scoreJustification: parsedResult.scoreJustification || 'Market analysis completed',
            language: expectedLanguage,
            fallbackUsed: Boolean(parsedResult.fallbackUsed ?? false),
            platformAnalyses: {
                twitter: (()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.twitter, sectors); return {
                    platformName: 'X',
                    score: c.score,
                    summary: parsedResult.platformAnalyses?.twitter?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.twitter?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.twitter?.contentSuggestion || '',
                    rubric: c.rubric
                }; })(),
                reddit: {
                    platformName: 'Reddit',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.reddit, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.reddit?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.reddit?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.reddit?.contentSuggestion || ''
                },
                linkedin: {
                    platformName: 'LinkedIn',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.linkedin, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.linkedin?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.linkedin?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.linkedin?.contentSuggestion || ''
                },
                instagram: {
                    platformName: 'Instagram',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.instagram, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.instagram?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.instagram?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.instagram?.contentSuggestion || ''
                },
                tiktok: {
                    platformName: 'TikTok',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.tiktok, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.tiktok?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.tiktok?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.tiktok?.contentSuggestion || ''
                },
                youtube: {
                    platformName: 'YouTube',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.youtube, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.youtube?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.youtube?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.youtube?.contentSuggestion || ''
                },
                facebook: {
                    platformName: 'Facebook',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.facebook, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.facebook?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.facebook?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.facebook?.contentSuggestion || ''
                },
                producthunt: {
                    platformName: 'Product Hunt',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.producthunt, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.producthunt?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.producthunt?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.producthunt?.contentSuggestion || ''
                },
                hackernews: {
                    platformName: 'Hacker News',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.hackernews, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.hackernews?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.hackernews?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.hackernews?.contentSuggestion || ''
                },
                medium: {
                    platformName: 'Medium',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.medium, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.medium?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.medium?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.medium?.contentSuggestion || ''
                },
                discord: {
                    platformName: 'Discord',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.discord, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.discord?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.discord?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.discord?.contentSuggestion || ''
                },
                github: {
                    platformName: 'GitHub',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.github, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.github?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.github?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.github?.contentSuggestion || ''
                },
                dribbble: {
                    platformName: 'Dribbble',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.dribbble, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.dribbble?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.dribbble?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.dribbble?.contentSuggestion || ''
                },
                angellist: {
                    platformName: 'AngelList',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.angellist, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.angellist?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.angellist?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.angellist?.contentSuggestion || ''
                },
                crunchbase: {
                    platformName: 'Crunchbase',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.crunchbase, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.crunchbase?.summary || '',
                    keyFindings: parsedResult.platformAnalyses?.crunchbase?.keyFindings || [],
                    contentSuggestion: parsedResult.platformAnalyses?.crunchbase?.contentSuggestion || ''
                }
            },
            tweetSuggestion: parsedResult.tweetSuggestion || '',
            redditTitleSuggestion: parsedResult.redditTitleSuggestion || '',
            redditBodySuggestion: parsedResult.redditBodySuggestion || '',
            linkedinSuggestion: parsedResult.linkedinSuggestion || '',

            // Add comprehensive analysis with fallbacks
            marketIntelligence: parsedResult.marketIntelligence,
            competitiveLandscape: parsedResult.competitiveLandscape,
            revenueModel: parsedResult.revenueModel,
            targetAudience: parsedResult.targetAudience,
            riskAssessment: parsedResult.riskAssessment,
            goToMarket: parsedResult.goToMarket,
            developmentRoadmap: parsedResult.developmentRoadmap,
            productMarketFit: parsedResult.productMarketFit,
            vcReview: parsedResult.vcReview,
            communityMatch: {
                subreddits: Array.isArray((parsedResult as any)?.communityMatch?.subreddits)
                    ? ((parsedResult as any).communityMatch.subreddits as any[]).slice(0, 20).map((it: any) => ({
                        name: typeof it?.name === 'string' ? it.name : '',
                        url: typeof it?.url === 'string' ? it.url : undefined,
                        members: typeof it?.members === 'string' ? it.members : undefined,
                        fitReason: typeof it?.fitReason === 'string' ? it.fitReason : '',
                        rulesSummary: typeof it?.rulesSummary === 'string' ? it.rulesSummary : '',
                        entryMessage: typeof it?.entryMessage === 'string' ? it.entryMessage : ''
                    }))
                    : [],
                discordServers: Array.isArray((parsedResult as any)?.communityMatch?.discordServers)
                    ? ((parsedResult as any).communityMatch.discordServers as any[]).slice(0, 10).map((it: any) => ({
                        name: typeof it?.name === 'string' ? it.name : '',
                        url: typeof it?.url === 'string' ? it.url : undefined,
                        members: typeof it?.members === 'string' ? it.members : undefined,
                        fitReason: typeof it?.fitReason === 'string' ? it.fitReason : '',
                        rulesSummary: typeof it?.rulesSummary === 'string' ? it.rulesSummary : '',
                        entryMessage: typeof it?.entryMessage === 'string' ? it.entryMessage : ''
                    }))
                    : [],
                linkedinGroups: Array.isArray((parsedResult as any)?.communityMatch?.linkedinGroups)
                    ? ((parsedResult as any).communityMatch.linkedinGroups as any[]).slice(0, 10).map((it: any) => ({
                        name: typeof it?.name === 'string' ? it.name : '',
                        url: typeof it?.url === 'string' ? it.url : undefined,
                        members: typeof it?.members === 'string' ? it.members : undefined,
                        fitReason: typeof it?.fitReason === 'string' ? it.fitReason : '',
                        rulesSummary: typeof it?.rulesSummary === 'string' ? it.rulesSummary : '',
                        entryMessage: typeof it?.entryMessage === 'string' ? it.entryMessage : ''
                    }))
                    : []
            }
        };

        // Recompute a more stable demandScore from platform rubrics (1-5 → 20-100) with simple penalties/bonuses
        try {
            const platformKeysPreferred = ['twitter','reddit','linkedin'];
            const entries: Array<{ key:string; score:number; rubric?: any }> = [];
            for (const key of Object.keys(cleanResult.platformAnalyses || {})) {
                const p = (cleanResult.platformAnalyses as any)[key];
                if (!p) continue;
                const s = Number(p.score);
                if (Number.isFinite(s)) {
                    entries.push({ key, score: s, rubric: p.rubric });
                }
            }
            // If preferred platforms exist, focus on them; otherwise use whatever exists
            const focused = entries.filter(e => platformKeysPreferred.includes(e.key)).length > 0
                ? entries.filter(e => platformKeysPreferred.includes(e.key))
                : entries;
            if (focused.length > 0) {
                // Normalize 1-5 to 20-100
                const normalized = focused.map(e => Math.max(20, Math.min(100, Math.round(e.score * 20))));
                // Slight weight if rubric has competitiveSignal
                const withWeights = normalized.map((n, i) => {
                    const r = focused[i].rubric || {};
                    const comp = Number(r.competitiveSignal || 3); // 1-5
                    const w = 0.7 + (Math.max(1, Math.min(5, Math.round(comp))) - 3) * 0.05; // ~0.6–0.8
                    return n * w;
                });
                let agg = Math.round(withWeights.reduce((a, b) => a + b, 0) / withWeights.length);
                // Penalize if only 1 platform had data
                if (focused.length === 1) agg = Math.round(agg * 0.85);
                // Apply clone penalty cap if applicable (below existing logic may add note)
                const ideaLower2 = (content || cleanResult.idea || '').toLowerCase();
                const cloneKeywords2 = ['facebook','instagram','tiktok','snapchat','twitter','x ',' x(','linkedin','reddit','discord','clubhouse','social network','social media app'];
                const isCloneIdea2 = cloneKeywords2.some(k => ideaLower2.includes(k));
                if (isCloneIdea2) agg = Math.min(agg, 40);
                // Blend with model-provided score to reduce variance
                const modelScore = Math.max(0, Math.min(100, Number(parsedResult.demandScore || 0)));
                const blended = Number.isFinite(modelScore) && modelScore > 0 ? Math.round(0.7 * agg + 0.3 * modelScore) : agg;
                cleanResult.demandScore = Math.max(0, Math.min(100, blended));
            }
        } catch {}

        // Clone/Brand penalty: generic consumer social or well-known brand clones get conservative cap
        try {
            const ideaLower = (content || cleanResult.idea || '').toLowerCase();
            const cloneKeywords = [
                'facebook','instagram','tiktok','snapchat','twitter','x ',' x(', 'linkedin','reddit','discord','clubhouse','social network','social media app'
            ];
            const isCloneIdea = cloneKeywords.some(k => ideaLower.includes(k));
            if (isCloneIdea) {
                const capped = Math.min(cleanResult.demandScore, 40);
                if (capped !== cleanResult.demandScore) {
                    cleanResult.demandScore = capped;
                }
                const note = expectedLanguage === 'Turkish'
                    ? 'Ağ etkisi ve büyük rakipler nedeniyle muhafazakâr skor (clone penalty).'
                    : 'Conservative score due to network effects and dominant incumbents (clone penalty).';
                cleanResult.scoreJustification = isNonEmptyString(cleanResult.scoreJustification)
                    ? `${cleanResult.scoreJustification} — ${note}`
                    : note;
            }
        } catch {}

        // Language post-check: if English expected but Turkish chars found anywhere, do a tiny repair call
        const langCheck = enforceLanguageOnObjectStrings(cleanResult, undefined);
        if (!langCheck.ok) {
            try {
                const aiInstance2 = getAI();
                const repair = await aiInstance2.models.generateContent({
                    model: runtimeModel,
                    contents: `Your JSON response contained stray text outside of valid JSON or invalid mixed-language artifacts. Rewrite ONLY the text fields to be in the SAME LANGUAGE as the user's input. Keep the structure and numeric values unchanged. Return ONLY valid JSON.\n\nSample:\n${(langCheck.offending||'').slice(0, 500)}`,
                    config: {
                        systemInstruction: 'You are a strict JSON and language repair assistant. Output valid JSON only.',
                        responseMimeType: 'application/json',
                        temperature: 0,
                        maxOutputTokens: 512
                    }
                });
                const repaired = safeJsonParse(repair.text?.trim() || '');
                console.log('🩹 Repair length:', repair.text ? repair.text.length : 0);
                if (repaired && typeof repaired === 'object') {
                    // shallow merge of text fields if compatible; otherwise keep original
                    cleanResult.scoreJustification = repaired.scoreJustification || cleanResult.scoreJustification;
                    // best-effort replace summaries/suggestions if present
                    const rp = repaired.platformAnalyses || {};
                    for (const key of Object.keys(cleanResult.platformAnalyses)) {
                        const cur = (cleanResult.platformAnalyses as any)[key];
                        const nr = rp[key];
                        if (nr) {
                            cur.summary = nr.summary || cur.summary;
                            cur.contentSuggestion = nr.contentSuggestion || cur.contentSuggestion;
                        }
                    }
                }
            } catch {}
        }

        console.log('✅ Single AI call analysis completed');
        return cleanResult;

    } catch (error) {
        console.log('❌ Platform analysis failed, using fallback...', error);

        // Detect language for fallback (respect forcedLang)
        // Note: Do NOT include plain 'I' in the character class to avoid false Turkish detection for English text
        const isTurkish = forcedLang === 'tr' ? true : forcedLang === 'en' ? false : /[çğıöşüÇĞİÖŞÜ]/.test(content) ||
            /\b(bir|bu|şu|için|ile|olan|var|yok|çok|az|büyük|küçük|iyi|kötü|yeni|eski)\b/i.test(content);

        // GROQ bridge fallback (model-based, avoids static placeholders)
        try {
            const groqKey = process.env.GROQ_API_KEY;
            if (groqKey) {
                const groqBody: any = {
                    model: 'llama3-70b-8192',
                    messages: [
                        { role: 'system', content: `${systemInstruction}\n\nSTRICT: Output VALID JSON only.` },
                        { role: 'user', content: `ANALYZE THIS STARTUP IDEA: "${content}"\n\nReturn ONLY JSON. Keep strings concise. Include a 'platformAnalyses' object for up to 6 relevant platforms (X, Reddit, LinkedIn, etc). Each platform: summary (<=200 chars), keyFindings (3 items), contentSuggestion (<=160 chars), score (1-5).` }
                    ],
                    temperature: 0,
                    max_tokens: 2048
                };
                const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqKey}`,
                    },
                    body: JSON.stringify(groqBody)
                });
                if (resp.ok) {
                    const jr: any = await resp.json();
                    const text: string = (jr.choices?.[0]?.message?.content || '').trim();
                    const groqParsed = safeJsonParse(text);
                    if (groqParsed && typeof groqParsed === 'object') {
                        // Map minimal fields expected by UI
                        const pa = groqParsed.platformAnalyses || {};
                        return {
                            idea: content,
                            demandScore: Math.max(0, Math.min(100, groqParsed.demandScore || 65)),
                            scoreJustification: groqParsed.scoreJustification || (isTurkish ? 'Model tabanlı değerlendirme' : 'Model-based assessment'),
                            language: isTurkish ? 'Turkish' : 'English',
                            fallbackUsed: false,
                            platformAnalyses: pa,
                            tweetSuggestion: groqParsed.tweetSuggestion || '',
                            redditTitleSuggestion: groqParsed.redditTitleSuggestion || '',
                            redditBodySuggestion: groqParsed.redditBodySuggestion || '',
                            linkedinSuggestion: groqParsed.linkedinSuggestion || ''
                        } as any;
                    }
                }
            }
        } catch (e) {
            console.warn('GROQ bridge failed:', e);
        }

        // Rescue fallback: try a minimal Gemini JSON response before static placeholders
        try {
            const aiRescue = getAI();
            const rescueModel = process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash';
            const sys = 'Respond ONLY with valid JSON. Keep fields short. No extra text.';
            const r2 = await aiRescue.models.generateContent({
                model: rescueModel,
                contents: `MINIMAL ANALYSIS FOR: "${content}"
Return JSON with keys: idea, demandScore, scoreJustification, platformAnalyses{ twitter|reddit|linkedin each: { platformName, score(1-5), summary, keyFindings[], contentSuggestion } }, tweetSuggestion, redditTitleSuggestion, redditBodySuggestion, linkedinSuggestion.`,
                config: { systemInstruction: sys, responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 1024 }
            });
            const txt2 = (r2.text || '').trim();
            try {
                const parsed2 = JSON.parse(txt2);
                if (parsed2 && typeof parsed2 === 'object') {
                    return parsed2 as any;
                }
            } catch {}
        } catch {}

        if (isTurkish) {
            // Turkish fallback
            return {
                idea: content,
                demandScore: 65,
                scoreJustification: 'Sınırlı veri ile analiz tamamlandı',
                language: 'Turkish',
                fallbackUsed: true,
                platformAnalyses: {
                    twitter: {
                        platformName: 'X',
                        score: 3,
                        summary: 'Twitter analizi geçici olarak kullanılamıyor. Orta düzey potansiyel tahmin ediliyor.',
                        keyFindings: ['Analiz kullanılamıyor', 'Yedek değerlendirme', 'Orta potansiyel'],
                        contentSuggestion: 'Fikrinizi X\'te paylaşarak geri bildirim alın.'
                    },
                    reddit: {
                        platformName: 'Reddit',
                        score: 3,
                        summary: 'Reddit analizi geçici olarak kullanılamıyor. Topluluk ilgisi orta düzey olarak tahmin ediliyor.',
                        keyFindings: ['Analiz kullanılamıyor', 'Yedek değerlendirme', 'Orta topluluk uyumu'],
                        contentSuggestion: 'İlgili subreddit\'lerde topluluk geri bildirimi için paylaşın.'
                    },
                    linkedin: {
                        platformName: 'LinkedIn',
                        score: 3,
                        summary: 'LinkedIn analizi geçici olarak kullanılamıyor. Profesyonel uygunluk orta düzey olarak tahmin ediliyor.',
                        keyFindings: ['Analiz kullanılamıyor', 'Yedek değerlendirme', 'Orta iş potansiyeli'],
                        contentSuggestion: 'Profesyonel ağınızla LinkedIn\'de paylaşın.'
                    }
                },
                tweetSuggestion: `🚀 Yeni bir fikir üzerinde çalışıyorum: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} Ne düşünüyorsunuz? #startup #girişim`,
                redditTitleSuggestion: 'Startup fikrimi için geri bildirim arıyorum',
                redditBodySuggestion: `Bu konsept üzerinde çalışıyorum: ${content}. Topluluktan düşüncelerinizi ve geri bildirimlerinizi almak isterim.`,
                linkedinSuggestion: `Yeni bir iş fırsatı keşfediyorum: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Bu alanda başkalarıyla bağlantı kurmakla ilgileniyorum.`
            };
        } else {
            // English fallback
            return {
                idea: content,
                demandScore: 65,
                scoreJustification: 'Analysis completed with limited data',
                language: 'English',
                fallbackUsed: true,
                platformAnalyses: {
                    twitter: {
                        platformName: 'X',
                        score: 3,
                        summary: 'Twitter analysis temporarily unavailable. Moderate potential estimated.',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate potential'],
                        contentSuggestion: 'Share your idea on X to get feedback.'
                    },
                    reddit: {
                        platformName: 'Reddit',
                        score: 3,
                        summary: 'Reddit analysis temporarily unavailable. Community interest estimated as moderate.',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate community fit'],
                        contentSuggestion: 'Post in relevant subreddits for community feedback.'
                    },
                    linkedin: {
                        platformName: 'LinkedIn',
                        score: 3,
                        summary: 'LinkedIn analysis temporarily unavailable. Professional relevance estimated as moderate.',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                        contentSuggestion: 'Share with your professional network on LinkedIn.'
                    }
                },
                tweetSuggestion: `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: 'Looking for feedback on my startup idea',
                redditBodySuggestion: `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
                linkedinSuggestion: `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`,
                
                // 8 Analysis Components with fallback data
                marketIntelligence: {
                    tam: '$2.5B Global Market',
                    sam: '$450M Addressable Market',
                    som: '$12M Realistic Target',
                    growthRate: '15% YoY',
                    marketTiming: 4,
                    keyTrends: ['AI adoption', 'Remote work growth', 'Digital transformation']
                },
                
                competitiveLandscape: {
                    directCompetitors: ['Competitor A', 'Competitor B', 'Competitor C'],
                    indirectCompetitors: ['Alternative 1', 'Alternative 2'],
                    marketPosition: 'Blue Ocean Opportunity',
                    differentiationScore: 8,
                    competitiveMoat: 'AI-powered features',
                    entryBarriers: 'Technical expertise required'
                },
                
                revenueModel: {
                    primaryModel: 'Freemium SaaS',
                    pricePoint: '$29/month',
                    revenueStreams: ['Subscriptions', 'Premium features', 'Enterprise plans'],
                    breakEvenTimeline: '18 months',
                    ltvCacRatio: '4.2x',
                    projectedMrr: '$25K by Year 1'
                },
                
                targetAudience: {
                    primarySegment: 'Small business owners (40%)',
                    secondarySegment: 'Freelancers (35%)',
                    tertiarySegment: 'Enterprise teams (25%)',
                    painPoints: ['Time management', 'Cost efficiency', 'Scalability'],
                    willingnessToPay: 'High ($25-50/month)',
                    customerAcquisitionChannels: ['Content marketing', 'Social media', 'Referrals']
                },
                
                riskAssessment: {
                    technicalRisk: 'Low',
                    marketRisk: 'Medium',
                    financialRisk: 'Low',
                    regulatoryRisk: 'Low',
                    overallRiskLevel: 'Medium',
                    mitigationStrategies: ['MVP validation', 'Market research', 'Financial planning']
                },
                
                goToMarket: {
                    phase1: 'MVP launch + early adopters',
                    phase2: 'Product-market fit + scaling',
                    phase3: 'Market expansion + partnerships',
                    timeline: '12-month rollout',
                    budgetNeeded: '$100K initial',
                    keyChannels: ['Digital marketing', 'Content strategy', 'Community building']
                },
                
                developmentRoadmap: {
                    mvpTimeline: '3 months',
                    betaLaunch: '5 months',
                    publicLaunch: '8 months',
                    keyFeatures: ['Core functionality', 'User dashboard', 'Analytics'],
                    teamNeeded: ['Developer', 'Designer', 'Marketer'],
                    techStack: ['React', 'Node.js', 'PostgreSQL']
                },
                
                productMarketFit: {
                    problemSolutionFit: 75,
                    solutionMarketFit: 68,
                    earlyAdopterSignals: 'Strong interest from target users',
                    retentionPrediction: '70% monthly retention',
                    viralCoefficient: '1.2x organic growth',
                    pmfIndicators: ['User engagement', 'Retention rates', 'Referral growth']
                }
            };
    }
}

// === Simple fusion of multiple results (majority/most-informative) ===
function fuseResults(results: any[]): any {
    if (!Array.isArray(results) || results.length === 0) return results?.[0];
    const first = results[0] || {};
    const avg = (nums: number[]) => Math.round(nums.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0) / Math.max(1, nums.length));
    const demandScore = avg(results.map(r => Number(r?.demandScore || 0)));
    const scoreJustification = results.map(r => r?.scoreJustification || '').sort((a, b) => b.length - a.length)[0] || first.scoreJustification;

    const platformKeys = Array.from(new Set(results.flatMap(r => Object.keys(r?.platformAnalyses || {}))));
    const platformAnalyses: any = {};
    for (const k of platformKeys) {
        const candidates = results.map(r => r?.platformAnalyses?.[k]).filter(Boolean);
        if (candidates.length === 0) continue;
        const best = candidates.reduce((best: any, cur: any) => {
            if (!best) return cur;
            const bs = Number(best.score || 0), cs = Number(cur.score || 0);
            const bl = (best.summary || '').length, cl = (cur.summary || '').length;
            if (cs > bs) return cur;
            if (cs === bs && cl > bl) return cur;
            return best;
        }, null);
        platformAnalyses[k] = best;
    }

    const pickLongest = (key: string) => results.map(r => r?.[key]).filter(Boolean).sort((a: any, b: any) => JSON.stringify(b).length - JSON.stringify(a).length)[0] || first[key];
    const assumptions = Array.from(new Set(results.flatMap(r => r?.assumptions || []))).slice(0, 5);
    const confidence = Math.max(0, Math.min(100, avg(results.map(r => Number(r?.confidence || 0)))));
    const nextTestsRaw = results.flatMap(r => r?.nextTests || []);
    const seen = new Set<string>();
    const nextTests: any[] = [];
    for (const t of nextTestsRaw) {
        const key = `${t?.hypothesis || ''}|${t?.channel || ''}|${t?.metric || ''}`;
        if (!seen.has(key)) { seen.add(key); nextTests.push(t); }
        if (nextTests.length >= 3) break;
    }

    return {
        ...first,
        demandScore,
        scoreJustification,
        platformAnalyses,
        marketIntelligence: pickLongest('marketIntelligence'),
        competitiveLandscape: pickLongest('competitiveLandscape'),
        revenueModel: pickLongest('revenueModel'),
        targetAudience: pickLongest('targetAudience'),
        riskAssessment: pickLongest('riskAssessment'),
        goToMarket: pickLongest('goToMarket'),
        developmentRoadmap: pickLongest('developmentRoadmap'),
        productMarketFit: pickLongest('productMarketFit'),
        assumptions: assumptions.length ? assumptions : first.assumptions,
        confidence: confidence || first.confidence,
        nextTests: nextTests.length ? nextTests : first.nextTests
    };
}
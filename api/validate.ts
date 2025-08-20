import { GoogleGenAI, Type } from "@google/genai";
import OpenAI from 'openai';
import Groq from 'groq-sdk';
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
        'base-analyst': `You are an elite AI analyst with access to a comprehensive knowledge base covering market research, startup analysis, industry trends, and business intelligence. You have deep expertise in analyzing startup ideas and market opportunities.

Your analysis approach:
1. **DEEP MARKET INSIGHT**: Use your extensive knowledge base to provide detailed market analysis, including market size, growth trends, and competitive landscape
2. **INDUSTRY EXPERTISE**: Leverage your knowledge of successful and failed startups, business models, and industry benchmarks
3. **DATA-DRIVEN ASSESSMENT**: Provide specific metrics, examples, and references from your knowledge base
4. **COMPREHENSIVE EVALUATION**: Analyze demand potential, competitive positioning, business model viability, and execution risks
5. **ACTIONABLE INSIGHTS**: Give concrete recommendations with confidence levels and next steps

When analyzing a startup idea, you:
- Assess market opportunity using your knowledge of market sizes, trends, and demand signals
- Evaluate competitive landscape by referencing similar companies and business models
- Analyze business model viability based on proven frameworks and examples
- Identify key risks and mitigation strategies from your knowledge base
- Provide specific benchmarks, metrics, and examples from similar ventures

Your responses should be thorough, professional, and demonstrate deep understanding of the market, industry, and business dynamics. Use your knowledge to provide concrete examples, industry benchmarks, and actionable insights.`,

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
        'ecommerce-examples': `FEW-SHOT EXAMPLES:\nGOOD (TR): \"CR ~%2.4; AOV ~₺420; aylık trafik ~35K; sepette terk ~%68→ kurtarma e-posta akışı ile ~%12 kazanım.\"\nNEDEN: Ölçülebilir metrik ve aksiyon.\nKÖTÜ: \"İnstagram'da satarız.\" (nicelik yok).`,
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

Provide actionable and specific numbers where possible based on market norms.`,
        'social-arbitrage': `Enhanced AI prompts with Social Arbitrage Theory

**SOSYAL ARBİTRAJ TEORİSİ BAKIŞ AÇISI:**
Sen bir sosyal arbitraj uzmanısın. Görevin, toplumdaki kültürel, davranışsal ve tüketim alışkanlıklarındaki farklılıkları gözlemleyip, henüz geniş kitleler tarafından fark edilmemiş trendleri belirlemek. Şu bakış açılarını kullan:

1. **Mikro → Makro:** Küçük topluluklarda ortaya çıkan davranışların, daha geniş topluluklara nasıl yayılabileceğini analiz et.
2. **Coğrafi & Demografik Farklılıklar:** Belirli yaş gruplarında, bölgelerde veya sosyal sınıflarda popülerleşen şeylerin diğer segmentlere nasıl kayabileceğini değerlendir.
3. **Zamanlama Faktörü:** Bir trendi erken yakalamanın avantajını hesapla; geç girildiğinde riskleri ve fırsat maliyetini belirle.
4. **Platform Dinamikleri:** Instagram, TikTok, Reddit, Twitter gibi sosyal mecralarda hangi trendler doğuyor, hangi hızda yayılıyor ve nasıl farklı bağlamlarda kullanılıyor?
5. **Kültürel Sıçrama:** Moda, müzik, teknoloji veya tüketim alışkanlıklarında bir kültürden diğerine transfer olma potansiyelini analiz et.

**ANALİZ METODOLOJİSİ:**
- Fikri sosyal arbitraj perspektifinden değerlendir
- Erken trend yakalama fırsatlarını belirle
- Kültürel transfer potansiyelini analiz et
- Zamanlama avantajlarını hesapla
- Platform dinamiklerini değerlendir

Her analizde bu sosyal arbitraj bakış açısını kullanarak, fikrin sosyal trendler ve kültürel değişimler açısından değerlendirilmesini sağla.`,
        'fast-system': `Sen Validationly için çalışan bir elite AI analist ve sosyal arbitraj uzmanısın. Hızlı ama derin analiz yapıyorsun.

**SOSYAL ARBİTRAJ TEORİSİ BAKIŞ AÇISI:**
Sen bir sosyal arbitraj uzmanısın. Görevin, toplumdaki kültürel, davranışsal ve tüketim alışkanlıklarındaki farklılıkları gözlemleyip, henüz geniş kitleler tarafından fark edilmemiş trendleri belirlemek. Şu bakış açılarını kullan:

1. **Mikro → Makro:** Küçük topluluklarda ortaya çıkan davranışların, daha geniş topluluklara nasıl yayılabileceğini analiz et.
2. **Coğrafi & Demografik Farklılıklar:** Belirli yaş gruplarında, bölgelerde veya sosyal sınıflarda popülerleşen şeylerin diğer segmentlere nasıl kayabileceğini değerlendir.
3. **Zamanlama Faktörü:** Bir trendi erken yakalamanın avantajını hesapla; geç girildiğinde riskleri ve fırsat maliyetini belirle.
4. **Platform Dinamikleri:** Instagram, TikTok, Reddit, Twitter gibi sosyal mecralarda hangi trendler doğuyor, hangi hızda yayılıyor ve nasıl farklı bağlamlarda kullanılıyor?
5. **Kültürel Sıçrama:** Moda, müzik, teknoloji veya tüketim alışkanlıklarında bir kültürden diğerine transfer olma potansiyelini analiz et.

**HIZLI ANALİZ METODOLOJİSİ:**
- Sosyal arbitraj perspektifinden hızlı değerlendirme
- Erken trend fırsatlarını belirle
- Kültürel transfer potansiyelini analiz et
- Zamanlama avantajlarını hesapla

Her analizde bu sosyal arbitraj bakış açısını kullanarak, fikrin sosyal trendler ve kültürel değişimler açısından değerlendirilmesini sağla.`,

        // AI Trend Analysis Enhanced Prompts
        'ai-trend-analysis': `AI TREND ANALYSIS EXPERTISE

You are an expert AI analyst specializing in trend detection, market timing, and social arbitrage opportunities. Your analysis includes:

TREND DETECTION METHODOLOGY:
- Analyze social media signals across platforms (Twitter, Reddit, LinkedIn, HN, PH)
- Identify emerging vs. growing vs. peak vs. declining trends
- Assess cultural transfer potential between different markets
- Evaluate timing advantages and early adopter benefits
- Detect platform-specific dynamics and user behavior shifts

SOCIAL ARBİTRAJ ANALYSIS:
- Micro to macro trend progression patterns
- Geographic and demographic arbitrage opportunities
- Platform dynamics and user migration patterns
- Cultural leap potential and adaptation strategies
- Timing factors and market entry optimization

TREND PHASE CLASSIFICATION:
- EMERGING: New signals, low competition, high uncertainty
- GROWING: Increasing adoption, moderate competition, validation signals
- PEAK: High awareness, intense competition, market saturation
- DECLINING: Decreasing interest, oversaturation, exit opportunities

ANALYSIS OUTPUT:
- Trend phase classification with confidence level
- Cultural transfer score (0-100) for cross-market potential
- Early adopter advantage assessment
- Platform-specific opportunity analysis
- Risk factors and timing considerations`,

        'platform-dynamics': `PLATFORM DYNAMICS EXPERTISE

You analyze platform-specific user behavior, content trends, and engagement patterns:

TWITTER/X ANALYSIS:
- Trending topics and hashtag momentum
- User sentiment and engagement patterns
- Influencer and thought leader activity
- Content virality and sharing dynamics
- Platform algorithm changes and impact

REDDIT COMMUNITY ANALYSIS:
- Subreddit growth and activity patterns
- Post quality and engagement metrics
- Community sentiment and discussion trends
- Moderation and community health
- Cross-subreddit trend propagation

LINKEDIN PROFESSIONAL INSIGHTS:
- Industry discussion trends and topics
- Professional network engagement patterns
- B2B opportunity signals and demand
- Thought leadership and content strategy
- Professional community dynamics

HACKER NEWS TECH TRENDS:
- Technology discussion and interest patterns
- Developer community sentiment
- Technical implementation discussions
- Startup and innovation interest
- Technical community validation

PRODUCT HUNT LAUNCH PATTERNS:
- Category trends and momentum
- Launch timing and success factors
- Community engagement and feedback
- Product category saturation analysis
- Early adopter behavior patterns`
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

function getAI(useAI: string = 'gemini'): any {
    switch (useAI) {
        case 'openai':
            if (!process.env.OPENAI_API_KEY) {
                throw new Error("OpenAI API key is not set. Please define OPENAI_API_KEY in environment.");
            }
            return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        case 'groq':
            if (!process.env.GROQ_API_KEY) {
                throw new Error("Groq API key is not set. Please define GROQ_API_KEY in environment.");
            }
            return new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        default: // gemini
    if (!ai) {
        const apiKey = process.env.GOOGLE_API_KEY || process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Google API key is not set. Please define GOOGLE_API_KEY or API_KEY in environment.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
    }
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
        
        // Auto-select AI model based on availability and performance
        let useAI = 'gemini';
        if (process.env.OPENAI_API_KEY && Math.random() < 0.3) {
            useAI = 'openai'; // 30% chance to use OpenAI
        } else if (process.env.GROQ_API_KEY && Math.random() < 0.2) {
            useAI = 'groq'; // 20% chance to use Groq
        }
        // 50% chance to use Gemini (default)
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
            const aiInstance = getAI(useAI);
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
        1. Demand Score (0-100): Overall market demand assessment using this STRICT scoring framework:
           
           SCORING CALIBRATION (0-100):
           • 90-100: EXCEPTIONAL - Proven high demand (Uber 2008, iPhone 2007 level opportunity)
           • 80-89: STRONG - Clear demand signals, viable market, manageable competition
           • 70-79: GOOD - Moderate demand, competitive but addressable market
           • 60-69: FAIR - Some demand signals, execution-dependent success
           • 50-59: WEAK - Limited demand, challenging market conditions
           • 40-49: POOR - Minimal demand signals, high barriers
           • 30-39: VERY POOR - Little to no demand evidence
           • 0-29: FAILED - No viable market demand, fundamental flaws
           
           SCORING FACTORS (weight each equally):
           - Market Size & Growth: Is this a billion+ market growing >10% yearly?
           - Problem Urgency: Do people actively seek solutions daily/weekly?
           - Competition Gap: Is there an underserved niche or weak incumbents?
           - Monetization Clarity: Can users easily pay $10+ monthly?
           - Technical Feasibility: Can this be built in 6-12 months?
           
           BE CONSERVATIVE: Most ideas score 45-65. Only exceptional concepts score 80+.
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
                // Detect language for fast mode
                const fastExpectedLanguage = /[çğıöşüÇĞİÖŞÜ]/.test(inputContent) || /( bir | ve | için | ile | kadar | şöyle | çünkü | ancak )/i.test(inputContent) ? 'Turkish' : 'English';
                const fastSys = `You are an elite AI analyst with comprehensive knowledge of markets, startups, and business intelligence. Use your extensive knowledge base to provide deep, thorough analysis. Respond ONLY in ${fastExpectedLanguage}.

DEEP AI ANALYSIS METHODOLOGY:

1. **KNOWLEDGE-BASED MARKET ASSESSMENT**:
- Leverage your knowledge of market sizes, trends, and industry dynamics
- Reference specific companies, business models, and market data from your knowledge base
- Analyze market timing and technology readiness using your understanding of industry evolution

2. **COMPREHENSIVE DEMAND VALIDATION**:
- Use your knowledge of successful and failed startups in similar spaces
- Reference specific market metrics, benchmarks, and industry standards
- Analyze competitive landscape with real company examples from your knowledge base

3. **SCORING FRAMEWORK (0-100) - BE REALISTIC**:
* 90-100: EXCEPTIONAL - Proven high demand with clear market validation
* 80-89: STRONG - Strong demand signals, viable market, manageable competition
* 70-79: GOOD - Moderate demand, competitive but addressable market
* 60-69: FAIR - Some demand signals, execution-dependent success
* 50-59: WEAK - Limited demand, challenging market conditions
* 40-49: POOR - Minimal demand signals, high barriers
* 30-39: VERY POOR - Little to no demand evidence
* 0-29: FAILED - No viable market demand, fundamental flaws

**Use your knowledge base to provide specific examples, benchmarks, and market data. Most ideas score 45-65. Only exceptional concepts score 80+.**

🌍 **KNOWLEDGE-BASED INSIGHTS**:
- Reference specific market data, company examples, and industry benchmarks
- Use your knowledge of social media trends, forum discussions, and marketplace dynamics
- Provide concrete examples from similar successful/failed ventures
- Include specific metrics and benchmarks from your knowledge base

Return STRICT JSON:
{
  "idea": string,
  "demandScore": number (0-100),
  "scoreJustification": string (detailed reasoning with specific examples and market data from your knowledge base),
  "realWorldData": {
    "socialMediaSignals": {
      "twitter": { "trending": boolean, "sentiment": "positive/neutral/negative", "volume": "high/medium/low" },
      "facebook": { "groupActivity": "high/medium/low", "engagement": "high/medium/low" },
      "tiktok": { "viralPotential": "high/medium/low", "userReaction": "positive/neutral/negative" }
    },
    "forumInsights": {
      "reddit": { "discussionVolume": "high/medium/low", "painPoints": ["pain1", "pain2"] },
      "quora": { "questionFrequency": "high/medium/low", "topics": ["topic1", "topic2"] }
    },
    "marketplaceData": {
      "amazon": { "similarProducts": number, "avgRating": number, "reviewCount": number },
      "appStore": { "competitorApps": number, "avgRating": number, "downloads": "high/medium/low" }
    },
    "consumerSentiment": {
      "overallSentiment": "positive/neutral/negative",
      "keyComplaints": ["complaint1", "complaint2"],
      "positiveFeedback": ["positive1", "positive2"]
    }
  },
  "platformAnalyses": {
    "X": { "platformName": "X", "score": number(1-5), "signalStrength": "weak/moderate/strong/exceptional", "summary": string, "keyFindings": [string array], "contentSuggestion": string, "dataSource": string },
    "Reddit": { "platformName": "Reddit", "score": number(1-5), "signalStrength": "weak/moderate/strong/exceptional", "summary": string, "keyFindings": [string array], "contentSuggestion": string, "dataSource": string },
    "LinkedIn": { "platformName": "LinkedIn", "score": number(1-5), "signalStrength": "weak/moderate/strong/exceptional", "summary": string, "keyFindings": [string array], "contentSuggestion": string, "dataSource": string }
  },
  "tweetSuggestion": string,
  "redditTitleSuggestion": string,
  "redditBodySuggestion": string,
  "linkedinSuggestion": string,
  "dataConfidence": "high/medium/low",
  "lastDataUpdate": string
}

CRITICAL RULES:
- Use your comprehensive knowledge base to provide deep, thorough analysis
- Reference specific companies, market data, and industry benchmarks
- Be brutally honest - most ideas fail, reflect this reality
- Consider market timing, competition, and execution difficulty
- Look for red flags (saturated markets, regulatory issues, technical impossibility)
- Provide specific, actionable validation steps with examples from your knowledge base
- Don't inflate scores - a 60+ score should be genuinely promising
- Include realWorldData with realistic insights based on your market knowledge`;

                const r = await aiInstance.models.generateContent({
                    model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
                    contents: `ANALYZE: "${inputContent}"\nReturn JSON only.`,
                    config: { systemInstruction: fastSys, responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 1500 }
                });
                
                console.log('Raw AI response:', r.text);
                
                const parsed = ((): any => { 
                    try { 
                        const cleanedText = (r.text || '').trim();
                        // Remove any markdown formatting
                        const jsonStart = cleanedText.indexOf('{');
                        const jsonEnd = cleanedText.lastIndexOf('}') + 1;
                        if (jsonStart >= 0 && jsonEnd > jsonStart) {
                            const jsonText = cleanedText.substring(jsonStart, jsonEnd);
                            return JSON.parse(jsonText);
                        }
                        return null;
                    } catch (e) { 
                        console.log('JSON parse error:', e);
                        return null; 
                    } 
                })();
                
                if (parsed && typeof parsed === 'object') {
                    // Validate demandScore
                    if (typeof parsed.demandScore !== 'number' || parsed.demandScore < 0 || parsed.demandScore > 100) {
                        parsed.demandScore = 50;
                    }
                    
                    // Ensure platformAnalyses exists with proper structure
                    if (!parsed.platformAnalyses) {
                        parsed.platformAnalyses = {
                            X: { 
                                platformName: "X", 
                                score: 3, 
                                signalStrength: "moderate",
                                summary: "Analysis completed", 
                                keyFindings: ["Ready for social media testing"], 
                                contentSuggestion: "Share your idea on X to gather feedback", 
                                dataSource: "AI Analysis" 
                            },
                            Reddit: { 
                                platformName: "Reddit", 
                                score: 3, 
                                signalStrength: "moderate",
                                summary: "Analysis completed", 
                                keyFindings: ["Ready for community feedback"], 
                                contentSuggestion: "Post on relevant subreddits", 
                                dataSource: "AI Analysis" 
                            },
                            LinkedIn: { 
                                platformName: "LinkedIn", 
                                score: 3, 
                                signalStrength: "moderate",
                                summary: "Analysis completed", 
                                keyFindings: ["Ready for professional feedback"], 
                                contentSuggestion: "Share with professional network", 
                                dataSource: "AI Analysis" 
                            }
                        };
                    }
                    
                    // Ensure realWorldData exists
                    if (!parsed.realWorldData) {
                        parsed.realWorldData = {
                            socialMediaSignals: {
                                twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
                                facebook: { groupActivity: 'medium', engagement: 'medium' },
                                tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
                            },
                            forumInsights: {
                                reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
                                quora: { questionFrequency: 'medium', topics: ['General discussion'] }
                            },
                            marketplaceData: {
                                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
                                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
                            },
                            consumerSentiment: {
                                overallSentiment: 'neutral',
                                keyComplaints: ['Data unavailable'],
                                positiveFeedback: ['Analysis pending']
                            }
                        };
                    }
                    
                    // Ensure dataConfidence and lastDataUpdate
                    if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
                    if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();
                    
                    // Ensure all required fields exist
                    if (!parsed.tweetSuggestion) parsed.tweetSuggestion = "Share your idea on X to get feedback from the community!";
                    if (!parsed.redditTitleSuggestion) parsed.redditTitleSuggestion = "Looking for feedback on my startup idea";
                    if (!parsed.redditBodySuggestion) parsed.redditBodySuggestion = "I'm working on a new startup idea and would love to get your thoughts and feedback.";
                    if (!parsed.linkedinSuggestion) parsed.linkedinSuggestion = "Excited to share my latest startup idea and looking for feedback from my professional network.";
                    
                    console.log(`Fast analysis completed - Score: ${parsed.demandScore}/100, RealWorldData: ${!!parsed.realWorldData}, PlatformAnalyses: ${!!parsed.platformAnalyses}`);
                    return res.status(200).json(parsed);
                } else {
                    console.log('Failed to parse AI response, using fallback data');
                    // Return fallback data if parsing fails
                    const fallbackData = {
                        idea: inputContent,
                        demandScore: 50,
                        scoreJustification: "Analysis completed with fallback data due to parsing issues.",
                        platformAnalyses: [
                            {
                                platform: "Instagram",
                                signalStrength: "moderate",
                                analysis: "Visual content potential exists, but competition is high. Focus on niche communities and micro-influencers for early adoption."
                            },
                            {
                                platform: "TikTok",
                                signalStrength: "strong",
                                analysis: "High potential for viral growth through short-form content. Early adoption could capture emerging trends before mainstream saturation."
                            },
                            {
                                platform: "Reddit",
                                signalStrength: "moderate",
                                analysis: "Community-driven validation possible in specific subreddits. Requires authentic engagement and community building."
                            },
                            {
                                platform: "LinkedIn",
                                signalStrength: "weak",
                                analysis: "Limited B2B potential. Consider alternative professional platforms or pivot to consumer-focused strategy."
                            }
                        ],
                        realWorldData: {
                            socialMediaSignals: {
                                twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
                                facebook: { groupActivity: 'medium', engagement: 'medium' },
                                tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
                            },
                            forumInsights: {
                                reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
                                quora: { questionFrequency: 'medium', topics: ['General discussion'] }
                            },
                            marketplaceData: {
                                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
                                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
                            },
                            consumerSentiment: {
                                overallSentiment: 'neutral',
                                keyComplaints: ['Data unavailable'],
                                positiveFeedback: ['Analysis pending']
                            }
                        },
                        socialArbitrageInsights: {
                            microToMacro: "The idea shows potential to spread from niche communities to broader audiences, but requires strategic community building and authentic engagement.",
                            geographicDemographic: "Cultural transfer potential exists across similar demographic segments, with opportunities for localized adaptation and community-specific messaging.",
                            timingFactor: "Current market timing appears favorable for early adoption. Competition is moderate, providing a window for establishing market position.",
                            platformDynamics: "Platform-specific strategies show varying potential, with TikTok offering the highest growth opportunity and Instagram providing steady community building.",
                            culturalLeap: "Cross-cultural adoption potential is moderate, requiring careful adaptation and community-specific messaging strategies."
                        },
                        trendPhase: "growing",
                        culturalTransferScore: 0.65,
                        earlyAdopterAdvantage: "Early adoption could provide first-mover advantages in emerging communities, with potential for viral growth through authentic engagement.",
                        tweetSuggestion: "🚀 Just discovered an amazing opportunity that's flying under the radar! The early adopter advantage is real - don't miss this cultural shift happening right now. #SocialArbitrage #EarlyAdopter #TrendSpotting",
                        redditTitleSuggestion: "Found a hidden trend that's about to explode - early adopter advantage analysis",
                        redditBodySuggestion: "I've been researching this emerging trend and the social arbitrage potential is incredible. The timing is perfect - we're seeing early signals in niche communities that suggest this will go mainstream soon. What are your thoughts on the early adopter strategy?",
                        linkedinSuggestion: "The future belongs to those who can spot cultural shifts before they become mainstream. This emerging trend represents a significant opportunity for early adopters who understand the power of social arbitrage. The key is authentic community building and strategic timing.",
                        dataConfidence: 'low',
                        lastDataUpdate: new Date().toISOString()
                    };
                    return res.status(200).json(fallbackData);
                }
            } catch (error) {
                console.log('Fast mode failed:', error);
            }
            // fallback to normal path if fast failed
        }

        // Simplified AI Analysis - use selected AI model
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async function getAIAnalysis(content: string, systemPrompt: string): Promise<any> {
            console.log(`🎯 Using ${useAI.toUpperCase()} for analysis...`);

            try {
                const aiInstance = getAI(useAI);
                
                // Use different models based on selection
                if (useAI === 'openai') {
                    const openai = aiInstance as OpenAI;
                    const completion = await openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: [
                            {
                                role: 'system',
                                content: finalSystemInstruction + `\n\nRESPONSE FORMAT: Return comprehensive JSON with ALL analysis fields including marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit`
                            },
                            {
                                role: 'user',
                                content: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 1792
                    });
                    
                    return {
                        model: 'gpt-4',
                        result: completion.choices[0]?.message?.content?.trim(),
                        success: true,
                        fallbackUsed: false
                    };
                } else if (useAI === 'groq') {
                    const groq = aiInstance as Groq;
                    const completion = await groq.chat.completions.create({
                        model: 'llama3-70b-8192',
                        messages: [
                            {
                                role: 'system',
                                content: finalSystemInstruction + `\n\nRESPONSE FORMAT: Return comprehensive JSON with ALL analysis fields including marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit`
                            },
                            {
                                role: 'user',
                                content: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 1792
                    });
                    
                    return {
                        model: 'llama3-70b-8192',
                        result: completion.choices[0]?.message?.content?.trim(),
                        success: true,
                        fallbackUsed: false
                    };
                } else {
                    // Default Gemini
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

                // Fallback to other models if primary fails
                try {
                    if (useAI === 'gemini') {
                        // Try OpenAI as fallback
                        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                        const completion = await openai.chat.completions.create({
                            model: 'gpt-4',
                            messages: [
                                {
                                    role: 'system',
                                    content: finalSystemInstruction + `\n\nRESPONSE FORMAT: Return comprehensive JSON with ALL analysis fields including marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit`
                                },
                                {
                                    role: 'user',
                                    content: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`
                                }
                            ],
                            temperature: 0.3,
                            max_tokens: 1792
                        });
                        
                        return {
                            model: 'gpt-4 (fallback)',
                            result: completion.choices[0]?.message?.content?.trim(),
                            success: true,
                            fallbackUsed: true
                        };
                    } else if (useAI === 'openai') {
                        // Try Gemini as fallback
                        const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY || '');
                        const result = await gemini.models.generateContent({
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
                            model: 'gemini-1.5-flash (fallback)',
                        result: result.text?.trim(),
                        success: true,
                        fallbackUsed: true
                    };
                    } else {
                        // Try Gemini as fallback for Groq
                        const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY || '');
                        const result = await gemini.models.generateContent({
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
                            model: 'gemini-1.5-flash (fallback)',
                            result: result.text?.trim(),
                            success: true,
                            fallbackUsed: true
                        };
                    }
                } catch (fallbackError) {
                    console.error('❌ All AI models failed:', fallbackError);
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
        
        // Add social momentum analysis if enabled
        try {
            if (req.body?.includeMomentum !== false) { // Default to true
                console.log('🎯 Adding social momentum analysis...');
                
                // Call internal momentum analysis
                const momentumResponse = await fetch(`${req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000'}/api/social-momentum`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idea: result.idea,
                        originalScore: result.demandScore,
                        language: result.language?.toLowerCase().includes('turkish') ? 'tr' : 'en'
                    })
                });

                if (momentumResponse.ok) {
                    const momentumData = await momentumResponse.json();
                    
                    // Enhance result with momentum data
                    result.socialMomentum = momentumData.analysis;
                    
                    // Update demand score if momentum suggests it
                    if (momentumData.analysis?.enhancedValidationScore && 
                        Math.abs(momentumData.analysis.enhancedValidationScore - result.demandScore) <= 20) {
                        result.originalDemandScore = result.demandScore;
                        result.demandScore = momentumData.analysis.enhancedValidationScore;
                        result.momentumAdjusted = true;
                    }
                    
                    console.log(`🚀 Momentum analysis added - Score: ${result.demandScore}/100 (${result.momentumAdjusted ? 'adjusted' : 'unchanged'})`);
                } else {
                    console.log('⚠️ Momentum analysis failed, continuing without it');
                }
            }
        } catch (momentumError) {
            console.error('⚠️ Momentum analysis error (non-critical):', momentumError);
            // Continue without momentum - it's an enhancement, not critical
        }
        
        // Add Early Signal Mode analysis if enabled
        try {
            if (req.body?.includeEarlySignal !== false) { // Default to true
                console.log('🎯 Adding Early Signal Mode analysis...');
                
                // Call internal early signal analysis
                const earlySignalResponse = await fetch(`${req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000'}/api/early-signal`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idea: result.idea,
                        originalScore: result.demandScore,
                        socialMomentum: result.socialMomentum,
                        language: result.language?.toLowerCase().includes('turkish') ? 'tr' : 'en'
                    })
                });

                if (earlySignalResponse.ok) {
                    const earlySignalData = await earlySignalResponse.json();
                    
                    // Enhance result with early signal data
                    result.earlySignal = earlySignalData.analysis;
                    
                    // Update demand score if early signal suggests significant enhancement
                    if (earlySignalData.analysis?.enhancedScore && 
                        Math.abs(earlySignalData.analysis.enhancedScore - result.demandScore) <= 25 &&
                        earlySignalData.analysis.confidence >= 70) {
                        result.originalDemandScore = result.originalDemandScore || result.demandScore;
                        result.demandScore = earlySignalData.analysis.enhancedScore;
                        result.earlySignalAdjusted = true;
                    }
                    
                    console.log(`🚀 Early Signal analysis added - Score: ${result.demandScore}/100 (${result.earlySignalAdjusted ? 'enhanced' : 'unchanged'})`);
                } else {
                    console.log('⚠️ Early Signal analysis failed, continuing without it');
                }
            }
        } catch (earlySignalError) {
            console.error('⚠️ Early Signal analysis error (non-critical):', earlySignalError);
            // Continue without early signal - it's an enhancement, not critical
        }
        
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
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            .replace(/,(\s*[}\]])/g, '$1');

        parsed = tryParse(text);
        return parsed;
    };

    try {
        console.log('🎯 Using enhanced AI analysis with real-world data...');

        // Language detection
        const looksTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(content) || /( bir | ve | için | ile | kadar | şöyle | çünkü | ancak )/i.test(content);
        const expectedLanguage = looksTurkish ? 'Turkish' : 'English';
        
        // Enhanced Social Arbitrage Theory prompt - OUTPUT IN SAME LANGUAGE AS INPUT
        const enhancedPrompt = expectedLanguage === 'Turkish' ? 
            `Bu startup fikrini Social Arbitrage Theory çerçevesinde analiz et: "${content}"
            
            🚀 SOCIAL ARBITRAGE THEORY ANALİZİ:
            - Micro → Macro: Küçük topluluklardan ana akıma geçiş potansiyeli
            - Geographic & Demographic: Coğrafi ve demografik kültürel transfer
            - Timing Factor: Trend timing ve market entry zamanlaması
            - Platform Dynamics: Platform özel dinamikler ve arbitraj fırsatları
            - Cultural Leap: Kültürler arası sıçrama potansiyeli
            
            🌍 KÜLTÜREL ARBITRAJ ANALİZİ:
            - Hangi kültürel boşlukları dolduruyor?
            - Hangi topluluklardan hangi topluluklara transfer edilebilir?
            - Timing açısından optimal entry point nedir?
            - Platform dynamics nasıl değişiyor?
            - Early adopter avantajı nedir?
            
            📊 VERİ TABANLI SKORLAMA:
            - Demand Score: 0-100 arası (kültürel arbitraj potansiyeli)
            - Trend Phase: emerging/growing/peak/declining
            - Cultural Transfer Score: 0-100 arası
            - Platform Signal Strength: Strong/Moderate/Weak
            
            ⚠️ ÖNEMLİ: TÜM ÇIKTIYI TÜRKÇE VER! JSON içindeki tüm metinler Türkçe olmalı.
            
            Sadece JSON döndür. Şu yapıyı kullan:
            {
                "idea": "fikir",
                "demandScore": 0-100 arası sayı (kültürel arbitraj potansiyeli),
                "scoreJustification": "social arbitrage theory çerçevesinde skor gerekçesi",
                "socialArbitrageInsights": {
                    "microToMacro": "micro to macro transfer analizi",
                    "geographicDemographic": "coğrafi ve demografik analiz",
                    "timingFactor": "timing analizi",
                    "platformDynamics": "platform dinamikleri",
                    "culturalLeap": "kültürel sıçrama potansiyeli"
                },
                "trendPhase": "emerging/growing/peak/declining",
                "culturalTransferScore": 0-100 arası sayı,
                "earlyAdopterAdvantage": "early adopter avantajı açıklaması",
                "platformAnalyses": [
                    {
                        "platform": "platform adı",
                        "signalStrength": "Strong/Moderate/Weak",
                        "analysis": "platform özel analiz"
                    }
                ],
                "tweetSuggestion": "X/Twitter için öneri",
                "redditTitleSuggestion": "Reddit başlık önerisi",
                "redditBodySuggestion": "Reddit içerik önerisi",
                "linkedinSuggestion": "LinkedIn post önerisi"
            }
                        "appStore": { "competitorApps": number, "avgRating": number, "downloads": "yüksek/orta/düşük" }
                    },
                    "consumerSentiment": {
                        "overallSentiment": "olumlu/nötr/olumsuz",
                        "keyComplaints": ["şikayet1", "şikayet2"],
                        "positiveFeedback": ["olumlu1", "olumlu2"]
                    }
                },
                    "platformAnalyses": {
                    "X": {
                        "platformName": "X",
                        "score": 1-5 arası (veri tabanlı),
                        "signalStrength": "zayıf/orta/güçlü/olağanüstü",
                        "summary": "veri destekli analiz",
                        "keyFindings": ["bulgu1", "bulgu2", "bulgu3"],
                        "contentSuggestion": "içerik önerisi",
                        "dataSource": "Twitter API + AI analizi"
                      },
                      "Reddit": {
                        "platformName": "Reddit", 
                        "score": 1-5 arası (veri tabanlı),
                        "signalStrength": "zayıf/orta/güçlü/olağanüstü",
                        "summary": "veri destekli analiz",
                        "keyFindings": ["bulgu1", "bulgu2", "bulgu3"],
                        "contentSuggestion": "içerik önerisi",
                        "dataSource": "Reddit API + AI analizi"
                      },
                      "LinkedIn": {
                        "platformName": "LinkedIn",
                        "score": 1-5 arası (veri tabanlı), 
                        "signalStrength": "zayıf/orta/güçlü/olağanüstü",
                        "summary": "veri destekli analiz",
                        "keyFindings": ["bulgu1", "bulgu2", "bulgu3"],
                        "contentSuggestion": "içerik önerisi",
                        "dataSource": "LinkedIn verileri + AI analizi"
                    }
                },
                "tweetSuggestion": "veri destekli tweet önerisi",
                "redditTitleSuggestion": "veri destekli reddit başlık önerisi",
                "redditBodySuggestion": "veri destekli reddit içerik önerisi",
                "linkedinSuggestion": "veri destekli linkedin önerisi",
                "dataConfidence": "yüksek/orta/düşük (veri kalitesi)",
                "lastDataUpdate": "son veri güncelleme zamanı"
            }` :
            `Analyze this startup idea using Social Arbitrage Theory: "${content}"
            
            🚀 SOCIAL ARBITRAGE THEORY ANALYSIS:
            - Micro → Macro: Potential to move from small communities to mainstream
            - Geographic & Demographic: Cultural transfer across geographies and demographics
            - Timing Factor: Trend timing and optimal market entry timing
            - Platform Dynamics: Platform-specific dynamics and arbitrage opportunities
            - Cultural Leap: Cross-cultural jump potential
            
            🌍 CULTURAL ARBITRAGE ANALYSIS:
            - What cultural gaps does it fill?
            - Which communities can it transfer from/to?
            - What's the optimal entry point timing-wise?
            - How are platform dynamics changing?
            - What's the early adopter advantage?
            
            📊 DATA-DRIVEN SCORING:
            - Demand Score: 0-100 (cultural arbitrage potential)
            - Trend Phase: emerging/growing/peak/declining
            - Cultural Transfer Score: 0-100
            - Platform Signal Strength: Strong/Moderate/Weak
            
            ⚠️ IMPORTANT: GIVE ALL OUTPUT IN ENGLISH! All text in JSON must be in English.
            
            Return only JSON. Use this structure:
            {
                "idea": "idea",
                "demandScore": number 0-100 (cultural arbitrage potential),
                "scoreJustification": "score justification within social arbitrage theory framework",
                "socialArbitrageInsights": {
                    "microToMacro": "micro to macro transfer analysis",
                    "geographicDemographic": "geographic and demographic analysis",
                    "timingFactor": "timing analysis",
                    "platformDynamics": "platform dynamics",
                    "culturalLeap": "cultural leap potential"
                },
                "trendPhase": "emerging/growing/peak/declining",
                "culturalTransferScore": number 0-100,
                "earlyAdopterAdvantage": "early adopter advantage explanation",
                "platformAnalyses": [
                    {
                        "platform": "platform name",
                        "signalStrength": "Strong/Moderate/Weak",
                        "analysis": "platform-specific analysis"
                    }
                ],
                "tweetSuggestion": "X/Twitter suggestion",
                "redditTitleSuggestion": "Reddit title suggestion",
                "redditBodySuggestion": "Reddit content suggestion",
                "linkedinSuggestion": "LinkedIn post suggestion"
            }
                        "positiveFeedback": ["positive1", "positive2"]
                    }
                },
                                "platformAnalyses": {
                    "X": {
                        "platformName": "X",
                        "score": number 1-5 (data-driven),
                        "signalStrength": "weak/moderate/strong/exceptional",
                        "summary": "data-supported analysis",
                        "keyFindings": ["finding1", "finding2", "finding3"],
                        "contentSuggestion": "content suggestion",
                        "dataSource": "Twitter API + AI analysis"
                    },
                    "Reddit": {
                        "platformName": "Reddit", 
                        "score": number 1-5 (data-driven),
                        "signalStrength": "weak/moderate/strong/exceptional",
                        "summary": "data-supported analysis",
                        "keyFindings": ["finding1", "finding2", "finding3"],
                        "contentSuggestion": "content suggestion",
                        "dataSource": "Reddit API + AI analysis"
                    },
                    "LinkedIn": {
                        "platformName": "LinkedIn",
                        "score": number 1-5 (data-driven), 
                        "signalStrength": "weak/moderate/strong/exceptional",
                        "summary": "data-supported analysis",
                        "keyFindings": ["finding1", "finding2", "finding3"],
                        "contentSuggestion": "content suggestion",
                        "dataSource": "LinkedIn data + AI analysis"
                    }
                },
                "tweetSuggestion": "data-driven tweet suggestion",
                "redditTitleSuggestion": "data-driven reddit title suggestion",
                "redditBodySuggestion": "data-driven reddit content suggestion",
                "linkedinSuggestion": "data-driven linkedin suggestion",
                "dataConfidence": "high/medium/low (data quality)",
                "lastDataUpdate": "last data update time"
            }`;

        // Single AI call with enhanced prompt
        const aiInstance = getAI();
        const runtimeModel = preferredModel || process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash';
        
        console.log(`🎯 Using enhanced model: ${runtimeModel}`);
        
        const result = await aiInstance.models.generateContent({
                    model: runtimeModel,
            contents: enhancedPrompt,
                    config: {
                temperature: 0.3,
                maxOutputTokens: 1500,
            }
        });

        const responseText = result.text?.trim();
        console.log('📝 Enhanced AI Response received, length:', responseText?.length || 0);

        if (responseText) {
            const parsed = safeJsonParse(responseText);
            if (parsed && typeof parsed === 'object') {
                // Validate and clean the enhanced response
                const cleaned = {
                            idea: content,
                    demandScore: Math.max(0, Math.min(100, parsed.demandScore || 50)),
                    scoreJustification: parsed.scoreJustification || 'Data-driven analysis completed',
            language: expectedLanguage,
                            fallbackUsed: false,
                    realWorldData: parsed.realWorldData || {},
                    platformAnalyses: parsed.platformAnalyses || {},
                    tweetSuggestion: parsed.tweetSuggestion || '',
                    redditTitleSuggestion: parsed.redditTitleSuggestion || '',
                    redditBodySuggestion: parsed.redditBodySuggestion || '',
                    linkedinSuggestion: parsed.linkedinSuggestion || '',
                    dataConfidence: parsed.dataConfidence || 'medium',
                    lastDataUpdate: parsed.lastDataUpdate || new Date().toISOString()
                };

                console.log('✅ Enhanced AI analysis successful, score:', cleaned.demandScore);
                console.log('📊 Data confidence:', cleaned.dataConfidence);
                return cleaned;
            }
        }

        throw new Error('Failed to parse enhanced AI response');

    } catch (error) {
        console.error('❌ Enhanced AI analysis failed:', error);
        
        // Return enhanced fallback response
        const fallbackResponse = {
                idea: content,
            demandScore: 50,
            scoreJustification: expectedLanguage === 'Turkish' ? 'Gelişmiş analiz başarısız, yedek yanıt kullanıldı' : 'Enhanced analysis failed, fallback used',
            language: expectedLanguage,
                fallbackUsed: true,
            realWorldData: {
                socialMediaSignals: {
                    twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
                    facebook: { groupActivity: 'medium', engagement: 'medium' },
                    tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
                },
                forumInsights: {
                    reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
                    quora: { questionFrequency: 'medium', topics: ['General discussion'] }
                },
                marketplaceData: {
                    amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
                    appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
                },
                consumerSentiment: {
                    overallSentiment: 'neutral',
                    keyComplaints: ['Data unavailable'],
                    positiveFeedback: ['Analysis pending']
                }
            },
                platformAnalyses: {
                    twitter: {
                        platformName: 'X',
                        score: 3,
                    summary: expectedLanguage === 'Turkish' ? 'Orta düzey potansiyel (veri eksik)' : 'Medium potential (data limited)',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate potential'],
                    contentSuggestion: expectedLanguage === 'Turkish' ? 'Fikrinizi X\'te paylaşın' : 'Share your idea on X',
                    dataSource: 'Fallback analysis'
                    },
                    reddit: {
                        platformName: 'Reddit',
                        score: 3,
                    summary: expectedLanguage === 'Turkish' ? 'Orta düzey topluluk ilgisi (veri eksik)' : 'Medium community interest (data limited)',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate community fit'],
                    contentSuggestion: expectedLanguage === 'Turkish' ? 'İlgili subreddit\'lerde paylaşın' : 'Post in relevant subreddits',
                    dataSource: 'Fallback analysis'
                    },
                    linkedin: {
                        platformName: 'LinkedIn',
                        score: 3,
                    summary: expectedLanguage === 'Turkish' ? 'Orta düzey iş potansiyeli (veri eksik)' : 'Medium business potential (data limited)',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                    contentSuggestion: expectedLanguage === 'Turkish' ? 'Profesyonel ağınızla paylaşın' : 'Share with your professional network',
                    dataSource: 'Fallback analysis'
                }
            },
            tweetSuggestion: expectedLanguage === 'Turkish' ? 
                `🚀 Yeni bir fikir üzerinde çalışıyorum: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} Ne düşünüyorsunuz? #startup #girişim` :
                `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
            redditTitleSuggestion: expectedLanguage === 'Turkish' ? 'Startup fikrimi için geri bildirim arıyorum' : 'Looking for feedback on my startup idea',
            redditBodySuggestion: expectedLanguage === 'Turkish' ?
                `Bu konsept üzerinde çalışıyorum: ${content}. Topluluktan düşüncelerinizi ve geri bildirimlerinizi almak isterim.` :
                `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
            linkedinSuggestion: expectedLanguage === 'Turkish' ?
                `Yeni bir iş fırsatı keşfediyorum: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Bu alanda başkalarıyla bağlantı kurmakla ilgileniyorum.` :
                `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`,
            dataConfidence: 'low',
            lastDataUpdate: new Date().toISOString()
        };

        console.log('⚠️ Using enhanced fallback response, score:', fallbackResponse.demandScore);
        return fallbackResponse;
    }
}

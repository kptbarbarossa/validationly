import { GoogleGenAI, Type } from "@google/genai";

// Dynamic prompt-based AI analysis system

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
        ]
    };

    // Sector-specific platform mapping (Phase 2 + Phase 3)
    private sectorPlatforms = {
        saas: ['github', 'stackoverflow', 'producthunt', 'hackernews', 'slack', 'devto', 'hashnode', 'gitlab', 'indiehackers'],
        ecommerce: ['instagram', 'tiktok', 'pinterest', 'facebook', 'etsy', 'amazon', 'shopify', 'woocommerce'],
        fintech: ['angellist', 'crunchbase', 'linkedin', 'medium', 'substack', 'clubhouse'],
        design: ['dribbble', 'behance', 'figma', 'instagram', 'awwwards', 'designs99', 'canva', 'adobe', 'unsplash'],
        marketplace: ['producthunt', 'angellist', 'crunchbase', 'linkedin', 'indiehackers', 'etsy'],
        mobile: ['producthunt', 'github', 'reddit', 'hackernews', 'devto', 'indiehackers'],
        hardware: ['youtube', 'reddit', 'producthunt', 'github', 'hackernews', 'instagram'],
        offline: ['instagram', 'tiktok', 'facebook', 'youtube', 'pinterest', 'reddit']
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
        const detectedSectors: string[] = [];

        for (const [sector, keywords] of Object.entries(this.sectorKeywords)) {
            const matchCount = keywords.filter(keyword =>
                inputLower.includes(keyword)
            ).length;

            if (matchCount > 0) {
                detectedSectors.push(sector);
            }
        }

        return detectedSectors.length > 0 ? detectedSectors : ['saas'];
    }

    getSectorSpecificPlatforms(sectors: string[]): string[] {
        const platforms = new Set<string>();
        
        // Always include core platforms
        platforms.add('twitter');
        platforms.add('reddit');
        platforms.add('linkedin');
        
        // Add sector-specific platforms
        for (const sector of sectors) {
            const sectorPlatforms = this.sectorPlatforms[sector] || [];
            sectorPlatforms.forEach(platform => platforms.add(platform));
        }
        
        return Array.from(platforms);
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

        return detectedAnalysis.length > 0 ? detectedAnalysis : ['market', 'competitive'];
    }

    async selectPrompts(input: string): Promise<PromptSelection & { sectorsDetected: string[] }> {
        const sectors = this.detectSector(input);
        const analysisTypes = this.detectAnalysisNeeds(input);

        const basePrompt = this.prompts['base-analyst'];
        const sectorPrompts = sectors.map(sector => this.prompts[`${sector}-sector`]).filter(p => p);
        const examplePrompts = sectors.map(sector => this.prompts[`${sector}-examples`]).filter(p => p);
        // Map analysis keywords to actual prompt keys
        const promptKeyMap: Record<string, string> = {
            market: 'market-opportunity',
            competitive: 'competitive-landscape',
            monetization: 'monetization-opportunity'
        };
        const analysisPrompts = analysisTypes
            .map(analysis => this.prompts[promptKeyMap[analysis]])
            .filter(p => p);

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

// Dynamic Prompt System Result
interface DynamicPromptResult {
    idea: string;
    content?: string;
    demandScore: number;
    scoreJustification: string;

    // Platform analyses from our dynamic prompt system
    platformAnalyses: {
        twitter: PlatformAnalysis;
        reddit: PlatformAnalysis;
        linkedin: PlatformAnalysis;
    };

    // Content suggestions
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;

    // Metadata
    promptMetadata?: {
        sectorsDetected: string[];
        analysisTypes: string[];
        confidence: number;
    };
    // Language & model behavior metadata
    language?: string;
    fallbackUsed?: boolean;
}

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
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable is not set");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}



// Legacy response schema for backward compatibility
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

        const { idea, content, lang, model, evidence, weightsVariant, enhance } = req.body;
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

        const finalSystemInstruction = `${systemInstruction}

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
        7. Risk Assessment: Technical, market, financial risk evaluation
        8. Go-to-Market: Phased launch strategy with timelines
        9. Development Roadmap: Technical implementation timeline
        10. Product-Market Fit: PMF indicators and predictions
        11. Content Suggestions: Platform-optimized versions

        OUTPUT CONSTRAINTS (STRICT):
        - Platform list: include ONLY the TOP 6–8 most relevant platforms overall (choose fewer when input/evidence is long). Do NOT include beyond this cap.
        - For each platform object:
          • summary: max 200–240 characters (keep concise)
          • keyFindings: EXACTLY 3 bullet items (strings)
          • contentSuggestion: max 160–200 characters
        - For high-level sections (marketIntelligence, competitiveLandscape, revenueModel, targetAudience, riskAssessment, goToMarket, developmentRoadmap, productMarketFit): keep sentences concise; avoid verbose paragraphs.

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Provide REAL market data, not generic examples
        - Reference actual competitors and market conditions
        - Give specific numbers based on industry knowledge
        - Make all suggestions actionable and data-driven
        - All content must feel authentic and valuable to entrepreneurs

        Analyze the following startup idea: "${inputContent}"${evidenceText}`;

        console.log('🚀 Starting dynamic prompt analysis...');

        // Simplified AI Analysis - use only Gemini 2.0 for now
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
                        maxOutputTokens: 1536,
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
                            maxOutputTokens: 1536,
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

        // Use simplified analysis approach with dynamic prompts
        const result = await getSimplifiedAIAnalysis(inputContent, finalSystemInstruction, lang, preferredModel, weightsVariant);

        console.log('✅ Dynamic prompt analysis completed successfully');
        console.log('📊 Result structure:', Object.keys(result));
        return res.status(200).json(result);

    } catch (error) {
        console.error('❌ Simplified validation error:', error);

        // Return simplified error response
        return res.status(500).json({
            message: 'Analysis failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Single AI call analysis - no separate platform functions needed

// Simplified AI analysis using only Gemini 2.0
async function getSimplifiedAIAnalysis(
    content: string,
    systemInstruction: string,
    forcedLang?: 'tr'|'en',
    preferredModel?: string,
    weightsVariant?: string
): Promise<DynamicPromptResult> {
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

        // Language: always mirror the user's input language (any language)
        const languageInstruction = `YOU MUST RESPOND STRICTLY IN THE SAME LANGUAGE AS THE USER INPUT. Detect the language yourself and keep 100% consistency across ALL text fields. Do not include words from any other language.`;

        // Detect sector and get relevant platforms
        const sectors = promptManager.detectSector(content);
        const relevantPlatforms = promptManager.getSectorSpecificPlatforms(sectors);
        const focusPlatforms = relevantPlatforms.slice(0, 6);
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
        const runtimeModel = preferredModel || 'gemini-2.5-flash';
        let result = await aiInstance.models.generateContent({
            model: runtimeModel,
            contents: `${languageInstruction}\n\nANALYZE THIS STARTUP IDEA: "${content}"\n\n🎯 DETECTED SECTORS: ${sectors.join(', ')}\n📱 FOCUS PLATFORMS: ${focusPlatforms.join(', ')} (USE ONLY THESE; MAX 6)\n\nProvide COMPREHENSIVE BUSINESS ANALYSIS with REAL DATA. IMPORTANT: Keep the response strictly in the same language as the input. KEEP OUTPUT CONCISE: one short sentence per field or 2-3 short bullets; numbers where applicable. RETURN ONLY JSON. NO EXTRA TEXT.:

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

            💰 REVENUE MODEL (realistic financial projections):
            - Primary Model: Specific business model (SaaS, marketplace, etc.)
            - Price Point: Exact pricing recommendation with currency
            - Revenue Streams: 3 specific revenue sources
            - Break-even Timeline: Realistic months to profitability
            - LTV/CAC Ratio: Specific ratio with calculation
            - Projected MRR: Monthly recurring revenue by year 1

            👥 TARGET AUDIENCE (specific customer segments):
            - Primary Segment: Exact customer type with percentage
            - Secondary Segment: Second customer group with percentage  
            - Tertiary Segment: Third group with percentage
            - Pain Points: 3 specific problems they face
            - Willingness to Pay: Price range they'll accept
            - Acquisition Channels: 3 specific marketing channels

            ⚠️ RISK ASSESSMENT (evaluate each risk level):
            - Technical Risk: Low/Medium/High with specific reasons
            - Market Risk: Low/Medium/High with market factors
            - Financial Risk: Low/Medium/High with financial factors
            - Regulatory Risk: Low/Medium/High with compliance issues
            - Overall Risk: Low/Medium/High summary
            - Mitigation Strategies: 3 specific risk reduction tactics

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
                    }
                }`,
                responseMimeType: "application/json",
                temperature: 0,
                maxOutputTokens: 2048,
            }
        });

        let responseText = result.text?.trim();
        console.log('🧪 AI raw length:', responseText ? responseText.length : 0);
        if (!responseText) {
            throw new Error('Empty response from AI analysis');
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
                        contents: `${languageInstruction}\n\nProduce ONLY the following minimal JSON for the idea: "${content}". Keep strings concise. JSON shape:\n{
  "idea": string,
  "demandScore": number, // 0-100
  "scoreJustification": string, // <= 140 chars
  "platformAnalyses": {
    "twitter"?: {"platformName":"X","score":1-5,"summary":string,"keyFindings":[string,string,string],"contentSuggestion":string},
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
                            maxOutputTokens: 1536,
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
            };
            // A/B override by explicit variant name if provided
            if (weightsVariant && weightsMap[weightsVariant]) {
                const wv = weightsMap[weightsVariant];
                const weighted = rubric.reach * wv.reach + rubric.nicheFit * wv.nicheFit + rubric.contentFit * wv.contentFit + rubric.competitiveSignal * wv.competitiveSignal;
                const score = Math.max(1, Math.min(5, Math.round(weighted)));
                return { score, rubric };
            }
            const sectorKey = sectorsForWeight && sectorsForWeight.length ? (sectorsForWeight[0] as keyof typeof weightsMap) : 'default';
            const w = weightsMap[sectorKey] || weightsMap.default;
            const weighted = rubric.reach * w.reach + rubric.nicheFit * w.nicheFit + rubric.contentFit * w.contentFit + rubric.competitiveSignal * w.competitiveSignal;
            const score = Math.max(1, Math.min(5, Math.round(weighted)));
            return { score, rubric };
        };

        const enforceLanguageOnObjectStrings = (obj: any, expected: 'English'|'Turkish'|undefined): { ok: boolean; offending?: string } => {
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
            const off = traverse(obj);
            return { ok: !off, offending: off || undefined };
        };
        const cleanResult: DynamicPromptResult = {
            idea: parsedResult.idea || content,
            demandScore: Math.max(0, Math.min(100, parsedResult.demandScore || 65)),
            scoreJustification: parsedResult.scoreJustification || 'Market analysis completed',
            language,
            fallbackUsed: Boolean(parsedResult.fallbackUsed ?? false),
            platformAnalyses: {
                twitter: (()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.twitter, sectors); return {
                    platformName: 'X',
                    score: c.score,
                    summary: parsedResult.platformAnalyses?.twitter?.summary || 'Twitter analysis shows moderate potential.',
                    keyFindings: parsedResult.platformAnalyses?.twitter?.keyFindings || ['Analysis completed', 'Moderate engagement potential', 'Content strategy recommended'],
                    contentSuggestion: parsedResult.platformAnalyses?.twitter?.contentSuggestion || 'Share your idea on X for feedback.',
                    rubric: c.rubric
                }; })(),
                reddit: {
                    platformName: 'Reddit',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.reddit, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.reddit?.summary || 'Reddit communities show moderate interest.',
                    keyFindings: parsedResult.platformAnalyses?.reddit?.keyFindings || ['Community engagement possible', 'Discussion potential identified', 'Subreddit targeting recommended'],
                    contentSuggestion: parsedResult.platformAnalyses?.reddit?.contentSuggestion || 'Post in relevant subreddits for detailed feedback.'
                },
                linkedin: {
                    platformName: 'LinkedIn',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.linkedin, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.linkedin?.summary || 'LinkedIn shows professional networking potential.',
                    keyFindings: parsedResult.platformAnalyses?.linkedin?.keyFindings || ['Professional audience alignment', 'B2B networking opportunities', 'Thought leadership potential'],
                    contentSuggestion: parsedResult.platformAnalyses?.linkedin?.contentSuggestion || 'Share professionally on LinkedIn for business feedback.'
                },
                instagram: {
                    platformName: 'Instagram',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.instagram, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.instagram?.summary || 'Instagram shows visual content potential.',
                    keyFindings: parsedResult.platformAnalyses?.instagram?.keyFindings || ['Visual storytelling opportunity', 'Influencer marketing potential', 'Story engagement'],
                    contentSuggestion: parsedResult.platformAnalyses?.instagram?.contentSuggestion || 'Create visual content showcasing your idea.'
                },
                tiktok: {
                    platformName: 'TikTok',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.tiktok, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.tiktok?.summary || 'TikTok shows viral content potential.',
                    keyFindings: parsedResult.platformAnalyses?.tiktok?.keyFindings || ['Gen Z audience reach', 'Viral potential', 'Short-form content'],
                    contentSuggestion: parsedResult.platformAnalyses?.tiktok?.contentSuggestion || 'Create engaging short videos about your concept.'
                },
                youtube: {
                    platformName: 'YouTube',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.youtube, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.youtube?.summary || 'YouTube shows educational content potential.',
                    keyFindings: parsedResult.platformAnalyses?.youtube?.keyFindings || ['Long-form content opportunity', 'Tutorial potential', 'Subscriber growth'],
                    contentSuggestion: parsedResult.platformAnalyses?.youtube?.contentSuggestion || 'Create educational videos about your solution.'
                },
                facebook: {
                    platformName: 'Facebook',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.facebook, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.facebook?.summary || 'Facebook shows community building potential.',
                    keyFindings: parsedResult.platformAnalyses?.facebook?.keyFindings || ['Community groups', 'Event promotion', 'Older demographics'],
                    contentSuggestion: parsedResult.platformAnalyses?.facebook?.contentSuggestion || 'Join relevant Facebook groups and communities.'
                },
                producthunt: {
                    platformName: 'Product Hunt',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.producthunt, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.producthunt?.summary || 'Product Hunt shows strong launch potential.',
                    keyFindings: parsedResult.platformAnalyses?.producthunt?.keyFindings || ['Tech community focus', 'Launch platform', 'Early adopter audience'],
                    contentSuggestion: parsedResult.platformAnalyses?.producthunt?.contentSuggestion || 'Prepare for Product Hunt launch with compelling story.'
                },
                hackernews: {
                    platformName: 'Hacker News',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.hackernews, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.hackernews?.summary || 'Hacker News shows developer community interest.',
                    keyFindings: parsedResult.platformAnalyses?.hackernews?.keyFindings || ['Developer audience', 'Technical discussion', 'Open source potential'],
                    contentSuggestion: parsedResult.platformAnalyses?.hackernews?.contentSuggestion || 'Share technical insights and development journey.'
                },
                medium: {
                    platformName: 'Medium',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.medium, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.medium?.summary || 'Medium shows thought leadership potential.',
                    keyFindings: parsedResult.platformAnalyses?.medium?.keyFindings || ['Long-form content', 'Professional audience', 'SEO benefits'],
                    contentSuggestion: parsedResult.platformAnalyses?.medium?.contentSuggestion || 'Write detailed articles about your industry insights.'
                },
                discord: {
                    platformName: 'Discord',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.discord, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.discord?.summary || 'Discord shows community building potential.',
                    keyFindings: parsedResult.platformAnalyses?.discord?.keyFindings || ['Real-time engagement', 'Community building', 'Niche audiences'],
                    contentSuggestion: parsedResult.platformAnalyses?.discord?.contentSuggestion || 'Join relevant Discord servers and engage with communities.'
                },
                github: {
                    platformName: 'GitHub',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.github, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.github?.summary || 'GitHub shows open source potential.',
                    keyFindings: parsedResult.platformAnalyses?.github?.keyFindings || ['Developer community', 'Open source opportunity', 'Technical credibility'],
                    contentSuggestion: parsedResult.platformAnalyses?.github?.contentSuggestion || 'Create open source tools or documentation.'
                },
                dribbble: {
                    platformName: 'Dribbble',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.dribbble, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.dribbble?.summary || 'Dribbble shows design community potential.',
                    keyFindings: parsedResult.platformAnalyses?.dribbble?.keyFindings || ['Design community', 'Portfolio showcase', 'Creative feedback'],
                    contentSuggestion: parsedResult.platformAnalyses?.dribbble?.contentSuggestion || 'Share design concepts and get creative feedback.'
                },
                angellist: {
                    platformName: 'AngelList',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.angellist, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.angellist?.summary || 'AngelList shows investor network potential.',
                    keyFindings: parsedResult.platformAnalyses?.angellist?.keyFindings || ['Investor network', 'Startup ecosystem', 'Funding opportunities'],
                    contentSuggestion: parsedResult.platformAnalyses?.angellist?.contentSuggestion || 'Create compelling startup profile for investors.'
                },
                crunchbase: {
                    platformName: 'Crunchbase',
                    ...(()=>{ const c = computePlatformScore(parsedResult.platformAnalyses?.crunchbase, sectors); return { score: c.score, rubric: c.rubric }; })(),
                    summary: parsedResult.platformAnalyses?.crunchbase?.summary || 'Crunchbase shows market intelligence value.',
                    keyFindings: parsedResult.platformAnalyses?.crunchbase?.keyFindings || ['Market intelligence', 'Competitor tracking', 'Industry analysis'],
                    contentSuggestion: parsedResult.platformAnalyses?.crunchbase?.contentSuggestion || 'Research competitors and market trends.'
                }
            },
            tweetSuggestion: parsedResult.tweetSuggestion || 'Share your startup idea on Twitter!',
            redditTitleSuggestion: parsedResult.redditTitleSuggestion || 'Looking for feedback on my startup idea',
            redditBodySuggestion: parsedResult.redditBodySuggestion || 'I would love to get your thoughts on this concept.',
            linkedinSuggestion: parsedResult.linkedinSuggestion || 'Excited to share this new business concept with my network.',

            // Add comprehensive analysis with fallbacks
            marketIntelligence: parsedResult.marketIntelligence || {
                tam: "Market analysis in progress",
                sam: "Calculating addressable market",
                som: "Determining obtainable market",
                growthRate: "Industry growth rate analysis",
                marketTiming: 3,
                keyTrends: ["Market analysis", "Industry trends", "Growth opportunities"]
            },
            competitiveLandscape: parsedResult.competitiveLandscape || {
                directCompetitors: ["Analysis in progress"],
                indirectCompetitors: ["Market research ongoing"],
                marketPosition: "Competitive positioning analysis",
                differentiationScore: 7,
                competitiveMoat: "Competitive advantage assessment",
                entryBarriers: "Market entry analysis"
            },
            revenueModel: parsedResult.revenueModel || {
                primaryModel: "Business model analysis",
                pricePoint: "Pricing strategy development",
                revenueStreams: ["Revenue analysis", "Monetization strategy"],
                breakEvenTimeline: "Financial projections",
                ltvCacRatio: "Unit economics analysis",
                projectedMrr: "Revenue projections"
            },
            targetAudience: parsedResult.targetAudience || {
                primarySegment: "Customer segment analysis",
                secondarySegment: "Market segmentation",
                tertiarySegment: "Audience research",
                painPoints: ["Customer research", "Pain point analysis"],
                willingnessToPay: "Pricing sensitivity analysis",
                customerAcquisitionChannels: ["Channel analysis", "Customer acquisition"]
            },
            riskAssessment: parsedResult.riskAssessment || {
                technicalRisk: "Medium",
                marketRisk: "Medium",
                financialRisk: "Medium",
                regulatoryRisk: "Low",
                overallRiskLevel: "Medium",
                mitigationStrategies: ["Risk analysis", "Mitigation planning"]
            },
            goToMarket: parsedResult.goToMarket || {
                phase1: "Go-to-market strategy development",
                phase2: "Market entry planning",
                phase3: "Scale strategy",
                timeline: "Strategic timeline",
                budgetNeeded: "Budget analysis",
                keyChannels: ["Channel strategy", "Market approach"]
            },
            developmentRoadmap: parsedResult.developmentRoadmap || {
                mvpTimeline: "Development planning",
                betaLaunch: "Beta strategy",
                publicLaunch: "Launch planning",
                keyFeatures: ["Feature analysis", "Product roadmap"],
                teamNeeded: ["Team planning", "Resource allocation"],
                techStack: ["Technology assessment", "Technical planning"]
            },
            productMarketFit: parsedResult.productMarketFit || {
                problemSolutionFit: 75,
                solutionMarketFit: 70,
                earlyAdopterSignals: "PMF analysis in progress",
                retentionPrediction: "Retention modeling",
                viralCoefficient: "Growth analysis",
                pmfIndicators: ["PMF assessment", "Market validation"]
            }
        };

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
        const isTurkish = forcedLang === 'tr' ? true : forcedLang === 'en' ? false : /[çğıöşüÇĞIİÖŞÜ]/.test(content) ||
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

        } catch (error) {
            console.error('❌ AI analysis failed:', error);
            
            // Return fallback result with sector-specific platforms
            const sectors = promptManager.detectSector(content);
            const relevantPlatforms = promptManager.getSectorSpecificPlatforms(sectors);
            
            const fallbackPlatforms: any = {
                twitter: {
                    platformName: 'X',
                    score: 3,
                    summary: 'Analysis unavailable. Fallback assessment shows moderate potential.',
                    keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                        contentSuggestion: 'Share your startup idea on X!'
                },
                reddit: {
                    platformName: 'Reddit',
                    score: 3,
                    summary: 'Analysis unavailable. Fallback assessment shows moderate potential.',
                    keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                    contentSuggestion: 'Post in relevant subreddits for feedback.'
                },
                linkedin: {
                    platformName: 'LinkedIn',
                    score: 3,
                    summary: 'Analysis unavailable. Fallback assessment shows moderate potential.',
                    keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                    contentSuggestion: 'Share with your professional network on LinkedIn.'
                }
            };

            // Add sector-specific platforms to fallback
            relevantPlatforms.forEach(platform => {
                if (!fallbackPlatforms[platform]) {
                    const platformNames = {
                        // Phase 2 platforms
                        github: 'GitHub',
                        stackoverflow: 'Stack Overflow',
                        instagram: 'Instagram',
                        pinterest: 'Pinterest',
                        angellist: 'AngelList',
                        crunchbase: 'Crunchbase',
                        dribbble: 'Dribbble',
                        behance: 'Behance',
                        figma: 'Figma Community',
                        producthunt: 'Product Hunt',
                        
                        // Phase 3 platforms
                        slack: 'Slack Communities',
                        clubhouse: 'Clubhouse',
                        substack: 'Substack',
                        notion: 'Notion Community',
                        devto: 'Dev.to',
                        hashnode: 'Hashnode',
                        gitlab: 'GitLab',
                        codepen: 'CodePen',
                        indiehackers: 'Indie Hackers',
                        awwwards: 'Awwwards',
                        designs99: '99designs',
                        canva: 'Canva Community',
                        adobe: 'Adobe Community',
                        unsplash: 'Unsplash',
                        etsy: 'Etsy',
                        amazon: 'Amazon Seller Central',
                        shopify: 'Shopify Community',
                        woocommerce: 'WooCommerce'
                    };
                    
                    fallbackPlatforms[platform] = {
                        platformName: platformNames[platform] || platform,
                        score: 3,
                        summary: 'Analysis unavailable. Fallback assessment shows moderate potential.',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                        contentSuggestion: `Share your idea on ${platformNames[platform] || platform}.`
                    };
                }
            });

            return {
                idea: content,
                demandScore: 50,
                scoreJustification: 'Analysis temporarily unavailable',
                language: isTurkish ? 'Turkish' : 'English',
                fallbackUsed: true,
                platformAnalyses: fallbackPlatforms,
                tweetSuggestion: `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: 'Looking for feedback on my startup idea',
                redditBodySuggestion: `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
                linkedinSuggestion: `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`,
                
                // Fallback analysis components
                marketIntelligence: {
                    tam: '$1.5B Market Size',
                    sam: '$300M Addressable',
                    som: '$8M Obtainable',
                    growthRate: '12% YoY',
                    marketTiming: 3,
                    keyTrends: ['Market growth', 'Technology adoption', 'User demand']
                },
                
                competitiveLandscape: {
                    directCompetitors: ['Market Leader', 'Emerging Player', 'Niche Solution'],
                    indirectCompetitors: ['Alternative A', 'Alternative B'],
                    marketPosition: 'Competitive Market',
                    differentiationScore: 6,
                    competitiveMoat: 'Unique value proposition',
                    entryBarriers: 'Market competition'
                },
                
                revenueModel: {
                    primaryModel: 'Subscription Model',
                    pricePoint: '$19/month',
                    revenueStreams: ['Monthly subscriptions', 'Annual plans', 'Add-ons'],
                    breakEvenTimeline: '24 months',
                    ltvCacRatio: '3.5x',
                    projectedMrr: '$15K by Year 1'
                },
                
                targetAudience: {
                    primarySegment: 'Target users (50%)',
                    secondarySegment: 'Secondary market (30%)',
                    tertiarySegment: 'Niche segment (20%)',
                    painPoints: ['Common problem', 'User frustration', 'Market gap'],
                    willingnessToPay: 'Moderate ($15-30/month)',
                    customerAcquisitionChannels: ['Online marketing', 'Word of mouth', 'Partnerships']
                },
                
                riskAssessment: {
                    technicalRisk: 'Medium',
                    marketRisk: 'Medium',
                    financialRisk: 'Medium',
                    regulatoryRisk: 'Low',
                    overallRiskLevel: 'Medium',
                    mitigationStrategies: ['Risk planning', 'Market validation', 'Financial management']
                },
                
                goToMarket: {
                    phase1: 'Initial launch strategy',
                    phase2: 'Growth and scaling',
                    phase3: 'Market expansion',
                    timeline: '18-month plan',
                    budgetNeeded: '$75K initial',
                    keyChannels: ['Digital channels', 'Content marketing', 'User acquisition']
                },
                
                developmentRoadmap: {
                    mvpTimeline: '4 months',
                    betaLaunch: '6 months',
                    publicLaunch: '10 months',
                    keyFeatures: ['Basic features', 'User interface', 'Core functionality'],
                    teamNeeded: ['Technical lead', 'Product manager', 'Marketing specialist'],
                    techStack: ['Modern framework', 'Cloud infrastructure', 'Database']
                },
                
                productMarketFit: {
                    problemSolutionFit: 65,
                    solutionMarketFit: 60,
                    earlyAdopterSignals: 'Moderate user interest',
                    retentionPrediction: '60% retention rate',
                    viralCoefficient: '1.1x growth factor',
                    pmfIndicators: ['User feedback', 'Market response', 'Growth metrics']
                }
            };
        }
    } catch (error) {
        console.error('❌ Simplified AI analysis failed:', error);
        throw error;
    }
}


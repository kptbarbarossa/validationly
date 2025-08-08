import { GoogleGenAI, Type } from "@google/genai";

// Dynamic prompt-based AI analysis system

// Embedded Prompt Manager for server-side usage
interface PromptSelection {
    basePrompt: string;
    sectorPrompts: string[];
    analysisPrompts: string[];
    confidence: number;
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
        ]
    };

    // Sector-specific platform mapping (Phase 2)
    private sectorPlatforms = {
        saas: ['github', 'stackoverflow', 'producthunt', 'hackernews'],
        ecommerce: ['instagram', 'tiktok', 'pinterest', 'facebook'],
        fintech: ['angellist', 'crunchbase', 'linkedin', 'medium'],
        design: ['dribbble', 'behance', 'figma', 'instagram'],
        marketplace: ['producthunt', 'angellist', 'crunchbase', 'linkedin'],
        mobile: ['producthunt', 'github', 'reddit', 'hackernews']
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
        const analysisPrompts = analysisTypes.map(analysis => this.prompts[`${analysis}-opportunity`]).filter(p => p);

        return {
            basePrompt,
            sectorPrompts,
            analysisPrompts,
            confidence: this.calculateConfidence(sectors, analysisTypes),
            sectorsDetected: sectors
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
}

interface PlatformAnalysis {
    platformName: string;
    score: number; // 1-5 simple score
    summary: string; // 2-3 sentence simple explanation
    keyFindings: string[]; // 2-3 key findings
    contentSuggestion: string; // Platform-specific content suggestion
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

        const { idea, content } = req.body;
        const inputContent = idea || content;

        // Input validation
        if (!inputContent) {
            return res.status(400).json({
                message: 'Idea or content is required'
            });
        }
        validateInput(inputContent);

        // Dynamic prompt selection based on input
        const promptSelection = await promptManager.selectPrompts(inputContent);
        const systemInstruction = promptManager.combinePrompts(promptSelection);

        console.log(`🎯 Selected prompts - Sectors: ${promptSelection.sectorPrompts.length}, Analysis: ${promptSelection.analysisPrompts.length}, Confidence: ${promptSelection.confidence}`);

        // Add language and format requirements
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

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Provide REAL market data, not generic examples
        - Reference actual competitors and market conditions
        - Give specific numbers based on industry knowledge
        - Make all suggestions actionable and data-driven
        - All content must feel authentic and valuable to entrepreneurs

        Analyze the following startup idea: "${inputContent}"`;

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
                        maxOutputTokens: 4096, // Increased for comprehensive analysis
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
                            maxOutputTokens: 4096, // Increased for comprehensive analysis
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

        // Use simplified analysis approach with dynamic prompts
        const result = await getSimplifiedAIAnalysis(inputContent, finalSystemInstruction);

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
async function getSimplifiedAIAnalysis(content: string, systemInstruction: string): Promise<DynamicPromptResult> {
    // Use the dynamic system instruction passed from the main function

    try {
        console.log('🎯 Using single AI call with dynamic prompt system...');
        console.log('📝 System instruction length:', systemInstruction.length);
        console.log('🎯 Input content:', content);

        // Simple language detection
        const isTurkish = /[çğıöşüÇĞIİÖŞÜ]/.test(content) || /\b(bir|bu|için|ile|olan|var|çok|iyi|yeni)\b/i.test(content);
        const language = isTurkish ? 'Turkish' : 'English';
        const languageInstruction = `RESPOND IN ${language.toUpperCase()} ONLY. All text fields must be in ${language}.`;

        // Detect sector and get relevant platforms
        const sectors = promptManager.detectSector(content);
        const relevantPlatforms = promptManager.getSectorSpecificPlatforms(sectors);
        
        console.log(`🎯 Detected sectors: ${sectors.join(', ')}`);
        console.log(`📱 Relevant platforms: ${relevantPlatforms.join(', ')}`);

        // Single comprehensive AI analysis using our dynamic prompt system
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `${languageInstruction}\n\nANALYZE THIS STARTUP IDEA: "${content}"\n\n🎯 DETECTED SECTORS: ${sectors.join(', ')}\n📱 FOCUS PLATFORMS: ${relevantPlatforms.join(', ')}\n\nProvide comprehensive business analysis including:
            - Market sizing (TAM/SAM/SOM) with real industry data
            - Competitive landscape with actual competitor names
            - Revenue model with realistic pricing recommendations
            - Target audience with specific customer segments
            - Risk assessment across all business dimensions
            - Go-to-market strategy with actionable phases
            - Development roadmap with realistic timelines
            - Product-market fit indicators and predictions
            - SECTOR-SPECIFIC platform analysis for: ${relevantPlatforms.join(', ')}
            - Content suggestions optimized for each relevant platform
            
            PLATFORM ANALYSIS PRIORITY:
            ${sectors.includes('saas') ? '- GitHub: Developer community engagement, open source strategy' : ''}
            ${sectors.includes('saas') ? '- Stack Overflow: Technical community validation' : ''}
            ${sectors.includes('ecommerce') ? '- Instagram: Visual product showcase, influencer marketing' : ''}
            ${sectors.includes('ecommerce') ? '- Pinterest: Product discovery, visual search' : ''}
            ${sectors.includes('fintech') ? '- AngelList: Investor relations, startup ecosystem' : ''}
            ${sectors.includes('fintech') ? '- Crunchbase: Market intelligence, competitor tracking' : ''}
            ${sectors.includes('design') ? '- Dribbble: Design community showcase' : ''}
            ${sectors.includes('design') ? '- Behance: Portfolio presentation' : ''}
            ${sectors.includes('design') ? '- Figma: Design tool integration community' : ''}`,
            config: {
                systemInstruction: systemInstruction + `\n\nRESPONSE FORMAT: Return JSON with this exact structure including ALL relevant platforms:
                {
                    "idea": "${content}",
                    "demandScore": number (0-100),
                    "scoreJustification": "short justification phrase",
                    "platformAnalyses": {
                        "twitter": { "platformName": "Twitter", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },
                        "reddit": { "platformName": "Reddit", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },
                        "linkedin": { "platformName": "LinkedIn", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },
                        ${relevantPlatforms.includes('github') ? '"github": { "platformName": "GitHub", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('stackoverflow') ? '"stackoverflow": { "platformName": "Stack Overflow", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('instagram') ? '"instagram": { "platformName": "Instagram", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('pinterest') ? '"pinterest": { "platformName": "Pinterest", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('angellist') ? '"angellist": { "platformName": "AngelList", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('crunchbase') ? '"crunchbase": { "platformName": "Crunchbase", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('dribbble') ? '"dribbble": { "platformName": "Dribbble", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('behance') ? '"behance": { "platformName": "Behance", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        ${relevantPlatforms.includes('figma') ? '"figma": { "platformName": "Figma Community", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" },' : ''}
                        "producthunt": { "platformName": "Product Hunt", "score": number (1-5), "summary": "analysis", "keyFindings": ["finding1", "finding2"], "contentSuggestion": "suggestion" }
                    },
                    "tweetSuggestion": "optimized Twitter post",
                    "redditTitleSuggestion": "compelling Reddit title",
                    "redditBodySuggestion": "detailed Reddit post body",
                    "linkedinSuggestion": "professional LinkedIn post"
                }`,
                responseMimeType: "application/json",
                temperature: 0.3,
                maxOutputTokens: 2048,
            }
        });

        const responseText = result.text?.trim();
        if (!responseText) {
            throw new Error('Empty response from AI analysis');
        }

        const parsedResult = JSON.parse(responseText);

        // Validate and clean the result
        const cleanResult: DynamicPromptResult = {
            idea: parsedResult.idea || content,
            demandScore: Math.max(0, Math.min(100, parsedResult.demandScore || 65)),
            scoreJustification: parsedResult.scoreJustification || 'Market analysis completed',
            platformAnalyses: {
                twitter: {
                    platformName: 'Twitter',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.twitter?.score || 3)),
                    summary: parsedResult.platformAnalyses?.twitter?.summary || 'Twitter analysis shows moderate potential.',
                    keyFindings: parsedResult.platformAnalyses?.twitter?.keyFindings || ['Analysis completed', 'Moderate engagement potential', 'Content strategy recommended'],
                    contentSuggestion: parsedResult.platformAnalyses?.twitter?.contentSuggestion || 'Share your idea on Twitter for feedback.'
                },
                reddit: {
                    platformName: 'Reddit',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.reddit?.score || 3)),
                    summary: parsedResult.platformAnalyses?.reddit?.summary || 'Reddit communities show moderate interest.',
                    keyFindings: parsedResult.platformAnalyses?.reddit?.keyFindings || ['Community engagement possible', 'Discussion potential identified', 'Subreddit targeting recommended'],
                    contentSuggestion: parsedResult.platformAnalyses?.reddit?.contentSuggestion || 'Post in relevant subreddits for detailed feedback.'
                },
                linkedin: {
                    platformName: 'LinkedIn',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.linkedin?.score || 3)),
                    summary: parsedResult.platformAnalyses?.linkedin?.summary || 'LinkedIn shows professional networking potential.',
                    keyFindings: parsedResult.platformAnalyses?.linkedin?.keyFindings || ['Professional audience alignment', 'B2B networking opportunities', 'Thought leadership potential'],
                    contentSuggestion: parsedResult.platformAnalyses?.linkedin?.contentSuggestion || 'Share professionally on LinkedIn for business feedback.'
                },
                instagram: {
                    platformName: 'Instagram',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.instagram?.score || 3)),
                    summary: parsedResult.platformAnalyses?.instagram?.summary || 'Instagram shows visual content potential.',
                    keyFindings: parsedResult.platformAnalyses?.instagram?.keyFindings || ['Visual storytelling opportunity', 'Influencer marketing potential', 'Story engagement'],
                    contentSuggestion: parsedResult.platformAnalyses?.instagram?.contentSuggestion || 'Create visual content showcasing your idea.'
                },
                tiktok: {
                    platformName: 'TikTok',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.tiktok?.score || 3)),
                    summary: parsedResult.platformAnalyses?.tiktok?.summary || 'TikTok shows viral content potential.',
                    keyFindings: parsedResult.platformAnalyses?.tiktok?.keyFindings || ['Gen Z audience reach', 'Viral potential', 'Short-form content'],
                    contentSuggestion: parsedResult.platformAnalyses?.tiktok?.contentSuggestion || 'Create engaging short videos about your concept.'
                },
                youtube: {
                    platformName: 'YouTube',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.youtube?.score || 3)),
                    summary: parsedResult.platformAnalyses?.youtube?.summary || 'YouTube shows educational content potential.',
                    keyFindings: parsedResult.platformAnalyses?.youtube?.keyFindings || ['Long-form content opportunity', 'Tutorial potential', 'Subscriber growth'],
                    contentSuggestion: parsedResult.platformAnalyses?.youtube?.contentSuggestion || 'Create educational videos about your solution.'
                },
                facebook: {
                    platformName: 'Facebook',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.facebook?.score || 3)),
                    summary: parsedResult.platformAnalyses?.facebook?.summary || 'Facebook shows community building potential.',
                    keyFindings: parsedResult.platformAnalyses?.facebook?.keyFindings || ['Community groups', 'Event promotion', 'Older demographics'],
                    contentSuggestion: parsedResult.platformAnalyses?.facebook?.contentSuggestion || 'Join relevant Facebook groups and communities.'
                },
                producthunt: {
                    platformName: 'Product Hunt',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.producthunt?.score || 4)),
                    summary: parsedResult.platformAnalyses?.producthunt?.summary || 'Product Hunt shows strong launch potential.',
                    keyFindings: parsedResult.platformAnalyses?.producthunt?.keyFindings || ['Tech community focus', 'Launch platform', 'Early adopter audience'],
                    contentSuggestion: parsedResult.platformAnalyses?.producthunt?.contentSuggestion || 'Prepare for Product Hunt launch with compelling story.'
                },
                hackernews: {
                    platformName: 'Hacker News',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.hackernews?.score || 3)),
                    summary: parsedResult.platformAnalyses?.hackernews?.summary || 'Hacker News shows developer community interest.',
                    keyFindings: parsedResult.platformAnalyses?.hackernews?.keyFindings || ['Developer audience', 'Technical discussion', 'Open source potential'],
                    contentSuggestion: parsedResult.platformAnalyses?.hackernews?.contentSuggestion || 'Share technical insights and development journey.'
                },
                medium: {
                    platformName: 'Medium',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.medium?.score || 3)),
                    summary: parsedResult.platformAnalyses?.medium?.summary || 'Medium shows thought leadership potential.',
                    keyFindings: parsedResult.platformAnalyses?.medium?.keyFindings || ['Long-form content', 'Professional audience', 'SEO benefits'],
                    contentSuggestion: parsedResult.platformAnalyses?.medium?.contentSuggestion || 'Write detailed articles about your industry insights.'
                },
                discord: {
                    platformName: 'Discord',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.discord?.score || 3)),
                    summary: parsedResult.platformAnalyses?.discord?.summary || 'Discord shows community building potential.',
                    keyFindings: parsedResult.platformAnalyses?.discord?.keyFindings || ['Real-time engagement', 'Community building', 'Niche audiences'],
                    contentSuggestion: parsedResult.platformAnalyses?.discord?.contentSuggestion || 'Join relevant Discord servers and engage with communities.'
                },
                github: {
                    platformName: 'GitHub',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.github?.score || 3)),
                    summary: parsedResult.platformAnalyses?.github?.summary || 'GitHub shows open source potential.',
                    keyFindings: parsedResult.platformAnalyses?.github?.keyFindings || ['Developer community', 'Open source opportunity', 'Technical credibility'],
                    contentSuggestion: parsedResult.platformAnalyses?.github?.contentSuggestion || 'Create open source tools or documentation.'
                },
                dribbble: {
                    platformName: 'Dribbble',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.dribbble?.score || 3)),
                    summary: parsedResult.platformAnalyses?.dribbble?.summary || 'Dribbble shows design community potential.',
                    keyFindings: parsedResult.platformAnalyses?.dribbble?.keyFindings || ['Design community', 'Portfolio showcase', 'Creative feedback'],
                    contentSuggestion: parsedResult.platformAnalyses?.dribbble?.contentSuggestion || 'Share design concepts and get creative feedback.'
                },
                angellist: {
                    platformName: 'AngelList',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.angellist?.score || 4)),
                    summary: parsedResult.platformAnalyses?.angellist?.summary || 'AngelList shows investor network potential.',
                    keyFindings: parsedResult.platformAnalyses?.angellist?.keyFindings || ['Investor network', 'Startup ecosystem', 'Funding opportunities'],
                    contentSuggestion: parsedResult.platformAnalyses?.angellist?.contentSuggestion || 'Create compelling startup profile for investors.'
                },
                crunchbase: {
                    platformName: 'Crunchbase',
                    score: Math.max(1, Math.min(5, parsedResult.platformAnalyses?.crunchbase?.score || 3)),
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

        console.log('✅ Single AI call analysis completed');
        return cleanResult;

    } catch (error) {
        console.log('❌ Platform analysis failed, using fallback...', error);

        // Detect language for fallback
        const isTurkish = /[çğıöşüÇĞIİÖŞÜ]/.test(content) ||
            /\b(bir|bu|şu|için|ile|olan|var|yok|çok|az|büyük|küçük|iyi|kötü|yeni|eski)\b/i.test(content);

        if (isTurkish) {
            // Turkish fallback
            return {
                idea: content,
                demandScore: 65,
                scoreJustification: 'Sınırlı veri ile analiz tamamlandı',
                platformAnalyses: {
                    twitter: {
                        platformName: 'Twitter',
                        score: 3,
                        summary: 'Twitter analizi geçici olarak kullanılamıyor. Orta düzey potansiyel tahmin ediliyor.',
                        keyFindings: ['Analiz kullanılamıyor', 'Yedek değerlendirme', 'Orta potansiyel'],
                        contentSuggestion: 'Fikrinizi Twitter\'da paylaşarak geri bildirim alın.'
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
                platformAnalyses: {
                    twitter: {
                        platformName: 'Twitter',
                        score: 3,
                        summary: 'Twitter analysis temporarily unavailable. Moderate potential estimated.',
                        keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate potential'],
                        contentSuggestion: 'Share your idea on Twitter to get feedback.'
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
                        contentSuggestion: parsedResult.platformAnalyses?.linkedin?.contentSuggestion || 'Share with your professional network on LinkedIn.'
                    }
                },
                tweetSuggestion: parsedResult.tweetSuggestion || `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: parsedResult.redditTitleSuggestion || 'Looking for feedback on my startup idea',
                redditBodySuggestion: parsedResult.redditBodySuggestion || `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
                linkedinSuggestion: parsedResult.linkedinSuggestion || `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`
            };

        } catch (error) {
            console.error('❌ AI analysis failed:', error);
            
            // Return fallback result with sector-specific platforms
            const sectors = promptManager.detectSector(content);
            const relevantPlatforms = promptManager.getSectorSpecificPlatforms(sectors);
            
            const fallbackPlatforms: any = {
                twitter: {
                    platformName: 'Twitter',
                    score: 3,
                    summary: 'Analysis unavailable. Fallback assessment shows moderate potential.',
                    keyFindings: ['Analysis unavailable', 'Fallback assessment', 'Moderate business potential'],
                    contentSuggestion: 'Share your startup idea on Twitter!'
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
                        github: 'GitHub',
                        stackoverflow: 'Stack Overflow',
                        instagram: 'Instagram',
                        pinterest: 'Pinterest',
                        angellist: 'AngelList',
                        crunchbase: 'Crunchbase',
                        dribbble: 'Dribbble',
                        behance: 'Behance',
                        figma: 'Figma Community',
                        producthunt: 'Product Hunt'
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
                platformAnalyses: fallbackPlatforms,
                tweetSuggestion: `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: 'Looking for feedback on my startup idea',
                redditBodySuggestion: `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
                linkedinSuggestion: `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`
            };
        }
    } catch (error) {
        console.error('❌ Simplified AI analysis failed:', error);
        throw error;
    }
}


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

    async selectPrompts(input: string): Promise<PromptSelection> {
        const sectors = this.detectSector(input);
        const analysisTypes = this.detectAnalysisNeeds(input);
        
        const basePrompt = this.prompts['base-analyst'];
        const sectorPrompts = sectors.map(sector => this.prompts[`${sector}-sector`]).filter(p => p);
        const analysisPrompts = analysisTypes.map(analysis => this.prompts[`${analysis}-opportunity`]).filter(p => p);
        
        return {
            basePrompt,
            sectorPrompts,
            analysisPrompts,
            confidence: this.calculateConfidence(sectors, analysisTypes)
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
        - DETECT the language of the user's input content
        - RESPOND in the EXACT SAME LANGUAGE throughout your ENTIRE response
        - If input is in Turkish → ALL fields must be in Turkish
        - If input is in English → ALL fields must be in English  
        - This applies to ALL text fields
        - NO MIXING of languages - maintain consistency across all fields

        ANALYSIS METHODOLOGY:
        1. Demand Score (0-100): Overall market demand assessment
        2. Platform Analysis: Analyze X, Reddit, LinkedIn market signals
        3. Content Suggestions: Create platform-optimized versions

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Write detailed, insightful summaries that sound like real market research
        - Make suggestions actionable and platform-appropriate
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
                        systemInstruction: finalSystemInstruction + `\n\nRESPONSE FORMAT RULES:\n- You MUST respond with ONLY valid JSON\n- No markdown code blocks (no \`\`\`json)\n- No explanations or text outside JSON\n- Start with { and end with }\n- Include ALL required schema fields`,
                        responseMimeType: "application/json",
                        responseSchema: legacyResponseSchema,
                        temperature: 0.3,
                        maxOutputTokens: 2048,
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
                            systemInstruction: finalSystemInstruction + `\n\nRESPONSE FORMAT RULES:\n- You MUST respond with ONLY valid JSON\n- No markdown code blocks (no \`\`\`json)\n- No explanations or text outside JSON\n- Start with { and end with }\n- Include ALL required schema fields`,
                            responseMimeType: "application/json",
                            responseSchema: legacyResponseSchema,
                            temperature: 0.3,
                            maxOutputTokens: 2048,
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

        // Convert to legacy format for backward compatibility
        const legacyResult = convertToLegacyFormat(result);

        console.log('✅ Simplified validation completed successfully');
        return res.status(200).json(legacyResult);

    } catch (error) {
        console.error('❌ Simplified validation error:', error);
        
        // Return simplified error response
        return res.status(500).json({
            message: 'Analysis failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Platform-specific AI analysis functions
async function analyzePlatform(content: string, platform: 'twitter' | 'reddit' | 'linkedin'): Promise<SimplePlatformAnalysis> {
    const platformPrompts = {
        twitter: `Analyze this startup idea for Twitter/X platform:
        
        Consider:
        - Viral potential and trend alignment
        - How tech Twitter would react
        - Hashtag opportunities
        - Expected engagement and reach
        - Audience reaction predictions
        
        Provide a simple 1-5 score and 2-3 sentence summary in plain language.
        Focus on practical insights about Twitter performance.`,
        
        reddit: `Analyze this startup idea for Reddit communities:
        
        Consider:
        - Community fit across relevant subreddits (r/entrepreneur, r/startups, etc.)
        - Discussion potential and engagement
        - Expected sentiment from Reddit users
        - Subreddit recommendations
        - Community concerns and questions
        
        Provide a simple 1-5 score and 2-3 sentence summary in plain language.
        Focus on how Reddit communities would receive this idea.`,
        
        linkedin: `Analyze this startup idea for LinkedIn professional network:
        
        Consider:
        - Professional relevance and business potential
        - Networking value and B2B opportunities
        - Target professional audience
        - Business development potential
        - Industry connections and partnerships
        
        Provide a simple 1-5 score and 2-3 sentence summary in plain language.
        Focus on professional and business networking aspects.`
    };

    const systemInstruction = `You are analyzing a startup idea for ${platform}. ${platformPrompts[platform]}

    🌍 LANGUAGE REQUIREMENT: Respond in the EXACT SAME LANGUAGE as the user's input.
    
    Return a JSON object with:
    {
        "platformName": "${platform === 'twitter' ? 'Twitter' : platform === 'reddit' ? 'Reddit' : 'LinkedIn'}",
        "score": number (1-5),
        "summary": "2-3 sentence summary in simple language",
        "keyFindings": ["finding1", "finding2", "finding3"],
        "contentSuggestion": "Platform-specific content suggestion"
    }`;

    try {
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `ANALYZE FOR ${platform.toUpperCase()}: "${content}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.3,
                maxOutputTokens: 1024,
            }
        });

        const responseText = result.text?.trim();
        if (!responseText) {
            throw new Error(`Empty response from AI for ${platform}`);
        }

        const parsedResult = JSON.parse(responseText);
        
        // Ensure score is within 1-5 range
        parsedResult.score = Math.max(1, Math.min(5, parsedResult.score || 3));
        
        return parsedResult;

    } catch (error) {
        console.log(`❌ ${platform} analysis failed, using fallback...`, error);
        
        // Fallback analysis
        return {
            platformName: platform === 'twitter' ? 'Twitter' : platform === 'reddit' ? 'Reddit' : 'LinkedIn',
            score: 3,
            summary: `Analysis for ${platform} is temporarily unavailable. This idea shows moderate potential for the platform.`,
            keyFindings: [
                'Platform analysis temporarily unavailable',
                'Using fallback assessment',
                'Moderate potential estimated'
            ],
            contentSuggestion: `Share your idea on ${platform} to get community feedback.`
        };
    }
}

// Simplified AI analysis using only Gemini 2.0
async function getSimplifiedAIAnalysis(content: string, systemInstruction: string): Promise<DynamicPromptResult> {
    // Use the dynamic system instruction passed from the main function

    try {
        console.log('🎯 Using simplified platform-specific analysis...');
        
        // Run platform analyses in parallel
        const [twitterAnalysis, redditAnalysis, linkedinAnalysis] = await Promise.all([
            analyzePlatform(content, 'twitter'),
            analyzePlatform(content, 'reddit'),
            analyzePlatform(content, 'linkedin')
        ]);

        // Get overall analysis for demand score and content suggestions
        const aiInstance = getAI();
        const overallResult = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `ANALYZE THIS STARTUP IDEA: "${content}"\n\n🌍 LANGUAGE REMINDER: You MUST respond in the EXACT SAME LANGUAGE as the user's input.\n\nProvide overall demand score and content suggestions.`,
            config: {
                systemInstruction: `Analyze this startup idea and provide:
                1. Overall demand score (0-100)
                2. Score justification (short phrase)
                3. Content suggestions for each platform
                
                🌍 LANGUAGE REQUIREMENT: Respond in the EXACT SAME LANGUAGE as the user's input.
                
                Return JSON with:
                {
                    "demandScore": number (0-100),
                    "scoreJustification": "short justification phrase",
                    "tweetSuggestion": "optimized Twitter post",
                    "redditTitleSuggestion": "compelling Reddit title",
                    "redditBodySuggestion": "detailed Reddit post body",
                    "linkedinSuggestion": "professional LinkedIn post"
                }`,
                responseMimeType: "application/json",
                temperature: 0.3,
                maxOutputTokens: 1024,
            }
        });

        const overallResponseText = overallResult.text?.trim();
        if (!overallResponseText) {
            throw new Error('Empty response from overall analysis');
        }

        const overallParsed = JSON.parse(overallResponseText);

        // Combine results
        const result: SimplifiedValidationResult = {
            idea: content,
            demandScore: Math.max(0, Math.min(100, overallParsed.demandScore || 65)),
            scoreJustification: overallParsed.scoreJustification || 'Market analysis completed',
            platformAnalyses: {
                twitter: twitterAnalysis,
                reddit: redditAnalysis,
                linkedin: linkedinAnalysis
            },
            tweetSuggestion: overallParsed.tweetSuggestion || 'Share your startup idea on Twitter!',
            redditTitleSuggestion: overallParsed.redditTitleSuggestion || 'Looking for feedback on my startup idea',
            redditBodySuggestion: overallParsed.redditBodySuggestion || 'I would love to get your thoughts on this concept.',
            linkedinSuggestion: overallParsed.linkedinSuggestion || 'Excited to share this new business concept with my network.'
        };

        console.log('✅ Simplified platform-specific analysis completed');
        return result;

    } catch (error) {
        console.log('❌ Platform analysis failed, using fallback...', error);

        // Fallback analysis
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
                    contentSuggestion: 'Share with your professional network on LinkedIn.'
                }
            },
            tweetSuggestion: `🚀 Working on a new idea: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
            redditTitleSuggestion: 'Looking for feedback on my startup idea',
            redditBodySuggestion: `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community.`,
            linkedinSuggestion: `Exploring a new business opportunity: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others in this space.`
        };
    }
}

// Convert simplified result to legacy format for backward compatibility
function convertToLegacyFormat(simplified: SimplifiedValidationResult): ValidationResult {
    return {
        idea: simplified.idea,
        content: simplified.content,
        demandScore: simplified.demandScore,
        scoreJustification: simplified.scoreJustification,
        signalSummary: [
            {
                platform: 'Twitter',
                summary: simplified.platformAnalyses.twitter.summary
            },
            {
                platform: 'Reddit', 
                summary: simplified.platformAnalyses.reddit.summary
            },
            {
                platform: 'LinkedIn',
                summary: simplified.platformAnalyses.linkedin.summary
            }
        ],
        tweetSuggestion: simplified.tweetSuggestion,
        redditTitleSuggestion: simplified.redditTitleSuggestion,
        redditBodySuggestion: simplified.redditBodySuggestion,
        linkedinSuggestion: simplified.linkedinSuggestion
    };
}


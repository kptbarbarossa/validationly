
import { GoogleGenAI, Type } from "@google/genai";

// Rate limiting için basit bir in-memory store
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 dakika
const MAX_REQUESTS_PER_WINDOW = 50; // Normal limit
const SUSPICIOUS_THRESHOLD = 5; // Şüpheli aktivite eşiği

// Rate limiting kontrolü
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userRequests = requestCounts.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    // Şüpheli aktivite kontrolü - çok hızlı istekler
    if (userRequests.count >= SUSPICIOUS_THRESHOLD &&
        (now - (userRequests.resetTime - RATE_LIMIT_WINDOW)) < 60000) { // 1 dakikada 5+ istek
        console.warn(`Suspicious activity detected from IP: ${ip}`);
        // Daha sıkı limit uygula
        return userRequests.count < SUSPICIOUS_THRESHOLD * 2;
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
    if (apiKey.length < 10) {
        throw new Error("Invalid API key format");
    }
    return apiKey;
}

// Input validation - now supports both ideas and content
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

    // Gelişmiş XSS ve injection koruması
    const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
            throw new Error("Invalid input detected");
        }
    }

    // SQL injection koruması
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
        /(--|\/\*|\*\/|;)/g,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
    ];

    for (const pattern of sqlPatterns) {
        if (pattern.test(content)) {
            throw new Error("Invalid input detected");
        }
    }
}

// Advanced Analytics Engine with Self-Learning
interface AnalyticsMemory {
    contentPatterns: Map<string, number>;
    successfulFormats: Map<string, number>;
    viralTriggers: Map<string, number>;
    seasonalTrends: Map<string, { month: number; score: number }[]>;
    languagePatterns: Map<string, { engagement: number; clarity: number }>;
}

const analyticsMemory: AnalyticsMemory = {
    contentPatterns: new Map(),
    successfulFormats: new Map(),
    viralTriggers: new Map(),
    seasonalTrends: new Map(),
    languagePatterns: new Map()
};

// AI instance will be created when needed
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: validateApiKey() });
    }
    return ai;
}

// Advanced Content Analysis Functions
function analyzeContentComplexity(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    const longWords = words.filter(w => w.length > 6).length;
    const complexityScore = Math.min(100, (avgWordsPerSentence * 2) + (longWords / words.length * 50));
    return Math.round(complexityScore);
}

function detectEmotionalTriggers(content: string): string[] {
    const emotionalWords = {
        excitement: ['amazing', 'incredible', 'fantastic', 'awesome', 'revolutionary', 'breakthrough'],
        urgency: ['now', 'today', 'immediately', 'urgent', 'limited', 'exclusive'],
        curiosity: ['secret', 'hidden', 'unknown', 'mystery', 'discover', 'reveal'],
        social: ['everyone', 'people', 'community', 'together', 'share', 'connect'],
        achievement: ['success', 'win', 'achieve', 'accomplish', 'master', 'expert']
    };

    const triggers: string[] = [];
    const lowerContent = content.toLowerCase();

    Object.entries(emotionalWords).forEach(([emotion, words]) => {
        if (words.some(word => lowerContent.includes(word))) {
            triggers.push(emotion);
        }
    });

    return triggers;
}

function calculateViralPotential(content: string, contentType: string): number {
    let score = 0;

    // Length optimization
    if (contentType === 'social_content') {
        if (content.length >= 50 && content.length <= 280) score += 20;
        else if (content.length <= 50) score += 10;
    }

    // Emotional triggers
    const triggers = detectEmotionalTriggers(content);
    score += triggers.length * 5;

    // Question marks (engagement)
    const questions = (content.match(/\?/g) || []).length;
    score += Math.min(questions * 10, 20);

    // Hashtags and mentions
    const hashtags = (content.match(/#\w+/g) || []).length;
    const mentions = (content.match(/@\w+/g) || []).length;
    score += Math.min((hashtags + mentions) * 5, 15);

    // Emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = (content.match(emojiRegex) || []).length;
    score += Math.min(emojis * 3, 15);

    return Math.min(score, 100);
}

function analyzeMarketSaturation(content: string, contentType: string): number {
    // Simulated market saturation analysis
    const commonKeywords = ['ai', 'app', 'platform', 'solution', 'service', 'tool'];
    const contentLower = content.toLowerCase();
    const commonCount = commonKeywords.filter(keyword => contentLower.includes(keyword)).length;

    // Higher common keyword count = higher saturation = lower score
    const saturationPenalty = commonCount * 5;
    const baseScore = contentType === 'startup_idea' ? 15 : 20;

    return Math.max(5, baseScore - saturationPenalty);
}

function predictOptimalTiming(content: string, contentType: string): string {
    const currentMonth = new Date().getMonth();
    const timeOfDay = new Date().getHours();

    // Content type specific timing
    if (contentType === 'social_content') {
        if (timeOfDay >= 9 && timeOfDay <= 11) return "Şimdi (sabah prime time)";
        if (timeOfDay >= 19 && timeOfDay <= 21) return "Bu akşam (akşam prime time)";
        return "Yarın sabah 9-11 arası";
    }

    if (contentType === 'startup_idea') {
        if (currentMonth >= 0 && currentMonth <= 2) return "Q2 2025 (yatırım sezonu)";
        if (currentMonth >= 8 && currentMonth <= 10) return "Ocak 2026 (yeni yıl motivasyonu)";
        return "Sonraki çeyrek";
    }

    return "Hemen şimdi";
}

const platformSignalSchema = {
    type: Type.OBJECT,
    properties: {
        platform: { type: Type.STRING, enum: ['X', 'Reddit', 'LinkedIn', 'General'] },
        summary: { type: Type.STRING, description: "A detailed, multi-sentence analysis of market signals from this platform including specific trends, user behaviors, pain points, and opportunities." }
    },
    required: ["platform", "summary"]
};

// Advanced Content Quality Analysis Schema
const contentQualitySchema = {
    type: Type.OBJECT,
    properties: {
        writingQuality: { type: Type.INTEGER, description: "Writing quality score (0-100)" },
        engagementPotential: { type: Type.INTEGER, description: "Potential for engagement (0-100)" },
        viralityScore: { type: Type.INTEGER, description: "Viral potential score (0-100)" },
        grammarScore: { type: Type.INTEGER, description: "Grammar and language quality (0-100)" },
        clarityScore: { type: Type.INTEGER, description: "Message clarity and understanding (0-100)" },
        emotionalImpact: { type: Type.INTEGER, description: "Emotional resonance score (0-100)" },
        psychologicalTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detected psychological triggers" },
        readabilityIndex: { type: Type.INTEGER, description: "Content readability score (0-100)" },
        memorabilityScore: { type: Type.INTEGER, description: "How memorable this content is (0-100)" },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific improvement suggestions" }
    },
    required: ["writingQuality", "engagementPotential", "viralityScore", "grammarScore", "clarityScore", "emotionalImpact", "psychologicalTriggers", "readabilityIndex", "memorabilityScore", "improvements"]
};

// Advanced Market Intelligence Schema
const marketIntelligenceSchema = {
    type: Type.OBJECT,
    properties: {
        competitorGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Identified market gaps" },
        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risk factors" },
        opportunityScore: { type: Type.INTEGER, description: "Market opportunity score (0-100)" },
        disruptionPotential: { type: Type.INTEGER, description: "Potential to disrupt existing market (0-100)" },
        scalabilityIndex: { type: Type.INTEGER, description: "How scalable this idea/content is (0-100)" }
    },
    required: ["competitorGaps", "riskFactors", "opportunityScore", "disruptionPotential", "scalabilityIndex"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: "The original content/idea analyzed" },
        contentType: { type: Type.STRING, enum: ["startup_idea", "social_content", "product_idea", "general_content"], description: "Type of content being analyzed" },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand or content appeal." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score, e.g., 'Strong Niche Interest' or 'High Engagement Potential'." },
        confidenceLevel: { type: Type.INTEGER, description: "AI confidence in this analysis (0-100)" },
        scoreBreakdown: {
            type: Type.OBJECT,
            properties: {
                marketSize: { type: Type.INTEGER, description: "Market size potential or audience reach (0-25)" },
                competition: { type: Type.INTEGER, description: "Competition level or content saturation (0-25)" },
                trendMomentum: { type: Type.INTEGER, description: "Current trend momentum or topic relevance (0-25)" },
                feasibility: { type: Type.INTEGER, description: "Execution feasibility or content quality (0-25)" }
            },
            required: ["marketSize", "competition", "trendMomentum", "feasibility"]
        },
        marketTiming: {
            type: Type.OBJECT,
            properties: {
                readiness: { type: Type.INTEGER, description: "Market/audience readiness score (0-100)" },
                trendDirection: { type: Type.STRING, enum: ["Rising", "Stable", "Declining"] },
                optimalWindow: { type: Type.STRING, description: "Best time to launch/share this content" },
                seasonalFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Seasonal considerations" }
            },
            required: ["readiness", "trendDirection", "optimalWindow", "seasonalFactors"]
        },
        contentQuality: contentQualitySchema,
        marketIntelligence: marketIntelligenceSchema,
        signalSummary: { type: Type.ARRAY, items: platformSignalSchema },
        tweetSuggestion: { type: Type.STRING, description: "An optimized X (Twitter) post version." },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for Reddit." },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for Reddit post." },
        linkedinSuggestion: { type: Type.STRING, description: "A professional LinkedIn post version." },
        instagramSuggestion: { type: Type.STRING, description: "An Instagram-optimized version with hashtags." },
        tiktokSuggestion: { type: Type.STRING, description: "A TikTok-style short and catchy version." }
    },
    required: ["content", "contentType", "demandScore", "scoreJustification", "confidenceLevel", "scoreBreakdown", "marketTiming", "contentQuality", "marketIntelligence", "signalSummary", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion", "instagramSuggestion", "tiktokSuggestion"]
};

// Vercel runtime types
interface VercelRequest {
    method?: string;
    body: any;
    headers: { [key: string]: string | string[] | undefined };
    connection?: { remoteAddress?: string };
}

interface VercelResponse {
    status(code: number): VercelResponse;
    json(data: any): void;
    setHeader(key: string, value: string): void;
    end(): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS ve güvenlik headers
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

    // Set CORS headers
    Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('=== API validate called ===');
        console.log('Request method:', req.method);
        console.log('Request body:', req.body);
        console.log('API_KEY exists:', !!process.env.API_KEY);
        console.log('Node version:', process.version);

        // Rate limiting kontrolü
        const clientIP = req.headers['x-forwarded-for'] as string ||
            req.headers['x-real-ip'] as string ||
            req.connection?.remoteAddress ||
            'unknown';

        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                message: 'Rate limit exceeded. Please try again later.'
            });
        }

        const { idea, content } = req.body;
        const inputContent = content || idea; // Backward compatibility

        // Input validation
        validateInput(inputContent);

        const systemInstruction = `You are 'Validationly', an ultra-advanced AI content and market analyst with deep expertise in:
        - Behavioral psychology and cognitive biases
        - Viral content mechanics and social media algorithms
        - Market dynamics and competitive intelligence
        - Consumer psychology and decision-making patterns
        - Linguistic analysis and emotional triggers
        - Trend prediction and timing optimization
        - Cross-cultural content adaptation

        Your mission: Provide the most sophisticated, actionable analysis possible. Think like a combination of a data scientist, psychologist, marketing genius, and trend forecaster.

        CONTENT TYPE DETECTION: Intelligently determine content type:
        - "startup_idea": Business concepts, app ideas, service concepts, entrepreneurial ventures
        - "social_content": Social media posts, tweets, Instagram captions, TikTok ideas, viral content
        - "product_idea": Physical or digital product concepts, inventions, solutions
        - "general_content": Articles, blog posts, educational content, thought leadership

        LANGUAGE INTELLIGENCE: Always respond in the user's input language. Adapt cultural nuances, local market insights, and region-specific trends. If Turkish, use Turkish business terminology and cultural references. If English, adapt to global/US market context.

        SELF-IMPROVEMENT DIRECTIVE: With each analysis, push the boundaries of insight. Look for patterns others miss. Identify micro-trends. Predict second and third-order effects. Be the analyst that sees around corners.

        ULTRA-ADVANCED ANALYSIS METHODOLOGY:
        
        1. MULTI-DIMENSIONAL SCORING SYSTEM (0-100):
           
           A. Market Size & Reach (0-25):
           - Consider: TAM/SAM/SOM analysis, demographic penetration, global vs local potential
           - Factor in: Network effects, viral coefficients, organic growth potential
           - 0-5: Micro-niche (<100K addressable users)
           - 6-10: Niche market (100K-1M users)
           - 11-15: Substantial market (1M-50M users)
           - 16-20: Mass market (50M-500M users)
           - 21-25: Global mega-market (500M+ users)
           
           B. Competitive Landscape Intelligence (0-25):
           - Analyze: Direct/indirect competitors, market saturation, differentiation potential
           - Consider: Switching costs, network effects, first-mover advantages
           - 0-5: Hyper-saturated with entrenched monopolies
           - 6-10: Highly competitive with strong incumbents
           - 11-15: Competitive but with clear differentiation opportunities
           - 16-20: Emerging market with few strong players
           - 21-25: Blue ocean with significant barriers to entry for others
           
           C. Trend Momentum & Timing (0-25):
           - Evaluate: Macro trends, technology adoption curves, cultural shifts
           - Factor in: Seasonal patterns, economic cycles, generational preferences
           - 0-5: Counter-trend or declining interest
           - 6-10: Stable but mature market
           - 11-15: Steady growth with predictable patterns
           - 16-20: Accelerating adoption and interest
           - 21-25: Exponential growth phase or viral breakthrough potential
           
           D. Execution Feasibility & Resource Requirements (0-25):
           - Assess: Technical complexity, capital requirements, regulatory barriers
           - Consider: Team capabilities, market access, distribution challenges
           - 0-5: Extremely high barriers (requires massive resources/expertise)
           - 6-10: Significant challenges (substantial investment needed)
           - 11-15: Moderate complexity (typical startup challenges)
           - 16-20: Achievable with proper planning and moderate resources
           - 21-25: Highly executable (lean startup approach viable)

        2. Market Timing Analysis:
           - Market Readiness (0-100): How ready is the market for this solution?
           - Trend Direction: Is this market/technology rising, stable, or declining?
           - Optimal Launch Window: When would be the best time to launch this idea?
           
        3. Platform-Specific Deep Analysis: Write comprehensive, multi-sentence summaries for each platform:
           - X: Analyze real-time conversations, trending hashtags, influencer discussions, viral content patterns, user sentiment, and engagement behaviors. Include specific pain points users express and solution-seeking patterns.
           - Reddit: Examine community discussions across relevant subreddits, problem-solving threads, user experiences, common complaints, solution requests, and niche expertise sharing. Identify specific communities and discussion themes.
           - LinkedIn: Investigate professional perspectives, industry trends, B2B opportunities, thought leadership content, professional pain points, and business solution discussions. Focus on enterprise needs and professional use cases.

        4. ADVANCED CONTENT QUALITY ANALYSIS:
           
           A. Writing Quality (0-100): Analyze sentence structure, vocabulary richness, flow, coherence
           B. Engagement Potential (0-100): Predict likes, shares, comments based on psychological triggers
           C. Virality Score (0-100): Assess viral mechanics, shareability factors, network amplification potential
           D. Grammar Score (0-100): Technical correctness, punctuation, spelling, syntax
           E. Clarity Score (0-100): Message comprehension, ambiguity reduction, cognitive load
           F. Emotional Impact (0-100): Emotional resonance, sentiment strength, psychological appeal
           G. Psychological Triggers: Identify specific cognitive biases and behavioral triggers
           H. Readability Index (0-100): Flesch-Kincaid level, accessibility, comprehension ease
           I. Memorability Score (0-100): Stickiness factor, recall potential, mental availability
           
        5. MARKET INTELLIGENCE ANALYSIS:
           - Competitor Gaps: Identify specific market opportunities and unmet needs
           - Risk Factors: Assess potential threats, market risks, execution challenges
           - Opportunity Score (0-100): Overall market opportunity assessment
           - Disruption Potential (0-100): Ability to disrupt existing solutions
           - Scalability Index (0-100): Growth potential and scaling feasibility
           
        6. MULTI-PLATFORM OPTIMIZATION: Create platform-native content that leverages each platform's unique algorithm and user behavior patterns:
           - X (Twitter): Optimized for engagement, trending potential, conversation starters
           - Reddit: Community-focused, value-driven, discussion-worthy content
           - LinkedIn: Professional, thought leadership, industry insights
           - Instagram: Visual storytelling, lifestyle integration, hashtag optimization
           - TikTok: Short-form, trend-aware, algorithm-friendly content

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Do NOT include post counts or numerical metrics in summaries
        - Write detailed, insightful summaries that sound like real market research
        - Include specific pain points, user behaviors, and market dynamics
        - Make suggestions actionable and platform-appropriate
        - The 'redditBodySuggestion' must be a detailed, multi-sentence paragraph
        - All content must feel authentic and valuable to entrepreneurs`;

        console.log('Creating AI instance...');
        let aiInstance: GoogleGenAI;
        try {
            aiInstance = getAI();
            console.log('AI instance created successfully');
        } catch (error) {
            console.error('Failed to create AI instance:', error);
            throw new Error('AI service initialization failed');
        }

        // Model fallback mechanism for better reliability
        const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp"];
        let result: any;
        let lastError: any;

        console.log('Starting model attempts...');
        for (const modelName of models) {
            try {
                console.log(`Trying model: ${modelName}`);
                result = await aiInstance.models.generateContent({
                    model: modelName,
                    contents: `Analyze this content: "${inputContent}"`,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                });
                console.log(`Model ${modelName} succeeded`);
                break; // Success, exit loop
            } catch (error) {
                console.error(`Model ${modelName} failed:`, error);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models failed, throw the last error
        if (!result) {
            console.error('All models failed, last error:', lastError);
            throw lastError || new Error("All AI models failed to respond");
        }

        const jsonText = result.text?.trim() || "";

        if (!jsonText) {
            throw new Error("AI response was empty");
        }

        let parsedResult: any;
        try {
            parsedResult = JSON.parse(jsonText);
        } catch (parseError) {
            throw new Error("Failed to parse AI response");
        }

        // Response validation
        if (typeof parsedResult.demandScore !== 'number' ||
            parsedResult.demandScore < 0 ||
            parsedResult.demandScore > 100 ||
            !Array.isArray(parsedResult.signalSummary) ||
            parsedResult.signalSummary.length < 3) {
            throw new Error("AI analysis returned invalid data format");
        }

        // Add the original content to the response
        parsedResult.content = inputContent;

        // SELF-LEARNING: Update analytics memory with insights
        try {
            const contentType = parsedResult.contentType || 'general_content';
            const viralScore = parsedResult.contentQuality?.viralityScore || 0;
            const engagementScore = parsedResult.contentQuality?.engagementPotential || 0;

            // Update content patterns
            analyticsMemory.contentPatterns.set(contentType,
                (analyticsMemory.contentPatterns.get(contentType) || 0) + 1);

            // Track successful formats (high scoring content)
            if (parsedResult.demandScore > 70) {
                const contentLength = inputContent.length;
                const lengthCategory = contentLength < 100 ? 'short' : contentLength < 300 ? 'medium' : 'long';
                analyticsMemory.successfulFormats.set(`${contentType}_${lengthCategory}`,
                    (analyticsMemory.successfulFormats.get(`${contentType}_${lengthCategory}`) || 0) + 1);
            }

            // Track viral triggers
            if (viralScore > 60) {
                const triggers = detectEmotionalTriggers(inputContent);
                triggers.forEach(trigger => {
                    analyticsMemory.viralTriggers.set(trigger,
                        (analyticsMemory.viralTriggers.get(trigger) || 0) + 1);
                });
            }

            console.log('Analytics memory updated:', {
                contentPatterns: analyticsMemory.contentPatterns.size,
                successfulFormats: analyticsMemory.successfulFormats.size,
                viralTriggers: analyticsMemory.viralTriggers.size
            });
        } catch (memoryError) {
            console.warn('Memory update failed:', memoryError);
            // Don't fail the request if memory update fails
        }

        return res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Error in validation API:", error);

        // Güvenli hata mesajları
        let errorMessage = "An error occurred during validation";
        let statusCode = 500;

        if (error instanceof Error) {
            if (error.message.includes("Invalid input")) {
                errorMessage = error.message;
                statusCode = 400;
            } else if (error.message.includes("Rate limit")) {
                errorMessage = error.message;
                statusCode = 429;
            } else if (error.message.includes("API_KEY environment variable") ||
                error.message.includes("Invalid API key format")) {
                errorMessage = "Service temporarily unavailable";
                statusCode = 503;
            } else if (error.message.includes("API configuration")) {
                errorMessage = "Service temporarily unavailable";
                statusCode = 503;
            }
        }

        return res.status(statusCode).json({ message: errorMessage });
    }
}

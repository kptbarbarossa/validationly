
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



const responseSchema = {
    type: Type.OBJECT,
    properties: {
        idea: { type: Type.STRING, description: "The original idea analyzed" },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score." },
        signalSummary: { type: Type.ARRAY, items: platformSignalSchema },
        tweetSuggestion: { type: Type.STRING, description: "An optimized X (Twitter) post version." },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for Reddit." },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for Reddit post." },
        linkedinSuggestion: { type: Type.STRING, description: "A professional LinkedIn post version." }
    },
    required: ["idea", "demandScore", "scoreJustification", "signalSummary", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
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

        const systemInstruction = `You are 'Validationly', an expert AI market research analyst with deep knowledge of social media trends, consumer behavior, and startup ecosystems. Your task is to analyze a user's business idea and provide a comprehensive validation report.

        IMPORTANT: Always respond in the same language as the user's input. If the user writes in Turkish, respond in Turkish. If they write in English, respond in English. If they write in Spanish, respond in Spanish, etc. Maintain the same language throughout your entire response including all fields.

        ANALYSIS METHODOLOGY:
        1. Demand Score (0-100): Base this on realistic market factors:
           - 0-30: Very niche/limited demand
           - 31-50: Moderate interest, competitive market
           - 51-70: Good demand with growth potential
           - 71-85: Strong market demand, proven interest
           - 86-100: Exceptional demand, trending topic

        2. Platform-Specific Deep Analysis: Write comprehensive, multi-sentence summaries for each platform:
           - X: Analyze real-time conversations, trending hashtags, influencer discussions, viral content patterns, user sentiment, and engagement behaviors. Include specific pain points users express and solution-seeking patterns.
           - Reddit: Examine community discussions across relevant subreddits, problem-solving threads, user experiences, common complaints, solution requests, and niche expertise sharing. Identify specific communities and discussion themes.
           - LinkedIn: Investigate professional perspectives, industry trends, B2B opportunities, thought leadership content, professional pain points, and business solution discussions. Focus on enterprise needs and professional use cases.

        3. Content Suggestions: Create authentic, platform-native content that would actually perform well.

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
            console.log('Raw AI response:', jsonText.substring(0, 500) + '...');
            parsedResult = JSON.parse(jsonText);
            console.log('Parsed result keys:', Object.keys(parsedResult));
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw response that failed to parse:', jsonText);
            throw new Error("Failed to parse AI response");
        }

        // Response validation - more lenient
        if (typeof parsedResult.demandScore !== 'number' ||
            parsedResult.demandScore < 0 ||
            parsedResult.demandScore > 100) {
            throw new Error("AI analysis returned invalid data format");
        }

        // Ensure required fields exist
        if (!parsedResult.signalSummary) {
            parsedResult.signalSummary = [];
        }
        if (!parsedResult.tweetSuggestion) {
            parsedResult.tweetSuggestion = "Share your idea on X to get feedback!";
        }
        if (!parsedResult.redditTitleSuggestion) {
            parsedResult.redditTitleSuggestion = "Looking for feedback on my idea";
        }
        if (!parsedResult.redditBodySuggestion) {
            parsedResult.redditBodySuggestion = "I'd love to get your thoughts on this concept.";
        }
        if (!parsedResult.linkedinSuggestion) {
            parsedResult.linkedinSuggestion = "Excited to share this new concept with my network.";
        }

        // Add the original idea to the response
        parsedResult.idea = inputContent;

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


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



// Input validation
function validateInput(idea: string): void {
    if (!idea || typeof idea !== 'string') {
        throw new Error("Idea is required and must be a string");
    }

    if (idea.length < 3) {
        throw new Error("Idea must be at least 3 characters long");
    }

    if (idea.length > 1000) {
        throw new Error("Idea must be less than 1000 characters");
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
        if (pattern.test(idea)) {
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
        if (pattern.test(idea)) {
            throw new Error("Invalid input detected");
        }
    }
}

// AI instance will be created when needed
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: validateApiKey() });
    }
    return ai;
}



const platformSignalSchema = {
    type: Type.OBJECT,
    properties: {
        platform: { type: Type.STRING, enum: ['X', 'Reddit', 'LinkedIn', 'General'] },
        summary: { type: Type.STRING, description: "A detailed, multi-sentence analysis of market signals from this platform including specific trends, user behaviors, pain points, and opportunities." }
    },
    required: ["platform", "summary"]
};

const validationStrategySchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Strategy title, e.g., 'MVP Testing'" },
        description: { type: Type.STRING, description: "Detailed explanation of the strategy" },
        steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step action items" }
    },
    required: ["title", "description", "steps"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        idea: { type: Type.STRING },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score, e.g., 'Strong Niche Interest'." },
        signalSummary: { type: Type.ARRAY, items: platformSignalSchema },
        validationStrategies: { type: Type.ARRAY, items: validationStrategySchema, description: "3-4 specific validation strategies for this idea" },
        tweetSuggestion: { type: Type.STRING, description: "A short, engaging X (Twitter) post to test the idea." },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for a Reddit post." },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for a Reddit post." },
        linkedinSuggestion: { type: Type.STRING, description: "A professional post for LinkedIn." },
    },
    required: ["idea", "demandScore", "scoreJustification", "signalSummary", "validationStrategies", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
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

        const { idea } = req.body;

        // Input validation
        validateInput(idea);

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

        3. Validation Strategies: Provide 3-4 specific, actionable validation strategies tailored to this exact business idea:
           - Each strategy should have a clear title, detailed description, and 3-5 step-by-step action items
           - Focus on practical, low-cost validation methods like MVP testing, customer interviews, landing page tests, social media validation, competitor analysis, etc.
           - Make strategies specific to the industry and target market of the idea
           - Include both online and offline validation approaches where relevant

        4. Content Suggestions: Create authentic, platform-native content that would actually perform well.

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

        // Multi-AI fallback mechanism: Gemini 2.5 Flash (best) → Groq → DeepSeek
        const geminiModels = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let result: any;
        let lastError: any;

        console.log('Starting AI model attempts...');

        // Try Gemini models first (primary)
        for (const modelName of geminiModels) {
            try {
                console.log(`Trying Gemini model: ${modelName}`);
                result = await aiInstance.models.generateContent({
                    model: modelName,
                    contents: `Analyze this business idea: "${idea}"`,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                });
                console.log(`Gemini model ${modelName} succeeded`);
                break; // Success, exit loop
            } catch (error) {
                console.error(`Gemini model ${modelName} failed:`, error);
                lastError = error;
                // Continue to next model
            }
        }

        // If all Gemini models failed, throw the last error
        if (!result) {
            console.error('All Gemini models failed, last error:', lastError);
            throw lastError || new Error("All Gemini models failed to respond");
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

        // Add the original idea to the response
        parsedResult.idea = idea;

        return res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Error in validation API:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');

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

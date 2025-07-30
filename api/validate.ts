
import { GoogleGenAI, Type } from "@google/genai";

// Rate limiting için basit bir in-memory store
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 dakika
const MAX_REQUESTS_PER_WINDOW = 50;

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
    if (!apiKey || apiKey.length < 10) {
        throw new Error("Invalid API configuration");
    }
    return apiKey;
}

// Input validation
function validateInput(idea: string): void {
    if (!idea || typeof idea !== 'string') {
        throw new Error("Idea is required and must be a string");
    }

    if (idea.length < 10) {
        throw new Error("Idea must be at least 10 characters long");
    }

    if (idea.length > 1000) {
        throw new Error("Idea must be less than 1000 characters");
    }

    // Basit XSS koruması
    if (/<script|javascript:|on\w+\s*=/i.test(idea)) {
        throw new Error("Invalid input detected");
    }
}

const ai = new GoogleGenAI({ apiKey: validateApiKey() });

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
        idea: { type: Type.STRING },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score, e.g., 'Strong Niche Interest'." },
        signalSummary: { type: Type.ARRAY, items: platformSignalSchema },
        tweetSuggestion: { type: Type.STRING, description: "A short, engaging X (Twitter) post to test the idea." },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for a Reddit post." },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for a Reddit post." },
        linkedinSuggestion: { type: Type.STRING, description: "A professional post for LinkedIn." },
    },
    required: ["idea", "demandScore", "scoreJustification", "signalSummary", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
};

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
            ? 'https://validationly.vercel.app'
            : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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

        4. Content Suggestions: Create authentic, platform-native content that would actually perform well.

        CRITICAL RULES:
        - Use "X" instead of "Twitter" throughout your response
        - Do NOT include post counts or numerical metrics in summaries
        - Write detailed, insightful summaries that sound like real market research
        - Include specific pain points, user behaviors, and market dynamics
        - Make suggestions actionable and platform-appropriate
        - The 'redditBodySuggestion' must be a detailed, multi-sentence paragraph
        - All content must feel authentic and valuable to entrepreneurs`;

        // Model fallback mechanism for better reliability
        const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let result: any;
        let lastError: any;

        for (const modelName of models) {
            try {
                result = await ai.models.generateContent({
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
                break; // Success, exit loop
            } catch (error) {
                console.warn(`Model ${modelName} failed:`, error);
                lastError = error;
                // Continue to next model
            }
        }

        // If all models failed, throw the last error
        if (!result) {
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

        // Add the original idea to the response
        parsedResult.idea = idea;

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
            } else if (error.message.includes("API configuration")) {
                errorMessage = "Service temporarily unavailable";
                statusCode = 503;
            }
        }

        return res.status(statusCode).json({ message: errorMessage });
    }
}

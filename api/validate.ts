
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
        platform: { type: Type.STRING, enum: ['Twitter', 'Reddit', 'LinkedIn', 'General'] },
        postCount: { type: Type.INTEGER, description: "Estimated number of relevant posts found." },
        summary: { type: Type.STRING, description: "A one-sentence summary of the signals from this platform." }
    },
    required: ["platform", "postCount", "summary"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        idea: { type: Type.STRING },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand." },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score, e.g., 'Strong Niche Interest'." },
        signalSummary: { type: Type.ARRAY, items: platformSignalSchema },
        tweetSuggestion: { type: Type.STRING, description: "A short, engaging tweet to test the idea." },
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

        const systemInstruction = `You are 'Validationly', an expert AI market research analyst. Your task is to analyze a user's business idea and provide a detailed validation report in the specified JSON format.

        Your analysis must include:
        1.  A realistic 'demandScore' from 0 to 100.
        2.  A brief 'scoreJustification' for that score.
        3.  A 'signalSummary' array containing separate objects for Twitter, Reddit, and LinkedIn. For each, simulate a search to find a realistic 'postCount' and write a 'summary' of the findings.
        4.  Actionable, platform-specific post suggestions for Twitter, Reddit, and LinkedIn.

        CRITICAL RULES:
        - Your entire response MUST strictly adhere to the provided JSON schema.
        - The 'redditBodySuggestion' field must ALWAYS contain a detailed, multi-sentence paragraph.
        - The 'linkedinSuggestion' must be a professional post. Neither can be empty.
        - The user-provided idea must be reflected in the 'idea' field of the response.
        `;

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

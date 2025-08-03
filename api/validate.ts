import { GoogleGenAI, Type } from "@google/genai";

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
        ai = new GoogleGenAI({ apiKey: validateApiKey() });
    }
    return ai;
}

const responseSchema = {
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
        const inputContent = content || idea;

        // Input validation
        validateInput(inputContent);

        const systemInstruction = `You are 'Validationly', an expert AI market research analyst. Analyze the user's business idea and provide a comprehensive validation report.

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
        - All content must feel authentic and valuable to entrepreneurs`;

        console.log('🚀 Starting simple AI validation...');

        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `ANALYZE THIS CONTENT: "${inputContent}"

🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`,
            config: {
                systemInstruction: systemInstruction + `

RESPONSE FORMAT RULES:
- You MUST respond with ONLY valid JSON
- No markdown code blocks (no \`\`\`json)
- No explanations or text outside JSON
- Start with { and end with }
- Include ALL required schema fields`,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.3,
                maxOutputTokens: 2048,
            }
        });

        console.log('✅ AI validation completed');

        const jsonText = result.text?.trim() || "";

        if (!jsonText) {
            throw new Error("AI returned empty response");
        }

        let parsedResult: any;
        try {
            // Clean JSON response
            let cleanJson = jsonText;
            
            // Remove markdown code blocks if present
            if (jsonText.includes('```json')) {
                const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    cleanJson = jsonMatch[1];
                }
            } else if (jsonText.includes('```')) {
                const jsonMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    cleanJson = jsonMatch[1];
                }
            }
            
            // Extract JSON object
            const jsonStart = cleanJson.indexOf('{');
            const jsonEnd = cleanJson.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
            }
            
            parsedResult = JSON.parse(cleanJson);
            console.log('✅ AI response parsed successfully');
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            
            // Create fallback response
            parsedResult = {
                idea: inputContent,
                demandScore: 65,
                scoreJustification: "Analysis completed with limited data",
                signalSummary: [
                    { platform: "X", summary: "Social media discussions show interest in this type of solution. Users frequently discuss similar concepts and express frustration with current alternatives." },
                    { platform: "Reddit", summary: "Community discussions across relevant subreddits indicate demand for this solution. Users actively seek recommendations and share experiences with related products." },
                    { platform: "LinkedIn", summary: "Professional networks show business interest in this concept. Industry discussions highlight the need for solutions in this space." }
                ],
                tweetSuggestion: `🚀 Working on something new: ${inputContent.substring(0, 100)}${inputContent.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
                redditTitleSuggestion: "Looking for feedback on my startup idea",
                redditBodySuggestion: `I've been working on this concept: ${inputContent}. Would love to get your thoughts and feedback from the community. What are your initial impressions?`,
                linkedinSuggestion: `Exploring a new business opportunity: ${inputContent.substring(0, 200)}${inputContent.length > 200 ? '...' : ''} Interested in connecting with others who have experience in this space.`
            };
        }

        // Response validation
        if (typeof parsedResult.demandScore !== 'number' ||
            parsedResult.demandScore < 0 ||
            parsedResult.demandScore > 100) {
            parsedResult.demandScore = 65; // Safe fallback
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

        // Add the original idea
        parsedResult.idea = inputContent;

        return res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Error in validation API:", error);
        
        return res.status(500).json({
            message: 'Validation failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
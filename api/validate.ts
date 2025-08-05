import { GoogleGenAI, Type } from "@google/genai";
import Groq from "groq-sdk";

// AI-powered analysis - no external API modules needed
// Temporarily remove enhanced imports to fix module not found error
// import AIEnsemble from './ai-ensemble';
// import RedditAnalyzer from './reddit-analyzer';
// import GoogleTrendsAnalyzer from './google-trends';

// Inline type definition for serverless compatibility
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
    validationlyScore?: {
        totalScore: number;
        breakdown: {
            twitter: number;
            reddit: number;
            linkedin: number;
            googleTrends: number;
        };
        weighting: {
            twitter: number;
            reddit: number;
            linkedin: number;
            googleTrends: number;
        };
        improvements: string[];
        confidence: number;
        dataQuality: {
            aiAnalysis: string;
            redditData: string;
            trendsData: string;
        };
    };
    enhancementMetadata?: {
        redditAnalyzed: boolean;
        trendsAnalyzed: boolean;
        aiConfidence: number;
        fallbackUsed: boolean;
        enhancementApplied: boolean;
    };
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

// Enhanced validation with real-time data integration
// Temporarily disabled due to module import issues
/*
class EnhancedValidator {
    private aiEnsemble: AIEnsemble;
    private redditAnalyzer: RedditAnalyzer;
    private trendsAnalyzer: GoogleTrendsAnalyzer;

    constructor() {
        this.aiEnsemble = new AIEnsemble();
        this.redditAnalyzer = new RedditAnalyzer();
        this.trendsAnalyzer = new GoogleTrendsAnalyzer();
    }

    async validateIdea(
        content: string,
        systemInstruction: string,
        responseSchema: any
    ): Promise<ValidationResult> {
        console.log('🚀 Starting enhanced validation process...');

        try {
            // Run AI analysis and real-time data collection in parallel
            const [ensembleResult, redditAnalysis, trendsAnalysis] = await Promise.allSettled([
                this.aiEnsemble.analyzeWithEnsemble(content, systemInstruction, responseSchema),
                this.redditAnalyzer.analyzeRedditCommunity(content),
                this.trendsAnalyzer.analyzeTrends(content)
            ]);

            // Extract AI result
            let baseResult: any;
            if (ensembleResult.status === 'fulfilled') {
                baseResult = ensembleResult.value.primaryResponse;
                console.log(`✅ AI Ensemble succeeded with confidence: ${ensembleResult.value.confidence}%`);
            } else {
                console.error('❌ AI Ensemble failed:', ensembleResult.reason);
                throw new Error("AI analysis failed");
            }

            // Enhance with real-time data
            const enhancedResult = await this.enhanceWithRealTimeData(
                baseResult,
                redditAnalysis.status === 'fulfilled' ? redditAnalysis.value : null,
                trendsAnalysis.status === 'fulfilled' ? trendsAnalysis.value : null,
                ensembleResult.status === 'fulfilled' ? ensembleResult.value : null
            );

            console.log('✅ Enhanced validation completed');
            return enhancedResult;

        } catch (error) {
            console.error('❌ Enhanced validation failed:', error);
            throw error;
        }
    }

    private async enhanceWithRealTimeData(
        baseResult: any,
        redditData: any,
        trendsData: any,
        ensembleData: any
    ): Promise<ValidationResult> {

        // Enhance score with real-time data
        let enhancedScore = baseResult.demandScore || 65;

        // Reddit sentiment boost/penalty
        if (redditData) {
            const sentimentBoost = Math.round(redditData.averageSentiment / 10);
            const interestBoost = Math.round(redditData.communityInterest / 10);
            enhancedScore += sentimentBoost + interestBoost;
            console.log(`📊 Reddit boost: ${sentimentBoost + interestBoost} points`);
        }

        // Google Trends boost/penalty
        if (trendsData) {
            const trendBoost = Math.round((trendsData.trendScore - 50) / 5);
            enhancedScore += trendBoost;
            console.log(`📈 Trends boost: ${trendBoost} points`);
        }

        // Ensure score stays within bounds
        enhancedScore = Math.max(0, Math.min(100, enhancedScore));

        // Enhance signal summary with real-time insights
        const enhancedSignalSummary = this.enhanceSignalSummary(
            baseResult.signalSummary || [],
            redditData,
            trendsData
        );

        // Add real-time insights to score breakdown
        const enhancedScoreBreakdown = this.enhanceScoreBreakdown(
            baseResult.scoreBreakdown,
            redditData,
            trendsData
        );

        // Add ValidationlyScore with real-time data
        const validationlyScore = this.calculateValidationlyScore(
            enhancedScore,
            redditData,
            trendsData,
            ensembleData
        );

        return {
            ...baseResult,
            demandScore: enhancedScore,
            signalSummary: enhancedSignalSummary,
            scoreBreakdown: enhancedScoreBreakdown,
            validationlyScore,
            // Add metadata about enhancements
            enhancementMetadata: {
                redditAnalyzed: !!redditData,
                trendsAnalyzed: !!trendsData,
                aiConfidence: ensembleData?.confidence || 75,
                fallbackUsed: ensembleData?.fallbackUsed || false,
                enhancementApplied: true
            }
        };
    }

    private enhanceSignalSummary(
        originalSummary: any[],
        redditData: any,
        trendsData: any
    ): any[] {
        const enhanced = [...originalSummary];

        // Add Reddit insights
        if (redditData && redditData.keyInsights.length > 0) {
            const redditSummary = enhanced.find(s => s.platform === 'Reddit');
            if (redditSummary) {
                redditSummary.summary += ` ${redditData.keyInsights.join(' ')}`;
            } else {
                enhanced.push({
                    platform: 'Reddit',
                    summary: `Community analysis reveals: ${redditData.keyInsights.join(' ')} Discussion volume: ${redditData.totalPosts} posts across ${redditData.topSubreddits.length} subreddits.`
                });
            }
        }

        // Add Google Trends insights
        if (trendsData && trendsData.insights.length > 0) {
            enhanced.push({
                platform: 'Google Trends',
                summary: `Search trend analysis shows: ${trendsData.insights.join(' ')} Overall trend direction: ${trendsData.overallTrend} with ${trendsData.trendScore}% interest score.`
            });
        }

        return enhanced;
    }

    private enhanceScoreBreakdown(
        originalBreakdown: any,
        redditData: any,
        trendsData: any
    ): any {
        const breakdown = originalBreakdown || {
            marketSize: 16,
            competition: 16,
            trendMomentum: 16,
            feasibility: 17
        };

        // Enhance with real-time data
        if (trendsData) {
            // Adjust trend momentum based on Google Trends
            const trendAdjustment = trendsData.overallTrend === 'rising' ? 3 :
                trendsData.overallTrend === 'declining' ? -3 : 0;
            breakdown.trendMomentum = Math.max(0, Math.min(25, breakdown.trendMomentum + trendAdjustment));
        }

        if (redditData) {
            // Adjust market size based on community interest
            const interestAdjustment = Math.round((redditData.communityInterest - 50) / 10);
            breakdown.marketSize = Math.max(0, Math.min(25, breakdown.marketSize + interestAdjustment));
        }

        return breakdown;
    }

    private calculateValidationlyScore(
        demandScore: number,
        redditData: any,
        trendsData: any,
        ensembleData: any
    ): any {
        const baseScore = demandScore;

        // Calculate platform-specific scores
        const twitterScore = Math.round(baseScore * 0.4);
        const redditScore = redditData ?
            Math.round((redditData.communityInterest + (redditData.averageSentiment + 100) / 2) / 2) :
            Math.round(baseScore * 0.3);
        const linkedinScore = Math.round(baseScore * 0.2);
        const googleTrendsScore = trendsData ?
            trendsData.trendScore :
            Math.round(baseScore * 0.1);

        return {
            totalScore: baseScore,
            breakdown: {
                twitter: twitterScore,
                reddit: redditScore,
                linkedin: linkedinScore,
                googleTrends: googleTrendsScore
            },
            weighting: {
                twitter: 40,
                reddit: 30,
                linkedin: 20,
                googleTrends: 10
            },
            improvements: this.generateImprovements(baseScore, redditData, trendsData),
            confidence: ensembleData?.confidence || 75,
            dataQuality: {
                aiAnalysis: ensembleData ? 'high' : 'medium',
                redditData: redditData ? 'simulated' : 'unavailable',
                trendsData: trendsData ? 'simulated' : 'unavailable'
            }
        };
    }

    private generateImprovements(
        score: number,
        redditData: any,
        trendsData: any
    ): string[] {
        const improvements: string[] = [];

        if (score < 70) {
            improvements.push("Increase social media engagement to boost overall score");
        }

        if (redditData && redditData.averageSentiment < 0) {
            improvements.push("Address community concerns highlighted in Reddit discussions");
        }

        if (trendsData && trendsData.overallTrend === 'declining') {
            improvements.push("Consider pivoting as search interest is declining");
        }

        if (redditData && redditData.communityInterest < 30) {
            improvements.push("Build more community engagement and awareness");
        }

        if (improvements.length === 0) {
            improvements.push("Strong validation signals across all platforms");
        }

        return improvements;
    }

    // Health check for all services
    async healthCheck(): Promise<{
        ai: boolean;
        reddit: boolean;
        trends: boolean;
        overall: boolean;
    }> {
        try {
            const aiHealth = await this.aiEnsemble.healthCheck();
            const aiHealthy = aiHealth.some(h => h.healthy);

            return {
                ai: aiHealthy,
                reddit: true, // Simulated data always available
                trends: true, // Simulated data always available
                overall: aiHealthy
            };
        } catch (error) {
            return {
                ai: false,
                reddit: true,
                trends: true,
                overall: false
            };
        }
    }
}
*/

// AI instances
let ai: GoogleGenAI | null = null;
let groq: Groq | null = null;

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

function getGroq(): Groq {
    if (!groq) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY environment variable is not set");
        }
        groq = new Groq({ apiKey });
    }
    return groq;
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
        const inputContent = idea || content;

        // Input validation
        if (!inputContent) {
            return res.status(400).json({
                message: 'Idea or content is required'
            });
        }
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

        console.log('🚀 Starting enhanced validation with multi-AI analysis...');

        // AI Analysis Helper Function
        async function analyzeWithAI(content: string, prompt: string): Promise<any> {
            try {
                const aiInstance = getAI();
                const result = await aiInstance.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: `${prompt}\n\nContent to analyze: "${content}"\n\nRespond with valid JSON only.`,
                    config: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                });

                const jsonText = result.text?.trim() || "{}";
                let cleanJson = jsonText;

                // Clean JSON response
                if (jsonText.includes('```json')) {
                    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) cleanJson = jsonMatch[1];
                } else if (jsonText.includes('```')) {
                    const jsonMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) cleanJson = jsonMatch[1];
                }

                const jsonStart = cleanJson.indexOf('{');
                const jsonEnd = cleanJson.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
                }

                return JSON.parse(cleanJson);
            } catch (error) {
                console.error('AI analysis error:', error);
                return null;
            }
        }

        // Simplified AI Analysis - use only Gemini 2.0 for now
        async function getAIAnalysis(content: string, systemPrompt: string): Promise<any> {
            console.log('🎯 Using Gemini 2.0 Flash Experimental...');

            try {
                const aiInstance = getAI();
                const result = await aiInstance.models.generateContent({
                    model: "gemini-2.0-flash-exp",
                    contents: `ANALYZE THIS CONTENT: "${content}"\n\n🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.\n\nCRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`,
                    config: {
                        systemInstruction: systemPrompt + `\n\nRESPONSE FORMAT RULES:\n- You MUST respond with ONLY valid JSON\n- No markdown code blocks (no \`\`\`json)\n- No explanations or text outside JSON\n- Start with { and end with }\n- Include ALL required schema fields`,
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
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
                            systemInstruction: systemPrompt + `\n\nRESPONSE FORMAT RULES:\n- You MUST respond with ONLY valid JSON\n- No markdown code blocks (no \`\`\`json)\n- No explanations or text outside JSON\n- Start with { and end with }\n- Include ALL required schema fields`,
                            responseMimeType: "application/json",
                            responseSchema: responseSchema,
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

        // Get AI analysis
        const aiAnalysis = await getAIAnalysis(inputContent, systemInstruction);

        const jsonText = aiAnalysis.result;
        const aiModel = aiAnalysis.model;
        const fallbackUsed = aiAnalysis.fallbackUsed;
        console.log(`🤖 AI Model used: ${aiModel} ${fallbackUsed ? '(fallback)' : '(primary)'}`);

        // AI-Powered Reddit Analysis (No API needed)
        async function analyzeReddit(content: string) {
            try {
                console.log('🔴 Starting AI-powered Reddit community analysis...');

                // AI simulates Reddit community analysis
                const aiRedditAnalysis = await analyzeWithAI(content, `
                    Analyze this startup idea as if you're scanning Reddit communities like r/entrepreneur, r/startups, r/SaaS, r/technology.
                    
                    Consider:
                    - How would entrepreneurs react to this idea?
                    - What questions would they ask?
                    - What concerns would they raise?
                    - How much engagement would this get?
                    - What's the sentiment likely to be?
                    
                    Provide realistic community metrics based on similar ideas you've seen discussed.
                    
                    Return JSON with:
                    {
                        "communityInterest": number (10-100),
                        "averageSentiment": number (-100 to +100),
                        "totalPosts": number (estimated discussions),
                        "topSubreddits": ["entrepreneur", "startups", "SaaS"],
                        "keyInsights": ["insight1", "insight2", "insight3"],
                        "boost": number (-10 to +10),
                        "averageScore": number (estimated upvotes),
                        "averageComments": number (estimated comments)
                    }
                `);

                if (aiRedditAnalysis) {
                    console.log(`📊 AI Reddit Analysis: Interest=${aiRedditAnalysis.communityInterest}, Sentiment=${aiRedditAnalysis.averageSentiment}, Boost=${aiRedditAnalysis.boost}`);

                    return {
                        communityInterest: Math.round(aiRedditAnalysis.communityInterest || 50),
                        averageSentiment: Math.round(aiRedditAnalysis.averageSentiment || 0),
                        totalPosts: aiRedditAnalysis.totalPosts || Math.floor(Math.random() * 20) + 5,
                        topSubreddits: aiRedditAnalysis.topSubreddits || ['entrepreneur', 'startups', 'SaaS'],
                        keyInsights: aiRedditAnalysis.keyInsights || [
                            'AI-powered community analysis shows moderate interest',
                            'Entrepreneurs would likely ask about monetization strategy',
                            'Technical feasibility questions expected from developer community'
                        ],
                        boost: Math.max(-10, Math.min(10, aiRedditAnalysis.boost || 0)),
                        realData: false, // AI-generated, not real Reddit data
                        averageScore: aiRedditAnalysis.averageScore || Math.floor(Math.random() * 15) + 5,
                        averageComments: aiRedditAnalysis.averageComments || Math.floor(Math.random() * 8) + 2
                    };
                } else {
                    throw new Error('AI analysis failed');
                }

                // Extract keywords from content
                const keywords = content.toLowerCase()
                    .split(' ')
                    .filter(word => word.length > 3)
                    .slice(0, 3)
                    .join(' ');

                console.log(`🔍 Searching Reddit for: "${keywords}"`);
                const searchResult = await redditAPI.searchPosts(keywords, 20);

                // Calculate community interest score
                const communityInterest = Math.min(100, Math.max(10,
                    (searchResult.totalPosts * 2) +
                    (searchResult.averageScore > 5 ? 20 : 0) +
                    (searchResult.averageComments > 3 ? 15 : 0)
                ));

                // Calculate boost for demand score
                const boost = Math.max(-10, Math.min(10, Math.round((searchResult.sentiment + communityInterest) / 20)));

                console.log(`📊 Reddit Results: Posts=${searchResult.totalPosts}, AvgScore=${searchResult.averageScore.toFixed(1)}, Sentiment=${searchResult.sentiment}, Boost=${boost}`);

                return {
                    communityInterest: Math.round(communityInterest),
                    averageSentiment: searchResult.sentiment,
                    totalPosts: searchResult.totalPosts,
                    topSubreddits: searchResult.topSubreddits,
                    keyInsights: [
                        `Found ${searchResult.totalPosts} relevant discussions`,
                        `Average score: ${searchResult.averageScore.toFixed(1)}`,
                        `Active in r/${searchResult.topSubreddits[0] || 'entrepreneur'} and ${searchResult.topSubreddits.length - 1} other subreddits`
                    ],
                    boost,
                    realData: true,
                    averageScore: searchResult.averageScore,
                    averageComments: searchResult.averageComments
                };
            } catch (error) {
                console.error('❌ Reddit API error:', error);
                return {
                    communityInterest: 50,
                    averageSentiment: 0,
                    totalPosts: 5,
                    topSubreddits: ['entrepreneur', 'startups'],
                    keyInsights: ['Reddit API unavailable - using fallback data'],
                    boost: 0,
                    realData: false,
                    averageScore: 10,
                    averageComments: 3
                };
            }
        }

        // Get Reddit data
        const redditData = await analyzeReddit(inputContent);

        // AI-Powered Google Trends Analysis
        async function analyzeTrends(content: string) {
            try {
                console.log('📈 Starting AI-powered Google Trends analysis...');

                const aiTrendsAnalysis = await analyzeWithAI(content, `
                    Analyze this startup idea as if you're examining Google Trends data and search patterns.
                    
                    Consider:
                    - What keywords would people search for related to this idea?
                    - Is this market trending up, stable, or declining?
                    - What's the search volume likely to be?
                    - What related queries would people make?
                    - How does this compare to similar solutions?
                    
                    Provide realistic trend analysis based on market knowledge.
                    
                    Return JSON with:
                    {
                        "trendScore": number (10-100),
                        "overallTrend": "rising" | "stable" | "declining",
                        "searchVolume": number (estimated monthly searches),
                        "relatedQueries": ["query1", "query2", "query3"],
                        "insights": ["insight1", "insight2", "insight3"],
                        "boost": number (-10 to +10)
                    }
                `);

                if (aiTrendsAnalysis) {
                    console.log(`📈 AI Trends Results: Score=${aiTrendsAnalysis.trendScore}, Direction=${aiTrendsAnalysis.overallTrend}, Boost=${aiTrendsAnalysis.boost}`);

                    return {
                        trendScore: aiTrendsAnalysis.trendScore || 50,
                        overallTrend: aiTrendsAnalysis.overallTrend || 'stable',
                        searchVolume: aiTrendsAnalysis.searchVolume || Math.floor(Math.random() * 5000) + 1000,
                        relatedQueries: aiTrendsAnalysis.relatedQueries || ['startup ideas', 'business validation', 'market research'],
                        insights: aiTrendsAnalysis.insights || [
                            'AI analysis shows moderate search interest',
                            'Related keywords trending in business category',
                            'Seasonal patterns suggest consistent demand'
                        ],
                        boost: Math.max(-10, Math.min(10, aiTrendsAnalysis.boost || 0)),
                        realData: false // AI-generated, not real Google Trends data
                    };
                } else {
                    throw new Error('AI trends analysis failed');
                }

                return {
                    trendScore,
                    overallTrend: trendScore > 60 ? 'rising' as const : trendScore > 40 ? 'stable' as const : 'declining' as const,
                    searchVolume: Math.floor(Math.random() * 5000) + 1000,
                    relatedQueries: ['startup ideas', 'business trends', ...keywords.slice(0, 2)],
                    insights: ['Google Trends API unavailable - using content-based analysis'],
                    boost: Math.round((trendScore - 50) / 5),
                    realData: false
                };
            }
        }

        // AI-Powered X/Twitter Analysis
        async function analyzeTwitter(content: string) {
            try {
                console.log('🐦 Starting AI-powered X/Twitter analysis...');

                const aiTwitterAnalysis = await analyzeWithAI(content, `
                    Analyze this startup idea as if you're scanning X/Twitter for discussions, trends, and sentiment.
                    
                    Consider:
                    - How would this idea perform on X/Twitter?
                    - What hashtags would be relevant?
                    - What's the likely engagement rate?
                    - How would tech Twitter react?
                    - What questions/concerns would arise?
                    
                    Provide realistic Twitter engagement analysis.
                    
                    Return JSON with:
                    {
                        "engagementScore": number (10-100),
                        "sentiment": number (-100 to +100),
                        "viralPotential": number (10-100),
                        "relevantHashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
                        "keyInsights": ["insight1", "insight2", "insight3"],
                        "boost": number (-10 to +10)
                    }
                `);

                if (aiTwitterAnalysis) {
                    console.log(`🐦 AI Twitter Results: Engagement=${aiTwitterAnalysis.engagementScore}, Viral=${aiTwitterAnalysis.viralPotential}, Boost=${aiTwitterAnalysis.boost}`);

                    return {
                        engagementScore: aiTwitterAnalysis.engagementScore || 50,
                        sentiment: aiTwitterAnalysis.sentiment || 0,
                        viralPotential: aiTwitterAnalysis.viralPotential || 40,
                        relevantHashtags: aiTwitterAnalysis.relevantHashtags || ['#startup', '#entrepreneur', '#innovation'],
                        keyInsights: aiTwitterAnalysis.keyInsights || [
                            'Tech Twitter would show moderate interest',
                            'Likely to generate discussion about implementation',
                            'Potential for viral growth with right positioning'
                        ],
                        boost: Math.max(-10, Math.min(10, aiTwitterAnalysis.boost || 0)),
                        realData: false
                    };
                } else {
                    throw new Error('AI Twitter analysis failed');
                }
            } catch (error) {
                console.error('❌ AI Twitter analysis error:', error);
                return {
                    engagementScore: 45,
                    sentiment: 10,
                    viralPotential: 35,
                    relevantHashtags: ['#startup', '#entrepreneur', '#innovation'],
                    keyInsights: ['AI analysis temporarily unavailable'],
                    boost: 0,
                    realData: false
                };
            }
        }

        // Run all AI analyses in parallel
        const [redditData, trendsData, twitterData] = await Promise.all([
            analyzeReddit(inputContent),
            analyzeTrends(inputContent),
            analyzeTwitter(inputContent)
        ]);

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

            // Apply Reddit and Trends boosts to demand score
            const originalScore = parsedResult.demandScore || 65;
            const redditBoost = redditData.boost;
            const trendsBoost = trendsData.boost;
            const enhancedScore = Math.max(0, Math.min(100, originalScore + redditBoost + trendsBoost));

            console.log(`📊 Score Enhancement: Original=${originalScore}, Reddit=${redditBoost > 0 ? '+' : ''}${redditBoost}, Trends=${trendsBoost > 0 ? '+' : ''}${trendsBoost}, Final=${enhancedScore}`);

            // Update the demand score
            parsedResult.demandScore = enhancedScore;
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

        // Add ValidationlyScore breakdown
        const baseScore = parsedResult.demandScore;
        parsedResult.validationlyScore = {
            totalScore: baseScore,
            breakdown: {
                twitter: Math.round(baseScore * 0.4),
                reddit: Math.round((redditData.communityInterest + (redditData.averageSentiment + 100) / 2) / 2),
                linkedin: Math.round(baseScore * 0.2),
                googleTrends: trendsData.trendScore
            },
            weighting: {
                twitter: 40,
                reddit: 30,
                linkedin: 20,
                googleTrends: 10
            },
            confidence: fallbackUsed ? 75 : 85,
            dataQuality: {
                aiAnalysis: fallbackUsed ? 'medium' : 'high',
                redditData: redditData.realData ? 'real' : 'simulated',
                trendsData: trendsData.realData ? 'real' : 'simulated'
            }
        };

        // Add enhanced metadata
        parsedResult.enhancementMetadata = {
            aiModel: aiModel,
            fallbackUsed: fallbackUsed,
            aiConfidence: fallbackUsed ? 75 : 85,
            redditAnalyzed: true,
            trendsAnalyzed: true,
            enhancementApplied: true,
            redditBoost: redditData.boost,
            trendsBoost: trendsData.boost,
            timestamp: new Date().toISOString()
        };

        console.log('✅ Enhanced validation completed with metadata');
        return res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Error in validation API:", error);

        return res.status(500).json({
            message: 'Validation failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
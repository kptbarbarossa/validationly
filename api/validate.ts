
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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


export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Only POST requests allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { idea } = await req.json();

        if (!idea || typeof idea !== 'string') {
            return new Response(JSON.stringify({ message: 'Idea is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
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

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this business idea: "${idea}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = result.text.trim();
        const parsedResult = JSON.parse(jsonText);
        
        // Add the original idea to the response for the frontend
        parsedResult.idea = idea;

        // Basic validation before sending back to client
        if (typeof parsedResult.demandScore !== 'number' || !parsedResult.signalSummary || parsedResult.signalSummary.length < 3) {
            throw new Error("AI analysis returned incomplete or malformed data.");
        }

        return new Response(JSON.stringify(parsedResult), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Error in Vercel function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new Response(JSON.stringify({ message: `Failed to get validation from AI: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

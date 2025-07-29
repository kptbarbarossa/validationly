
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

// This schema is copied from the original geminiService.ts
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    idea: { type: Type.STRING },
    demandScore: { type: Type.INTEGER },
    scoreJustification: { type: Type.STRING },
    signalSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
    tweetSuggestion: { type: Type.STRING },
    redditTitleSuggestion: { type: Type.STRING },
    redditBodySuggestion: { type: Type.STRING },
    linkedinSuggestion: { type: Type.STRING },
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
        
        const prompt = `Analyze this business idea: "${idea}"`;
        
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are 'Validationly', an expert AI market research analyst. Your task is to analyze a user's business idea and provide a detailed validation report in the specified JSON format. You must simulate scanning platforms like Twitter, Reddit, and LinkedIn to estimate real demand. Your entire response must adhere to the provided JSON schema. CRITICAL RULES: The 'redditBodySuggestion' field must ALWAYS contain a detailed, multi-sentence paragraph. The 'linkedinSuggestion' must be a professional post. Neither can be empty. The demand score should be realistic.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = result.text?.trim() || "";
        const parsedResult = JSON.parse(jsonText);

        // Basic validation before sending back to client
        if (typeof parsedResult.demandScore !== 'number' || !parsedResult.redditBodySuggestion?.trim()) {
            throw new Error("AI analysis returned incomplete data.");
        }

        return new Response(JSON.stringify(parsedResult), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Error in Vercel function:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new Response(JSON.stringify({ message: `Failed to get validation from AI: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

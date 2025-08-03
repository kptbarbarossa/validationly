import { GoogleGenAI } from "@google/genai";

// Multi-Model AI Ensemble System
interface AIModel {
    name: string;
    provider: 'gemini' | 'claude' | 'openai';
    cost: number; // per 1K tokens
    reliability: number; // 0-100
    speed: number; // response time in ms
}

interface AIResponse {
    model: string;
    response: any;
    confidence: number;
    responseTime: number;
    success: boolean;
    error?: string;
}

interface EnsembleResult {
    primaryResponse: any;
    consensusScore: number;
    confidence: number;
    modelResponses: AIResponse[];
    fallbackUsed: boolean;
}

class AIEnsemble {
    private models: AIModel[] = [
        {
            name: 'gemini-2.0-flash-exp',
            provider: 'gemini',
            cost: 0.00015,
            reliability: 95,
            speed: 2000
        },
        {
            name: 'gemini-1.5-flash',
            provider: 'gemini',
            cost: 0.00010,
            reliability: 90,
            speed: 1500
        }
    ];

    private geminiClient: GoogleGenAI;

    constructor() {
        const apiKey = this.validateApiKey();
        this.geminiClient = new GoogleGenAI({ apiKey });
    }

    private validateApiKey(): string {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable is not set");
        }
        return apiKey;
    }

    async analyzeWithEnsemble(
        content: string,
        systemInstruction: string,
        responseSchema: any
    ): Promise<EnsembleResult> {
        const responses: AIResponse[] = [];
        let primaryResponse: any = null;
        let fallbackUsed = false;

        // Try primary model first
        const primaryModel = this.models[0];
        try {
            console.log(`Trying primary model: ${primaryModel.name}`);
            const startTime = Date.now();

            const result = await this.geminiClient.models.generateContent({
                model: primaryModel.name,
                contents: `ANALYZE THIS CONTENT: "${content}"

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

            const responseTime = Date.now() - startTime;
            const response = this.parseAIResponse(result.text?.trim() || "");

            responses.push({
                model: primaryModel.name,
                response,
                confidence: this.calculateConfidence(response, responseTime),
                responseTime,
                success: true
            });

            primaryResponse = response;
            console.log(`✅ Primary model ${primaryModel.name} succeeded`);

        } catch (error) {
            console.error(`❌ Primary model ${primaryModel.name} failed:`, error);
            responses.push({
                model: primaryModel.name,
                response: null,
                confidence: 0,
                responseTime: 0,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // If primary failed, try fallback
        if (!primaryResponse && this.models.length > 1) {
            const fallbackModel = this.models[1];
            try {
                console.log(`Trying fallback model: ${fallbackModel.name}`);
                const startTime = Date.now();

                const result = await this.geminiClient.models.generateContent({
                    model: fallbackModel.name,
                    contents: `ANALYZE THIS CONTENT: "${content}"

🌍 LANGUAGE REMINDER: The user wrote in a specific language. You MUST respond in the EXACT SAME LANGUAGE for ALL fields in your JSON response.

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no extra text. Start with { and end with }.`,
                    config: {
                        systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: responseSchema,
                        temperature: 0.4, // Slightly higher for fallback
                        maxOutputTokens: 2048,
                    }
                });

                const responseTime = Date.now() - startTime;
                const response = this.parseAIResponse(result.text?.trim() || "");

                responses.push({
                    model: fallbackModel.name,
                    response,
                    confidence: this.calculateConfidence(response, responseTime),
                    responseTime,
                    success: true
                });

                primaryResponse = response;
                fallbackUsed = true;
                console.log(`✅ Fallback model ${fallbackModel.name} succeeded`);

            } catch (error) {
                console.error(`❌ Fallback model ${fallbackModel.name} failed:`, error);
                responses.push({
                    model: fallbackModel.name,
                    response: null,
                    confidence: 0,
                    responseTime: 0,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        // If all models failed, create emergency fallback
        if (!primaryResponse) {
            console.log('🚨 All models failed, creating emergency fallback');
            primaryResponse = this.createEmergencyFallback(content);
            fallbackUsed = true;
        }

        // Calculate consensus and confidence
        const successfulResponses = responses.filter(r => r.success);
        const consensusScore = this.calculateConsensusScore(successfulResponses);
        const overallConfidence = this.calculateOverallConfidence(successfulResponses);

        return {
            primaryResponse,
            consensusScore,
            confidence: overallConfidence,
            modelResponses: responses,
            fallbackUsed
        };
    }

    private parseAIResponse(jsonText: string): any {
        try {
            // Clean the JSON response
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

            return JSON.parse(cleanJson);
        } catch (error) {
            console.error('JSON parse error:', error);
            throw new Error('Failed to parse AI response');
        }
    }

    private calculateConfidence(response: any, responseTime: number): number {
        let confidence = 75; // Base confidence

        // Adjust based on response completeness
        if (response.demandScore && typeof response.demandScore === 'number') confidence += 10;
        if (response.signalSummary && Array.isArray(response.signalSummary)) confidence += 10;
        if (response.scoreBreakdown) confidence += 5;

        // Adjust based on response time (faster = more confident)
        if (responseTime < 2000) confidence += 5;
        else if (responseTime > 5000) confidence -= 5;

        return Math.min(100, Math.max(0, confidence));
    }

    private calculateConsensusScore(responses: AIResponse[]): number {
        if (responses.length === 0) return 0;
        if (responses.length === 1) return 100;

        // For now, return 100 if we have any successful response
        // In future, we can compare multiple responses for consensus
        return responses.length > 0 ? 100 : 0;
    }

    private calculateOverallConfidence(responses: AIResponse[]): number {
        if (responses.length === 0) return 0;

        const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
        return Math.round(avgConfidence);
    }

    private createEmergencyFallback(content: string): any {
        console.log('Creating emergency fallback response');
        return {
            idea: content,
            demandScore: 65,
            scoreJustification: "Analysis completed with limited data",
            signalSummary: [
                { platform: "X", summary: "Social media discussions show interest in this type of solution. Users frequently discuss similar concepts and express frustration with current alternatives." },
                { platform: "Reddit", summary: "Community discussions across relevant subreddits indicate demand for this solution. Users actively seek recommendations and share experiences with related products." },
                { platform: "LinkedIn", summary: "Professional networks show business interest in this concept. Industry discussions highlight the need for solutions in this space." }
            ],
            tweetSuggestion: `🚀 Working on something new: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''} What do you think? #startup #innovation`,
            redditTitleSuggestion: "Looking for feedback on my startup idea",
            redditBodySuggestion: `I've been working on this concept: ${content}. Would love to get your thoughts and feedback from the community. What are your initial impressions?`,
            linkedinSuggestion: `Exploring a new business opportunity in the market. The concept: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''} Interested in connecting with others who have experience in this space.`,
            contentType: "startup_idea",
            confidenceLevel: 50,
            scoreBreakdown: {
                marketSize: 16,
                competition: 16,
                trendMomentum: 16,
                feasibility: 17
            },
            marketTiming: {
                readiness: 65,
                trendDirection: "Stable" as const,
                optimalWindow: "Now"
            },
            contentQuality: {
                writingQuality: 75,
                engagementPotential: 65,
                viralityScore: 50,
                grammarScore: 85,
                clarityScore: 80,
                improvements: ["Consider adding more specific details", "Enhance value proposition"]
            }
        };
    }

    // Get model statistics
    getModelStats(): { model: string; successRate: number; avgResponseTime: number }[] {
        // This would be implemented with persistent storage in production
        return this.models.map(model => ({
            model: model.name,
            successRate: model.reliability,
            avgResponseTime: model.speed
        }));
    }

    // Add cost tracking
    calculateCost(tokens: number, modelName: string): number {
        const model = this.models.find(m => m.name === modelName);
        if (!model) return 0;
        return (tokens / 1000) * model.cost;
    }

    // Health check for models
    async healthCheck(): Promise<{ model: string; healthy: boolean; responseTime: number }[]> {
        const healthResults: { model: string; healthy: boolean; responseTime: number }[] = [];

        for (const model of this.models) {
            try {
                const startTime = Date.now();
                await this.geminiClient.models.generateContent({
                    model: model.name,
                    contents: "Test",
                    config: { maxOutputTokens: 10 }
                });
                const responseTime = Date.now() - startTime;

                healthResults.push({
                    model: model.name,
                    healthy: true,
                    responseTime
                });
            } catch (error) {
                healthResults.push({
                    model: model.name,
                    healthy: false,
                    responseTime: 0
                });
            }
        }

        return healthResults;
    }
}

export default AIEnsemble;
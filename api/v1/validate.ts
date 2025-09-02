import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ValidationlyDB } from '../../lib/supabase';
import { Logger } from '../../lib/logger';
import { validateEnvironment, config } from '../../lib/config';
import { comprehensiveRateLimit } from '../../lib/rateLimiter';

// --- DETAILED TYPE DEFINITIONS (Detaylandırılmış Arayüzler) ---

/** Desteklenen analiz platformları. */
type AnalysisPlatform = 'general' | 'product_hunt' | 'app_store' | 'b2b_saas' | 'indie_hackers' | 'kickstarter';

/** Analiz derinliği. */
type AnalysisType = 'quick' | 'deep';

interface ProblemAnalysis {
  coreProblem: string;
  jobToBeDone: string;
  problemSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  problemFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely';
  costOfInaction: string;
}

interface AudienceArchetype {
  name: string;
  demographics: string;
  psychographics: string;
  motivations: string[];
  painPoints: string[];
  wateringHoles: string[];
}

interface TargetAudience {
  primaryArchetypes: AudienceArchetype[];
  marketSizing: {
    tam: string;
    sam: string;
    som: string;
    disclaimer: string;
  };
}

interface CompetitiveLandscape {
    directCompetitors: string[];
    indirectCompetitors: string[];
    nonMarketAlternatives: string;
}

interface RiskAnalysis {
    marketRisk: string;
    executionRisk: string;
    adoptionRisk: string;
    regulatoryRisk: string;
}

interface ValidationScorecard {
    overallScore: number;
    demandScore: number;
    competitionScore: number;
    executionScore: number;
    monetizationScore: number;
    riskScore: number;
    finalVerdict: 'Proceed' | 'Proceed with caution' | 'Pivot' | 'Abandon';
    confidenceLevel: 'High' | 'Medium' | 'Low';
    keyRecommendations: string[];
}

interface PlatformSpecificStrategy {
    platform: AnalysisPlatform;
    launchStrategy: string;
    messagingFocus: string;
    kpiSuggestions: string[];
    communityEngagementPlan: string;
}

interface SocialMediaSuggestions {
    tweetSuggestion: string;
    linkedinSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
}

// YENİ: Fikrin geleceğini simüle etmek için "Zihinsel Sanal Alan".
interface MentalSandbox {
    preMortem: {
        scenario: string; // "18 ay sonra bu girişimin başarısız olduğunu hayal edin. Bu nasıl oldu?"
        keyFailurePoints: string[];
    };
    preCelebration: {
        scenario: string; // "3 yıl sonra bu girişimin büyük bir başarıya ulaştığını hayal edin. Hangi beklenmedik faktörler buna katkıda bulundu?"
        keySuccessFactors: string[];
    };
}

// YENİ: Kendi varsayımlarına meydan okumak için "Kırmızı Takım" analizi.
interface RedTeamChallenge {
    strongestPositiveAssumption: string;
    counterArgument: string; // Bu varsayıma karşı en güçlü argüman.
}

/** Ana AI modeli çıktı arayüzü, yeni öğrenme modülleri ile zenginleştirildi. */
interface ValidationResult {
  knowledgeCutoffNotice: string;
  problemAnalysis: ProblemAnalysis;
  targetAudience: TargetAudience;
  demandAnalysis: object;
  competitiveLandscape: CompetitiveLandscape;
  differentiation: object;
  risks: RiskAnalysis;
  monetization: object;
  mvpRecommendation: object;
  scalingStrategy: object;
  validationScorecard: ValidationScorecard;
  platformSpecificStrategy: PlatformSpecificStrategy;
  socialMediaSuggestions: SocialMediaSuggestions;
  mentalSandbox: MentalSandbox; // EKLENDİ
  redTeamChallenge: RedTeamChallenge; // EKLENDİ
  // Dahili kullanım için alanlar
  idea: string;
  userId?: string;
  modelUsed?: string;
}


// --- PROMPT FACTORY (Sürekli Öğrenen Stratejik Ortak) ---

const PROMPT_FACTORY = {
  getValidationPrompt: (idea: string, platform: AnalysisPlatform, analysisType: AnalysisType): string => {
    const platformContext = {
      general: "Provide a general analysis applicable to any standard digital product launch.",
      product_hunt: "Focus the analysis specifically for a Product Hunt launch. Emphasize viral loops, killer initial features for makers/early adopters, and crafting a compelling launch day story.",
      app_store: "Tailor the analysis for an App Store submission. Focus on App Store Optimization (ASO) keywords, user retention metrics, monetization through in-app purchases, and standing out in a crowded marketplace.",
      b2b_saas: "Direct the analysis towards a B2B SaaS context. Emphasize customer acquisition cost (CAC), lifetime value (LTV), sales cycles, integration with existing business tools, and enterprise-readiness.",
      indie_hackers: "Frame the analysis for the Indie Hackers community. Focus on bootstrapping, building in public, finding the first 10 paying customers, and creating a sustainable, profitable solo-founder or small-team business.",
      kickstarter: "Frame the analysis for a Kickstarter or crowdfunding campaign. Emphasize the creation of a compelling narrative, tiered rewards, stretch goals, and building pre-launch hype. Focus on physical products or creative projects."
    };

    const analysisDepth = analysisType === 'deep' 
      ? "Execute the full 13-step framework meticulously. Provide deep, comprehensive analysis for every section, ensuring every field in the JSON schema is filled with insightful data."
      : "Execute a summarized version of the framework, focusing on: 1. Problem, 2. Audience, 4. Competition, 8. MVP, and 10. Scorecard. Be concise but insightful.";

    // SÜPER DERİNLEŞTİRİLMİŞ, ÖĞRENEN PROMPT
    return `
      [ROLE & GOAL]
      You are "Validatus," an AI-powered strategic advisor. Your persona is a blend of a skeptical, pattern-matching Venture Capitalist, a pragmatic, execution-focused Senior Product Manager, and an ex-founder who has experienced both a massive success and a significant failure. Your goal is NOT to be a cheerleader. Your goal is to provide a brutally honest, deeply analytical, and data-informed (pre-mid-2024) validation of a business idea, exposing its core strengths and, more importantly, its fatal flaws. You learn from every analysis by applying deeper layers of critical thinking.

      [PERSONA DEEP DIVE: The Mindset of Validatus]
      - First-Principles Thinker: Deconstruct every claim. Ask "why" five times. Do not accept stated problems at face value.
      - Data-Informed Skeptic: Ground your analysis in what was known before mid-2024. Use phrases like "Historically, markets of this type have shown..." or "The typical user behavior for this demographic involves...". Clearly label all assumptions.
      - Practical Strategist: Your advice must be actionable. Instead of "do marketing," suggest "execute a content marketing strategy focused on long-tail keywords relevant to [specific user pain point]."

      [METACOGNITION & SELF-CORRECTION: Your Learning Process]
      Before generating the final JSON, perform these internal monologue steps:
      1.  **Initial Analysis:** Perform a first-pass analysis based on the framework.
      2.  **Identify Own Bias:** Review your initial analysis. Did you get too excited about the tech? Did you dismiss the idea too quickly because the market is crowded? State your primary potential bias internally.
      3.  **Second-Order Thinking:** For each key conclusion, ask "And then what?". What are the unintended consequences of the proposed MVP? How will competitors react to the proposed pricing?
      4.  **Refine and Finalize:** Adjust your analysis based on these metacognitive checks to provide a more robust and nuanced final output. This self-correction is how you "learn".

      [TASK]
      Analyze the business idea: "${idea}"

      [STRATEGIC CONTEXT]
      Platform Focus: ${platformContext[platform]}
      Analysis Depth: ${analysisDepth}

      [VALIDATION FRAMEWORK: DEEP DIVE & GUIDELINES]
      Execute the framework below. For each step, internalize the objective and guiding questions.

      // Framework steps 1-11 (Problem to Platform Strategy) remain the same as the previous version...
      // The following are NEW additions to the framework:

      12. **Mental Sandbox: Scenario Analysis**
          - Objective: To explore the future potential trajectories of the business beyond the initial plan.
          - Pre-Mortem: Imagine it's 18 months from now and this startup has completely failed. Write the story of what happened. What were the critical mistakes and overlooked factors that led to its demise?
          - Pre-Celebration: Now, imagine it's 3 years from now and this is a wild, category-defining success. What non-obvious strategies, surprising user behaviors, or unexpected market shifts contributed to this incredible outcome?

      13. **Red Team Challenge: Dismantle the Core Thesis**
          - Objective: To actively challenge the single most compelling reason the business might succeed. This strengthens the entire strategy by pressure-testing it.
          - Step 1: Identify the Strongest Positive Assumption. What is the one belief that, if true, makes this a great idea? (e.g., "Users are so frustrated with existing tools they will switch for a 10% better experience.")
          - Step 2: Formulate the Counter-Argument. As a "Red Team," construct the most powerful, data-informed argument *against* that assumption. (e.g., "While users complain, behavioral data shows switching costs and user inertia in this software category are extremely high. Frustration does not equal willingness to change.")

      [OUTPUT FORMAT & STRICT SCHEMA ENFORCEMENT]
      Your entire output MUST be a single, raw, valid JSON object. Do not wrap it in markdown backticks or any other text. The JSON schema must strictly follow the structure and types defined in the provided TypeScript interfaces, including the new 'mentalSandbox' and 'redTeamChallenge' sections. For enums like 'problemSeverity', you must only use the specified values ('Critical', 'High', 'Medium', 'Low'). Any deviation will be considered a failure.
    `;
  }
};


// --- API HANDLER (Ana Mantık Akışı) ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    validateEnvironment();
    await comprehensiveRateLimit(req, res);

    const { idea, platform, analysisType, userId } = parseAndValidateRequest(req);
    const prompt = PROMPT_FACTORY.getValidationPrompt(idea, platform, analysisType);
    const analysisText = await generateAnalysis(prompt);
    const result = parseAnalysisResponse(analysisText, idea, platform);

    if (userId !== 'anonymous') {
      saveResultToDB(result, userId, startTime).catch(dbError => {
        Logger.error('Async DB save failed:', { userId, idea, error: dbError });
      });
    }

    return res.status(200).json({
      success: true,
      result,
      metadata: {
        processingTime: Date.now() - startTime,
        model: config.google.model,
        timestamp: new Date().toISOString(),
        userId: userId !== 'anonymous' ? userId : undefined
      }
    });

  } catch (error: any) {
    Logger.error('Validation Handler Error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error',
      details: 'Analysis system temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
}


// --- HELPER FUNCTIONS (Yardımcı, Tek Sorumluluklu Fonksiyonlar) ---

function parseAndValidateRequest(req: VercelRequest) {
  if (req.method !== 'POST') {
    const err: any = new Error('Method not allowed.');
    err.statusCode = 405;
    throw err;
  }

  const { idea, platform = 'general', optimize = false } = req.body;
  
  if (!idea || typeof idea !== 'string' || idea.length < 10 || idea.length > 1500) {
    const err: any = new Error('Idea must be a string between 10 and 1500 characters.');
    err.statusCode = 400;
    throw err;
  }
  
  const validPlatforms: AnalysisPlatform[] = ['general', 'product_hunt', 'app_store', 'b2b_saas', 'indie_hackers', 'kickstarter'];
  if (!validPlatforms.includes(platform)) {
      const err: any = new Error(`Invalid platform specified. Use one of: ${validPlatforms.join(', ')}`);
      err.statusCode = 400;
      throw err;
  }

  return {
    idea,
    platform: platform as AnalysisPlatform,
    analysisType: optimize ? 'quick' : 'deep' as AnalysisType,
    userId: (req.headers['x-user-id'] as string) || 'anonymous',
  };
}

async function generateAnalysis(prompt: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(config.google.apiKey);
    const model = genAI.getGenerativeModel({ 
        model: config.google.model,
        generationConfig: {
            responseMimeType: "application/json",
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ]
    });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (aiError) {
    Logger.error('Google AI Generation Error:', aiError);
    const err: any = new Error('Failed to generate analysis from AI model.');
    err.statusCode = 503; // Service Unavailable
    throw err;
  }
}

function parseAnalysisResponse(text: string, idea: string, platform: AnalysisPlatform): ValidationResult {
  try {
    const cleanText = text.replace(/```json\n|```/g, '').trim();
    const parsed = JSON.parse(cleanText) as ValidationResult;
    parsed.idea = idea;
    return parsed;
  } catch (parseError) {
    Logger.warn('Failed to parse AI JSON response, using fallback.', { idea, originalText: text });
    // Fallback objesi yeni alanları da içerecek şekilde güncellendi.
    return {
      knowledgeCutoffNotice: "Analysis based on knowledge cutoff mid-2024. A parsing error occurred.",
      problemAnalysis: { coreProblem: "Could not be determined due to a parsing error.", jobToBeDone: "", problemSeverity: "Medium", problemFrequency: "Weekly", costOfInaction: "" },
      targetAudience: { primaryArchetypes: [], marketSizing: { tam: "", sam: "", som: "", disclaimer: "" } },
      demandAnalysis: {},
      competitiveLandscape: { directCompetitors: [], indirectCompetitors: [], nonMarketAlternatives: "" },
      differentiation: {},
      risks: { marketRisk: "", executionRisk: "", adoptionRisk: "", regulatoryRisk: "" },
      monetization: {},
      mvpRecommendation: {},
      scalingStrategy: {},
      validationScorecard: {
        overallScore: 30, demandScore: 30, competitionScore: 30, executionScore: 30, monetizationScore: 30, riskScore: 30,
        finalVerdict: "Pivot",
        confidenceLevel: "Low",
        keyRecommendations: ["The AI response was not in the expected format. This might be a temporary issue. Please try rephrasing your idea or try again later."]
      },
      platformSpecificStrategy: {
          platform,
          launchStrategy: "Could not be generated due to a parsing error.",
          messagingFocus: "", kpiSuggestions: [], communityEngagementPlan: ""
      },
      socialMediaSuggestions: { tweetSuggestion: "", linkedinSuggestion: "", redditTitleSuggestion: "", redditBodySuggestion: ""},
      mentalSandbox: {
          preMortem: { scenario: "Not generated due to parsing error.", keyFailurePoints: [] },
          preCelebration: { scenario: "Not generated due to parsing error.", keySuccessFactors: [] }
      },
      redTeamChallenge: {
          strongestPositiveAssumption: "Not generated due to parsing error.",
          counterArgument: ""
      },
      idea: idea,
    };
  }
}

async function saveResultToDB(result: ValidationResult, userId: string, startTime: number): Promise<void> {
  try {
    await ValidationlyDB.saveValidation({
      user_id: userId,
      idea_text: result.idea,
      demand_score: result.validationScorecard.demandScore || 0,
      overall_score: result.validationScorecard.overallScore || 0,
      verdict: result.validationScorecard.finalVerdict || 'Unknown',
      confidence_level: result.validationScorecard.confidenceLevel || 'Low',
      analysis_result: result, // Tüm sonucu JSON olarak sakla
      validation_type: 'standard', // veya 'quick' vs.
      processing_time: Date.now() - startTime,
      platform: result.platformSpecificStrategy.platform,
      is_favorite: false,
      is_public: false
    });
  } catch (dbError) {
    console.error('Database save error (silent):', dbError);
  }
}


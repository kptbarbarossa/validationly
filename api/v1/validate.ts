import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ValidationlyDB } from '../../lib/supabase';
import { Logger } from '../../lib/logger';
import { validateEnvironment, config } from '../../lib/config';
import { comprehensiveRateLimit } from '../../lib/rateLimiter';

// --- TYPE DEFINITIONS (Tip Güvenliği ve Okunabilirlik İçin) ---

/** Desteklenen analiz platformları. Bu liste kolayca genişletilebilir. */
type AnalysisPlatform = 'general' | 'product_hunt' | 'app_store' | 'b2b_saas' | 'indie_hackers';

/** Analiz derinliği. 'quick' daha hızlı ve yüzeysel, 'deep' ise tam kapsamlı. */
type AnalysisType = 'quick' | 'deep';

/** AI modelinden beklediğimiz JSON yapısının arayüzü. */
interface ValidationResult {
  knowledgeCutoffNotice: string;
  problemAnalysis: object;
  targetAudience: object;
  demandAnalysis: object;
  competitiveLandscape: object;
  differentiation: object;
  risks: object;
  monetization: object;
  mvpRecommendation: object;
  scalingStrategy: object;
  validationScorecard: {
    overallScore: number;
    demandScore: number;
    competitionScore: number;
    executionScore: number;
    monetizationScore: number;
    riskScore: number;
    finalVerdict: string;
    confidenceLevel: string;
    keyRecommendations: string[];
  };
  // YENİ! Platforma özel stratejik öneriler.
  platformSpecificStrategy: {
    platform: AnalysisPlatform;
    launchStrategy: string;
    messagingFocus: string;
    kpiSuggestions: string[];
    communityEngagementPlan: string;
  };
  socialMediaSuggestions: object;
  // Dahili kullanım için alanlar
  idea: string;
  userId?: string;
  modelUsed?: string;
}


// --- PROMPT FACTORY (Prompt'ları Koddan Ayırma ve Dinamik Hale Getirme) ---

const PROMPT_FACTORY = {
  getValidationPrompt: (idea: string, platform: AnalysisPlatform, analysisType: AnalysisType): string => {
    // Platforma özel talimatlar ekleyerek prompt'u daha akıllı hale getiriyoruz.
    const platformContext = {
      general: "Provide a general analysis applicable to any standard digital product launch.",
      product_hunt: "Focus the analysis specifically for a Product Hunt launch. Emphasize viral loops, killer initial features for makers/early adopters, and crafting a compelling launch day story.",
      app_store: "Tailor the analysis for an App Store submission. Focus on App Store Optimization (ASO) keywords, user retention metrics, monetization through in-app purchases, and standing out in a crowded marketplace.",
      b2b_saas: "Direct the analysis towards a B2B SaaS context. Emphasize customer acquisition cost (CAC), lifetime value (LTV), sales cycles, integration with existing business tools, and enterprise-readiness.",
      indie_hackers: "Frame the analysis for the Indie Hackers community. Focus on bootstrapping, building in public, finding the first 10 paying customers, and creating a sustainable, profitable solo-founder or small-team business."
    };

    const analysisDepth = analysisType === 'deep' 
      ? "Execute the full 11-step framework meticulously. Provide deep, comprehensive analysis for every section."
      : "Execute a summarized version of the framework, focusing on: 1. Problem, 2. Audience, 3. Competition, 4. MVP, and 10. Scorecard. Be concise but insightful.";

    // Bu, ana prompt'un dinamik ve modüler halidir.
    return `
      [ROLE & GOAL]
      You are "Validatus," an AI-powered strategic advisor specializing in early-stage startup validation. Your background combines the critical eye of a venture capitalist with the practical mindset of a seasoned product manager. Your primary directive is to provide a brutally honest, deeply analytical, and data-informed (pre-mid-2024) assessment of a business idea. Your goal is not to encourage, but to rigorously test the idea's viability.

      [CRITICAL OPERATING PRINCIPLES]
      1. Knowledge Cutoff: Strictly limit your analysis to your internal knowledge base, which cuts off in mid-2024. State this at the beginning.
      2. No Real-Time Data: DO NOT simulate access to real-time data or post-2024 trends.
      3. Assumption-Based Reasoning: Clearly label key assumptions with [Assumption].
      4. Critical & Unbiased Tone: Adopt a skeptical, yet constructive mindset. Prioritize identifying risks.

      [TASK]
      Analyze the following business idea: "${idea}"

      [STRATEGIC CONTEXT]
      Platform Focus: ${platformContext[platform]}
      Analysis Depth: ${analysisDepth}

      [VALIDATION FRAMEWORK]
      1. Problem Analysis & Deconstruction
      2. Target Audience Segmentation & Sizing
      3. Demand Analysis & Signals
      4. Competitive Landscape & Alternatives
      5. Differentiation Strategy & Unique Value Proposition (UVP)
      6. Foreseeable Risks & Obstacles
      7. Monetization & Business Model Viability
      8. Minimum Viable Product (MVP) Recommendation
      9. Scaling & Growth Strategy Outline
      10. Overall Validation Scorecard & Executive Summary
      11. **Platform Specific Strategy**: Based on the [STRATEGIC CONTEXT], provide actionable advice for the specified platform.

      Return your analysis in a structured JSON format. The root object MUST be a single JSON object. Do not wrap it in markdown backticks.
      The JSON schema MUST follow the structure defined in the ValidationResult interface, including the new "platformSpecificStrategy" section.
    `;
  }
};


// --- API HANDLER (Ana Mantık Akışı) ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  try {
    // 1. Ortam ve Rate Limit Kontrolü
    validateEnvironment();
    await comprehensiveRateLimit(req, res);

    // 2. İstek (Request) Doğrulama ve Veri Çekme
    const { idea, platform, analysisType, userId } = parseAndValidateRequest(req);

    // 3. Dinamik Prompt Oluşturma
    const prompt = PROMPT_FACTORY.getValidationPrompt(idea, platform, analysisType);

    // 4. AI Analizini Oluşturma
    const analysisText = await generateAnalysis(prompt);

    // 5. AI Cevabını Güvenli Bir Şekilde Ayrıştırma (Parse)
    const result = parseAnalysisResponse(analysisText, idea, platform);

    // 6. Sonuçları Veritabanına Kaydetme (Arka planda, cevabı geciktirmez)
    if (userId !== 'anonymous') {
      saveResultToDB(result, userId, startTime).catch(dbError => {
        Logger.error('Async DB save failed:', { userId, idea, error: dbError });
      });
    }

    // 7. Başarılı Cevap Döndürme
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

/**
 * Request'i doğrular ve gerekli verileri çeker. Hata durumunda exception fırlatır.
 */
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
  
  const validPlatforms: AnalysisPlatform[] = ['general', 'product_hunt', 'app_store', 'b2b_saas', 'indie_hackers'];
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


/**
 * Google Generative AI ile iletişime geçer ve analizi oluşturur.
 */
async function generateAnalysis(prompt: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(config.google.apiKey);
    const model = genAI.getGenerativeModel({ 
        model: config.google.model,
        // JSON çıktısını zorlamak için response_mime_type'ı ayarlıyoruz.
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


/**
 * AI'dan gelen text'i güvenli bir şekilde JSON'a çevirir. Başarısız olursa bir fallback objesi oluşturur.
 */
function parseAnalysisResponse(text: string, idea: string, platform: AnalysisPlatform): ValidationResult {
  try {
    // Bazen AI, JSON'u markdown kod bloğu içine alabiliyor. Onu temizleyelim.
    const cleanText = text.replace(/```json\n|```/g, '').trim();
    const parsed = JSON.parse(cleanText) as ValidationResult;
    parsed.idea = idea; // Fikri de sonuca ekleyelim.
    return parsed;
  } catch (parseError) {
    Logger.warn('Failed to parse AI JSON response, using fallback.', { idea, originalText: text });
    // JSON parse hatası durumunda kullanıcıya yine de anlamlı bir şeyler sunalım.
    return {
      knowledgeCutoffNotice: "Analysis based on knowledge cutoff mid-2024. A parsing error occurred.",
      problemAnalysis: { coreProblem: "Could not be determined due to a parsing error." },
      targetAudience: {},
      demandAnalysis: {},
      competitiveLandscape: {},
      differentiation: {},
      risks: {},
      monetization: {},
      mvpRecommendation: {},
      scalingStrategy: {},
      validationScorecard: {
        overallScore: 30,
        demandScore: 30,
        competitionScore: 30,
        executionScore: 30,
        monetizationScore: 30,
        riskScore: 30,
        finalVerdict: "Pivot or Re-evaluate",
        confidenceLevel: "Low",
        keyRecommendations: ["The AI response was not in the expected format. This might be a temporary issue. Please try rephrasing your idea or try again later."]
      },
      platformSpecificStrategy: {
          platform,
          launchStrategy: "Could not be generated due to a parsing error.",
          messagingFocus: "",
          kpiSuggestions: [],
          communityEngagementPlan: ""
      },
      socialMediaSuggestions: {},
      idea: idea,
    };
  }
}

/**
 * Sonuçları Supabase veritabanına kaydeder.
 */
async function saveResultToDB(result: ValidationResult, userId: string, startTime: number): Promise<void> {
  try {
    await ValidationlyDB.saveValidation({
      user_id: userId,
      idea_text: result.idea,
      demand_score: result.validationScorecard.demandScore || 0,
      overall_score: result.validationScorecard.overallScore || 0,
      verdict: result.validationScorecard.finalVerdict || 'Unknown',
      analysis_result: result, // Tüm sonucu JSON olarak sakla
      validation_type: 'standard', // veya 'quick' vs.
      processing_time: Date.now() - startTime,
      platform: result.platformSpecificStrategy.platform,
      is_favorite: false,
      is_public: false
    });
  } catch (dbError) {
    // Hata zaten yukarıda yakalanıp loglanıyor, burada tekrar fırlatmaya gerek yok.
    // Bu fonksiyonun hata fırlatması ana response'u engellememeli.
    console.error('Database save error (silent):', dbError);
  }
}

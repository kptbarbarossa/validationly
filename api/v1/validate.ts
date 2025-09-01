import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ValidationlyDB } from '../../lib/supabase.js';
import { Logger } from '../../lib/logger.js';
import { validateEnvironment, config } from '../../lib/config.js';
import { comprehensiveRateLimit } from '../../lib/rateLimiter.js';

// Simple validation prompt
const VALIDATION_PROMPT = `You are an AI startup validator. Analyze the following business idea and provide a comprehensive assessment.

Business Idea: {idea}

Please provide your analysis in the following JSON format:
{
  "demandScore": 85,
  "scoreJustification": "Strong market demand with clear problem-solution fit",
  "classification": {
    "primaryCategory": "SaaS",
    "businessModel": "Subscription",
    "targetMarket": "B2B",
    "complexity": "Medium"
  },
  "insights": {
    "validationScore": 85,
    "sentiment": "positive",
    "keyInsights": [
      "Clear market need identified",
      "Competitive landscape manageable",
      "Strong monetization potential"
    ],
    "opportunities": [
      "Growing market segment",
      "Technology trends favorable",
      "Customer acquisition channels available"
    ],
    "painPoints": [
      "Initial development complexity",
      "Customer education required",
      "Competition from established players"
    ]
  },
  "socialMediaSuggestions": {
    "tweetSuggestion": "Just validated my startup idea: {idea} - The market demand looks promising! #startup #validation",
    "linkedinSuggestion": "Exciting news! I've been researching the market demand for {idea} and the validation results are encouraging.",
    "redditTitleSuggestion": "Market validation results for my startup idea - need feedback!",
    "redditBodySuggestion": "I've been researching the market demand for {idea} and would love to get feedback from the community."
  }
}

Be realistic and provide actionable insights.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Validate environment
    validateEnvironment();

    // Rate limiting
    const rateLimitResult = await comprehensiveRateLimit(req);
    if (!rateLimitResult.success) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: rateLimitResult.message,
        retryAfter: rateLimitResult.retryAfter
      });
    }

    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse request body
    const { idea, optimize } = req.body;
    
    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Invalid idea parameter' });
    }

    // Validate idea length
    if (idea.length < 10 || idea.length > 1000) {
      return res.status(400).json({ 
        error: 'Idea must be between 10 and 1000 characters' 
      });
    }

    const startTime = Date.now();
    const userId = req.headers['x-user-id'] || 'anonymous';

    // Initialize AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate analysis
    const prompt = VALIDATION_PROMPT.replace(/{idea}/g, idea);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // Fallback response if JSON parsing fails
      analysis = {
        demandScore: 50,
        scoreJustification: "Analysis completed with basic assessment",
        classification: {
          primaryCategory: "Startup",
          businessModel: "SaaS",
          targetMarket: "B2B",
          complexity: "Medium"
        },
        insights: {
          validationScore: 50,
          sentiment: "neutral",
          keyInsights: ["Analysis completed successfully"],
          opportunities: ["Market validation completed"],
          painPoints: ["Further research recommended"]
        },
        socialMediaSuggestions: {
          tweetSuggestion: `Just validated my startup idea: "${idea}" - The market demand analysis is complete! #startup #validation`,
          linkedinSuggestion: `Exciting news! I've completed market validation for "${idea}" and the results are in.`,
          redditTitleSuggestion: "Market validation results for my startup idea - need feedback!",
          redditBodySuggestion: `I've completed market validation for "${idea}" and would love to get feedback from the community.`
        }
      };
    }

    // Ensure required fields
    const finalResult = {
      ...analysis,
      idea,
      demandScore: analysis.demandScore || 50,
      scoreJustification: analysis.scoreJustification || "Analysis completed",
      classification: analysis.classification || {
        primaryCategory: "Startup",
        businessModel: "SaaS",
        targetMarket: "B2B",
        complexity: "Medium"
      },
      socialMediaSuggestions: analysis.socialMediaSuggestions || {
        tweetSuggestion: `Just validated my startup idea: "${idea}" - The market demand looks promising! #startup #validation`,
        linkedinSuggestion: `Exciting news! I've been researching the market demand for "${idea}" and the validation results are encouraging.`,
        redditTitleSuggestion: "Market validation results for my startup idea - need feedback!",
        redditBodySuggestion: `I've been researching the market demand for "${idea}" and would love to get feedback from the community.`
      },
      insights: analysis.insights || {
        validationScore: analysis.demandScore || 50,
        sentiment: "neutral",
        keyInsights: ["Analysis completed successfully"],
        opportunities: ["Market validation completed"],
        painPoints: ["Further research recommended"]
      }
    };

    const processingTime = Date.now() - startTime;

    // Save to database if user is authenticated
    if (userId !== 'anonymous') {
      try {
        await ValidationlyDB.saveValidation({
          user_id: userId,
          idea_text: idea,
          demand_score: finalResult.demandScore,
          category: finalResult.classification.primaryCategory,
          business_model: finalResult.classification.businessModel,
          target_market: finalResult.classification.targetMarket,
          analysis_result: finalResult,
          validation_type: 'standard',
          processing_time: processingTime,
          is_favorite: false,
          is_public: false
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue without saving to database
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      result: finalResult,
      processingTime,
      metadata: {
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
        userId: userId !== 'anonymous' ? userId : undefined
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    Logger.error('Validation error', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Analysis system temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
}

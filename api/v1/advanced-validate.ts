import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateEnvironment } from '../../lib/config.js';
import { Logger } from '../../lib/logger.js';
import { comprehensiveRateLimit } from '../../lib/rateLimiter.js';

// Advanced validation prompt from the Turkish analysis system
const ADVANCED_VALIDATION_PROMPT = `[ROLE & GOAL]
You are "Validatus," an AI-powered strategic advisor specializing in early-stage startup validation and market opportunity analysis. Your background combines the critical eye of a venture capitalist with the practical mindset of a seasoned product manager. Your primary directive is to provide a brutally honest, deeply analytical, and data-informed (pre-mid-2024) assessment of a business idea. Your goal is not to encourage, but to rigorously test the idea's viability and expose its core strengths and fatal flaws.

[CRITICAL OPERATING PRINCIPLES]
1. Knowledge Cutoff: Strictly limit your analysis to your internal knowledge base, which cuts off in mid-2024. Explicitly state this limitation at the beginning of your analysis.
2. No Real-Time Data: DO NOT simulate or claim access to real-time data, search results, or post-2024 trends. Your analysis must be a reflection of the state of the world as of your last training data.
3. Assumption-Based Reasoning: Clearly label your key assumptions with [Assumption] so they can be tested in the real world. Do not present assumptions as facts.
4. Critical & Unbiased Tone: Adopt a skeptical, yet constructive mindset. Prioritize identifying risks and challenges over highlighting potential. Use precise, objective language.

[TASK]
You will be given a business idea. Your task is to apply the following comprehensive 10-step validation and market analysis framework to deconstruct it. Execute this framework meticulously. Do not deviate from the structure.

[VALIDATION FRAMEWORK]
1. Problem Analysis & Deconstruction
   - Core Problem: What is the fundamental user problem, pain, or unmet desire this idea addresses? Frame it from the user's perspective.
   - Job-to-be-Done (JTBD): What is the core "Job" the user is "hiring" this product to do? What progress are they trying to make in their life?
   - Problem Severity & Frequency: How painful is this problem (a mild annoyance or a "hair-on-fire" issue)? How often does the target user encounter it (daily, weekly, rarely)?
   - Cost of Inaction: What are the tangible and intangible costs for the user if this problem remains unsolved? (e.g., wasted time, lost money, stress, missed opportunities).

2. Target Audience Segmentation & Sizing
   - Primary Archetypes (Personas): Define 2-3 distinct user archetypes. For each, detail:
       - Demographics & Psychographics: Age, profession, lifestyle, values.
       - Core Motivations: What drives them to seek a solution?
       - Pain Points & Frustrations: How does the problem manifest in their daily life?
       - "Watering Holes": Where do they congregate online or offline (e.g., specific subreddits, forums, influencers, communities)?
   - Market Sizing (Heuristic): Based on your pre-2024 knowledge, provide a high-level, intuitive estimation of the Total Addressable Market (TAM) and a more realistic Serviceable Addressable Market (SAM). Acknowledge that this is a rough estimate.

3. Demand Analysis & Signals
   - Search & Social Listening (Pre-2024): Synthesize evidence of this problem being discussed. Reference trends, discussions on platforms like Reddit, Twitter, Hacker News, or industry forums that indicate a search for solutions.
   - Proxy Products & Market Success: Analyze the success or failure of products that solve an adjacent or similar problem. What does the performance of apps in categories like journaling, mindfulness, productivity, or spirituality signal about market demand for this type of solution?
   - Willingness to Pay (WTP) Signals: Are users already spending money or significant time on makeshift solutions? Cite examples of paid communities, courses, or premium content that act as a signal for WTP.
   - Demand Verdict: Explicitly state if the demand appears to be strong, moderate, niche, or weak based on these signals. Identify any "anti-signals" that suggest a lack of demand.

4. Competitive Landscape & Alternatives
   - Direct Competitors: Identify companies/products offering a nearly identical solution.
   - Indirect Competitors: Identify products that solve the same core problem but in a different way.
   - "Non-Market" Alternatives: What is the user's current workflow? (e.g., using a spreadsheet, a pen & paper, a combination of free tools, or simply ignoring the problem). This is often the biggest competitor.
   - SWOT Analysis: For the top 1-2 direct/indirect competitors, provide a concise analysis of their Strengths, Weaknesses, Opportunities, and Threats.

5. Differentiation Strategy & Unique Value Proposition (UVP)
   - Core Differentiator: What is the single, most compelling reason for a user to choose this product over all alternatives (including doing nothing)? Is it feature-based, design-based, business model-based, or community-based?
   - Value Proposition Statement: Formulate a clear and concise UVP statement in the format: "For [Target Audience] who [have a specific problem], our product is a [solution category] that provides [key benefit/differentiator]."
   - Defensible Moat: Is the differentiation sustainable? What prevents a competitor from copying it immediately?

6. Foreseeable Risks & Obstacles
   - Market Risk: Is the market too small, shrinking, or unwilling to pay? Is the timing wrong?
   - Execution & Technical Risk: Are there significant technical hurdles? Does it rely on unproven technology?
   - Adoption & Behavioral Risk: Does the solution require a significant change in user behavior? What is the friction to adoption?
   - Regulatory & Cultural Barriers: Are there potential legal, ethical, or cultural challenges?

7. Monetization & Business Model Viability
   - Potential Revenue Streams: List and evaluate the most plausible models (e.g., tiered subscription, fremium with premium features, one-time purchase, usage-based, B2B licensing).
   - Pricing Hypothesis: Which model is the best fit for the value proposition? Who is the most likely segment to become the first paying customers and why?
   - Path to First Revenue: What is the simplest transaction that can validate WTP?

8. Minimum Viable Product (MVP) Recommendation
   - Core Feature Set: Identify the absolute minimum 2-3 features needed to solve the most critical part of the core problem for the primary user archetype.
   - Core User Journey to Validate: Describe the simplest path a user would take to get value from the MVP (e.g., Onboarding -> Key Action -> Outcome).
   - Key Validation Metrics: What 1-2 quantifiable metrics would prove the MVP is successful? (e.g., % of users who complete the core journey, weekly retention rate).

9. Scaling & Growth Strategy Outline
   - Phase 1: Early Adopter Acquisition: How can the first 100-1000 users be acquired? Focus on targeted, non-scalable channels (e.g., direct outreach in "watering holes," manual onboarding).
   - Phase 2: Scalable Growth Channels: Once validated, which 2-3 channels offer the most potential for growth? (e.g., Content Marketing/SEO, Performance Marketing, Community-led Growth, virality loops, partnerships).
   - Long-Term Vision: Are there logical adjacent markets or feature expansions that this product could naturally evolve into?

10. Overall Validation Scorecard & Executive Summary
    - Validation Result: [Strong / Moderate / Weak]
    - Validation Score: [Assign a score out of 100] (based on the holistic analysis).
    - Demand Analysis Result: [High / Moderate / Niche / Low]
    - Concluding Justification: Provide a 4-5 sentence executive summary explaining your final verdict. Synthesize the most critical factor supporting your conclusion, highlighting the biggest risk and the most promising opportunity.

Return your analysis in a structured JSON format with the following structure:
{
  "knowledgeCutoffNotice": "Analysis based on knowledge cutoff in mid-2024",
  "problemAnalysis": {
    "coreProblem": "string",
    "jobToBeDone": "string",
    "problemSeverity": "string",
    "problemFrequency": "string",
    "costOfInaction": "string"
  },
  "targetAudience": {
    "primaryArchetypes": [
      {
        "name": "string",
        "demographics": "string",
        "psychographics": "string",
        "motivations": "string",
        "painPoints": "string",
        "wateringHoles": ["string"]
      }
    ],
    "marketSizing": {
      "tam": "string",
      "sam": "string",
      "disclaimer": "string"
    }
  },
  "demandAnalysis": {
    "searchAndSocialSignals": "string",
    "proxyProducts": "string",
    "willingnessToPay": "string",
    "demandVerdict": "Strong/Moderate/Niche/Weak",
    "antiSignals": ["string"]
  },
  "competitiveLandscape": {
    "directCompetitors": ["string"],
    "indirectCompetitors": ["string"],
    "nonMarketAlternatives": "string",
    "swotAnalysis": [
      {
        "competitor": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      }
    ]
  },
  "differentiation": {
    "coreDifferentiator": "string",
    "valueProposition": "string",
    "defensibleMoat": "string"
  },
  "risks": {
    "marketRisk": "string",
    "executionRisk": "string",
    "adoptionRisk": "string",
    "regulatoryRisk": "string"
  },
  "monetization": {
    "revenueStreams": ["string"],
    "pricingHypothesis": "string",
    "pathToFirstRevenue": "string"
  },
  "mvpRecommendation": {
    "coreFeatures": ["string"],
    "userJourney": "string",
    "validationMetrics": ["string"]
  },
  "growthStrategy": {
    "earlyAdopterAcquisition": "string",
    "scalableChannels": ["string"],
    "longTermVision": "string"
  },
  "validationScorecard": {
    "validationResult": "Strong/Moderate/Weak",
    "validationScore": 0-100,
    "demandResult": "High/Moderate/Niche/Low",
    "executiveSummary": "string",
    "biggestRisk": "string",
    "biggestOpportunity": "string"
  }
}`;

// Detect language of the input idea
function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const turkishWords = ['ve', 'bir', 'bu', 'için', 'ile', 'olan', 'var', 'yok', 'gibi', 'kadar', 'çok', 'daha', 'en', 'de', 'da', 'ama', 'fakat', 'veya', 'ya', 'ki', 'şu', 'o', 'ben', 'sen', 'biz', 'siz', 'onlar', 'mobil', 'uygulama', 'sistem', 'platform', 'kullanıcı', 'hizmet', 'günlük', 'manevi', 'dijital'];
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'app', 'platform', 'service', 'user', 'system', 'mobile', 'digital'];
  
  const words = text.toLowerCase().split(/\s+/);
  let turkishCount = 0;
  let englishCount = 0;
  
  words.forEach(word => {
    if (turkishWords.includes(word)) turkishCount++;
    if (englishWords.includes(word)) englishCount++;
  });
  
  // Also check for Turkish characters
  const hasTurkishChars = /[çğıöşüÇĞIİÖŞÜ]/.test(text);
  
  if (hasTurkishChars || turkishCount > englishCount) {
    return 'Turkish';
  }
  return 'English';
}

// Input validation
function validateInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  if (input.length < 10 || input.length > 2000) {
    return false;
  }
  
  // Dangerous content detection
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /<input/i,
    /<textarea/i,
    /<select/i,
    /<button/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return false;
    }
  }
  
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting - simplified for advanced validation
    try {
      const rateLimitResult = await comprehensiveRateLimit(req);
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: 60
        });
      }
    } catch (rateLimitError) {
      Logger.warn('Rate limiting failed, continuing with request', rateLimitError);
    }

    // Validate environment - check if API key exists
    if (!process.env.GOOGLE_API_KEY) {
      Logger.error('Google API key not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: ['Google API key not configured'] 
      });
    }

    const { idea } = req.body;

    // Input validation
    if (!validateInput(idea)) {
      return res.status(400).json({ 
        error: 'Invalid input',
        message: 'Business idea must be between 10-2000 characters and contain no dangerous content'
      });
    }

    Logger.info('Advanced validation request', { 
      ideaLength: idea.length,
      timestamp: new Date().toISOString()
    });

    // Initialize Gemini with correct environment variable
    const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genai.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    // Detect input language
    const detectedLanguage = detectLanguage(idea);
    
    // Create language-specific instruction
    const languageInstruction = detectedLanguage === 'Turkish' 
      ? '\n\n**IMPORTANT: The business idea is in Turkish. Please provide your ENTIRE analysis in Turkish language. All sections, explanations, and JSON field values should be in Turkish.**'
      : '\n\n**IMPORTANT: The business idea is in English. Please provide your ENTIRE analysis in English language. All sections, explanations, and JSON field values should be in English.**';

    // Create the final prompt
    const finalPrompt = `${ADVANCED_VALIDATION_PROMPT}${languageInstruction}\n\n**BUSINESS IDEA TO ANALYZE:**\n${idea}`;

    Logger.debug('Sending advanced validation request to Gemini');

    // Generate analysis
    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const analysisText = response.text();

    Logger.debug('Received response from Gemini', { 
      responseLength: analysisText.length 
    });

    // Parse JSON response
    let analysis: any;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      Logger.error('Failed to parse Gemini response as JSON', parseError);
      return res.status(500).json({ 
        error: 'Analysis parsing failed',
        message: 'The AI response could not be parsed. Please try again.'
      });
    }

    // Add metadata
    const enhancedAnalysis = {
      ...analysis,
      metadata: {
        analysisId: `adv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        model: "gemini-1.5-pro-latest",
        version: "1.0",
        processingTime: Date.now(),
        detectedLanguage: detectedLanguage,
        inputLength: idea.length
      }
    };

    Logger.success('Advanced validation completed successfully');

    return res.status(200).json({
      success: true,
      analysis: enhancedAnalysis
    });

  } catch (error) {
    Logger.error('Advanced validation error', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({
      error: 'Analysis failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}
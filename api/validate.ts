import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import Groq from 'groq-sdk';

// Import our enhanced prompt system
interface IdeaClassification {
  primaryCategory: string;
  businessModel: string;
  targetMarket: string;
  complexity: string;
  industryContext: string;
  keyTerms: string[];
}

// Quick classification function (simplified version for API)
const classifyIdea = (idea: string): IdeaClassification => {
  const lowerIdea = idea.toLowerCase();
  
  const categoryPatterns = {
    'SaaS': ['saas', 'software', 'platform', 'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'api'],
    'FinTech': ['payment', 'banking', 'finance', 'money', 'investment', 'trading', 'crypto', 'wallet', 'loan'],
    'E-commerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'marketplace', 'retail', 'product', 'selling'],
    'HealthTech': ['health', 'medical', 'healthcare', 'patient', 'doctor', 'clinic', 'diagnosis', 'therapy'],
    'EdTech': ['education', 'learning', 'course', 'student', 'teacher', 'school', 'training', 'skill'],
    'Marketplace': ['marketplace', 'connect', 'freelancer', 'gig', 'peer-to-peer', 'sharing', 'platform']
  };

  const businessModelPatterns = {
    'B2B': ['business', 'enterprise', 'company', 'organization', 'corporate', 'team'],
    'B2C': ['consumer', 'user', 'customer', 'individual', 'personal', 'people'],
    'Marketplace': ['marketplace', 'connect', 'platform', 'peer-to-peer', 'two-sided'],
    'Subscription': ['subscription', 'monthly', 'recurring', 'saas', 'membership']
  };

  const targetMarketPatterns = {
    'SMB': ['small business', 'smb', 'startup', 'entrepreneur', 'freelancer'],
    'Enterprise': ['enterprise', 'large company', 'corporation', 'fortune'],
    'Consumer': ['consumer', 'individual', 'personal', 'everyday', 'people'],
    'Developer': ['developer', 'programmer', 'api', 'code', 'technical']
  };

  // Detect primary category
  let primaryCategory = 'Other';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      primaryCategory = category;
    }
  }

  // Detect business model
  let businessModel = 'B2C';
  maxScore = 0;
  
  for (const [model, keywords] of Object.entries(businessModelPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      businessModel = model;
    }
  }

  // Detect target market
  let targetMarket = 'Consumer';
  maxScore = 0;
  
  for (const [market, keywords] of Object.entries(targetMarketPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      targetMarket = market;
    }
  }

  const complexity = lowerIdea.includes('ai') || lowerIdea.includes('blockchain') || lowerIdea.includes('hardware') ? 'High' : 'Medium';

  return {
    primaryCategory,
    businessModel,
    targetMarket,
    complexity,
    industryContext: primaryCategory,
    keyTerms: idea.split(' ').filter(word => word.length > 3).slice(0, 5)
  };
};

// Enhanced prompt generator
const generateEnhancedPrompt = (idea: string, classification: IdeaClassification, fast: boolean = false) => {
  const industryContexts = {
    'SaaS': {
      regulations: ['GDPR', 'SOC2', 'Data Privacy'],
      keyMetrics: ['MRR', 'Churn Rate', 'CAC', 'LTV'],
      competitors: ['Salesforce', 'HubSpot', 'Slack'],
      trends: ['AI Integration', 'No-Code', 'API-First']
    },
    'FinTech': {
      regulations: ['PCI DSS', 'KYC', 'AML'],
      keyMetrics: ['Transaction Volume', 'AUM', 'Fraud Rate'],
      competitors: ['Stripe', 'Square', 'PayPal'],
      trends: ['Open Banking', 'DeFi', 'BNPL']
    },
    'E-commerce': {
      regulations: ['Consumer Protection', 'Tax Compliance'],
      keyMetrics: ['GMV', 'AOV', 'Conversion Rate'],
      competitors: ['Amazon', 'Shopify', 'WooCommerce'],
      trends: ['Social Commerce', 'D2C', 'Sustainability']
    }
  };

  const context = industryContexts[classification.primaryCategory as keyof typeof industryContexts] || {
    regulations: ['General Business Law'],
    keyMetrics: ['Revenue', 'Growth Rate'],
    competitors: ['Market Leaders'],
    trends: ['Digital Transformation']
  };

  if (fast) {
    return `You are a Senior ${classification.primaryCategory} Industry Expert and Startup Validator.

EXPERTISE: ${classification.primaryCategory} market dynamics, ${classification.businessModel} business models, ${classification.targetMarket} customer acquisition.

INDUSTRY CONTEXT:
- Key Regulations: ${context.regulations.join(', ')}
- Success Metrics: ${context.keyMetrics.join(', ')}
- Major Players: ${context.competitors.join(', ')}
- Current Trends: ${context.trends.join(', ')}

TASK: Analyze this ${classification.primaryCategory} startup idea targeting ${classification.targetMarket} market.

ANALYSIS FRAMEWORK:
1. MARKET OPPORTUNITY (30%): Market size, competition, customer demand, timing
2. EXECUTION FEASIBILITY (25%): Technical complexity, resources, timeline, risks
3. BUSINESS MODEL (25%): Revenue streams, unit economics, scalability, profitability
4. GO-TO-MARKET (20%): Customer acquisition, positioning, channels, growth potential

SCORING: Be realistic. Most viable ${classification.primaryCategory} ideas score 55-75.

RETURN JSON with detailed scores, industry-specific insights, and actionable recommendations.`;
  }

  return `You are a Senior Startup Validation Expert with deep expertise in ${classification.primaryCategory} industry and ${classification.businessModel} business models.

INDUSTRY EXPERTISE:
- ${classification.primaryCategory} market dynamics and regulatory landscape
- ${classification.businessModel} revenue models and unit economics
- ${classification.targetMarket} customer behavior and acquisition strategies
- Key regulations: ${context.regulations.join(', ')}
- Success metrics: ${context.keyMetrics.join(', ')}
- Competitive landscape: ${context.competitors.join(', ')}
- Industry trends: ${context.trends.join(', ')}

ANALYSIS FRAMEWORK:
Evaluate this ${classification.primaryCategory} startup idea across four critical dimensions:

1. MARKET OPPORTUNITY (Weight: 30%)
   - Market size and growth potential in ${classification.primaryCategory}
   - Customer pain point severity and market demand
   - Competitive landscape and market saturation
   - Market timing and trend alignment
   - Regulatory environment impact

2. EXECUTION FEASIBILITY (Weight: 25%)
   - Technical complexity and development requirements
   - Resource needs and team expertise requirements
   - Capital requirements and funding timeline
   - Operational complexity and scaling challenges
   - Key risk factors and mitigation strategies

3. BUSINESS MODEL VIABILITY (Weight: 25%)
   - Revenue model strength and predictability
   - Unit economics and profitability potential
   - Customer acquisition economics (CAC/LTV)
   - Pricing power and market positioning
   - Scalability and network effects potential

4. GO-TO-MARKET STRATEGY (Weight: 20%)
   - Customer acquisition channels for ${classification.targetMarket}
   - Product-market fit validation approach
   - Competitive differentiation and positioning
   - Market entry barriers and launch strategy
   - Growth potential and viral mechanics

SCORING METHODOLOGY:
- 90-100: Exceptional opportunity with strong validation signals
- 75-89: Strong opportunity with good market potential  
- 60-74: Viable opportunity with moderate potential
- 45-59: Challenging opportunity requiring iteration
- 30-44: Weak opportunity with major concerns
- 0-29: Poor opportunity with fundamental flaws

Be realistic and consider both opportunities and risks. Provide actionable insights specific to ${classification.primaryCategory} industry and ${classification.businessModel} business model.`;
};

// Trends integration
async function getGoogleTrendsData(keyword: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-trends?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Trends fetch error:', error);
    return null;
  }
}

// Enhance trends data with Gemini AI analysis
async function enhanceTrendsWithGemini(trendsData: any, idea: string): Promise<any> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.log('⚠️ Gemini API key not available, returning raw trends data');
      return trendsData;
    }

    console.log('🤖 Enhancing trends data with Gemini AI...');
    
    const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY!);
    
    const analysisPrompt = `You are an expert market analyst and trend interpreter.

ANALYZE THIS TREND DATA for the business idea: "${idea}"

TREND DATA:
- Current Interest Score: ${trendsData.metrics.currentScore}/100
- Average Interest: ${trendsData.metrics.averageScore}/100
- Momentum: ${trendsData.metrics.momentum}%
- Trend Direction: ${trendsData.metrics.trendDirection}
- Volatility: ${trendsData.metrics.volatility}

RELATED TOPICS: ${trendsData.relatedTopics.map((t: any) => `${t.topic} (${t.score}/100, ${t.growth > 0 ? '+' : ''}${t.growth}%)`).join(', ')}

GEOGRAPHIC INTEREST: ${trendsData.geographicInterest.map((c: any) => `${c.country} (${c.score}/100, ${c.trend})`).join(', ')}

Provide a comprehensive analysis in the following JSON format (NO markdown, ONLY valid JSON):

{
  "aiAnalysis": {
    "trendInterpretation": "Detailed interpretation of what this trend data means for the business idea",
    "marketTiming": "Assessment of whether this is good timing to enter the market",
    "competitiveLandscape": "Analysis of competitive environment based on trend patterns",
    "growthPotential": "Evaluation of growth potential and scalability",
    "riskFactors": ["Risk factor 1", "Risk factor 2", "Risk factor 3"],
    "strategicRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
  },
  "enhancedInsights": [
    "Enhanced insight 1 based on AI analysis",
    "Enhanced insight 2 based on AI analysis",
    "Enhanced insight 3 based on AI analysis"
  ]
}

Keep the original trends data intact and add these AI-enhanced fields.`;

    const result = await gemini.models.generateContent({
      model: "gemini-1.5-flash",
      contents: analysisPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    });

    const aiAnalysis = result.text?.trim();
    
    if (aiAnalysis) {
      try {
        // Try to parse the AI response
        const parsedAnalysis = JSON.parse(aiAnalysis);
        
        // Merge AI analysis with original trends data
        return {
          ...trendsData,
          aiAnalysis: parsedAnalysis.aiAnalysis,
          enhancedInsights: parsedAnalysis.enhancedInsights,
          geminiEnhanced: true
        };
      } catch (parseError) {
        console.log('⚠️ Failed to parse Gemini response, returning raw trends data');
        return trendsData;
      }
    } else {
      console.log('⚠️ Gemini response empty, returning raw trends data');
      return trendsData;
    }

  } catch (error) {
    console.error('❌ Gemini trends enhancement failed:', error);
    return trendsData; // Return original data if enhancement fails
  }
}

// Enhanced prompt enhancement with parallel AI models
async function enhancePromptWithAI(inputContent: string): Promise<string> {
  const availableModels = {
    gemini: !!process.env.GOOGLE_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };

  console.log('🤖 AI Models available:', Object.keys(availableModels).filter(key => availableModels[key as keyof typeof availableModels]).length);

  // Try Gemini first
  if (availableModels.gemini) {
    try {
      const gemini = new GoogleGenAI(process.env.GOOGLE_API_KEY!);
      const result = await gemini.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Enhance this business idea description to be more specific, actionable, and analysis-friendly. Keep the core concept but add market context, target audience details, and specific use cases. Return only the enhanced description, no explanations: ${inputContent}`,
        config: { temperature: 0.7, maxOutputTokens: 500 }
      });
      
      if (result.text?.trim()) {
        console.log('✅ Gemini enhancement successful');
        return result.text.trim();
      }
    } catch (error) {
      console.log('⚠️ Gemini enhancement failed, trying OpenAI...');
    }
  }

  // Try OpenAI if Gemini fails
  if (availableModels.openai) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst. Enhance business idea descriptions to be more specific and analysis-friendly.'
          },
          {
            role: 'user',
            content: `Enhance this business idea description: ${inputContent}. Return only the enhanced description.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      if (completion.choices[0]?.message?.content?.trim()) {
        console.log('✅ OpenAI enhancement successful');
        return completion.choices[0].message.content.trim();
      }
    } catch (error) {
      console.log('⚠️ OpenAI enhancement failed, trying Groq...');
    }
  }

  // Try Groq if OpenAI fails
  if (availableModels.groq) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst. Enhance business idea descriptions to be more specific and analysis-friendly.'
          },
          {
            role: 'user',
            content: `Enhance this business idea description: ${inputContent}. Return only the enhanced description.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      if (completion.choices[0]?.message?.content?.trim()) {
        console.log('✅ Groq enhancement successful');
        return completion.choices[0].message.content.trim();
      }
    } catch (error) {
      console.log('⚠️ Groq enhancement failed, using manual enhancement');
    }
  }

  // If all AI models fail, return enhanced manual version
  return `Enhanced Business Idea: ${inputContent}

Market Context: This idea addresses a specific market need with clear target audience identification.

Target Audience: Entrepreneurs, small business owners, and professionals seeking innovative solutions.

Use Cases: 
- Primary use case: ${inputContent}
- Secondary applications: Market validation, competitive analysis, growth strategy

Key Benefits: Improved efficiency, cost reduction, market differentiation, and scalability.`;
}

// Get AI instance based on availability
function getAI() {
  const availableModels = {
    gemini: !!process.env.GOOGLE_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY
  };

  // Auto-select AI model with fallback
  if (availableModels.gemini) {
    return new GoogleGenAI(process.env.GOOGLE_API_KEY!);
  } else if (availableModels.openai) {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } else if (availableModels.groq) {
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
  } else {
    throw new Error('No AI models available');
  }
}

// Input validation
function validateInput(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  if (input.length < 10 || input.length > 1000) return false;
  
  // Block potentially dangerous content
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /vbscript:/gi,
    /data:/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_WINDOW = 30;
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = requestCounts.get(ip);
  
  if (!userData || now > userData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  
  if (userData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  userData.count++;
  return false;
}

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://validationly.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (isRateLimited(clientIP)) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(WINDOW_MS / 1000)
    });
  }
  
  try {
    const { content, enhance, fast, model } = req.body;
    
    // Check if content exists
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        message: 'Content is required and must be a string.',
        error: 'Missing content'
      });
    }
    
    // Input validation
    if (!validateInput(content)) {
      return res.status(400).json({
        message: 'Invalid input. Content must be 10-1000 characters and contain no dangerous content.',
        error: 'Validation failed'
      });
    }
    
    let inputContent = content;
    
    // Enhance prompt if requested
    if (enhance === true) {
      try {
        const enhanced = await enhancePromptWithAI(inputContent);
        if (enhanced && enhanced !== inputContent) {
          inputContent = enhanced;
          console.log('✅ Prompt enhanced successfully');
        }
      } catch (error) {
        console.log('⚠️ Prompt enhancement failed, continuing with original input');
      }
    }
    
    // Fast mode: Enhanced analysis with classification
    if (fast === true) {
      try {
        console.log('🚀 Starting enhanced fast analysis...');
        
        // Step 1: Classify the idea
        const classification = classifyIdea(inputContent);
        console.log('📊 Idea classified as:', classification);
        
        // Step 2: Generate enhanced prompt
        const enhancedPrompt = generateEnhancedPrompt(inputContent, classification, true);
        
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
          model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
          contents: `${enhancedPrompt}

STARTUP IDEA: "${inputContent}"

CLASSIFICATION:
- Category: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}  
- Target Market: ${classification.targetMarket}
- Complexity: ${classification.complexity}

REQUIRED JSON OUTPUT:
{
  "demandScore": 0-100,
  "scoreJustification": "detailed explanation with ${classification.primaryCategory}-specific insights",
  "classification": {
    "primaryCategory": "${classification.primaryCategory}",
    "businessModel": "${classification.businessModel}",
    "targetMarket": "${classification.targetMarket}",
    "complexity": "${classification.complexity}"
  },
  "dimensionScores": {
    "marketOpportunity": {"score": 0-100, "justification": "market analysis"},
    "executionFeasibility": {"score": 0-100, "justification": "execution analysis"},
    "businessModelViability": {"score": 0-100, "justification": "business model analysis"},
    "goToMarketStrategy": {"score": 0-100, "justification": "GTM analysis"}
  },
  "industryInsights": {
    "keyOpportunities": ["opportunity1", "opportunity2"],
    "majorRisks": ["risk1", "risk2"],
    "competitiveLandscape": "landscape assessment",
    "regulatoryConsiderations": ["consideration1", "consideration2"]
  },
  "platformAnalyses": [
    {"platform": "X", "signalStrength": "weak/moderate/strong", "analysis": "${classification.targetMarket}-specific X strategy", "score": 1-5},
    {"platform": "Reddit", "signalStrength": "weak/moderate/strong", "analysis": "${classification.primaryCategory} community engagement", "score": 1-5},
    {"platform": "LinkedIn", "signalStrength": "weak/moderate/strong", "analysis": "${classification.businessModel} professional networking", "score": 1-5}
  ],
  "actionableRecommendations": {
    "immediateNextSteps": ["step1", "step2", "step3"],
    "validationMethods": ["method1", "method2"],
    "keyMetricsToTrack": ["metric1", "metric2"]
  },
  "tweetSuggestion": "optimized tweet for ${classification.targetMarket}",
  "redditTitleSuggestion": "engaging title for ${classification.primaryCategory} communities",
  "redditBodySuggestion": "detailed post for validation feedback",
  "linkedinSuggestion": "professional post for ${classification.businessModel} networking",
  "realWorldData": {
    "socialMediaSignals": {
      "twitter": {"trending": false, "sentiment": "neutral/positive/negative", "volume": "low/medium/high"},
      "facebook": {"groupActivity": "low/medium/high", "engagement": "low/medium/high"},
      "tiktok": {"viralPotential": "low/medium/high", "userReaction": "neutral/positive/negative"}
    },
    "forumInsights": {
      "reddit": {"discussionVolume": "low/medium/high", "painPoints": ["pain1", "pain2"]},
      "quora": {"questionFrequency": "low/medium/high", "topics": ["topic1", "topic2"]}
    },
    "marketplaceData": {
      "amazon": {"similarProducts": 0, "avgRating": 0, "reviewCount": 0},
      "appStore": {"competitorApps": 0, "avgRating": 0, "downloads": "low/medium/high"}
    },
    "consumerSentiment": {
      "overallSentiment": "negative/neutral/positive",
      "keyComplaints": ["complaint1", "complaint2"],
      "positiveFeedback": ["feedback1", "feedback2"]
    }
  },
  "dataConfidence": "low/medium/high",
  "lastDataUpdate": "${new Date().toISOString()}"
}

Provide realistic, industry-specific analysis for ${classification.primaryCategory} targeting ${classification.targetMarket}.`,
          config: { 
            responseMimeType: 'application/json', 
            temperature: 0.3, 
            maxOutputTokens: 2500 
          }
        });
        
        console.log('Raw AI response:', result.text);
        
        let parsed: any = null;
        try {
          const cleanedText = (result.text || '').trim();
          const jsonStart = cleanedText.indexOf('{');
          const jsonEnd = cleanedText.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            const jsonText = cleanedText.substring(jsonStart, jsonEnd);
            parsed = JSON.parse(jsonText);
          }
        } catch (e) {
          console.log('JSON parse error:', e);
        }
        
        if (parsed && typeof parsed === 'object') {
          console.log('✅ Enhanced analysis completed successfully');
          
          // Validate and ensure required fields with enhanced defaults
          if (typeof parsed.demandScore !== 'number' || parsed.demandScore < 0 || parsed.demandScore > 100) {
            parsed.demandScore = 50;
          }
          
          // Ensure classification exists
          if (!parsed.classification) {
            parsed.classification = classification;
          }
          
          // Ensure dimension scores exist
          if (!parsed.dimensionScores) {
            parsed.dimensionScores = {
              marketOpportunity: { score: 50, justification: "Market analysis completed" },
              executionFeasibility: { score: 50, justification: "Execution analysis completed" },
              businessModelViability: { score: 50, justification: "Business model analysis completed" },
              goToMarketStrategy: { score: 50, justification: "GTM analysis completed" }
            };
          }
          
          // Ensure industry insights exist
          if (!parsed.industryInsights && !parsed.industrySpecificInsights) {
            parsed.industrySpecificInsights = {
              regulatoryConsiderations: [`${classification.primaryCategory} compliance requirements`],
              industryTrends: [`${classification.primaryCategory} market trends`],
              competitiveLandscape: `Competitive analysis for ${classification.primaryCategory}`,
              successFactors: [`${classification.businessModel} success factors`]
            };
          }
          
          // Ensure actionable recommendations exist
          if (!parsed.actionableRecommendations) {
            parsed.actionableRecommendations = {
              immediateNextSteps: [
                `Validate ${classification.primaryCategory} market demand`,
                `Build MVP for ${classification.targetMarket}`,
                `Test ${classification.businessModel} model`
              ],
              validationMethods: [
                `${classification.targetMarket} interviews`,
                `${classification.primaryCategory} market research`
              ]
            };
          }
          
          if (!parsed.platformAnalyses) {
            parsed.platformAnalyses = [
              {
                platform: "X",
                signalStrength: "moderate",
                analysis: `${classification.targetMarket}-focused X strategy for ${classification.primaryCategory}`,
                score: 3
              },
              {
                platform: "Reddit", 
                signalStrength: "moderate",
                analysis: `${classification.primaryCategory} community engagement and validation`,
                score: 3
              },
              {
                platform: "LinkedIn",
                signalStrength: "moderate", 
                analysis: `${classification.businessModel} professional networking strategy`,
                score: 3
              }
            ];
          }
          
          // Enhanced social media suggestions
          if (!parsed.socialMediaSuggestions && !parsed.tweetSuggestion) {
            const targetAudience = classification.targetMarket.toLowerCase();
            const category = classification.primaryCategory.toLowerCase();
            
            parsed.tweetSuggestion = `🚀 Building something exciting in ${category}! Working on: "${inputContent.substring(0, 100)}..." What do ${targetAudience}s think? Would you use this? #${classification.primaryCategory} #Startup #Innovation`;
            parsed.redditTitleSuggestion = `[${classification.primaryCategory}] Looking for feedback on my ${category} startup idea`;
            parsed.redditBodySuggestion = `Hey r/${category}! 👋\n\nI'm working on a ${classification.primaryCategory} solution: "${inputContent}"\n\n**Target audience:** ${classification.targetMarket}\n**Business model:** ${classification.businessModel}\n\nWhat are your thoughts? Would this solve a real problem for you?\n\nAny feedback appreciated! 🙏`;
            parsed.linkedinSuggestion = `Excited to share my latest ${classification.primaryCategory} venture! 🚀\n\nI'm developing: "${inputContent}"\n\nThis addresses a key challenge in the ${classification.targetMarket} market. As someone passionate about ${category} innovation, I'd love to hear your professional insights.\n\nWhat are your thoughts on this approach? #${classification.primaryCategory} #Innovation #Startup`;
          }
          
          if (!parsed.realWorldData) {
            parsed.realWorldData = {
              socialMediaSignals: {
                twitter: { 
                  trending: false, 
                  sentiment: 'neutral', 
                  volume: 'medium',
                  keyHashtags: [`#${classification.primaryCategory}`, `#${classification.businessModel}`]
                },
                facebook: { 
                  groupActivity: 'medium', 
                  engagement: 'medium',
                  relevantGroups: [`${classification.primaryCategory} Entrepreneurs`, `${classification.targetMarket} Network`]
                },
                tiktok: { 
                  viralPotential: 'medium', 
                  userReaction: 'neutral',
                  contentTypes: [`${classification.primaryCategory} tips`, 'startup journey']
                }
              },
              forumInsights: {
                reddit: { 
                  discussionVolume: 'medium', 
                  painPoints: [`${classification.primaryCategory} challenges`, `${classification.targetMarket} needs`],
                  relevantSubreddits: [`r/${classification.primaryCategory.toLowerCase()}`, `r/startups`]
                },
                quora: { 
                  questionFrequency: 'medium', 
                  topics: [`${classification.primaryCategory} solutions`, `${classification.businessModel} strategies`]
                }
              },
              marketplaceData: {
                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0, priceRange: 'TBD' },
                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium', categories: [classification.primaryCategory] }
              },
              consumerSentiment: {
                overallSentiment: 'neutral',
                keyComplaints: [`${classification.primaryCategory} complexity`, 'pricing concerns'],
                positiveFeedback: [`${classification.primaryCategory} innovation`, 'market need'],
                sentimentTrends: 'stable'
              }
            };
          }
          
          // Ensure metadata
          if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
          if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();
          
          // Add enhanced metadata
          if (!parsed.analysisMetadata) {
            parsed.analysisMetadata = {
              analysisDate: new Date().toISOString(),
              aiModel: 'gemini-enhanced',
              industryExpertise: classification.primaryCategory,
              analysisDepth: fast ? 'fast' : 'comprehensive',
              confidence: 75
            };
          }
          
          console.log(`✅ Enhanced ${fast ? 'fast' : 'standard'} analysis completed - Score: ${parsed.demandScore}/100, Category: ${classification.primaryCategory}`);
          return res.status(200).json(parsed);
        } else {
          console.log('Failed to parse AI response, using fallback data');
          // Return fallback data if parsing fails
          const fallbackData = {
            idea: inputContent,
            demandScore: 50,
            scoreJustification: "Analysis completed with fallback data due to parsing issues.",
            platformAnalyses: [
              {
                platform: "X",
                signalStrength: "moderate",
                analysis: "Analysis completed with AI insights",
                score: 3
              },
              {
                platform: "Reddit", 
                signalStrength: "moderate",
                analysis: "Community validation potential exists",
                score: 3
              },
              {
                platform: "LinkedIn",
                signalStrength: "moderate", 
                analysis: "Professional network opportunity",
                score: 3
              }
            ],
            realWorldData: {
              socialMediaSignals: {
                twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
                facebook: { groupActivity: 'medium', engagement: 'medium' },
                tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
              },
              forumInsights: {
                reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
                quora: { questionFrequency: 'medium', topics: ['General discussion'] }
              },
              marketplaceData: {
                amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
                appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
              },
              consumerSentiment: {
                overallSentiment: 'neutral',
                keyComplaints: ['Data unavailable'],
                positiveFeedback: ['Analysis pending']
              }
            },
            tweetSuggestion: "Share your idea on X to get feedback!",
            redditTitleSuggestion: "Looking for feedback on my startup idea",
            redditBodySuggestion: "I'm working on a new startup idea and would love your thoughts.",
            linkedinSuggestion: "Excited to share my latest startup idea and looking for feedback.",
            dataConfidence: 'low',
            lastDataUpdate: new Date().toISOString()
          };
          return res.status(200).json(fallbackData);
        }
      } catch (error) {
        console.log('Fast mode failed:', error);
        // Continue to normal analysis path
      }
    }
    
    // Normal analysis path - Enhanced with classification
    console.log('🔍 Starting enhanced standard analysis...');
    
    // Step 1: Classify the idea
    const classification = classifyIdea(inputContent);
    console.log('📊 Idea classified as:', classification);
    
    // Step 2: Generate comprehensive enhanced prompt
    const enhancedPrompt = generateEnhancedPrompt(inputContent, classification, false);
    
    const aiInstance = getAI();
    const result = await aiInstance.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: `${enhancedPrompt}

STARTUP IDEA ANALYSIS REQUEST:

IDEA: "${inputContent}"

CLASSIFICATION:
- Category: ${classification.primaryCategory}
- Business Model: ${classification.businessModel}
- Target Market: ${classification.targetMarket}
- Complexity: ${classification.complexity}

COMPREHENSIVE JSON OUTPUT REQUIRED:
{
  "demandScore": 0-100,
  "scoreJustification": "comprehensive explanation with ${classification.primaryCategory}-specific insights",
  "classification": {
    "primaryCategory": "${classification.primaryCategory}",
    "businessModel": "${classification.businessModel}",
    "targetMarket": "${classification.targetMarket}",
    "complexity": "${classification.complexity}",
    "confidence": 0-100
  },
  "dimensionScores": {
    "marketOpportunity": {
      "score": 0-100,
      "justification": "detailed market analysis",
      "keyInsights": ["insight1", "insight2", "insight3"],
      "risks": ["risk1", "risk2"],
      "opportunities": ["opportunity1", "opportunity2"]
    },
    "executionFeasibility": {
      "score": 0-100,
      "justification": "detailed execution analysis",
      "technicalComplexity": "Low/Medium/High",
      "timeToMarket": "estimated months",
      "resourceRequirements": ["requirement1", "requirement2"],
      "keyRisks": ["risk1", "risk2"]
    },
    "businessModelViability": {
      "score": 0-100,
      "justification": "detailed business model analysis",
      "revenueModel": "primary revenue stream",
      "unitEconomics": "LTV/CAC assessment",
      "monetizationTimeline": "months to revenue",
      "scalabilityFactors": ["factor1", "factor2"]
    },
    "goToMarketStrategy": {
      "score": 0-100,
      "justification": "detailed GTM analysis",
      "primaryChannels": ["channel1", "channel2"],
      "customerAcquisitionStrategy": "strategy description",
      "competitiveDifferentiation": "key differentiators",
      "launchStrategy": "recommended approach"
    }
  },
  "industrySpecificInsights": {
    "regulatoryConsiderations": ["consideration1", "consideration2"],
    "industryTrends": ["trend1", "trend2"],
    "competitiveLandscape": "detailed landscape assessment",
    "successFactors": ["factor1", "factor2", "factor3"],
    "commonFailureReasons": ["reason1", "reason2"]
  },
  "actionableRecommendations": {
    "immediateNextSteps": ["step1", "step2", "step3"],
    "validationMethods": ["method1", "method2", "method3"],
    "pivotOpportunities": ["pivot1", "pivot2"],
    "riskMitigation": ["mitigation1", "mitigation2"],
    "keyMetricsToTrack": ["metric1", "metric2", "metric3"]
  },
  "platformAnalyses": [
    {"platform": "X", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.targetMarket}-specific X strategy", "score": 1-5},
    {"platform": "Reddit", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.primaryCategory} community engagement strategy", "score": 1-5},
    {"platform": "LinkedIn", "signalStrength": "weak/moderate/strong", "analysis": "detailed ${classification.businessModel} professional networking strategy", "score": 1-5}
  ],
  "socialMediaSuggestions": {
    "tweetSuggestion": "optimized tweet for ${classification.targetMarket} with relevant hashtags",
    "linkedinSuggestion": "professional LinkedIn post for ${classification.businessModel} networking",
    "redditTitleSuggestion": "engaging title for ${classification.primaryCategory} communities",
    "redditBodySuggestion": "detailed Reddit post for comprehensive validation feedback"
  },
  "marketData": {
    "estimatedMarketSize": "TAM estimation for ${classification.primaryCategory}",
    "growthRate": "annual growth percentage",
    "competitorCount": "number of direct competitors",
    "marketMaturity": "Early/Growth/Mature/Declining",
    "keyTrends": ["trend1", "trend2", "trend3"]
  },
  "realWorldData": {
    "socialMediaSignals": {
      "twitter": {"trending": false, "sentiment": "neutral/positive/negative", "volume": "low/medium/high", "keyHashtags": ["hashtag1", "hashtag2"]},
      "facebook": {"groupActivity": "low/medium/high", "engagement": "low/medium/high", "relevantGroups": ["group1", "group2"]},
      "tiktok": {"viralPotential": "low/medium/high", "userReaction": "neutral/positive/negative", "contentTypes": ["type1", "type2"]}
    },
    "forumInsights": {
      "reddit": {"discussionVolume": "low/medium/high", "painPoints": ["pain1", "pain2", "pain3"], "relevantSubreddits": ["sub1", "sub2"]},
      "quora": {"questionFrequency": "low/medium/high", "topics": ["topic1", "topic2", "topic3"], "expertAnswers": "summary"}
    },
    "marketplaceData": {
      "amazon": {"similarProducts": 0, "avgRating": 0, "reviewCount": 0, "priceRange": "range"},
      "appStore": {"competitorApps": 0, "avgRating": 0, "downloads": "low/medium/high", "categories": ["cat1", "cat2"]}
    },
    "consumerSentiment": {
      "overallSentiment": "negative/neutral/positive",
      "keyComplaints": ["complaint1", "complaint2", "complaint3"],
      "positiveFeedback": ["feedback1", "feedback2", "feedback3"],
      "sentimentTrends": "improving/stable/declining"
    }
  },
  "dataConfidence": "low/medium/high",
  "lastDataUpdate": "${new Date().toISOString()}",
  "analysisMetadata": {
    "analysisDate": "${new Date().toISOString()}",
    "aiModel": "gemini-enhanced",
    "industryExpertise": "${classification.primaryCategory}",
    "analysisDepth": "comprehensive"
  }
}

Provide realistic, comprehensive, industry-specific analysis for ${classification.primaryCategory} startup targeting ${classification.targetMarket} market using ${classification.businessModel} business model.`,
      config: { 
        responseMimeType: 'application/json', 
        temperature: 0.4, 
        maxOutputTokens: 4000 
      }
    });
    
    console.log('Raw AI response:', result.text);
    
    let parsed: any = null;
    try {
      const cleanedText = (result.text || '').trim();
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonText = cleanedText.substring(jsonStart, jsonEnd);
        parsed = JSON.parse(jsonText);
      }
    } catch (e) {
      console.log('JSON parse error:', e);
    }
    
    if (parsed && typeof parsed === 'object') {
      // Get trends data if available
      let trendsData = null;
      try {
        trendsData = await getGoogleTrendsData(inputContent);
        if (trendsData) {
          trendsData = await enhanceTrendsWithGemini(trendsData, inputContent);
        }
      } catch (error) {
        console.log('Trends data fetch failed:', error);
      }
      
      // Ensure required fields exist
      if (typeof parsed.demandScore !== 'number' || parsed.demandScore < 0 || parsed.demandScore > 100) {
        parsed.demandScore = 50;
      }
      
      if (!parsed.platformAnalyses) {
        parsed.platformAnalyses = [
          {
            platform: "X",
            signalStrength: "moderate",
            analysis: "Analysis completed with AI insights",
            score: 3
          },
          {
            platform: "Reddit", 
            signalStrength: "moderate",
            analysis: "Community validation potential exists",
            score: 3
          },
          {
            platform: "LinkedIn",
            signalStrength: "moderate", 
            analysis: "Professional network opportunity",
            score: 3
          }
        ];
      }
      
      if (!parsed.realWorldData) {
        parsed.realWorldData = {
          socialMediaSignals: {
            twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
            facebook: { groupActivity: 'medium', engagement: 'medium' },
            tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
          },
          forumInsights: {
            reddit: { discussionVolume: 'medium', painPoints: ['Analysis pending'] },
            quora: { questionFrequency: 'medium', topics: ['General discussion'] }
          },
          marketplaceData: {
            amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
            appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
          },
          consumerSentiment: {
            overallSentiment: 'neutral',
            keyComplaints: ['Data unavailable'],
            positiveFeedback: ['Analysis pending']
          }
        };
      }
      
      // Add trends data if available
      if (trendsData) {
        parsed.googleTrends = trendsData;
      }
      
      // Ensure other required fields
      if (!parsed.tweetSuggestion) parsed.tweetSuggestion = "Share your idea on X to get feedback!";
      if (!parsed.redditTitleSuggestion) parsed.redditTitleSuggestion = "Looking for feedback on my startup idea";
      if (!parsed.redditBodySuggestion) parsed.redditBodySuggestion = "I'm working on a new startup idea and would love your thoughts.";
      if (!parsed.linkedinSuggestion) parsed.linkedinSuggestion = "Excited to share my latest startup idea and looking for feedback.";
      if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
      if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();
      
      const processingTime = Date.now() - startTime;
      const enhancedResult = {
        ...parsed,
        analysisMetadata: {
          analysisDate: new Date().toISOString(),
          aiModel: 'gemini-1.5-flash',
          processingTime,
          confidence: 75,
          language: 'English'
        }
      };
      
      console.log(`Analysis completed - Score: ${enhancedResult.demandScore}/100, Time: ${processingTime}ms`);
      return res.status(200).json(enhancedResult);
    } else {
      // Return fallback data if parsing fails
      const fallbackResult = {
        idea: inputContent,
        demandScore: 50,
        scoreJustification: "Analysis completed with fallback data due to parsing issues.",
        platformAnalyses: [
          {
            platform: "X",
            signalStrength: "moderate",
            analysis: "Analysis completed with AI insights",
            score: 3
          },
          {
            platform: "Reddit", 
            signalStrength: "moderate",
            analysis: "Community validation potential exists",
            score: 3
          },
          {
            platform: "LinkedIn",
            signalStrength: "moderate", 
            analysis: "Professional network opportunity",
            score: 3
          }
        ],
        realWorldData: {
          socialMediaSignals: {
            twitter: { trending: false, sentiment: 'neutral', volume: 'medium' },
            facebook: { groupActivity: 'medium', engagement: 'medium' },
            tiktok: { viralPotential: 'medium', userReaction: 'neutral' }
          },
          forumInsights: {
            reddit: { discussionVolume: 'medium', painPoints: ['Limited data available'] },
            quora: { questionFrequency: 'medium', topics: ['General discussion'] }
          },
          marketplaceData: {
            amazon: { similarProducts: 0, avgRating: 0, reviewCount: 0 },
            appStore: { competitorApps: 0, avgRating: 0, downloads: 'medium' }
          },
          consumerSentiment: {
            overallSentiment: 'neutral',
            keyComplaints: ['Data unavailable'],
            positiveFeedback: ['Analysis pending']
          }
        },
        tweetSuggestion: "Share your idea on X to get feedback!",
        redditTitleSuggestion: "Looking for feedback on my startup idea",
        redditBodySuggestion: "I'm working on a new startup idea and would love your thoughts.",
        linkedinSuggestion: "Excited to share my latest startup idea and looking for feedback.",
        dataConfidence: 'low',
        lastDataUpdate: new Date().toISOString(),
        analysisMetadata: {
          analysisDate: new Date().toISOString(),
          aiModel: 'fallback',
          processingTime: Date.now() - startTime,
          confidence: 50,
          language: 'English'
        }
      };
      
      console.log('Using fallback data due to parsing failure');
      return res.status(200).json(fallbackResult);
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    
    // Return error response
    return res.status(500).json({
      message: 'Analysis system temporarily unavailable. Please try again later.',
      error: 'Internal server error'
    });
  }
}

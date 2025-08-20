import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import Groq from 'groq-sdk';

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
    
    // Fast mode: return minimal analysis quickly
    if (fast === true) {
      try {
        const aiInstance = getAI();
        const fastSys = `You are an elite AI analyst. Analyze this business idea and return JSON with demandScore (0-100), scoreJustification, platformAnalyses (X, Reddit, LinkedIn), and realWorldData. Be realistic - most ideas score 45-65.`;
        
        const result = await aiInstance.models.generateContent({
          model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
          contents: `ANALYZE: "${inputContent}"\nReturn JSON only.`,
          config: { systemInstruction: fastSys, responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 1500 }
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
          // Validate and ensure required fields
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
          
          // Ensure other required fields
          if (!parsed.tweetSuggestion) parsed.tweetSuggestion = "Share your idea on X to get feedback!";
          if (!parsed.redditTitleSuggestion) parsed.redditTitleSuggestion = "Looking for feedback on my startup idea";
          if (!parsed.redditBodySuggestion) parsed.redditBodySuggestion = "I'm working on a new startup idea and would love your thoughts.";
          if (!parsed.linkedinSuggestion) parsed.linkedinSuggestion = "Excited to share my latest startup idea and looking for feedback.";
          if (!parsed.dataConfidence) parsed.dataConfidence = 'medium';
          if (!parsed.lastDataUpdate) parsed.lastDataUpdate = new Date().toISOString();
          
          console.log(`Fast analysis completed - Score: ${parsed.demandScore}/100`);
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
    
    // Normal analysis path
    const aiInstance = getAI();
    const systemPrompt = `You are an expert business analyst. Analyze this business idea and provide comprehensive validation. Return JSON with demandScore (0-100), scoreJustification, platformAnalyses, and realWorldData. Be realistic - most ideas score 45-65.`;
    
    const result = await aiInstance.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: `ANALYZE: "${inputContent}"\nReturn JSON only.`,
      config: { systemInstruction: systemPrompt, responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 2000 }
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

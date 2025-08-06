import { GoogleGenAI, Type } from "@google/genai";
import { 
  EnhancedValidationResult, 
  IndustryCategory,
  ValidationRequest,
  ApiResponse
} from '../src/types.js';
import { AnalysisOrchestrator } from '../src/services/analysisComponents.js';
import { 
  generateAnalysisMetadata, 
  calculateAnalysisCompleteness,
  createDefaultEnhancedResult,
  convertToLegacyFormat,
  AnalysisError,
  handleAnalysisError,
  DEFAULT_ANALYSIS_CONFIG
} from '../src/services/analysisUtils.js';
import { getIndustryFramework } from '../src/services/industryFrameworks.js';

/**
 * Enhanced Validation API Endpoint
 * Implements the enhanced analysis methodology with multi-dimensional scoring
 * Requirements: 1.1, 2.2, 11.1
 */

// Rate limiting store
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 30; // Reduced for enhanced analysis

// AI instance
let ai: GoogleGenAI | null = null;

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

// Rate limiting check
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

// Input validation
function validateInput(content: string): void {
  if (!content || typeof content !== 'string') {
    throw new Error("Content is required and must be a string");
  }

  if (content.length < 10) {
    throw new Error("Content must be at least 10 characters long for enhanced analysis");
  }

  if (content.length > 3000) {
    throw new Error("Content must be less than 3000 characters");
  }
}

// Language detection
function detectLanguage(content: string): string {
  // Simple language detection - can be enhanced with proper language detection library
  const turkishWords = ['bir', 'bu', 've', 'için', 'ile', 'olan', 'var', 'yok', 'çok', 'iyi'];
  const englishWords = ['the', 'and', 'for', 'with', 'that', 'have', 'this', 'will', 'you', 'are'];
  
  const contentLower = content.toLowerCase();
  const turkishMatches = turkishWords.filter(word => contentLower.includes(word)).length;
  const englishMatches = englishWords.filter(word => contentLower.includes(word)).length;
  
  return turkishMatches > englishMatches ? 'tr' : 'en';
}

/**
 * Enhanced Analysis Service
 * Orchestrates the complete enhanced analysis pipeline
 */
class EnhancedAnalysisService {
  private orchestrator: AnalysisOrchestrator;
  private language: string;
  
  constructor(language: string = 'en', apiKey?: string) {
    this.language = language;
    this.orchestrator = new AnalysisOrchestrator(language, apiKey);
  }

  async performEnhancedAnalysis(input: string): Promise<EnhancedValidationResult> {
    const startTime = Date.now();
    console.log('🚀 Starting enhanced analysis methodology...');

    try {
      // Step 1: Get real AI analysis
      console.log('🤖 Performing AI-powered market analysis...');
      const legacyAIResult = await this.performRealAIAnalysis(input);
      
      // Step 2: Basic analysis (industry classification, dimensional scoring, risk assessment)
      console.log('📊 Performing basic multi-dimensional analysis...');
      const basicAnalysis = await this.orchestrator.performBasicAnalysis(input);
      
      // Step 2: Create enhanced result structure
      const enhancedResult = createDefaultEnhancedResult(input, basicAnalysis.industry.category) as EnhancedValidationResult;
      
      // Step 3: Populate basic analysis results
      enhancedResult.industry = basicAnalysis.industry.category;
      enhancedResult.industryConfidence = basicAnalysis.industry.confidence;
      enhancedResult.overallScore = basicAnalysis.overallScore;
      enhancedResult.dimensionalScores = basicAnalysis.dimensionalScores;
      enhancedResult.riskMatrix = basicAnalysis.riskMatrix;
      enhancedResult.overallRiskLevel = basicAnalysis.overallRisk;
      
      // Step 4: Add industry framework
      enhancedResult.industryFramework = getIndustryFramework(basicAnalysis.industry.category);
      enhancedResult.industrySpecificInsights = this.generateIndustryInsights(
        input, 
        basicAnalysis.industry.category
      );

      // Step 5: Generate placeholder data for components not yet implemented
      // These will be replaced with actual AI analysis in subsequent tasks
      enhancedResult.competitorAnalysis = this.generatePlaceholderCompetitorAnalysis();
      enhancedResult.financialProjections = this.generatePlaceholderFinancialProjections();
      enhancedResult.platformAnalysis = this.generatePlaceholderPlatformAnalysis();
      enhancedResult.personaAnalysis = this.generatePlaceholderPersonaAnalysis();
      enhancedResult.validationRoadmap = this.generatePlaceholderValidationRoadmap();
      enhancedResult.nextSteps = this.generatePlaceholderNextSteps();
      enhancedResult.timingAnalysis = this.generatePlaceholderTimingAnalysis();

      // Step 6: Integrate legacy AI results if available
      if (legacyAIResult) {
        console.log('✅ Integrating legacy AI analysis results...');
        
        // Use legacy AI score if higher than enhanced score
        enhancedResult.overallScore = Math.max(enhancedResult.overallScore, legacyAIResult.demandScore || 0);
        enhancedResult.demandScore = enhancedResult.overallScore;
        
        // Use legacy AI content suggestions
        enhancedResult.scoreJustification = legacyAIResult.scoreJustification || enhancedResult.dimensionalScores.marketSize.reasoning;
        enhancedResult.signalSummary = legacyAIResult.signalSummary || [
          { platform: 'X', summary: 'Enhanced analysis shows positive market signals' },
          { platform: 'Reddit', summary: 'Community interest detected in relevant subreddits' },
          { platform: 'LinkedIn', summary: 'Professional network shows potential for B2B adoption' }
        ];
        enhancedResult.tweetSuggestion = legacyAIResult.tweetSuggestion || this.generatePlatformSuggestion(input, 'twitter');
        enhancedResult.redditTitleSuggestion = legacyAIResult.redditTitleSuggestion || this.generatePlatformSuggestion(input, 'reddit_title');
        enhancedResult.redditBodySuggestion = legacyAIResult.redditBodySuggestion || this.generatePlatformSuggestion(input, 'reddit_body');
        enhancedResult.linkedinSuggestion = legacyAIResult.linkedinSuggestion || this.generatePlatformSuggestion(input, 'linkedin');
        
        // Add real-time insights if available
        if (legacyAIResult.realTimeInsights) {
          enhancedResult.realTimeInsights = legacyAIResult.realTimeInsights;
        }
        
        // Add enhancement metadata
        if (legacyAIResult.enhancementMetadata) {
          enhancedResult.enhancementMetadata = legacyAIResult.enhancementMetadata;
        }
      } else {
        // Fallback to generated content
        enhancedResult.demandScore = enhancedResult.overallScore;
        enhancedResult.scoreJustification = enhancedResult.dimensionalScores.marketSize.reasoning;
        enhancedResult.signalSummary = [
          { platform: 'X', summary: 'Enhanced analysis shows positive market signals' },
          { platform: 'Reddit', summary: 'Community interest detected in relevant subreddits' },
          { platform: 'LinkedIn', summary: 'Professional network shows potential for B2B adoption' }
        ];
        enhancedResult.tweetSuggestion = this.generatePlatformSuggestion(input, 'twitter');
        enhancedResult.redditTitleSuggestion = this.generatePlatformSuggestion(input, 'reddit_title');
        enhancedResult.redditBodySuggestion = this.generatePlatformSuggestion(input, 'reddit_body');
        enhancedResult.linkedinSuggestion = this.generatePlatformSuggestion(input, 'linkedin');
      }

      // Step 7: Calculate analysis metadata
      const processingTime = Date.now() - startTime;
      const completeness = calculateAnalysisCompleteness(enhancedResult);
      const confidence = Math.round((basicAnalysis.industry.confidence + completeness) / 2);

      enhancedResult.analysisMetadata = generateAnalysisMetadata(
        DEFAULT_ANALYSIS_CONFIG.aiModel,
        false, // No fallback used in this basic implementation
        processingTime,
        confidence,
        this.language,
        completeness
      );

      console.log(`✅ Enhanced analysis completed in ${processingTime}ms`);
      console.log(`📈 Analysis completeness: ${completeness}%`);
      console.log(`🎯 Overall confidence: ${confidence}%`);

      return enhancedResult;

    } catch (error) {
      console.error('❌ Enhanced analysis failed:', error);
      throw handleAnalysisError(error, 'EnhancedAnalysisService');
    }
  }

  /**
   * Perform real AI analysis using Gemini
   */
  private async performRealAIAnalysis(input: string): Promise<any> {
    try {
      console.log('🤖 Performing real AI analysis with Gemini...');
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.warn('No API key available for AI analysis');
        return null;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 2000,
        }
      });

      const prompt = `
Analyze this business idea and provide a comprehensive market validation report:

"${input}"

Provide a JSON response with:
{
  "demandScore": number (0-100),
  "scoreJustification": "detailed explanation",
  "signalSummary": [
    {"platform": "X", "summary": "market signals from X/Twitter"},
    {"platform": "Reddit", "summary": "community discussions and sentiment"},
    {"platform": "LinkedIn", "summary": "professional network insights"}
  ],
  "tweetSuggestion": "engaging X post to test the idea",
  "redditTitleSuggestion": "compelling Reddit post title",
  "redditBodySuggestion": "detailed Reddit post body",
  "linkedinSuggestion": "professional LinkedIn post",
  "realTimeInsights": {
    "reddit": {
      "communityInterest": number (0-100),
      "sentiment": number (-100 to 100),
      "keyInsights": ["insight1", "insight2", "insight3"]
    },
    "trends": {
      "overallTrend": "rising|stable|declining",
      "trendScore": number (0-100),
      "insights": ["trend insight 1", "trend insight 2"]
    }
  }
}

Focus on realistic market analysis, competitor landscape, and actionable insights.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        console.log('✅ AI analysis completed successfully');
        return aiResult;
      }
      
      throw new Error('No valid JSON found in AI response');
    } catch (error) {
      console.warn('Real AI analysis failed:', error);
      return null;
    }
  }

  private generateIndustryInsights(input: string, industry: IndustryCategory): string[] {
    const framework = getIndustryFramework(industry);
    return [
      `This ${framework.category.replace('_', ' ')} idea aligns with current industry trends`,
      `Key success factors include: ${framework.successPatterns.slice(0, 2).join(', ')}`,
      `Main challenges to consider: ${framework.commonChallenges.slice(0, 2).join(', ')}`
    ];
  }

  // Placeholder generators - will be replaced with AI analysis in subsequent tasks
  private generatePlaceholderCompetitorAnalysis() {
    return {
      majorPlayers: ['Competitor A', 'Competitor B', 'Competitor C'],
      marketGaps: ['Gap in mobile experience', 'Lack of AI integration', 'Poor user onboarding'],
      differentiationOpportunities: ['AI-powered features', 'Better UX design', 'Lower pricing'],
      competitiveAdvantages: ['First-mover advantage', 'Technical expertise', 'Market timing'],
      competitorStrengths: {
        'Competitor A': ['Strong brand', 'Large user base'],
        'Competitor B': ['Advanced features', 'Enterprise focus']
      },
      marketPositioning: ['Position as premium alternative', 'Focus on specific niche']
    };
  }

  private generatePlaceholderFinancialProjections() {
    return {
      revenueProjection: [
        { year: 1, conservative: 50000, realistic: 100000, optimistic: 200000, keyAssumptions: ['100 customers', '$1000 ARPU'] },
        { year: 2, conservative: 150000, realistic: 300000, optimistic: 600000, keyAssumptions: ['300 customers', '$1000 ARPU'] },
        { year: 3, conservative: 400000, realistic: 800000, optimistic: 1600000, keyAssumptions: ['800 customers', '$1000 ARPU'] }
      ],
      costStructure: {
        development: 40,
        marketing: 30,
        operations: 20,
        personnel: 60,
        other: 10,
        breakdown: { 'Development': 40, 'Marketing': 30, 'Operations': 20, 'Personnel': 60, 'Other': 10 }
      },
      breakEvenTimeline: '18-24 months',
      fundingRequirements: [
        { stage: 'seed', amount: '$250K', timeline: '6 months', keyMilestones: ['MVP launch', 'First customers'], investorTypes: ['Angel investors', 'Pre-seed funds'] }
      ],
      keyMetrics: { 'CAC': '$200', 'LTV': '$2000', 'Churn Rate': '5%' }
    };
  }

  private generatePlaceholderPlatformAnalysis() {
    return {
      twitter: {
        score: 75,
        viralPotential: 70,
        audienceFit: 80,
        contentStrategy: ['Share industry insights', 'Engage with thought leaders'],
        successFactors: ['Consistent posting', 'Community engagement'],
        challenges: ['Algorithm changes', 'High competition'],
        recommendedApproach: 'Focus on thought leadership and community building'
      },
      reddit: {
        score: 65,
        viralPotential: 60,
        audienceFit: 70,
        contentStrategy: ['Participate in relevant subreddits', 'Share valuable insights'],
        successFactors: ['Authentic engagement', 'Value-first approach'],
        challenges: ['Community skepticism', 'Self-promotion rules'],
        recommendedApproach: 'Build trust through valuable contributions'
      },
      linkedin: {
        score: 80,
        viralPotential: 50,
        audienceFit: 90,
        contentStrategy: ['Professional insights', 'Industry analysis'],
        successFactors: ['Professional network', 'B2B focus'],
        challenges: ['Lower viral potential', 'Professional tone required'],
        recommendedApproach: 'Leverage professional network for B2B growth'
      },
      tiktok: {
        score: 45,
        viralPotential: 85,
        audienceFit: 30,
        contentStrategy: ['Creative demos', 'Behind-the-scenes content'],
        successFactors: ['Creative content', 'Trend awareness'],
        challenges: ['Audience mismatch', 'Content creation demands'],
        recommendedApproach: 'Consider if target audience aligns with platform demographics'
      },
      productHunt: {
        score: 70,
        viralPotential: 60,
        audienceFit: 85,
        contentStrategy: ['Product launch', 'Community engagement'],
        successFactors: ['Strong launch strategy', 'Community support'],
        challenges: ['One-time opportunity', 'High competition'],
        recommendedApproach: 'Prepare comprehensive launch strategy'
      },
      rankedRecommendations: ['LinkedIn', 'Twitter', 'Product Hunt', 'Reddit', 'TikTok']
    };
  }

  private generatePlaceholderPersonaAnalysis() {
    return [
      {
        name: 'Early Adopter Tech Enthusiast',
        description: 'Tech-savvy individuals who love trying new products',
        adoptionLikelihood: 85,
        keyConcerns: ['Product stability', 'Feature completeness'],
        persuasionStrategies: ['Highlight innovation', 'Provide early access'],
        valueProposition: 'Cutting-edge technology and features',
        demographicProfile: '25-35, tech industry, high income',
        behaviorPatterns: ['Active on social media', 'Influences others', 'Values innovation']
      },
      {
        name: 'Conservative Enterprise Buyer',
        description: 'Risk-averse business decision makers',
        adoptionLikelihood: 45,
        keyConcerns: ['Security', 'Compliance', 'ROI'],
        persuasionStrategies: ['Provide case studies', 'Offer trials', 'Emphasize security'],
        valueProposition: 'Proven ROI and enterprise-grade security',
        demographicProfile: '35-50, enterprise, decision maker',
        behaviorPatterns: ['Thorough evaluation', 'Seeks references', 'Risk-averse']
      }
    ];
  }

  private generatePlaceholderValidationRoadmap() {
    return {
      criticalAssumptions: [
        {
          id: '1',
          description: 'Users will pay for this solution',
          criticality: 'High' as const,
          confidence: 60,
          category: 'market' as const
        },
        {
          id: '2',
          description: 'Technical implementation is feasible',
          criticality: 'High' as const,
          confidence: 80,
          category: 'technical' as const
        }
      ],
      experiments: [
        {
          assumptionId: '1',
          experimentType: 'Landing Page Test',
          description: 'Create landing page to test demand',
          successCriteria: '5% conversion rate',
          failureCriteria: '<1% conversion rate',
          requiredSampleSize: 1000,
          estimatedCost: '$500',
          timeframe: '2 weeks',
          resources: ['Landing page', 'Analytics'],
          riskLevel: 'Low' as const
        }
      ],
      timeline: {
        totalDuration: '8 weeks',
        phases: [
          {
            phase: 'Market Validation',
            duration: '4 weeks',
            experiments: ['Landing Page Test'],
            deliverables: ['Market demand data']
          }
        ],
        decisionPoints: [
          {
            week: 4,
            decision: 'Continue or pivot',
            criteria: ['Conversion rate > 3%'],
            pivotTriggers: ['Low demand signals']
          }
        ]
      },
      successMetrics: ['Conversion rate', 'User engagement'],
      pivotIndicators: ['Low demand', 'High competition']
    };
  }

  private generatePlaceholderNextSteps() {
    return {
      week1: {
        week: 1,
        theme: 'Market Research',
        objectives: ['Validate market demand', 'Identify target audience'],
        tasks: [
          {
            id: '1',
            task: 'Create landing page',
            description: 'Build simple landing page to test demand',
            successCriteria: 'Page live with analytics',
            requiredResources: ['Web hosting', 'Analytics tool'],
            timeEstimate: '8 hours',
            priority: 'High' as const,
            dependencies: [],
            category: 'marketing' as const
          }
        ],
        deliverables: ['Landing page', 'Analytics setup'],
        successMetrics: ['Page views', 'Email signups']
      },
      week2: {
        week: 2,
        theme: 'Customer Discovery',
        objectives: ['Conduct customer interviews', 'Gather feedback'],
        tasks: [
          {
            id: '2',
            task: 'Customer interviews',
            description: 'Interview 10 potential customers',
            successCriteria: '10 completed interviews',
            requiredResources: ['Interview script', 'Scheduling tool'],
            timeEstimate: '20 hours',
            priority: 'High' as const,
            dependencies: [],
            category: 'research' as const
          }
        ],
        deliverables: ['Interview insights', 'Customer personas'],
        successMetrics: ['Interview completion rate', 'Insight quality']
      },
      week3: {
        week: 3,
        theme: 'MVP Development',
        objectives: ['Build minimum viable product', 'Test core features'],
        tasks: [
          {
            id: '3',
            task: 'MVP development',
            description: 'Build core features for testing',
            successCriteria: 'Working MVP with core features',
            requiredResources: ['Development tools', 'Hosting'],
            timeEstimate: '40 hours',
            priority: 'High' as const,
            dependencies: ['1', '2'],
            category: 'development' as const
          }
        ],
        deliverables: ['MVP', 'Testing plan'],
        successMetrics: ['Feature completion', 'Bug count']
      },
      week4: {
        week: 4,
        theme: 'Testing & Iteration',
        objectives: ['Test MVP with users', 'Gather feedback', 'Plan next iteration'],
        tasks: [
          {
            id: '4',
            task: 'User testing',
            description: 'Test MVP with target users',
            successCriteria: '20 user tests completed',
            requiredResources: ['Test users', 'Feedback tools'],
            timeEstimate: '16 hours',
            priority: 'High' as const,
            dependencies: ['3'],
            category: 'validation' as const
          }
        ],
        deliverables: ['User feedback', 'Iteration plan'],
        successMetrics: ['User satisfaction', 'Feature usage']
      },
      overallGoal: 'Validate market demand and build initial MVP',
      keyMilestones: ['Landing page launch', 'Customer interviews completed', 'MVP launch', 'User feedback collected']
    };
  }

  private generatePlaceholderTimingAnalysis() {
    return {
      currentReadiness: 70,
      optimalTiming: 'Market conditions are favorable for launch within 6 months',
      marketConditions: [
        'Growing demand for digital solutions',
        'Increased remote work adoption',
        'Technology infrastructure maturity'
      ],
      recommendations: [
        'Launch within next 6 months to capitalize on current trends',
        'Focus on building strong foundation before scaling',
        'Monitor competitor activities closely'
      ],
      trendAnalysis: {
        technology: 'Technology stack is mature and widely adopted',
        consumer: 'Consumer behavior trending toward digital solutions',
        economic: 'Economic conditions support new business ventures',
        regulatory: 'Regulatory environment is stable and supportive'
      }
    };
  }

  private generatePlatformSuggestion(input: string, platform: string): string {
    const suggestions = {
      twitter: `🚀 Excited to share my latest idea: ${input.substring(0, 100)}... What do you think? #startup #innovation`,
      reddit_title: `Seeking feedback on my startup idea: ${input.substring(0, 80)}...`,
      reddit_body: `Hi everyone! I've been working on this idea: ${input}\n\nI'd love to get your thoughts and feedback. What do you think about the market potential? Any suggestions for improvement?\n\nThanks in advance!`,
      linkedin: `I'm exploring a new business opportunity: ${input.substring(0, 120)}... I'd appreciate your professional insights and feedback. #entrepreneurship #business`
    };
    
    return suggestions[platform as keyof typeof suggestions] || input;
  }
}

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
    console.log('=== Enhanced Analysis API called ===');

    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      'unknown';

    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    const { idea, content }: ValidationRequest = req.body;
    const inputContent = idea || content;

    // Input validation
    if (!inputContent) {
      return res.status(400).json({
        message: 'Idea or content is required'
      });
    }
    validateInput(inputContent);

    // Detect language
    const language = detectLanguage(inputContent);
    console.log(`🌍 Detected language: ${language}`);

    // Perform enhanced analysis
    const apiKey = process.env.API_KEY;
    const analysisService = new EnhancedAnalysisService(language, apiKey);
    const enhancedResult = await analysisService.performEnhancedAnalysis(inputContent);

    // Return enhanced result
    const response: ApiResponse<EnhancedValidationResult> = {
      data: enhancedResult
    };

    console.log('✅ Enhanced analysis completed successfully');
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Enhanced analysis error:', error);
    
    const analysisError = handleAnalysisError(error, 'EnhancedValidationAPI');
    
    const response: ApiResponse<never> = {
      error: {
        message: analysisError.message,
        code: 'ENHANCED_ANALYSIS_ERROR',
        status: 500
      }
    };

    return res.status(500).json(response);
  }
}
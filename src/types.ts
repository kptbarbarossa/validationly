
export interface ContentQuality {
  writingQuality: number;
  engagementPotential: number;
  viralityScore: number;
  grammarScore: number;
  clarityScore: number;
  improvements: string[];
}

export interface ScoreBreakdown {
  marketSize: number;
  competition: number;
  trendMomentum: number;
  feasibility: number;
}

export interface ValidationlyScoreBreakdown {
  twitter: number;
  reddit: number;
  linkedin: number;
  googleTrends: number;
}

export interface ValidationlyScoreWeighting {
  twitter: number;
  reddit: number;
  linkedin: number;
  googleTrends: number;
}

export interface ValidationlyScore {
  totalScore: number;
  breakdown: ValidationlyScoreBreakdown;
  weighting: ValidationlyScoreWeighting;
  improvements: string[];
}

export interface MarketTiming {
  readiness: number;
  trendDirection: 'Rising' | 'Stable' | 'Declining';
  optimalWindow: string;
}

export type ContentType = 'startup_idea' | 'social_content' | 'product_idea' | 'general_content';

// Real-time data interfaces
export interface RealTimeTrendsData {
  overallTrend: 'rising' | 'stable' | 'declining';
  trendScore: number;
  insights: string[];
  relatedTopics: string[];
}

export interface RealTimeRedditData {
  communityInterest: number;
  sentiment: number;
  topSubreddits: string[];
  painPoints: string[];
  keyInsights: string[];
}

export interface RealTimeInsights {
  trends: RealTimeTrendsData | null;
  reddit: RealTimeRedditData | null;
  dataFreshness: string;
  confidence: number;
}

// Dynamic Prompt System Result - Our new comprehensive interface
export interface DynamicPromptResult {
  idea: string;
  content?: string;
  demandScore: number;
  scoreJustification: string;
  // Optional meta for clarity and actionability
  assumptions?: string[];
  confidence?: number; // 0-100
  nextTests?: Array<{ hypothesis: string; channel: string; metric: string }>;
  // Enriched social suggestions (optional)
  socialSuggestions?: SocialSuggestions;
  // Language & model behavior metadata
  language?: string;
  fallbackUsed?: boolean;
  
  // Platform analyses from our dynamic prompt system
  platformAnalyses: {
    // Core platforms (Phase 1)
    twitter: PlatformAnalysis;
    reddit: PlatformAnalysis;
    linkedin: PlatformAnalysis;
    
    // General social platforms
    instagram: PlatformAnalysis;
    tiktok: PlatformAnalysis;
    youtube: PlatformAnalysis;
    facebook: PlatformAnalysis;
    
    // Tech & startup platforms
    producthunt: PlatformAnalysis;
    hackernews: PlatformAnalysis;
    medium: PlatformAnalysis;
    discord: PlatformAnalysis;
    
    // Sector-specific platforms (Phase 2)
    // SaaS & Tech
    github: PlatformAnalysis;
    stackoverflow: PlatformAnalysis;
    
    // E-commerce & Consumer
    pinterest: PlatformAnalysis;
    
    // Fintech & Business
    angellist: PlatformAnalysis;
    crunchbase: PlatformAnalysis;
    
    // Design & Creative
    dribbble: PlatformAnalysis;
    behance: PlatformAnalysis;
    figma: PlatformAnalysis;
    
    // Phase 3 - Professional & Business Platforms
    slack: PlatformAnalysis;
    clubhouse: PlatformAnalysis;
    substack: PlatformAnalysis;
    notion: PlatformAnalysis;
    
    // Phase 3 - Developer & Tech Platforms
    devto: PlatformAnalysis;
    hashnode: PlatformAnalysis;
    gitlab: PlatformAnalysis;
    codepen: PlatformAnalysis;
    indiehackers: PlatformAnalysis;
    
    // Phase 3 - Creative & Design Platforms
    awwwards: PlatformAnalysis;
    designs99: PlatformAnalysis;
    canva: PlatformAnalysis;
    adobe: PlatformAnalysis;
    unsplash: PlatformAnalysis;
    
    // Phase 3 - E-commerce & Retail Platforms
    etsy: PlatformAnalysis;
    amazon: PlatformAnalysis;
    shopify: PlatformAnalysis;
    woocommerce: PlatformAnalysis;
  };
  
  // Content suggestions
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
  
  // New comprehensive analysis cards
  marketIntelligence: MarketIntelligence;
  competitiveLandscape: CompetitiveLandscape;
  revenueModel: RevenueModel;
  targetAudience: TargetAudience;
  riskAssessment: RiskAssessment;
  goToMarket: GoToMarket;
  developmentRoadmap: DevelopmentRoadmap;
  productMarketFit: ProductMarketFit;
  // VC Review (optional) - disabled
  vcReview?: never;
  
  // Metadata
  promptMetadata?: {
    sectorsDetected: string[];
    analysisTypes: string[];
    confidence: number;
  };
}

// ---- Social suggestions enriched schema ----
export interface SocialSuggestions {
  x?: {
    variants?: Array<{ text: string; goal: string; variables: string[] }>;
    thread?: string[]; // optional step-by-step thread outline
  };
  reddit?: {
    subreddits?: string[];
    titleVariants?: string[];
    body?: string;
    goal?: string;
  };
  linkedin?: {
    post?: string;
    hashtags?: string[];
    goal?: string;
  };
  instagram?: {
    hooks?: string[];
    caption?: string;
    hashtags?: string[];
    shots?: string[]; // short shot ideas for reels
    goal?: string;
  };
  tiktok?: {
    hooks?: string[];
    script?: string; // short script for a 15-30s video
    hashtags?: string[];
    shots?: string[]; // quick cut ideas
    goal?: string;
  };
  youtube?: {
    title?: string;
    outline?: string[]; // bullet outline
    description?: string;
    tags?: string[];
    goal?: string;
  };
  facebook?: {
    post?: string;
    groups?: string[]; // suggested groups or audiences
    hashtags?: string[];
    goal?: string;
  };
  threads?: {
    post?: string;
    hashtags?: string[];
    goal?: string;
  };
  pinterest?: {
    title?: string;
    description?: string;
    board?: string;
    hashtags?: string[];
    goal?: string;
  };
}

// New analysis interfaces
export interface MarketIntelligence {
  tam: string; // Total Addressable Market
  sam: string; // Serviceable Addressable Market  
  som: string; // Serviceable Obtainable Market
  growthRate: string;
  marketTiming: number; // 1-5 stars
  keyTrends: string[];
}

export interface CompetitiveLandscape {
  directCompetitors: string[];
  indirectCompetitors: string[];
  marketPosition: string;
  differentiationScore: number; // 1-10
  competitiveMoat: string;
  entryBarriers: string;
}

export interface RevenueModel {
  primaryModel: string;
  pricePoint: string;
  revenueStreams: string[];
  breakEvenTimeline: string;
  ltvCacRatio: string;
  projectedMrr: string;
}

export interface TargetAudience {
  primarySegment: string;
  secondarySegment: string;
  tertiarySegment: string;
  painPoints: string[];
  willingnessToPay: string;
  customerAcquisitionChannels: string[];
}

export interface RiskAssessment {
  technicalRisk: RiskLevel;
  marketRisk: RiskLevel;
  financialRisk: RiskLevel;
  regulatoryRisk: RiskLevel;
  overallRiskLevel: RiskLevel;
  mitigationStrategies: string[];
}

export interface GoToMarket {
  phase1: string;
  phase2: string;
  phase3: string;
  timeline: string;
  budgetNeeded: string;
  keyChannels: string[];
}

export interface DevelopmentRoadmap {
  mvpTimeline: string;
  betaLaunch: string;
  publicLaunch: string;
  keyFeatures: string[];
  teamNeeded: string[];
  techStack: string[];
}

export interface ProductMarketFit {
  problemSolutionFit: number; // percentage
  solutionMarketFit: number; // percentage
  earlyAdopterSignals: string;
  retentionPrediction: string;
  viralCoefficient: string;
  pmfIndicators: string[];
}

// VC Review types removed from active usage

export type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';

export interface PlatformAnalysis {
  platformName: string;
  score: number; // 1-5 simple score
  summary: string; // 2-3 sentence simple explanation
  keyFindings: string[]; // 2-3 key findings
  contentSuggestion: string; // Platform-specific content suggestion
}

// Legacy interface for backward compatibility
export interface SimplifiedValidationResult extends DynamicPromptResult {}

// Legacy interface for backward compatibility
export interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  signalSummary: PlatformSignal[];
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
  // Optional advanced fields
  content?: string;
  contentType?: ContentType;
  confidenceLevel?: number;
  scoreBreakdown?: ScoreBreakdown;
  marketTiming?: MarketTiming;
  contentQuality?: ContentQuality;
  instagramSuggestion?: string;
  tiktokSuggestion?: string;
  facebookSuggestion?: string;
  validationlyScore?: ValidationlyScore;
  // 🚀 PHASE 1: New real-time data
  realTimeInsights?: RealTimeInsights;
  // Enhancement metadata
  enhancementMetadata?: {
    redditAnalyzed: boolean;
    trendsAnalyzed: boolean;
    aiConfidence: number;
    fallbackUsed: boolean;
    enhancementApplied: boolean;
  };
  // Enhanced Analysis Fields (from enhanced-validate API)
  industry?: IndustryCategory;
  industryConfidence?: number;
  industryFramework?: IndustryFramework;
  industrySpecificInsights?: string[];
  dimensionalScores?: DimensionalScores;
  riskMatrix?: RiskMatrix;
  overallRiskLevel?: RiskLevel;
}

export interface PlatformSignal {
  platform: 'X' | 'Twitter' | 'Reddit' | 'LinkedIn' | 'General';
  summary: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ValidationRequest {
  content?: string;  // New primary field
  idea?: string;     // Backward compatibility
  lang?: 'tr' | 'en';
  model?: string;    // Optional runtime model selection (whitelisted on server)
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface UserInput {
  idea: string;
  isValid: boolean;
  errorMessage?: string;
}

// ===== ENHANCED ANALYSIS METHODOLOGY INTERFACES =====

// Industry Classification System
export enum IndustryCategory {
  SAAS_TECH = 'saas_tech',
  ECOMMERCE = 'ecommerce',
  HEALTH_FITNESS = 'health_fitness',
  EDUCATION = 'education',
  FINTECH = 'fintech',
  MARKETPLACE = 'marketplace',
  CONSUMER_APP = 'consumer_app',
  B2B_SERVICES = 'b2b_services',
  HARDWARE = 'hardware',
  CONTENT_MEDIA = 'content_media'
}

// Risk Assessment Types
// Duplicate definition removed; use the unified RiskLevel above

export interface RiskAssessment {
  level: RiskLevel;
  description: string;
  mitigationStrategies: string[];
  impact: number; // 1-10
  probability: number; // 1-10
}

// Multi-Dimensional Scoring
export interface DimensionalScore {
  score: number; // 0-100
  reasoning: string;
  keyFactors: string[];
  improvementAreas: string[];
}

export interface DimensionalScores {
  marketSize: DimensionalScore;
  competitionIntensity: DimensionalScore;
  technicalFeasibility: DimensionalScore;
  monetizationPotential: DimensionalScore;
  timingTrend: DimensionalScore;
}

// Risk Matrix
export interface RiskMatrix {
  technical: RiskAssessment;
  market: RiskAssessment;
  financial: RiskAssessment;
  regulatory: RiskAssessment;
  execution: RiskAssessment;
}

// Competitor Analysis
export interface CompetitorAnalysis {
  majorPlayers: string[];
  marketGaps: string[];
  differentiationOpportunities: string[];
  competitiveAdvantages: string[];
  competitorStrengths: Record<string, string[]>;
  marketPositioning: string[];
}

// Financial Projections
export interface YearlyProjection {
  year: number;
  conservative: number;
  realistic: number;
  optimistic: number;
  keyAssumptions: string[];
}

export interface CostBreakdown {
  development: number;
  marketing: number;
  operations: number;
  personnel: number;
  other: number;
  breakdown: Record<string, number>;
}

export interface FundingStage {
  stage: 'seed' | 'series_a' | 'growth';
  amount: string;
  timeline: string;
  keyMilestones: string[];
  investorTypes: string[];
}

export interface FinancialProjections {
  revenueProjection: YearlyProjection[];
  costStructure: CostBreakdown;
  breakEvenTimeline: string;
  fundingRequirements: FundingStage[];
  keyMetrics: Record<string, string>;
}

// Platform Analysis
export interface PlatformScore {
  score: number; // 0-100
  viralPotential: number;
  audienceFit: number;
  contentStrategy: string[];
  successFactors: string[];
  challenges: string[];
  recommendedApproach: string;
}

export interface PlatformAnalysis {
  twitter: PlatformScore;
  reddit: PlatformScore;
  linkedin: PlatformScore;
  tiktok: PlatformScore;
  productHunt: PlatformScore;
  rankedRecommendations: string[];
}

// Persona Analysis
export interface PersonaInsight {
  name: string;
  description: string;
  adoptionLikelihood: number; // 0-100
  keyConcerns: string[];
  persuasionStrategies: string[];
  valueProposition: string;
  demographicProfile: string;
  behaviorPatterns: string[];
}

// Validation Framework
export interface Assumption {
  id: string;
  description: string;
  criticality: 'High' | 'Medium' | 'Low';
  confidence: number; // 0-100
  category: 'market' | 'technical' | 'business' | 'user';
}

export interface ValidationExperiment {
  assumptionId: string;
  experimentType: string;
  description: string;
  successCriteria: string;
  failureCriteria: string;
  requiredSampleSize: number;
  estimatedCost: string;
  timeframe: string;
  resources: string[];
  riskLevel: RiskLevel;
}

export interface ValidationTimeline {
  totalDuration: string;
  phases: Array<{
    phase: string;
    duration: string;
    experiments: string[];
    deliverables: string[];
  }>;
  decisionPoints: Array<{
    week: number;
    decision: string;
    criteria: string[];
    pivotTriggers: string[];
  }>;
}

export interface ValidationRoadmap {
  criticalAssumptions: Assumption[];
  experiments: ValidationExperiment[];
  timeline: ValidationTimeline;
  successMetrics: string[];
  pivotIndicators: string[];
}

// Action Planning
export interface ActionItem {
  id: string;
  task: string;
  description: string;
  successCriteria: string;
  requiredResources: string[];
  timeEstimate: string;
  priority: 'High' | 'Medium' | 'Low';
  dependencies: string[];
  category: 'research' | 'development' | 'marketing' | 'validation';
}

export interface WeeklyPlan {
  week: number;
  theme: string;
  objectives: string[];
  tasks: ActionItem[];
  deliverables: string[];
  successMetrics: string[];
}

export interface NextSteps {
  week1: WeeklyPlan;
  week2: WeeklyPlan;
  week3: WeeklyPlan;
  week4: WeeklyPlan;
  overallGoal: string;
  keyMilestones: string[];
}

// Market Timing Analysis
export interface TimingAnalysis {
  currentReadiness: number; // 0-100
  optimalTiming: string;
  marketConditions: string[];
  recommendations: string[];
  trendAnalysis: {
    technology: string;
    consumer: string;
    economic: string;
    regulatory: string;
  };
  waitingStrategy?: {
    whatToWaitFor: string[];
    preparationSteps: string[];
    timeframe: string;
  };
}

// Industry-Specific Framework
export interface IndustryFramework {
  category: IndustryCategory;
  scoringWeights: {
    marketSize: number;
    competition: number;
    technical: number;
    monetization: number;
    timing: number;
  };
  specificConsiderations: string[];
  regulatoryFactors: string[];
  keyMetrics: string[];
  successPatterns: string[];
  commonChallenges: string[];
  typicalTimelines: {
    mvp: string;
    marketEntry: string;
    profitability: string;
  };
}

// Critic Agent - Quality Control System
export interface CriticAnalysis {
  overallQuality: number; // 0-100
  issues: QualityIssue[];
  suggestions: string[];
  completenessScore: number; // 0-100
  consistencyScore: number; // 0-100
  needsRepair: boolean;
}

export interface QualityIssue {
  type: 'missing_field' | 'inconsistent_data' | 'low_quality' | 'language_mixing' | 'unrealistic_numbers';
  field: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

// Evidence-Based Analysis
export interface EvidenceSource {
  platform: string;
  type: 'reddit_post' | 'product_hunt' | 'crunchbase' | 'github' | 'news' | 'trend_data';
  content: string;
  url?: string;
  relevanceScore: number; // 0-100
  credibilityScore: number; // 0-100
}

export interface EvidenceAnalysis {
  sources: EvidenceSource[];
  evidenceQuality: number; // 0-100
  supportingEvidence: string[];
  contradictingEvidence: string[];
  confidenceBoost: number; // -20 to +20
}

// Enhanced Confidence Scoring
export interface ConfidenceFactors {
  sectorCoverage: number; // 0-100
  analysisDepth: number; // 0-100
  schemaCompleteness: number; // 0-100
  evidenceQuality: number; // 0-100
  consistencyScore: number; // 0-100
  modelReliability: number; // 0-100
}

export interface EnhancedConfidence {
  overall: number; // 0-100
  factors: ConfidenceFactors;
  breakdown: string[];
  recommendations: string[];
}

// Enhanced Risk Assessment
export interface EnhancedRiskMatrix {
  technical: RiskAssessment;
  market: RiskAssessment;
  financial: RiskAssessment;
  regulatory: RiskAssessment;
  competitive: RiskAssessment;
  overall: RiskLevel;
  mitigationStrategies: string[];
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0-100
  factors: string[];
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  mitigations: string[];
}

// Enhanced Financial Projections
export interface EnhancedFinancialProjections {
  revenueModel: RevenueModel;
  pricingStrategy: PricingStrategy;
  financialMetrics: FinancialMetrics;
  fundingRequirements: FundingRequirements;
  breakEvenAnalysis: BreakEvenAnalysis;
}

export interface RevenueModel {
  primary: string;
  secondary: string[];
  revenueStreams: RevenueStream[];
  scalabilityFactor: number; // 1-10
}

export interface RevenueStream {
  name: string;
  type: 'subscription' | 'one_time' | 'commission' | 'advertising' | 'freemium';
  projectedRevenue: number;
  confidence: number; // 0-100
}

export interface PricingStrategy {
  model: 'freemium' | 'subscription' | 'one_time' | 'usage_based' | 'tiered';
  pricePoint: number;
  currency: string;
  justification: string;
  competitivePosition: 'premium' | 'competitive' | 'budget';
}

export interface FinancialMetrics {
  ltvcacRatio: number;
  projectedMRR: number;
  churnRate: number;
  grossMargin: number;
  unitEconomics: string;
}

export interface FundingRequirements {
  totalNeeded: number;
  currency: string;
  breakdown: FundingBreakdown[];
  timeline: string;
  fundingStage: 'pre_seed' | 'seed' | 'series_a' | 'bootstrap';
}

export interface FundingBreakdown {
  category: string;
  amount: number;
  percentage: number;
  justification: string;
}

export interface BreakEvenAnalysis {
  timeToBreakEven: number; // months
  monthlyBurnRate: number;
  revenueRequired: number;
  assumptions: string[];
}

// Enhanced Persona Analysis
export interface EnhancedPersonaInsight {
  segment: string;
  demographics: Demographics;
  psychographics: Psychographics;
  painPoints: PainPoint[];
  willingnessToPay: WillingnessToPay;
  acquisitionChannels: AcquisitionChannel[];
  marketSize: number;
  priority: 'primary' | 'secondary' | 'tertiary';
}

export interface Demographics {
  ageRange: string;
  income: string;
  location: string;
  occupation: string;
  education: string;
}

export interface Psychographics {
  values: string[];
  interests: string[];
  behaviors: string[];
  motivations: string[];
}

export interface PainPoint {
  description: string;
  severity: number; // 1-10
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  currentSolutions: string[];
  satisfactionWithCurrent: number; // 1-10
}

export interface WillingnessToPay {
  minPrice: number;
  maxPrice: number;
  idealPrice: number;
  priceElasticity: 'high' | 'medium' | 'low';
  paymentPreference: 'monthly' | 'annual' | 'one_time';
}

export interface AcquisitionChannel {
  channel: string;
  effectiveness: number; // 1-10
  cost: 'low' | 'medium' | 'high';
  timeToConvert: string;
  scalability: number; // 1-10
}

// Error Management - Enhanced Error Handling
export interface RetryStrategy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
  retryableErrors: string[];
}

export interface FallbackConfig {
  models: string[];
  qualityThreshold: number;
  gracefulDegradation: boolean;
  fallbackPrompts: Record<string, string>;
}

export interface ErrorContext {
  attempt: number;
  model: string;
  error: string;
  timestamp: string;
  inputLength: number;
  promptVersion: string;
}

// Enhanced Validation Result
export interface EnhancedValidationResult {
  // Core Analysis
  idea: string;
  industry: IndustryCategory;
  industryConfidence: number; // 0-100
  overallScore: number;
  
  // Multi-Dimensional Scoring (Requirement 1.1)
  dimensionalScores: DimensionalScores;
  
  // Industry-Specific Analysis (Requirement 2.2)
  industryFramework: IndustryFramework;
  industrySpecificInsights: string[];
  
  // Enhanced Risk Assessment
  riskMatrix: EnhancedRiskMatrix;
  overallRiskLevel: RiskLevel;
  
  // Competitor Intelligence
  competitorAnalysis: CompetitorAnalysis;
  
  // Enhanced Financial Projections
  financialProjections: EnhancedFinancialProjections;
  
  // Platform Analysis
  platformAnalysis: PlatformAnalysis;
  
  // Enhanced Persona Analysis
  personaAnalysis: EnhancedPersonaInsight[];
  
  // Validation Roadmap
  validationRoadmap: ValidationRoadmap;
  
  // Actionable Steps
  nextSteps: NextSteps;
  
  // Market Timing
  timingAnalysis: TimingAnalysis;
  
  // Quality Control
  criticAnalysis: CriticAnalysis;
  
  // Evidence-Based Analysis
  evidenceAnalysis?: EvidenceAnalysis;
  
  // Enhanced Confidence
  enhancedConfidence: EnhancedConfidence;
  
  // Analysis Metadata
  analysisMetadata: {
    analysisDate: string;
    aiModel: string;
    fallbackUsed: boolean;
    analysisVersion: string;
    processingTime: number;
    confidence: number; // 0-100
    language: string;
    completeness: number; // 0-100 - percentage of analysis components completed
    retryCount: number;
    qualityScore: number;
  };
  
  // Backward Compatibility (maintain existing interface)
  demandScore: number; // Maps to overallScore
  scoreJustification: string;
  signalSummary: PlatformSignal[];
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
}

// Analysis Component Base Classes
export abstract class AnalysisComponent {
  protected industry: IndustryCategory;
  protected language: string;
  
  constructor(industry: IndustryCategory, language: string = 'en') {
    this.industry = industry;
    this.language = language;
  }
  
  abstract analyze(input: string): Promise<any>;
  
  protected getIndustryWeights(): { marketSize: number; competition: number; technical: number; monetization: number; timing: number } {
    // Default weights - to be overridden by specific components
    return {
      marketSize: 0.25,
      competition: 0.20,
      technical: 0.20,
      monetization: 0.20,
      timing: 0.15
    };
  }
  
  protected validateScore(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

export abstract class DimensionalScorer extends AnalysisComponent {
  abstract calculateDimensionalScores(input: string): Promise<DimensionalScores>;
  
  protected calculateOverallScore(scores: DimensionalScores): number {
    const weights = this.getIndustryWeights();
    return this.validateScore(
      scores.marketSize.score * weights.marketSize +
      scores.competitionIntensity.score * weights.competition +
      scores.technicalFeasibility.score * weights.technical +
      scores.monetizationPotential.score * weights.monetization +
      scores.timingTrend.score * weights.timing
    );
  }
}

export abstract class RiskAssessor extends AnalysisComponent {
  abstract assessRisks(input: string): Promise<RiskMatrix>;
  
  protected calculateOverallRisk(risks: RiskMatrix): RiskLevel {
    const riskScores = Object.values(risks).map(risk => {
      switch (risk.level) {
        case 'Low': return 1;
        case 'Medium': return 2;
        case 'High': return 3;
        default: return 2;
      }
    });
    
    const averageRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
    
    if (averageRisk <= 1.5) return 'Low';
    if (averageRisk <= 2.5) return 'Medium';
    return 'High';
  }
}

export abstract class IndustryClassifier extends AnalysisComponent {
  abstract classifyIndustry(input: string): Promise<{
    category: IndustryCategory;
    confidence: number;
    reasoning: string;
  }>;
  
  protected getIndustryKeywords(): Record<IndustryCategory, string[]> {
    return {
      [IndustryCategory.SAAS_TECH]: ['software', 'saas', 'api', 'platform', 'cloud', 'tech', 'app'],
      [IndustryCategory.ECOMMERCE]: ['ecommerce', 'online store', 'marketplace', 'retail', 'shopping'],
      [IndustryCategory.HEALTH_FITNESS]: ['health', 'fitness', 'wellness', 'medical', 'healthcare'],
      [IndustryCategory.EDUCATION]: ['education', 'learning', 'course', 'training', 'teaching'],
      [IndustryCategory.FINTECH]: ['finance', 'fintech', 'payment', 'banking', 'investment'],
      [IndustryCategory.MARKETPLACE]: ['marketplace', 'platform', 'connect', 'network', 'community'],
      [IndustryCategory.CONSUMER_APP]: ['mobile app', 'consumer', 'social', 'entertainment'],
      [IndustryCategory.B2B_SERVICES]: ['b2b', 'business', 'enterprise', 'service', 'consulting'],
      [IndustryCategory.HARDWARE]: ['hardware', 'device', 'iot', 'physical', 'manufacturing'],
      [IndustryCategory.CONTENT_MEDIA]: ['content', 'media', 'publishing', 'creative', 'video']
    };
  }
}


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
  
  // Community Match (optional)
  communityMatch?: CommunityMatch;
  
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

// ---- Community Match schema ----
export interface CommunityItem {
  name: string;
  url?: string;
  members?: string; // e.g., "120k" or "12,345"
  fitReason: string; // why this community fits the idea
  rulesSummary: string; // key posting rules to respect
  entryMessage: string; // a short, compliant intro/DM/post template
}

export interface CommunityMatch {
  subreddits: CommunityItem[];
  discordServers: CommunityItem[];
  linkedinGroups: CommunityItem[];
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

// Fast Validate Interfaces
export interface FastPlatformAnalysis {
  summary: string;
  findings: string[];
  suggestion: string;
  score: number; // 1-5
}

export interface FastValidateResult {
  idea: string;
  score: number; // 0-100
  justification: string;
  platforms: {
    twitter?: FastPlatformAnalysis;
    reddit?: FastPlatformAnalysis;
    linkedin?: FastPlatformAnalysis;
  };
  posts: {
    tweet: string;
    redditTitle: string;
    redditBody: string;
    linkedin: string;
  };
}

// Results Dashboard Interface
export interface AnalysisResult {
  overallScore: number;
  summary: string;
  potentialMarket: string;
  risks: string;
  platformAnalyses: Array<{
    platform: string;
    interestLevel: number;
  }>;
}

// Premium MVP - 7 Platform System Types
export interface PremiumPlatformData {
  platform: string;
  summary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  metrics: {
    volume: number;
    engagement: number;
    growth_rate: number;
    total_stars?: number;
    total_forks?: number;
    total_comments?: number;
    total_views?: number;
    total_likes?: number;
    total_votes?: number;
    total_answers?: number;
    avg_score?: number;
    avg_points?: number;
    avg_relevance?: number;
  };
  top_keywords: string[];
  representative_quotes: Array<{
    text: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
  additional_insights?: string[];
}

export interface PremiumAnalysisResult {
  demand_index: number;
  verdict: 'high' | 'medium' | 'low';
  opportunities: string[];
  risks: string[];
  mvp_suggestions: string[];
  platforms: PremiumPlatformData[];
}

export interface PremiumSocialPosts {
  twitter: {
    tone: 'professional' | 'fun' | 'analytical';
    text: string;
  };
  reddit: {
    title: string;
    body: string;
  };
  linkedin: {
    tone: 'professional' | 'fun' | 'analytical';
    text: string;
    cta: string;
  };
}

export interface PremiumValidationRequest {
  query: string;
  time_range?: {
    from: string; // ISO date
    to: string;   // ISO date
  };
  platforms?: string[]; // default = all 7
  language?: string;    // auto-detect
  max_items_per_platform?: number; // default = 100
  tones_for_posts?: Array<'professional' | 'fun' | 'analytical'>;
  output_format?: 'json';
}

export interface PremiumValidationResponse {
  query: string;
  language: string;
  analysis: PremiumAnalysisResult;
  social_posts: PremiumSocialPosts;
  generated_at: string;
}

// Social Arbitrage Types - Phase 1 Premium Feature
export interface SocialArbitrageMetrics {
  attention_imbalance: number;      // AII ∈ [0,1] - social vs news balance
  lag_minutes: number;              // CPL - cross-platform lag
  sentiment_velocity: number;       // SV ∈ [-1,1] - sentiment change rate
  influencer_momentum: number;      // IWM ∈ [0,1] - influencer-weighted momentum
  narrative_concentration: number;  // NC ∈ [0,1] - narrative focus (Herfindahl)
  catalyst_proximity: number;       // CPS ∈ [0,1] - proximity to catalysts
  mispricing_gap: number;          // MG ∈ [0,1] - composite arbitrage gap
  edge_type: 'content' | 'distribution' | 'product' | 'none';
  confidence: number;               // model confidence in metrics
}

export interface ArbitrageCatalyst {
  type: 'ph_launch' | 'gh_release' | 'conf' | 'video' | 'news';
  eta: string;                     // ISO date
  likelihood: number;              // ∈ [0,1]
  description?: string;
}

export interface ArbitragePlay {
  type: 'content' | 'distribution' | 'product';
  where: string;                   // target platform
  why: string;                     // reasoning
  cta: string;                     // call to action
  urgency: 'high' | 'medium' | 'low';
  estimated_window_hours: number;  // opportunity window
}

// Enhanced Platform Data with Arbitrage
export interface PremiumPlatformDataWithArbitrage extends PremiumPlatformData {
  arbitrage?: SocialArbitrageMetrics;
  catalysts?: ArbitrageCatalyst[];
  plays?: ArbitragePlay[];
}

// Enhanced Analysis Result with Arbitrage
export interface PremiumAnalysisResultWithArbitrage extends PremiumAnalysisResult {
  social_arbitrage_rating: number;  // SAR ∈ [0,100]
  arbitrage_horizon_days: number;   // expected window before mainstream
  arbitrage_decay_half_life: number; // how fast edge fades
  top_catalysts: ArbitrageCatalyst[];
  recommended_plays: ArbitragePlay[];
  platforms: PremiumPlatformDataWithArbitrage[];
}

// Plan-Based Feature Access
export type UserPlan = 'free' | 'pro' | 'premium';

export interface PlanLimits {
  queries_per_month: number;
  platforms: string[];
  exports: boolean;
  arbitrage_metrics: boolean;
  comparison: boolean;
  alerts: boolean;
  automation: boolean;
}

export const PLAN_CONFIGS: Record<UserPlan, PlanLimits> = {
  free: {
    queries_per_month: 3,
    platforms: ['reddit', 'googlenews'],
    exports: false,
    arbitrage_metrics: false,
    comparison: false,
    alerts: false,
    automation: false
  },
  pro: {
    queries_per_month: -1, // unlimited
    platforms: ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'],
    exports: true,
    arbitrage_metrics: false,
    comparison: true,
    alerts: false,
    automation: false
  },
  premium: {
    queries_per_month: -1, // unlimited
    platforms: ['reddit', 'hackernews', 'producthunt', 'github', 'stackoverflow', 'googlenews', 'youtube'],
    exports: true,
    arbitrage_metrics: true,
    comparison: true,
    alerts: true,
    automation: true
  }
};

// User Context for Plan-Based Features
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  fullName?: string;
  avatarUrl?: string;
  plan?: UserPlan;
  subscription_status?: 'active' | 'canceled' | 'expired';
}

// ==========================================
// SIGNAL DIGEST SYSTEM TYPES
// ==========================================

export interface WeeklyDigestRequest {
  category: string;
  time_range: {
    from: string;
    to: string;
  };
  language?: string;
  user_plan?: UserPlan;
}

export interface Signal {
  title: string;
  signal_score: number;
  demand_index: number;
  arbitrage: SocialArbitrageMetrics;
  evidence: PlatformEvidence;
  platforms_covered: string[];
  risk_flags: string[];
  notes: string[];
  novelty_score?: number;
  cross_evidence_score?: number;
}

export interface PlatformEvidence {
  github?: Array<{
    repo: string;
    stars_7d: number;
    url: string;
    description?: string;
  }>;
  reddit?: Array<{
    post: string;
    upvotes: number;
    url: string;
    subreddit?: string;
  }>;
  hackernews?: Array<{
    story: string;
    points: number;
    url: string;
    comments?: number;
  }>;
  producthunt?: Array<{
    post: string;
    eta?: string;
    url: string;
    votes?: number;
  }>;
  stackoverflow?: Array<{
    question: string;
    unanswered: boolean;
    url: string;
    views?: number;
  }>;
  googlenews?: Array<{
    headline: string;
    url: string;
    published?: string;
  }>;
  youtube?: Array<{
    video: string;
    views: number;
    url: string;
    channel?: string;
  }>;
}

export interface ActionablePlay {
  type: 'diligence' | 'sourcing' | 'market_making';
  where: string;
  why: string;
  cta: string;
  urgency: 'high' | 'medium' | 'low';
  estimated_window_hours: number;
  templates: {
    email_subject: string;
    email_body: string;
    linkedin_message?: string;
  };
}

export interface WeeklyDigest {
  category: string;
  time_range: {
    from: string;
    to: string;
  };
  language: string;
  sar: number;
  horizon_days: number;
  summary: {
    one_liner: string;
    top_takeaways: string[];
    risks: string[];
    confidence: number;
  };
  top_signals: Signal[];
  plays: ActionablePlay[];
  appendix: {
    platform_stats: Record<string, any>;
    methodology_notes: string[];
  };
  export_options: {
    pdf: boolean;
    markdown: boolean;
    notion: boolean;
  };
  notes: string[];
  created_at: string;
}

// ==========================================
// ICP PAIN EXTRACTOR SYSTEM TYPES
// ==========================================

export type PainCategory = 
  | 'Functional' 
  | 'Integration' 
  | 'Performance' 
  | 'UX' 
  | 'Onboarding' 
  | 'Pricing' 
  | 'Docs' 
  | 'Security';

export type PersonaType = 'founder' | 'pm' | 'dev' | 'vc';

export interface PainExtractionRequest {
  query: string;
  persona: PersonaType;
  time_range: {
    from: string;
    to: string;
  };
  language?: string;
  user_plan?: UserPlan;
}

export interface PainMention {
  text: string;
  platform: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  intent: 'complaint' | 'feature_request' | 'question' | 'praise' | 'announcement';
  confidence: number;
  taxonomy: PainCategory[];
  author_karma?: number;
}

export interface PainCluster {
  cluster_id: string;
  label: string;
  taxonomy: PainCategory[];
  keywords: string[];
  metrics: {
    freq: number;        // frequency (0-1)
    sev: number;         // severity (0-1)
    urg: number;         // urgency (0-1)
    imp: number;         // impact (0-1)
    addr: number;        // addressability (0-1)
    comp_gap: number;    // competition gap (0-1)
    pain_score: number;  // 0-100
    opp_score: number;   // 0-100
  };
  intent_breakdown: {
    complaint: number;
    feature_request: number;
    question: number;
    praise?: number;
    announcement?: number;
  };
  representative_quotes: Array<{
    text: string;
    platform: string;
    sentiment: string;
    author?: string;
  }>;
  solutions_mentioned: Array<{
    type: 'producthunt' | 'github' | 'other';
    name: string;
    url: string;
    description?: string;
  }>;
  actions: {
    mvp_features: string[];
    gtm: string[];
    success_metrics: string[];
  };
  arbitrage?: SocialArbitrageMetrics;
}

export interface PainExtractionResult {
  query: string;
  persona: PersonaType;
  time_range: {
    from: string;
    to: string;
  };
  language: string;
  summary: {
    top_pains: Array<{
      label: string;
      pain_score: number;
      opp_score: number;
      why: string[];
      quick_wins: string[];
      copy_hooks: string[];
    }>;
    persona_hint: PersonaType;
    confidence: number;
  };
  pain_clusters: PainCluster[];
  social_posts: {
    twitter: {
      tone: string;
      text: string;
    };
    reddit: {
      title: string;
      body: string;
    };
    linkedin: {
      tone: string;
      text: string;
      cta: string;
    };
  };
  filters?: {
    taxonomy: PainCategory[];
    platforms: string[];
  };
  notes: string[];
}

export interface PersonaWeights {
  [key in PersonaType]: {
    [category in PainCategory]: number;
  };
}

export const PERSONA_WEIGHTS: PersonaWeights = {
  founder: {
    Functional: 0.20,
    Integration: 0.10,
    Performance: 0.10,
    UX: 0.10,
    Onboarding: 0.20,
    Pricing: 0.25,
    Docs: 0.03,
    Security: 0.02
  },
  pm: {
    Functional: 0.25,
    Integration: 0.10,
    Performance: 0.15,
    UX: 0.20,
    Onboarding: 0.15,
    Pricing: 0.10,
    Docs: 0.03,
    Security: 0.02
  },
  dev: {
    Functional: 0.15,
    Integration: 0.25,
    Performance: 0.20,
    UX: 0.05,
    Onboarding: 0.05,
    Pricing: 0.05,
    Docs: 0.15,
    Security: 0.10
  },
  vc: {
    Functional: 0.20,
    Integration: 0.10,
    Performance: 0.15,
    UX: 0.10,
    Onboarding: 0.15,
    Pricing: 0.20,
    Docs: 0.05,
    Security: 0.05
  }
};

// ==========================================
// YOUTUBE HOOK SYNTH SYSTEM TYPES
// ==========================================

export type HookType = 
  | 'question' 
  | 'bold_claim' 
  | 'curiosity_gap' 
  | 'pattern_interrupt' 
  | 'fomo' 
  | 'challenge' 
  | 'authority' 
  | 'contrarian';

export type VideoTone = 'energetic' | 'analytical' | 'casual' | 'authoritative' | 'friendly';
export type VideoGoal = 'free_trial_signups' | 'engagement' | 'subscriber_growth' | 'product_sales' | 'brand_awareness';

export interface HookSynthRequest {
  category: string;
  persona: string;
  tone: VideoTone;
  goal: VideoGoal;
  language?: string;
  user_plan?: UserPlan;
}

export interface VisualPlan {
  t: string; // timestamp like "0.0", "2.5"
  shot: string; // description of visual
  overlay?: string; // text overlay
  sfx?: string; // sound effect
}

export interface Hook {
  type: HookType;
  text: string;
  duration_sec: number;
  visual_plan: VisualPlan[];
  variants: string[];
  hook_score: number;
  reasons: string[];
}

export interface ABTestPack {
  titles: string[];
  thumbnail_prompts: string[];
}

export interface HookSynthResult {
  brief: {
    category: string;
    persona: string;
    tone: VideoTone;
    goal: VideoGoal;
  };
  hooks: Hook[];
  ab_test_pack: ABTestPack;
  notes: string[];
  created_at: string;
}

export interface HookMetrics {
  retention_pred: number;    // predicted 30s retention (0-1)
  click_pred: number;        // predicted click rate (0-1)
  novelty: number;          // novelty score (0-1)
  persona_fit: number;      // persona alignment (0-1)
}
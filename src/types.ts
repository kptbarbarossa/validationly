
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


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

export interface MarketTiming {
  readiness: number;
  trendDirection: 'Rising' | 'Stable' | 'Declining';
  optimalWindow: string;
}

export type ContentType = 'startup_idea' | 'social_content' | 'product_idea' | 'general_content';

export interface ValidationResult {
  content: string;
  contentType: ContentType;
  demandScore: number;
  scoreJustification: string;
  confidenceLevel: number;
  scoreBreakdown: ScoreBreakdown;
  marketTiming: MarketTiming;
  contentQuality: ContentQuality;
  signalSummary: PlatformSignal[];
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
  instagramSuggestion: string;
  tiktokSuggestion: string;
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

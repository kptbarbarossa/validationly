
export interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  signalSummary: {
    platform: 'Twitter' | 'Reddit' | 'LinkedIn' | 'General';
    postCount: number;
    summary: string;
  }[];
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
}

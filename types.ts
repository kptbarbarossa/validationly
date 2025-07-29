
export interface ValidationResult {
  idea: string;
  demandScore: number;
  scoreJustification: string;
  signalSummary: string[];
  tweetSuggestion: string;
  redditTitleSuggestion: string;
  redditBodySuggestion: string;
  linkedinSuggestion: string;
}
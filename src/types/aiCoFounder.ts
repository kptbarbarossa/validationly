// AI Co-founder Types and Interfaces

export interface UserContext {
  userId: string;
  username?: string;
  email?: string;
  createdAt: Date;
  lastActive: Date;
  
  // Validation History
  validationHistory: ValidationHistory[];
  totalValidations: number;
  
  // User Preferences
  favoritePlatforms: string[];
  industryPreferences: string[];
  businessStage: 'idea' | 'mvp' | 'launch' | 'scale';
  
  // AI Learning
  aiInsights: AIInsight[];
  conversationHistory: Conversation[];
  personalizedTips: PersonalizedTip[];
}

export interface ValidationHistory {
  id: string;
  idea: string;
  timestamp: Date;
  overallScore: number;
  platformAnalyses: PlatformAnalysis[];
  summary: string;
  aiRecommendations: string[];
}

export interface PlatformAnalysis {
  platform: string;
  interestLevel: number;
  keyInsights: string[];
  opportunities: string[];
  risks: string[];
}

export interface AIInsight {
  id: string;
  type: 'market' | 'platform' | 'strategy' | 'timing';
  title: string;
  description: string;
  confidence: number; // 0-100
  timestamp: Date;
  actionable: boolean;
}

export interface Conversation {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  context: {
    currentIdea?: string;
    validationStage?: 'planning' | 'execution' | 'optimization';
    userIntent?: 'validation' | 'strategy' | 'growth' | 'pricing';
  };
  followUpActions?: string[];
}

export interface PersonalizedTip {
  id: string;
  category: 'platform' | 'timing' | 'strategy' | 'growth';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  basedOn: string[]; // What data this tip is based on
  actionItems: string[];
}

export interface AICoFounderResponse {
  message: string;
  context: {
    rememberedIdeas: string[];
    userPreferences: string[];
    previousRecommendations: string[];
  };
  suggestions: AISuggestion[];
  followUpQuestions: string[];
  nextSteps: string[];
}

export interface AISuggestion {
  type: 'validation' | 'strategy' | 'platform' | 'timing';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionItems: string[];
}

export interface UserIntent {
  primary: 'validate' | 'strategize' | 'optimize' | 'grow';
  secondary?: 'platform' | 'timing' | 'audience' | 'pricing';
  urgency: 'low' | 'medium' | 'high';
  context: string;
}

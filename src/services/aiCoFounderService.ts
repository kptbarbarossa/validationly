import type { 
  UserContext, 
  AICoFounderResponse, 
  UserIntent, 
  ValidationHistory,
  AISuggestion 
} from '../types/aiCoFounder';

export class AICoFounderService {
  private userContexts: Map<string, UserContext> = new Map();

  // Initialize or get user context
  async getUserContext(userId: string): Promise<UserContext> {
    if (!this.userContexts.has(userId)) {
      const newContext: UserContext = {
        userId,
        createdAt: new Date(),
        lastActive: new Date(),
        validationHistory: [],
        totalValidations: 0,
        favoritePlatforms: [],
        industryPreferences: [],
        businessStage: 'idea',
        aiInsights: [],
        conversationHistory: [],
        personalizedTips: []
      };
      this.userContexts.set(userId, newContext);
    }
    
    const context = this.userContexts.get(userId)!;
    context.lastActive = new Date();
    return context;
  }

  // Add validation to user history
  async addValidation(userId: string, validation: ValidationHistory): Promise<void> {
    const context = await this.getUserContext(userId);
    context.validationHistory.unshift(validation);
    context.totalValidations++;
    
    // Update favorite platforms based on high interest
    const highInterestPlatforms = validation.platformAnalyses
      .filter(p => p.interestLevel >= 7)
      .map(p => p.platform);
    
    context.favoritePlatforms = [...new Set([...context.favoritePlatforms, ...highInterestPlatforms])];
    
    // Generate AI insights from this validation
    await this.generateInsights(context, validation);
  }

  // Generate AI insights from validation
  private async generateInsights(context: UserContext, validation: ValidationHistory): Promise<void> {
    const insights = [];

    // Platform-specific insights
    validation.platformAnalyses.forEach(platform => {
      if (platform.interestLevel >= 8) {
        insights.push({
          id: `insight_${Date.now()}_${platform.platform}`,
          type: 'platform' as const,
          title: `High Interest on ${platform.platform}`,
          description: `Your idea shows exceptional interest (${platform.interestLevel}/10) on ${platform.platform}. Consider prioritizing this platform for your go-to-market strategy.`,
          confidence: platform.interestLevel * 10,
          timestamp: new Date(),
          actionable: true
        });
      }
    });

    // Overall score insights
    if (validation.overallScore >= 80) {
      insights.push({
        id: `insight_${Date.now()}_overall`,
        type: 'strategy' as const,
        title: 'Exceptional Market Validation',
        description: `Your idea scored ${validation.overallScore}/100 - this indicates strong market demand. Consider accelerating your development timeline.`,
        confidence: validation.overallScore,
        timestamp: new Date(),
        actionable: true
      });
    }

    context.aiInsights.unshift(...insights);
  }

  // Process user message and generate AI response
  async processMessage(userId: string, message: string, currentIdea?: string): Promise<AICoFounderResponse> {
    const context = await this.getUserContext(userId);
    
    // Analyze user intent
    const intent = this.analyzeUserIntent(message);
    
    // Generate personalized response
    const response = await this.generateResponse(context, intent, message, currentIdea);
    
    // Save conversation
    context.conversationHistory.unshift({
      id: `conv_${Date.now()}`,
      timestamp: new Date(),
      userMessage: message,
      aiResponse: response.message,
      context: {
        currentIdea,
        validationStage: this.determineValidationStage(context),
        userIntent: intent.primary
      },
      followUpActions: response.nextSteps
    });

    return response;
  }

  // Analyze what the user wants
  private analyzeUserIntent(message: string): UserIntent {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('validate') || lowerMessage.includes('test') || lowerMessage.includes('idea')) {
      return { primary: 'validate', urgency: 'high', context: message };
    }
    
    if (lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('next')) {
      return { primary: 'strategize', urgency: 'medium', context: message };
    }
    
    if (lowerMessage.includes('grow') || lowerMessage.includes('scale') || lowerMessage.includes('expand')) {
      return { primary: 'grow', urgency: 'medium', context: message };
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return { primary: 'optimize', urgency: 'low', context: message };
    }
    
    return { primary: 'validate', urgency: 'medium', context: message };
  }

  // Generate AI response based on context and intent
  private async generateResponse(
    context: UserContext, 
    intent: UserIntent, 
    message: string, 
    currentIdea?: string
  ): Promise<AICoFounderResponse> {
    const rememberedIdeas = context.validationHistory.slice(0, 3).map(v => v.idea);
    const userPreferences = context.favoritePlatforms;
    const previousRecommendations = context.aiInsights.slice(0, 3).map(i => i.title);

    let responseMessage = '';
    let suggestions: AISuggestion[] = [];
    let followUpQuestions: string[] = [];
    let nextSteps: string[] = [];

    // Generate contextual response
    if (intent.primary === 'validate') {
      responseMessage = this.generateValidationResponse(context, currentIdea, rememberedIdeas);
      suggestions = this.generateValidationSuggestions(context);
      followUpQuestions = [
        "Hangi platformda daha detaylı analiz yapmak istersiniz?",
        "Bu fikrin hangi yönünü daha çok geliştirmek istiyorsunuz?",
        "Hedef kitlenizi nasıl tanımlıyorsunuz?"
      ];
      nextSteps = [
        "Platform-specific validation yapın",
        "Competitor analysis ekleyin",
        "Target audience research yapın"
      ];
    } else if (intent.primary === 'strategize') {
      responseMessage = this.generateStrategyResponse(context, rememberedIdeas);
      suggestions = this.generateStrategySuggestions(context);
      followUpQuestions = [
        "Hangi business model'i düşünüyorsunuz?",
        "Go-to-market stratejiniz nedir?",
        "Funding ihtiyacınız var mı?"
      ];
      nextSteps = [
        "Business model canvas oluşturun",
        "Go-to-market plan hazırlayın",
        "Financial projections yapın"
      ];
    }

    return {
      message: responseMessage,
      context: {
        rememberedIdeas,
        userPreferences,
        previousRecommendations
      },
      suggestions,
      followUpQuestions,
      nextSteps
    };
  }

  // Generate validation-focused response
  private generateValidationResponse(context: UserContext, currentIdea?: string, rememberedIdeas?: string[]): string {
    let response = "Merhaba! ";
    
    if (rememberedIdeas && rememberedIdeas.length > 0) {
      response += `Önceki fikirlerinizi hatırlıyorum: ${rememberedIdeas.join(', ')}. `;
    }
    
    if (currentIdea) {
      response += `Şimdi "${currentIdea}" fikrini validate etmek istiyorsunuz. `;
    }
    
    if (context.favoritePlatforms.length > 0) {
      response += `En iyi sonuçları aldığınız platformlar: ${context.favoritePlatforms.join(', ')}. `;
    }
    
    response += "Size nasıl yardımcı olabilirim?";
    
    return response;
  }

  // Generate strategy-focused response
  private generateStrategyResponse(context: UserContext, rememberedIdeas?: string[]): string {
    let response = "Strateji konusunda size yardimci olayim! ";
    
    if (rememberedIdeas && rememberedIdeas.length > 0) {
      const latestIdea = rememberedIdeas[0];
      response += `"${latestIdea}" fikriniz için strateji geliştirelim. `;
    }
    
    if (context.businessStage === 'idea') {
      response += "Su anda idea stage'desiniz. MVP gelistirme ve market validation odaklanmaniz gereken alanlar. ";
    } else if (context.businessStage === 'mvp') {
      response += "MVP'niz hazir. Simdi user acquisition ve product-market fit'e odaklanmalisiniz. ";
    }
    
          response += "Hangi konuda daha detayli strateji istiyorsunuz?";
    
    return response;
  }

  // Generate validation suggestions
  private generateValidationSuggestions(context: UserContext): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    if (context.favoritePlatforms.includes('reddit')) {
      suggestions.push({
        type: 'platform',
        title: 'Reddit Deep Dive',
        description: 'Reddit\'te guclu sinyaller aliyorsunuz. Subreddit-specific analiz yapalim.',
        confidence: 85,
        reasoning: 'Previous validations show high Reddit engagement',
        actionItems: ['Subreddit sentiment analysis', 'Community pain points', 'Competitor mentions']
      });
    }
    
    if (context.totalValidations > 3) {
      suggestions.push({
        type: 'strategy',
        title: 'Validation Pattern Analysis',
        description: 'Cok sayida validation yaptiniz. Pattern\'lari analiz edelim.',
        confidence: 90,
        reasoning: 'Multiple validations provide pattern insights',
        actionItems: ['Trend analysis', 'Platform performance comparison', 'Idea evolution tracking']
      });
    }
    
    return suggestions;
  }

  // Generate strategy suggestions
  private generateStrategySuggestions(context: UserContext): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    if (context.businessStage === 'idea') {
      suggestions.push({
        type: 'strategy',
        title: 'MVP Roadmap',
        description: 'Idea stage\'den MVP\'ye gecis plani olusturalim.',
        confidence: 80,
        reasoning: 'User is in idea stage, needs MVP guidance',
        actionItems: ['Feature prioritization', 'Technical requirements', 'Timeline planning']
      });
    }
    
    return suggestions;
  }

  // Determine current validation stage
  private determineValidationStage(context: UserContext): 'planning' | 'execution' | 'optimization' {
    if (context.totalValidations === 0) return 'planning';
    if (context.totalValidations < 3) return 'execution';
    return 'optimization';
  }

  // Get personalized tips for user
  async getPersonalizedTips(userId: string): Promise<PersonalizedTip[]> {
    const context = await this.getUserContext(userId);
    return context.personalizedTips;
  }

  // Update user business stage
  async updateBusinessStage(userId: string, stage: UserContext['businessStage']): Promise<void> {
    const context = await this.getUserContext(userId);
    context.businessStage = stage;
  }

  // Get user insights
  async getUserInsights(userId: string): Promise<AIInsight[]> {
    const context = await this.getUserContext(userId);
    return context.aiInsights;
  }
}

// Export singleton instance
export const aiCoFounderService = new AICoFounderService();

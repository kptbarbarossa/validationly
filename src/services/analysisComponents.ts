import {
  AnalysisComponent,
  DimensionalScorer,
  RiskAssessor,
  IndustryClassifier,
  IndustryCategory,
  DimensionalScores,
  DimensionalScore,
  RiskMatrix,
  RiskAssessment,
  RiskLevel
} from '../types.js';
import { getIndustryScoringWeights, getIndustryFramework } from './industryFrameworks.js';
import { ScoreCalculator, IndustryScoreAdjuster } from './scoreCalculator.js';
import { 
  DimensionalPromptBuilder, 
  LanguageConsistencyEnforcer, 
  AnalysisType 
} from './dimensionalPrompts.js';

/**
 * Enhanced Multi-Dimensional Scorer Implementation
 * Implements requirement 1.1 for multi-dimensional scoring system
 */
export class EnhancedDimensionalScorer extends DimensionalScorer {
  constructor(industry: IndustryCategory, language: string = 'en') {
    super(industry, language);
  }

  async analyze(input: string): Promise<DimensionalScores> {
    return this.calculateDimensionalScores(input);
  }

  async calculateDimensionalScores(input: string): Promise<DimensionalScores> {
    const industryFramework = getIndustryFramework(this.industry);
    
    // Detect language for consistent AI responses
    const detectedLanguage = LanguageConsistencyEnforcer.detectLanguage(input);
    
    // Calculate each dimensional score using AI-powered analysis with specialized prompts
    const marketSize = await this.calculateMarketSizeScore(input, industryFramework, detectedLanguage);
    const competitionIntensity = await this.calculateCompetitionScore(input, industryFramework, detectedLanguage);
    const technicalFeasibility = await this.calculateTechnicalFeasibilityScore(input, industryFramework, detectedLanguage);
    const monetizationPotential = await this.calculateMonetizationScore(input, industryFramework, detectedLanguage);
    const timingTrend = await this.calculateTimingScore(input, industryFramework, detectedLanguage);

    return {
      marketSize,
      competitionIntensity,
      technicalFeasibility,
      monetizationPotential,
      timingTrend
    };
  }

  /**
   * Calculate Market Size Score (0-100)
   * Evaluates the total addressable market and growth potential using AI analysis
   */
  private async calculateMarketSizeScore(input: string, industryFramework: any, language: string): Promise<DimensionalScore> {
    try {
      // Generate AI prompt for market size analysis
      const prompt = DimensionalPromptBuilder.buildPrompt(
        AnalysisType.MARKET_SIZE,
        input,
        this.industry,
        language
      );

      // Call AI analysis (this will be implemented in the AI integration task)
      const aiResult = await this.callAIAnalysis(prompt, 'market_size');
      
      if (aiResult) {
        // Validate language consistency
        const isLanguageConsistent = LanguageConsistencyEnforcer.validateResponseLanguage(
          aiResult.reasoning, 
          language
        );
        
        if (!isLanguageConsistent) {
          console.warn('AI response language inconsistency detected for market size analysis');
        }
        
        return {
          score: ScoreCalculator.validateScore(aiResult.score),
          reasoning: aiResult.reasoning,
          keyFactors: aiResult.keyFactors || [],
          improvementAreas: aiResult.improvementAreas || []
        };
      }
    } catch (error) {
      console.error('AI analysis failed for market size, falling back to rule-based analysis:', error);
    }

    // Fallback to rule-based analysis if AI fails
    return this.fallbackMarketSizeAnalysis(input, industryFramework, language);
  }

  /**
   * Fallback market size analysis using rule-based approach
   */
  private fallbackMarketSizeAnalysis(input: string, industryFramework: any, language: string): DimensionalScore {
    const baseScore = this.analyzeMarketSizeFactors(input, industryFramework);
    const industryAdjustment = this.applyIndustryAdjustment(baseScore, 'marketSize', industryFramework);
    const finalScore = ScoreCalculator.validateScore(industryAdjustment);

    return {
      score: finalScore,
      reasoning: this.generateMarketSizeReasoning(input, finalScore, industryFramework, language),
      keyFactors: this.getMarketSizeFactors(input, industryFramework, language),
      improvementAreas: this.getMarketSizeImprovements(finalScore, industryFramework, language)
    };
  }

  /**
   * Calculate Competition Intensity Score (0-100)
   * Lower score indicates higher competition (inverted scale) using AI analysis
   */
  private async calculateCompetitionScore(input: string, industryFramework: any, language: string): Promise<DimensionalScore> {
    try {
      // Generate AI prompt for competition analysis
      const prompt = DimensionalPromptBuilder.buildPrompt(
        AnalysisType.COMPETITION_INTENSITY,
        input,
        this.industry,
        language
      );

      // Call AI analysis
      const aiResult = await this.callAIAnalysis(prompt, 'competition');
      
      if (aiResult) {
        // Validate language consistency
        const isLanguageConsistent = LanguageConsistencyEnforcer.validateResponseLanguage(
          aiResult.reasoning, 
          language
        );
        
        if (!isLanguageConsistent) {
          console.warn('AI response language inconsistency detected for competition analysis');
        }
        
        return {
          score: ScoreCalculator.validateScore(aiResult.score),
          reasoning: aiResult.reasoning,
          keyFactors: aiResult.keyFactors || [],
          improvementAreas: aiResult.improvementAreas || []
        };
      }
    } catch (error) {
      console.error('AI analysis failed for competition, falling back to rule-based analysis:', error);
    }

    // Fallback to rule-based analysis if AI fails
    return this.fallbackCompetitionAnalysis(input, industryFramework, language);
  }

  /**
   * Fallback competition analysis using rule-based approach
   */
  private fallbackCompetitionAnalysis(input: string, industryFramework: any, language: string): DimensionalScore {
    const baseScore = this.analyzeCompetitionFactors(input, industryFramework);
    const industryAdjustment = this.applyIndustryAdjustment(baseScore, 'competition', industryFramework);
    const finalScore = ScoreCalculator.validateScore(industryAdjustment);

    return {
      score: finalScore,
      reasoning: this.generateCompetitionReasoning(input, finalScore, industryFramework, language),
      keyFactors: this.getCompetitionFactors(input, industryFramework, language),
      improvementAreas: this.getCompetitionImprovements(finalScore, industryFramework, language)
    };
  }

  /**
   * Calculate Technical Feasibility Score (0-100)
   * Evaluates implementation complexity and technical requirements using AI analysis
   */
  private async calculateTechnicalFeasibilityScore(input: string, industryFramework: any, language: string): Promise<DimensionalScore> {
    try {
      // Generate AI prompt for technical feasibility analysis
      const prompt = DimensionalPromptBuilder.buildPrompt(
        AnalysisType.TECHNICAL_FEASIBILITY,
        input,
        this.industry,
        language
      );

      // Call AI analysis
      const aiResult = await this.callAIAnalysis(prompt, 'technical');
      
      if (aiResult) {
        // Validate language consistency
        const isLanguageConsistent = LanguageConsistencyEnforcer.validateResponseLanguage(
          aiResult.reasoning, 
          language
        );
        
        if (!isLanguageConsistent) {
          console.warn('AI response language inconsistency detected for technical feasibility analysis');
        }
        
        return {
          score: ScoreCalculator.validateScore(aiResult.score),
          reasoning: aiResult.reasoning,
          keyFactors: aiResult.keyFactors || [],
          improvementAreas: aiResult.improvementAreas || []
        };
      }
    } catch (error) {
      console.error('AI analysis failed for technical feasibility, falling back to rule-based analysis:', error);
    }

    // Fallback to rule-based analysis if AI fails
    return this.fallbackTechnicalAnalysis(input, industryFramework, language);
  }

  /**
   * Fallback technical feasibility analysis using rule-based approach
   */
  private fallbackTechnicalAnalysis(input: string, industryFramework: any, language: string): DimensionalScore {
    const baseScore = this.analyzeTechnicalFactors(input, industryFramework);
    const industryAdjustment = this.applyIndustryAdjustment(baseScore, 'technical', industryFramework);
    const finalScore = ScoreCalculator.validateScore(industryAdjustment);

    return {
      score: finalScore,
      reasoning: this.generateTechnicalReasoning(input, finalScore, industryFramework, language),
      keyFactors: this.getTechnicalFactors(input, industryFramework, language),
      improvementAreas: this.getTechnicalImprovements(finalScore, industryFramework, language)
    };
  }

  /**
   * Calculate Monetization Potential Score (0-100)
   * Evaluates revenue generation opportunities and business model viability using AI analysis
   */
  private async calculateMonetizationScore(input: string, industryFramework: any, language: string): Promise<DimensionalScore> {
    try {
      // Generate AI prompt for monetization analysis
      const prompt = DimensionalPromptBuilder.buildPrompt(
        AnalysisType.MONETIZATION_POTENTIAL,
        input,
        this.industry,
        language
      );

      // Call AI analysis
      const aiResult = await this.callAIAnalysis(prompt, 'monetization');
      
      if (aiResult) {
        // Validate language consistency
        const isLanguageConsistent = LanguageConsistencyEnforcer.validateResponseLanguage(
          aiResult.reasoning, 
          language
        );
        
        if (!isLanguageConsistent) {
          console.warn('AI response language inconsistency detected for monetization analysis');
        }
        
        return {
          score: ScoreCalculator.validateScore(aiResult.score),
          reasoning: aiResult.reasoning,
          keyFactors: aiResult.keyFactors || [],
          improvementAreas: aiResult.improvementAreas || []
        };
      }
    } catch (error) {
      console.error('AI analysis failed for monetization, falling back to rule-based analysis:', error);
    }

    // Fallback to rule-based analysis if AI fails
    return this.fallbackMonetizationAnalysis(input, industryFramework, language);
  }

  /**
   * Fallback monetization analysis using rule-based approach
   */
  private fallbackMonetizationAnalysis(input: string, industryFramework: any, language: string): DimensionalScore {
    const baseScore = this.analyzeMonetizationFactors(input, industryFramework);
    const industryAdjustment = this.applyIndustryAdjustment(baseScore, 'monetization', industryFramework);
    const finalScore = ScoreCalculator.validateScore(industryAdjustment);

    return {
      score: finalScore,
      reasoning: this.generateMonetizationReasoning(input, finalScore, industryFramework, language),
      keyFactors: this.getMonetizationFactors(input, industryFramework, language),
      improvementAreas: this.getMonetizationImprovements(finalScore, industryFramework, language)
    };
  }

  /**
   * Calculate Timing/Trend Score (0-100)
   * Evaluates market timing and trend alignment using AI analysis
   */
  private async calculateTimingScore(input: string, industryFramework: any, language: string): Promise<DimensionalScore> {
    try {
      // Generate AI prompt for timing/trend analysis
      const prompt = DimensionalPromptBuilder.buildPrompt(
        AnalysisType.TIMING_TREND,
        input,
        this.industry,
        language
      );

      // Call AI analysis
      const aiResult = await this.callAIAnalysis(prompt, 'timing');
      
      if (aiResult) {
        // Validate language consistency
        const isLanguageConsistent = LanguageConsistencyEnforcer.validateResponseLanguage(
          aiResult.reasoning, 
          language
        );
        
        if (!isLanguageConsistent) {
          console.warn('AI response language inconsistency detected for timing analysis');
        }
        
        return {
          score: ScoreCalculator.validateScore(aiResult.score),
          reasoning: aiResult.reasoning,
          keyFactors: aiResult.keyFactors || [],
          improvementAreas: aiResult.improvementAreas || []
        };
      }
    } catch (error) {
      console.error('AI analysis failed for timing, falling back to rule-based analysis:', error);
    }

    // Fallback to rule-based analysis if AI fails
    return this.fallbackTimingAnalysis(input, industryFramework, language);
  }

  /**
   * Fallback timing analysis using rule-based approach
   */
  private fallbackTimingAnalysis(input: string, industryFramework: any, language: string): DimensionalScore {
    const baseScore = this.analyzeTimingFactors(input, industryFramework);
    const industryAdjustment = this.applyIndustryAdjustment(baseScore, 'timing', industryFramework);
    const finalScore = ScoreCalculator.validateScore(industryAdjustment);

    return {
      score: finalScore,
      reasoning: this.generateTimingReasoning(input, finalScore, industryFramework, language),
      keyFactors: this.getTimingFactors(input, industryFramework, language),
      improvementAreas: this.getTimingImprovements(finalScore, industryFramework, language)
    };
  }

  // ===== AI ANALYSIS INTEGRATION =====
  
  /**
   * Call AI analysis with the generated prompt
   * This method will be fully implemented when AI integration is added
   */
  private async callAIAnalysis(prompt: string, analysisType: string): Promise<any> {
    // TODO: This will be implemented in the AI integration task
    // For now, return null to trigger fallback analysis
    return null;
  }

  // ===== MARKET SIZE ANALYSIS METHODS =====
  
  private analyzeMarketSizeFactors(input: string, industryFramework: any): number {
    let score = 50; // Base score
    
    // Analyze market indicators in the input
    const marketKeywords = ['market', 'users', 'customers', 'demand', 'audience', 'global', 'millions', 'billions'];
    const foundKeywords = marketKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    // Adjust score based on market indicators
    score += foundKeywords * 5;
    
    // Industry-specific market size considerations
    if (industryFramework.category === IndustryCategory.SAAS_TECH) {
      if (input.toLowerCase().includes('enterprise') || input.toLowerCase().includes('b2b')) {
        score += 15; // Enterprise markets often larger
      }
    } else if (industryFramework.category === IndustryCategory.ECOMMERCE) {
      if (input.toLowerCase().includes('niche') || input.toLowerCase().includes('specialized')) {
        score -= 10; // Niche markets smaller but less competitive
      }
    }
    
    return Math.max(20, Math.min(95, score));
  }

  private generateMarketSizeReasoning(input: string, score: number, industryFramework: any, language: string = 'en'): string {
    const industry = industryFramework.category.replace('_', ' ').toUpperCase();
    
    if (language === 'tr') {
      if (score >= 80) {
        return `${industry} sektöründe güçlü pazar büyüklüğü potansiyeli. Fikir, büyük bir adreslenebilir pazarı ve önemli büyüme fırsatlarını hedefliyor.`;
      } else if (score >= 60) {
        return `${industry} sektöründe orta düzeyde pazar büyüklüğü potansiyeli. Makul bir pazar fırsatı var ancak odaklanmış hedefleme gerektirebilir.`;
      } else {
        return `${industry} sektöründe sınırlı pazar büyüklüğü potansiyeli. Hedef pazarı genişletmeyi veya bitişik fırsatlar bulmayı düşünün.`;
      }
    } else {
      if (score >= 80) {
        return `Strong market size potential in ${industry}. The idea addresses a large addressable market with significant growth opportunities.`;
      } else if (score >= 60) {
        return `Moderate market size potential in ${industry}. There's a reasonable market opportunity but may require focused targeting.`;
      } else {
        return `Limited market size potential in ${industry}. Consider expanding the target market or finding adjacent opportunities.`;
      }
    }
  }

  private getMarketSizeFactors(input: string, industryFramework: any, language: string = 'en'): string[] {
    if (language === 'tr') {
      const factors = ['Hedef pazar tanımlaması', 'Pazar büyüme trendleri', 'Coğrafi erişim potansiyeli'];
      
      // Add industry-specific factors
      if (industryFramework.category === IndustryCategory.SAAS_TECH) {
        factors.push('Kurumsal vs KOBİ pazar büyüklüğü', 'API entegrasyon fırsatları');
      } else if (industryFramework.category === IndustryCategory.ECOMMERCE) {
        factors.push('Tüketici harcama kalıpları', 'Online alışveriş benimsenmesi');
      }
      
      return factors;
    } else {
      const factors = ['Target market identification', 'Market growth trends', 'Geographic reach potential'];
      
      // Add industry-specific factors
      if (industryFramework.category === IndustryCategory.SAAS_TECH) {
        factors.push('Enterprise vs SMB market size', 'API integration opportunities');
      } else if (industryFramework.category === IndustryCategory.ECOMMERCE) {
        factors.push('Consumer spending patterns', 'Online shopping adoption');
      }
      
      return factors;
    }
  }

  private getMarketSizeImprovements(score: number, industryFramework: any, language: string = 'en'): string[] {
    const improvements = [];
    
    if (score < 70) {
      if (language === 'tr') {
        improvements.push('Toplam adreslenebilir pazar (TAM) büyüklüğünü araştırın');
        improvements.push('Bitişik pazar fırsatlarını belirleyin');
        improvements.push('Uluslararası genişleme potansiyelini değerlendirin');
      } else {
        improvements.push('Research total addressable market (TAM) size');
        improvements.push('Identify adjacent market opportunities');
        improvements.push('Consider international expansion potential');
      }
    }
    
    return improvements;
  }

  // ===== COMPETITION ANALYSIS METHODS =====
  
  private analyzeCompetitionFactors(input: string, industryFramework: any): number {
    let score = 50; // Base score (inverted - lower competition = higher score)
    
    // Analyze competition indicators
    const competitionKeywords = ['unique', 'first', 'innovative', 'different', 'better', 'alternative'];
    const saturatedKeywords = ['crowded', 'competitive', 'many players', 'established'];
    
    const uniqueKeywords = competitionKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    const saturatedKeywords_found = saturatedKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    score += uniqueKeywords * 8;
    score -= saturatedKeywords_found * 10;
    
    // Industry-specific competition adjustments
    if (industryFramework.category === IndustryCategory.SAAS_TECH) {
      score -= 10; // Generally highly competitive
    } else if (industryFramework.category === IndustryCategory.HARDWARE) {
      score += 5; // Higher barriers to entry
    }
    
    return Math.max(15, Math.min(90, score));
  }

  private generateCompetitionReasoning(input: string, score: number, industryFramework: any, language: string = 'en'): string {
    const industry = industryFramework.category.replace('_', ' ').toUpperCase();
    
    if (language === 'tr') {
      if (score >= 75) {
        return `${industry} sektöründe düşük rekabet ortamı. Fikir, daha az doğrudan rakiple güçlü farklılaşma potansiyeline sahip.`;
      } else if (score >= 50) {
        return `${industry} sektöründe orta düzeyde rekabet. Başarı, net farklılaşma ve mükemmel uygulama bağlı olacak.`;
      } else {
        return `${industry} sektöründe yüksek rekabet ortamı. Güçlü farklılaşma ve benzersiz değer önerisi başarı için kritik.`;
      }
    } else {
      if (score >= 75) {
        return `Low competition environment in ${industry}. The idea has strong differentiation potential with fewer direct competitors.`;
      } else if (score >= 50) {
        return `Moderate competition in ${industry}. Success will depend on clear differentiation and execution excellence.`;
      } else {
        return `High competition environment in ${industry}. Strong differentiation and unique value proposition are critical for success.`;
      }
    }
  }

  private getCompetitionFactors(input: string, industryFramework: any, language: string = 'en'): string[] {
    if (language === 'tr') {
      return [
        'Doğrudan rakip analizi',
        'Dolaylı rakip tehditleri',
        'Giriş engelleri',
        'Farklılaşma fırsatları',
        'Rekabet avantajları'
      ];
    } else {
      return [
        'Direct competitor analysis',
        'Indirect competitor threats',
        'Barriers to entry',
        'Differentiation opportunities',
        'Competitive advantages'
      ];
    }
  }

  private getCompetitionImprovements(score: number, industryFramework: any, language: string = 'en'): string[] {
    const improvements = [];
    
    if (score < 60) {
      if (language === 'tr') {
        improvements.push('Benzersiz değer önerisini belirleyin');
        improvements.push('Rakip zayıflıklarını araştırın');
        improvements.push('Savunulabilir rekabet avantajları geliştirin');
      } else {
        improvements.push('Identify unique value proposition');
        improvements.push('Research competitor weaknesses');
        improvements.push('Develop defensible competitive advantages');
      }
    }
    
    return improvements;
  }

  // ===== TECHNICAL FEASIBILITY METHODS =====
  
  private analyzeTechnicalFactors(input: string, industryFramework: any): number {
    let score = 60; // Base score
    
    // Analyze technical complexity indicators
    const simpleKeywords = ['simple', 'basic', 'straightforward', 'easy', 'minimal'];
    const complexKeywords = ['complex', 'advanced', 'sophisticated', 'cutting-edge', 'AI', 'machine learning'];
    
    const simpleCount = simpleKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    const complexCount = complexKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    score += simpleCount * 8;
    score -= complexCount * 6;
    
    // Industry-specific technical considerations
    if (industryFramework.category === IndustryCategory.HARDWARE) {
      score -= 15; // Hardware generally more complex
    } else if (industryFramework.category === IndustryCategory.CONTENT_MEDIA) {
      score += 10; // Often simpler technically
    }
    
    return Math.max(20, Math.min(95, score));
  }

  private generateTechnicalReasoning(input: string, score: number, industryFramework: any, language: string = 'en'): string {
    const industry = industryFramework.category.replace('_', ' ').toUpperCase();
    
    if (language === 'tr') {
      if (score >= 80) {
        return `${industry} sektöründe yüksek teknik fizibilite. Çözüm mevcut teknolojiler ve makul kaynaklarla uygulanabilir.`;
      } else if (score >= 60) {
        return `${industry} sektöründe orta düzeyde teknik fizibilite. Uygulama mümkün ancak uzman bilgi veya önemli geliştirme süresi gerektirebilir.`;
      } else {
        return `${industry} sektöründe düşük teknik fizibilite. Çığır açan yenilikler veya önemli kaynaklar gerektirebilecek önemli teknik zorluklar mevcut.`;
      }
    } else {
      if (score >= 80) {
        return `High technical feasibility in ${industry}. The solution can be implemented with existing technologies and reasonable resources.`;
      } else if (score >= 60) {
        return `Moderate technical feasibility in ${industry}. Implementation is possible but may require specialized expertise or significant development time.`;
      } else {
        return `Low technical feasibility in ${industry}. Significant technical challenges exist that may require breakthrough innovations or substantial resources.`;
      }
    }
  }

  private getTechnicalFactors(input: string, industryFramework: any, language: string = 'en'): string[] {
    if (language === 'tr') {
      const factors = ['Uygulama karmaşıklığı', 'Teknoloji gereksinimleri', 'Geliştirme zaman çizelgesi', 'Gerekli teknik uzmanlık'];
      
      if (industryFramework.category === IndustryCategory.FINTECH) {
        factors.push('Güvenlik gereksinimleri', 'Düzenleyici uyumluluk sistemleri');
      } else if (industryFramework.category === IndustryCategory.HARDWARE) {
        factors.push('Üretim karmaşıklığı', 'Tedarik zinciri gereksinimleri');
      }
      
      return factors;
    } else {
      const factors = ['Implementation complexity', 'Technology requirements', 'Development timeline', 'Technical expertise needed'];
      
      if (industryFramework.category === IndustryCategory.FINTECH) {
        factors.push('Security requirements', 'Regulatory compliance systems');
      } else if (industryFramework.category === IndustryCategory.HARDWARE) {
        factors.push('Manufacturing complexity', 'Supply chain requirements');
      }
      
      return factors;
    }
  }

  private getTechnicalImprovements(score: number, industryFramework: any, language: string = 'en'): string[] {
    const improvements = [];
    
    if (score < 70) {
      if (language === 'tr') {
        improvements.push('Teknik gereksinimleri basitleştirin');
        improvements.push('Mevcut teknoloji çözümlerini değerlendirin');
        improvements.push('Teknik uzmanlık edinimi için plan yapın');
      } else {
        improvements.push('Simplify technical requirements');
        improvements.push('Consider existing technology solutions');
        improvements.push('Plan for technical expertise acquisition');
      }
    }
    
    return improvements;
  }

  // ===== MONETIZATION ANALYSIS METHODS =====
  
  private analyzeMonetizationFactors(input: string, industryFramework: any): number {
    let score = 55; // Base score
    
    // Analyze monetization indicators
    const revenueKeywords = ['subscription', 'revenue', 'monetize', 'pricing', 'pay', 'premium', 'freemium'];
    const foundRevenue = revenueKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    score += foundRevenue * 6;
    
    // Industry-specific monetization patterns
    if (industryFramework.category === IndustryCategory.SAAS_TECH) {
      score += 10; // Strong recurring revenue models
    } else if (industryFramework.category === IndustryCategory.ECOMMERCE) {
      score += 8; // Clear transaction-based revenue
    } else if (industryFramework.category === IndustryCategory.CONTENT_MEDIA) {
      score -= 5; // Monetization can be challenging
    }
    
    return Math.max(25, Math.min(90, score));
  }

  private generateMonetizationReasoning(input: string, score: number, industryFramework: any, language: string = 'en'): string {
    const industry = industryFramework.category.replace('_', ' ').toUpperCase();
    
    if (language === 'tr') {
      if (score >= 75) {
        return `${industry} sektöründe güçlü para kazanma potansiyeli. Birden fazla net gelir akışı ve kanıtlanmış iş modelleri mevcut.`;
      } else if (score >= 55) {
        return `${industry} sektöründe orta düzeyde para kazanma potansiyeli. Gelir fırsatları mevcut ancak dikkatli strateji ve uygulama gerektirebilir.`;
      } else {
        return `${industry} sektöründe sınırlı para kazanma potansiyeli. Gelir üretimi zorlu olabilir ve yenilikçi yaklaşımlar gerektirebilir.`;
      }
    } else {
      if (score >= 75) {
        return `Strong monetization potential in ${industry}. Multiple clear revenue streams and proven business models are available.`;
      } else if (score >= 55) {
        return `Moderate monetization potential in ${industry}. Revenue opportunities exist but may require careful strategy and execution.`;
      } else {
        return `Limited monetization potential in ${industry}. Revenue generation may be challenging and require innovative approaches.`;
      }
    }
  }

  private getMonetizationFactors(input: string, industryFramework: any, language: string = 'en'): string[] {
    if (language === 'tr') {
      return [
        'Gelir modeli netliği',
        'Fiyatlandırma stratejisi potansiyeli',
        'Müşteri ödeme istekliliği',
        'Yinelenen gelir fırsatları',
        'Gelir akışlarının ölçeklenebilirliği'
      ];
    } else {
      return [
        'Revenue model clarity',
        'Pricing strategy potential',
        'Customer willingness to pay',
        'Recurring revenue opportunities',
        'Scalability of revenue streams'
      ];
    }
  }

  private getMonetizationImprovements(score: number, industryFramework: any, language: string = 'en'): string[] {
    const improvements = [];
    
    if (score < 65) {
      if (language === 'tr') {
        improvements.push('Net gelir akışlarını tanımlayın');
        improvements.push('Müşteri ödeme istekliliğini araştırın');
        improvements.push('Birden fazla para kazanma modelini değerlendirin');
      } else {
        improvements.push('Define clear revenue streams');
        improvements.push('Research customer willingness to pay');
        improvements.push('Consider multiple monetization models');
      }
    }
    
    return improvements;
  }

  // ===== TIMING ANALYSIS METHODS =====
  
  private analyzeTimingFactors(input: string, industryFramework: any): number {
    let score = 60; // Base score
    
    // Analyze timing indicators
    const trendKeywords = ['trending', 'growing', 'emerging', 'future', 'now', 'timely', 'opportunity'];
    const lateKeywords = ['saturated', 'declining', 'outdated', 'past'];
    
    const trendCount = trendKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    const lateCount = lateKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    score += trendCount * 7;
    score -= lateCount * 10;
    
    // Industry-specific timing considerations
    if (industryFramework.category === IndustryCategory.SAAS_TECH) {
      score += 5; // Generally good timing for tech solutions
    } else if (industryFramework.category === IndustryCategory.HARDWARE) {
      score -= 5; // Longer development cycles affect timing
    }
    
    return Math.max(20, Math.min(90, score));
  }

  private generateTimingReasoning(input: string, score: number, industryFramework: any, language: string = 'en'): string {
    const industry = industryFramework.category.replace('_', ' ').toUpperCase();
    
    if (language === 'tr') {
      if (score >= 75) {
        return `${industry} sektöründe mükemmel pazar zamanlaması. Mevcut trendler ve pazar koşulları bu tür çözümleri güçlü şekilde destekliyor.`;
      } else if (score >= 55) {
        return `${industry} sektöründe iyi pazar zamanlaması. Zamanlama makul ancak optimal değil - başarı uygulama hızına bağlı olacak.`;
      } else {
        return `${industry} sektöründe zayıf pazar zamanlaması. Pazar koşulları elverişli olmayabilir - beklemeyi veya yaklaşımı değiştirmeyi düşünün.`;
      }
    } else {
      if (score >= 75) {
        return `Excellent market timing in ${industry}. Current trends and market conditions strongly favor this type of solution.`;
      } else if (score >= 55) {
        return `Good market timing in ${industry}. The timing is reasonable though not optimal - success will depend on execution speed.`;
      } else {
        return `Poor market timing in ${industry}. Market conditions may not be favorable - consider waiting or pivoting the approach.`;
      }
    }
  }

  private getTimingFactors(input: string, industryFramework: any, language: string = 'en'): string[] {
    if (language === 'tr') {
      return [
        'Pazar trendi uyumu',
        'Teknoloji hazırlığı',
        'Tüketici davranış değişimleri',
        'Ekonomik koşullar',
        'Düzenleyici ortam'
      ];
    } else {
      return [
        'Market trend alignment',
        'Technology readiness',
        'Consumer behavior shifts',
        'Economic conditions',
        'Regulatory environment'
      ];
    }
  }

  private getTimingImprovements(score: number, industryFramework: any, language: string = 'en'): string[] {
    const improvements = [];
    
    if (score < 65) {
      if (language === 'tr') {
        improvements.push('Mevcut pazar trendlerini araştırın');
        improvements.push('Optimal zamanlama pencerelerini belirleyin');
        improvements.push('Pazar hazırlık stratejilerini değerlendirin');
      } else {
        improvements.push('Research current market trends');
        improvements.push('Identify optimal timing windows');
        improvements.push('Consider market preparation strategies');
      }
    }
    
    return improvements;
  }

  // ===== INDUSTRY ADJUSTMENT METHODS =====
  
  private applyIndustryAdjustment(baseScore: number, dimension: string, industryFramework: any): number {
    const weights = industryFramework.scoringWeights;
    const weight = weights[dimension] || 0.2; // Default weight if not found
    
    // Apply industry-specific weight influence
    // Higher weight means this dimension is more important for this industry
    const adjustment = (weight - 0.2) * 50; // Normalize around 0.2 baseline
    
    return baseScore + adjustment;
  }

  protected getIndustryWeights(): { marketSize: number; competition: number; technical: number; monetization: number; timing: number } {
    const weights = getIndustryScoringWeights(this.industry);
    return {
      marketSize: weights.marketSize,
      competition: weights.competition,
      technical: weights.technical,
      monetization: weights.monetization,
      timing: weights.timing
    };
  }
}

/**
 * Enhanced Risk Assessor Implementation
 * Implements requirement 4.1 and 4.2 for risk assessment matrix
 */
export class EnhancedRiskAssessor extends RiskAssessor {
  constructor(industry: IndustryCategory, language: string = 'en') {
    super(industry, language);
  }

  async analyze(input: string): Promise<RiskMatrix> {
    return this.assessRisks(input);
  }

  async assessRisks(input: string): Promise<RiskMatrix> {
    // This will be implemented with AI integration in later tasks
    // For now, providing the structure and industry-specific considerations
    
    const industryFramework = getIndustryFramework(this.industry);
    
    return {
      technical: this.createRiskAssessment('Medium', 'Technical implementation complexity', input),
      market: this.createRiskAssessment('Medium', 'Market demand uncertainty', input),
      financial: this.createRiskAssessment('High', 'Funding and revenue challenges', input),
      regulatory: this.createRiskAssessment('Low', 'Regulatory compliance requirements', input, industryFramework.regulatoryFactors),
      execution: this.createRiskAssessment('Medium', 'Team and resource challenges', input)
    };
  }

  private createRiskAssessment(
    level: RiskLevel, 
    description: string, 
    input: string, 
    industryFactors: string[] = []
  ): RiskAssessment {
    const impact = this.getRiskScore(level);
    const probability = this.getRiskScore(level);
    
    return {
      level,
      description: `${description} for: ${input.substring(0, 50)}...`,
      mitigationStrategies: [
        'Mitigation strategy 1',
        'Mitigation strategy 2',
        'Mitigation strategy 3'
      ],
      impact,
      probability
    };
  }

  private getRiskScore(level: RiskLevel): number {
    switch (level) {
      case 'Low': return Math.floor(Math.random() * 3) + 1; // 1-3
      case 'Medium': return Math.floor(Math.random() * 3) + 4; // 4-6
      case 'High': return Math.floor(Math.random() * 4) + 7; // 7-10
      default: return 5;
    }
  }
}

/**
 * Enhanced Industry Classifier Implementation
 * Implements requirement 2.1 for industry detection system
 * Uses the new IndustryDetectionService for comprehensive classification
 */
export class EnhancedIndustryClassifier extends IndustryClassifier {
  private industryDetectionService: any; // Will be injected
  
  constructor(language: string = 'en', apiKey?: string) {
    // Industry classifier doesn't need a specific industry as it determines the industry
    super(IndustryCategory.SAAS_TECH, language);
    
    // Import and create industry detection service
    // Using dynamic import to avoid circular dependencies
    this.initializeDetectionService(apiKey);
  }

  private async initializeDetectionService(apiKey?: string) {
    try {
      const { createIndustryDetectionService } = await import('./industryDetection');
      this.industryDetectionService = createIndustryDetectionService(apiKey);
    } catch (error) {
      console.warn('Failed to initialize industry detection service:', error);
      this.industryDetectionService = null;
    }
  }

  async analyze(input: string): Promise<{ category: IndustryCategory; confidence: number; reasoning: string; }> {
    return this.classifyIndustry(input);
  }

  async classifyIndustry(input: string): Promise<{
    category: IndustryCategory;
    confidence: number;
    reasoning: string;
  }> {
    try {
      // Use the enhanced industry detection service if available
      if (this.industryDetectionService) {
        const result = await this.industryDetectionService.detectIndustry(input);
        
        // Validate the result
        if (this.industryDetectionService.validateClassification(result)) {
          return {
            category: result.category,
            confidence: this.industryDetectionService.getConfidenceScore(result),
            reasoning: result.reasoning
          };
        }
      }
      
      // Fallback to keyword-based classification
      console.warn('Industry detection service unavailable, using fallback classification');
      return this.fallbackClassification(input);
      
    } catch (error) {
      console.error('Industry classification failed, using fallback:', error);
      return this.fallbackClassification(input);
    }
  }

  /**
   * Fallback classification using keyword matching
   */
  private fallbackClassification(input: string): {
    category: IndustryCategory;
    confidence: number;
    reasoning: string;
  } {
    const keywords = this.getIndustryKeywords();
    const inputLower = input.toLowerCase();
    
    const scores: Record<IndustryCategory, number> = {} as Record<IndustryCategory, number>;
    
    // Initialize scores
    Object.keys(keywords).forEach(industry => {
      scores[industry as IndustryCategory] = 0;
    });
    
    // Calculate keyword match scores
    Object.entries(keywords).forEach(([industry, keywordList]) => {
      keywordList.forEach(keyword => {
        if (inputLower.includes(keyword.toLowerCase())) {
          scores[industry as IndustryCategory] += 1;
        }
      });
    });
    
    // Find the industry with the highest score
    let bestIndustry = IndustryCategory.SAAS_TECH;
    let bestScore = 0;
    
    Object.entries(scores).forEach(([industry, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestIndustry = industry as IndustryCategory;
      }
    });
    
    // Calculate confidence based on keyword matches
    const totalKeywords = keywords[bestIndustry].length;
    const confidence = Math.min(75, Math.max(25, (bestScore / totalKeywords) * 100 + 25));
    
    const matchedKeywords = this.getMatchedKeywords(inputLower, keywords[bestIndustry]);
    
    return {
      category: bestIndustry,
      confidence: Math.round(confidence),
      reasoning: `Classified as ${bestIndustry} using keyword analysis. Found ${bestScore} relevant keywords: ${matchedKeywords.slice(0, 3).join(', ')}${matchedKeywords.length > 3 ? '...' : ''}`
    };
  }

  private getMatchedKeywords(input: string, keywords: string[]): string[] {
    return keywords.filter(keyword => input.includes(keyword.toLowerCase()));
  }
}

/**
 * Analysis Component Factory
 * Creates appropriate analysis components based on industry and requirements
 */
export class AnalysisComponentFactory {
  static createDimensionalScorer(industry: IndustryCategory, language: string = 'en'): EnhancedDimensionalScorer {
    return new EnhancedDimensionalScorer(industry, language);
  }

  static createRiskAssessor(industry: IndustryCategory, language: string = 'en'): EnhancedRiskAssessor {
    return new EnhancedRiskAssessor(industry, language);
  }

  static createIndustryClassifier(language: string = 'en', apiKey?: string): EnhancedIndustryClassifier {
    return new EnhancedIndustryClassifier(language, apiKey);
  }
}

/**
 * Analysis Orchestrator
 * Coordinates multiple analysis components for comprehensive analysis
 */
export class AnalysisOrchestrator {
  private language: string;
  private apiKey?: string;
  
  constructor(language: string = 'en', apiKey?: string) {
    this.language = language;
    this.apiKey = apiKey;
  }

  async performBasicAnalysis(input: string): Promise<{
    industry: { category: IndustryCategory; confidence: number; reasoning: string; };
    dimensionalScores: DimensionalScores;
    riskMatrix: RiskMatrix;
    overallScore: number;
    overallRisk: RiskLevel;
  }> {
    // Step 1: Classify industry using enhanced detection service
    const industryClassifier = AnalysisComponentFactory.createIndustryClassifier(this.language, this.apiKey);
    const industryResult = await industryClassifier.classifyIndustry(input);

    // Step 2: Perform dimensional scoring
    const dimensionalScorer = AnalysisComponentFactory.createDimensionalScorer(industryResult.category, this.language);
    const dimensionalScores = await dimensionalScorer.calculateDimensionalScores(input);
    const overallScore = dimensionalScorer.calculateOverallScore(dimensionalScores);

    // Step 3: Assess risks
    const riskAssessor = AnalysisComponentFactory.createRiskAssessor(industryResult.category, this.language);
    const riskMatrix = await riskAssessor.assessRisks(input);
    const overallRisk = riskAssessor.calculateOverallRisk(riskMatrix);

    return {
      industry: industryResult,
      dimensionalScores,
      riskMatrix,
      overallScore,
      overallRisk
    };
  }

  async validateAnalysisComponents(): Promise<boolean> {
    // Validation method to ensure all components are working correctly
    try {
      const testInput = "A SaaS platform for project management";
      const result = await this.performBasicAnalysis(testInput);
      
      // Validate that all required components are present and have valid data
      return (
        result.industry.category !== undefined &&
        result.industry.confidence > 0 &&
        result.dimensionalScores.marketSize.score >= 0 &&
        result.dimensionalScores.marketSize.score <= 100 &&
        result.riskMatrix.technical.level !== undefined &&
        result.overallScore >= 0 &&
        result.overallScore <= 100 &&
        ['Low', 'Medium', 'High'].includes(result.overallRisk)
      );
    } catch (error) {
      console.error('Analysis component validation failed:', error);
      return false;
    }
  }
}
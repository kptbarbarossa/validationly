import { IndustryCategory, IndustryClassifier } from '../types';
import { getIndustryFramework } from './industryFrameworks';

/**
 * Industry Detection System
 * Implements AI-powered industry classification with keyword-based fallback
 * Requirements: 2.1 - Industry detection and classification
 */

export interface IndustryDetectionResult {
  category: IndustryCategory;
  confidence: number; // 0-100
  reasoning: string;
  detectionMethod: 'ai' | 'keyword' | 'default';
  alternativeCategories?: Array<{
    category: IndustryCategory;
    confidence: number;
  }>;
}

export class AIIndustryClassifier extends IndustryClassifier {
  private readonly AI_CLASSIFICATION_PROMPT = `
You are an expert business analyst specializing in industry classification. Analyze the following business idea and classify it into the most appropriate industry category.

Available categories:
- saas_tech: Software as a Service, APIs, cloud platforms, developer tools
- ecommerce: Online retail, product sales, shopping platforms
- health_fitness: Healthcare, wellness, fitness, medical applications
- education: Learning platforms, courses, training, educational tools
- fintech: Financial services, payments, banking, investment tools
- marketplace: Two-sided platforms connecting buyers/sellers or service providers
- consumer_app: Mobile apps, social platforms, entertainment, consumer-focused tools
- b2b_services: Business services, consulting, enterprise solutions
- hardware: Physical products, IoT devices, manufacturing
- content_media: Publishing, media creation, content platforms, creative tools

Business Idea: "{idea}"

Respond with a JSON object containing:
{
  "category": "most_appropriate_category",
  "confidence": confidence_score_0_to_100,
  "reasoning": "detailed_explanation_of_classification",
  "alternativeCategories": [
    {"category": "alternative_category", "confidence": confidence_score}
  ]
}

Consider:
1. Primary business model and revenue source
2. Target customer type (B2B vs B2C)
3. Core technology or service offering
4. Industry-specific regulations or requirements
5. Typical distribution channels and go-to-market strategy

Be precise and provide confidence scores based on how clearly the idea fits the category.
`;

  async classifyIndustry(input: string): Promise<{
    category: IndustryCategory;
    confidence: number;
    reasoning: string;
  }> {
    try {
      // This would integrate with the AI service
      // For now, implementing the logic structure
      const prompt = this.AI_CLASSIFICATION_PROMPT.replace('{idea}', input);
      
      // TODO: Integrate with actual AI service (Gemini)
      // const aiResponse = await this.callAI(prompt);
      
      // Fallback to keyword-based classification for now
      return this.keywordBasedClassification(input);
    } catch (error) {
      console.warn('AI classification failed, falling back to keyword detection:', error);
      return this.keywordBasedClassification(input);
    }
  }

  private keywordBasedClassification(input: string): {
    category: IndustryCategory;
    confidence: number;
    reasoning: string;
  } {
    const keywords = this.getIndustryKeywords();
    const inputLower = input.toLowerCase();
    const scores: Record<IndustryCategory, number> = {} as Record<IndustryCategory, number>;

    // Initialize scores
    Object.keys(keywords).forEach(category => {
      scores[category as IndustryCategory] = 0;
    });

    // Calculate keyword match scores
    Object.entries(keywords).forEach(([category, categoryKeywords]) => {
      categoryKeywords.forEach(keyword => {
        if (inputLower.includes(keyword.toLowerCase())) {
          scores[category as IndustryCategory] += 1;
        }
      });
    });

    // Find best match
    const sortedCategories = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([category, score]) => ({ category: category as IndustryCategory, score }));

    const bestMatch = sortedCategories[0];
    const totalKeywords = keywords[bestMatch.category].length;
    const confidence = Math.min(95, (bestMatch.score / totalKeywords) * 100 + 20); // Base confidence + keyword matches

    return {
      category: bestMatch.category,
      confidence: Math.round(confidence),
      reasoning: `Classified based on keyword analysis. Found ${bestMatch.score} relevant keywords for ${bestMatch.category} industry.`
    };
  }

  protected getIndustryKeywords(): Record<IndustryCategory, string[]> {
    return {
      [IndustryCategory.SAAS_TECH]: [
        'software', 'saas', 'api', 'platform', 'cloud', 'tech', 'app', 'dashboard',
        'analytics', 'automation', 'integration', 'developer', 'code', 'programming',
        'database', 'server', 'hosting', 'subscription', 'enterprise software'
      ],
      [IndustryCategory.ECOMMERCE]: [
        'ecommerce', 'online store', 'retail', 'shopping', 'product', 'sell', 'buy',
        'inventory', 'checkout', 'payment', 'shipping', 'fulfillment', 'catalog',
        'merchant', 'dropshipping', 'wholesale', 'consumer goods'
      ],
      [IndustryCategory.HEALTH_FITNESS]: [
        'health', 'fitness', 'wellness', 'medical', 'healthcare', 'doctor', 'patient',
        'therapy', 'nutrition', 'exercise', 'workout', 'mental health', 'telemedicine',
        'pharmaceutical', 'clinical', 'diagnosis', 'treatment', 'hospital'
      ],
      [IndustryCategory.EDUCATION]: [
        'education', 'learning', 'course', 'training', 'teaching', 'student', 'school',
        'university', 'curriculum', 'lesson', 'tutorial', 'certification', 'skill',
        'knowledge', 'academic', 'instructor', 'classroom', 'online learning'
      ],
      [IndustryCategory.FINTECH]: [
        'finance', 'fintech', 'payment', 'banking', 'investment', 'money', 'financial',
        'credit', 'loan', 'insurance', 'trading', 'cryptocurrency', 'blockchain',
        'wallet', 'transaction', 'accounting', 'budgeting', 'wealth management'
      ],
      [IndustryCategory.MARKETPLACE]: [
        'marketplace', 'platform', 'connect', 'network', 'community', 'two-sided',
        'buyers', 'sellers', 'service providers', 'freelance', 'gig economy',
        'peer-to-peer', 'matching', 'booking', 'rental', 'sharing economy'
      ],
      [IndustryCategory.CONSUMER_APP]: [
        'mobile app', 'consumer', 'social', 'entertainment', 'gaming', 'lifestyle',
        'personal', 'fun', 'viral', 'user-generated', 'social media', 'dating',
        'photo', 'video', 'music', 'streaming', 'chat', 'messaging'
      ],
      [IndustryCategory.B2B_SERVICES]: [
        'b2b', 'business', 'enterprise', 'service', 'consulting', 'professional',
        'corporate', 'agency', 'outsourcing', 'managed service', 'business process',
        'workflow', 'productivity', 'collaboration', 'team', 'organization'
      ],
      [IndustryCategory.HARDWARE]: [
        'hardware', 'device', 'iot', 'physical', 'manufacturing', 'product',
        'electronics', 'sensor', 'wearable', 'gadget', 'appliance', 'machinery',
        'component', 'embedded', 'smart device', 'robotics', 'industrial'
      ],
      [IndustryCategory.CONTENT_MEDIA]: [
        'content', 'media', 'publishing', 'creative', 'video', 'podcast', 'blog',
        'news', 'journalism', 'writing', 'photography', 'design', 'art',
        'entertainment', 'streaming', 'production', 'creator', 'influencer'
      ]
    };
  }
}

/**
 * Main industry detection service
 * Combines AI classification with keyword fallback
 */
export class IndustryDetectionService {
  private aiClassifier: AIIndustryClassifier;

  constructor() {
    this.aiClassifier = new AIIndustryClassifier(IndustryCategory.SAAS_TECH); // Default category
  }

  /**
   * Detect industry category for a business idea
   * Uses AI classification with keyword-based fallback
   */
  async detectIndustry(idea: string): Promise<IndustryDetectionResult> {
    try {
      // Validate input
      if (!idea || idea.trim().length < 10) {
        return this.getDefaultClassification('Input too short for reliable classification');
      }

      // Try AI classification first
      const aiResult = await this.aiClassifier.classifyIndustry(idea);
      
      // Validate AI result
      if (aiResult.confidence >= 60) {
        return {
          category: aiResult.category,
          confidence: aiResult.confidence,
          reasoning: aiResult.reasoning,
          detectionMethod: 'ai'
        };
      }

      // Fallback to keyword-based detection
      const keywordResult = await this.keywordBasedDetection(idea);
      
      if (keywordResult.confidence >= 40) {
        return keywordResult;
      }

      // Final fallback to default
      return this.getDefaultClassification('Unable to classify with sufficient confidence');

    } catch (error) {
      console.error('Industry detection failed:', error);
      return this.getDefaultClassification('Classification error occurred');
    }
  }

  /**
   * Keyword-based industry detection as fallback
   */
  private async keywordBasedDetection(idea: string): Promise<IndustryDetectionResult> {
    const classifier = new AIIndustryClassifier(IndustryCategory.SAAS_TECH);
    const result = await classifier.classifyIndustry(idea);
    
    return {
      category: result.category,
      confidence: result.confidence,
      reasoning: result.reasoning,
      detectionMethod: 'keyword'
    };
  }

  /**
   * Get default classification when detection fails
   */
  private getDefaultClassification(reason: string): IndustryDetectionResult {
    return {
      category: IndustryCategory.SAAS_TECH, // Default to most common category
      confidence: 30,
      reasoning: `${reason}. Defaulted to SaaS/Tech category.`,
      detectionMethod: 'default'
    };
  }

  /**
   * Get industry confidence score based on detection method and result
   */
  getConfidenceScore(result: IndustryDetectionResult): number {
    const baseConfidence = result.confidence;
    
    // Adjust confidence based on detection method
    switch (result.detectionMethod) {
      case 'ai':
        return Math.min(95, baseConfidence);
      case 'keyword':
        return Math.min(80, baseConfidence);
      case 'default':
        return Math.min(40, baseConfidence);
      default:
        return baseConfidence;
    }
  }

  /**
   * Validate industry classification result
   */
  validateClassification(result: IndustryDetectionResult): boolean {
    return (
      Object.values(IndustryCategory).includes(result.category) &&
      result.confidence >= 0 &&
      result.confidence <= 100 &&
      result.reasoning.length > 0
    );
  }

  /**
   * Get industry-specific analysis context
   */
  getIndustryContext(category: IndustryCategory): {
    framework: any;
    keywords: string[];
    considerations: string[];
  } {
    const framework = getIndustryFramework(category);
    const keywords = new AIIndustryClassifier(category).getIndustryKeywords()[category];
    
    return {
      framework,
      keywords,
      considerations: framework.specificConsiderations
    };
  }
}

// Export singleton instance
export const industryDetectionService = new IndustryDetectionService();

// Export types and classes for testing
export { AIIndustryClassifier };
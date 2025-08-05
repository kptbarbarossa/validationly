import { describe, it, expect, beforeEach } from 'vitest';
import { 
  IndustryDetectionService, 
  AIIndustryClassifier,
  IndustryDetectionResult 
} from '../industryDetection';
import { IndustryCategory } from '../../types';

describe('IndustryDetectionService', () => {
  let service: IndustryDetectionService;

  beforeEach(() => {
    service = new IndustryDetectionService();
  });

  describe('detectIndustry', () => {
    it('should detect SaaS/Tech industry correctly', async () => {
      const idea = 'A cloud-based API platform for developers to integrate payment processing into their applications';
      const result = await service.detectIndustry(idea);

      expect(result.category).toBe(IndustryCategory.SAAS_TECH);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.detectionMethod).toBe('keyword');
      expect(result.reasoning).toContain('keyword analysis');
    });

    it('should detect E-commerce industry correctly', async () => {
      const idea = 'An online marketplace for handmade crafts where artisans can sell their products directly to consumers';
      const result = await service.detectIndustry(idea);

      expect([IndustryCategory.ECOMMERCE, IndustryCategory.MARKETPLACE]).toContain(result.category);
      expect(result.confidence).toBeGreaterThan(40);
      expect(result.detectionMethod).toBe('keyword');
    });

    it('should detect Health/Fitness industry correctly', async () => {
      const idea = 'A telemedicine platform connecting patients with healthcare providers for virtual consultations';
      const result = await service.detectIndustry(idea);

      expect(result.category).toBe(IndustryCategory.HEALTH_FITNESS);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.detectionMethod).toBe('keyword');
    });

    it('should detect Education industry correctly', async () => {
      const idea = 'An online learning platform offering coding courses and certifications for software developers';
      const result = await service.detectIndustry(idea);

      expect([IndustryCategory.EDUCATION, IndustryCategory.SAAS_TECH]).toContain(result.category);
      expect(result.confidence).toBeGreaterThan(40);
      expect(result.detectionMethod).toBe('keyword');
    });

    it('should detect FinTech industry correctly', async () => {
      const idea = 'A mobile payment app that allows users to send money internationally with cryptocurrency';
      const result = await service.detectIndustry(idea);

      expect(result.category).toBe(IndustryCategory.FINTECH);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.detectionMethod).toBe('keyword');
    });

    it('should handle short input with default classification', async () => {
      const idea = 'App';
      const result = await service.detectIndustry(idea);

      expect(result.category).toBe(IndustryCategory.SAAS_TECH);
      expect(result.confidence).toBeLessThan(50);
      expect(result.detectionMethod).toBe('default');
      expect(result.reasoning).toContain('Input too short');
    });

    it('should handle empty input with default classification', async () => {
      const idea = '';
      const result = await service.detectIndustry(idea);

      expect(result.category).toBe(IndustryCategory.SAAS_TECH);
      expect(result.confidence).toBeLessThan(50);
      expect(result.detectionMethod).toBe('default');
    });

    it('should handle ambiguous input with reasonable classification', async () => {
      const idea = 'A platform that helps people connect and share information';
      const result = await service.detectIndustry(idea);

      expect(Object.values(IndustryCategory)).toContain(result.category);
      expect(result.confidence).toBeGreaterThan(0);
      expect(['keyword', 'default']).toContain(result.detectionMethod);
    });
  });

  describe('getConfidenceScore', () => {
    it('should adjust confidence based on detection method', () => {
      const aiResult: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 85,
        reasoning: 'AI classification',
        detectionMethod: 'ai'
      };

      const keywordResult: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 85,
        reasoning: 'Keyword classification',
        detectionMethod: 'keyword'
      };

      const defaultResult: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 85,
        reasoning: 'Default classification',
        detectionMethod: 'default'
      };

      expect(service.getConfidenceScore(aiResult)).toBe(85);
      expect(service.getConfidenceScore(keywordResult)).toBe(80); // Capped at 80 for keyword
      expect(service.getConfidenceScore(defaultResult)).toBe(40); // Capped at 40 for default
    });
  });

  describe('validateClassification', () => {
    it('should validate correct classification result', () => {
      const validResult: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 75,
        reasoning: 'Valid classification',
        detectionMethod: 'ai'
      };

      expect(service.validateClassification(validResult)).toBe(true);
    });

    it('should reject invalid category', () => {
      const invalidResult: IndustryDetectionResult = {
        category: 'invalid_category' as IndustryCategory,
        confidence: 75,
        reasoning: 'Invalid classification',
        detectionMethod: 'ai'
      };

      expect(service.validateClassification(invalidResult)).toBe(false);
    });

    it('should reject invalid confidence scores', () => {
      const invalidConfidenceHigh: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 150,
        reasoning: 'Invalid confidence',
        detectionMethod: 'ai'
      };

      const invalidConfidenceLow: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: -10,
        reasoning: 'Invalid confidence',
        detectionMethod: 'ai'
      };

      expect(service.validateClassification(invalidConfidenceHigh)).toBe(false);
      expect(service.validateClassification(invalidConfidenceLow)).toBe(false);
    });

    it('should reject empty reasoning', () => {
      const emptyReasoning: IndustryDetectionResult = {
        category: IndustryCategory.SAAS_TECH,
        confidence: 75,
        reasoning: '',
        detectionMethod: 'ai'
      };

      expect(service.validateClassification(emptyReasoning)).toBe(false);
    });
  });

  describe('getIndustryContext', () => {
    it('should return industry context for valid category', () => {
      const context = service.getIndustryContext(IndustryCategory.SAAS_TECH);

      expect(context.framework).toBeDefined();
      expect(context.framework.category).toBe(IndustryCategory.SAAS_TECH);
      expect(context.keywords).toBeInstanceOf(Array);
      expect(context.keywords.length).toBeGreaterThan(0);
      expect(context.considerations).toBeInstanceOf(Array);
      expect(context.considerations.length).toBeGreaterThan(0);
    });

    it('should return different contexts for different industries', () => {
      const saasContext = service.getIndustryContext(IndustryCategory.SAAS_TECH);
      const ecommerceContext = service.getIndustryContext(IndustryCategory.ECOMMERCE);

      expect(saasContext.framework.category).toBe(IndustryCategory.SAAS_TECH);
      expect(ecommerceContext.framework.category).toBe(IndustryCategory.ECOMMERCE);
      expect(saasContext.keywords).not.toEqual(ecommerceContext.keywords);
      expect(saasContext.considerations).not.toEqual(ecommerceContext.considerations);
    });
  });
});

describe('AIIndustryClassifier', () => {
  let classifier: AIIndustryClassifier;

  beforeEach(() => {
    classifier = new AIIndustryClassifier(IndustryCategory.SAAS_TECH);
  });

  describe('classifyIndustry', () => {
    it('should classify SaaS ideas correctly', async () => {
      const idea = 'A cloud-based CRM software for small businesses with API integrations';
      const result = await classifier.classifyIndustry(idea);

      expect(result.category).toBe(IndustryCategory.SAAS_TECH);
      expect(result.confidence).toBeGreaterThan(50);
      expect(result.reasoning).toContain('keyword analysis');
    });

    it('should classify marketplace ideas correctly', async () => {
      const idea = 'A platform connecting freelance designers with small businesses needing graphic design work';
      const result = await classifier.classifyIndustry(idea);

      expect([IndustryCategory.MARKETPLACE, IndustryCategory.B2B_SERVICES]).toContain(result.category);
      expect(result.confidence).toBeGreaterThan(40);
    });

    it('should handle hardware ideas correctly', async () => {
      const idea = 'An IoT sensor device for monitoring air quality in smart homes';
      const result = await classifier.classifyIndustry(idea);

      expect(result.category).toBe(IndustryCategory.HARDWARE);
      expect(result.confidence).toBeGreaterThan(40);
    });
  });

  describe('getIndustryKeywords', () => {
    it('should return comprehensive keyword lists for all industries', () => {
      const keywords = classifier.getIndustryKeywords();

      // Check that all industry categories have keywords
      Object.values(IndustryCategory).forEach(category => {
        expect(keywords[category]).toBeDefined();
        expect(keywords[category]).toBeInstanceOf(Array);
        expect(keywords[category].length).toBeGreaterThan(5);
      });
    });

    it('should have unique keywords for different industries', () => {
      const keywords = classifier.getIndustryKeywords();
      
      const saasKeywords = keywords[IndustryCategory.SAAS_TECH];
      const healthKeywords = keywords[IndustryCategory.HEALTH_FITNESS];
      
      // Should have some unique keywords
      const intersection = saasKeywords.filter(keyword => healthKeywords.includes(keyword));
      expect(intersection.length).toBeLessThan(saasKeywords.length / 2);
    });
  });
});
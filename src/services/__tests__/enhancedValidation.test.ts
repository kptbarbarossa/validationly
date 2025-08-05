import { describe, it, expect } from 'vitest';
import { 
  validateScore, 
  calculateAnalysisCompleteness, 
  generateAnalysisMetadata,
  createDefaultEnhancedResult,
  INDUSTRY_DISPLAY_NAMES,
  RISK_LEVEL_DISPLAY
} from '../analysisUtils';
import { IndustryCategory, EnhancedValidationResult } from '../../types';
import { getIndustryFramework, getAllIndustryCategories } from '../industryFrameworks';

describe('Enhanced Validation System', () => {
  describe('Analysis Utils', () => {
    it('should validate scores correctly', () => {
      expect(validateScore(50)).toBe(50);
      expect(validateScore(-10)).toBe(0);
      expect(validateScore(150)).toBe(100);
      expect(validateScore(75.7)).toBe(76);
    });

    it('should generate analysis metadata', () => {
      const metadata = generateAnalysisMetadata(
        'gemini-2.0-flash-experimental',
        false,
        1500,
        85,
        'en',
        90
      );

      expect(metadata.aiModel).toBe('gemini-2.0-flash-experimental');
      expect(metadata.fallbackUsed).toBe(false);
      expect(metadata.processingTime).toBe(1500);
      expect(metadata.confidence).toBe(85);
      expect(metadata.language).toBe('en');
      expect(metadata.completeness).toBe(90);
      expect(metadata.analysisDate).toBeDefined();
      expect(metadata.analysisVersion).toBeDefined();
    });

    it('should create default enhanced result', () => {
      const idea = 'A SaaS platform for project management';
      const industry = IndustryCategory.SAAS_TECH;
      const result = createDefaultEnhancedResult(idea, industry);

      expect(result.idea).toBe(idea);
      expect(result.industry).toBe(industry);
      expect(result.overallScore).toBe(50);
      expect(result.analysisMetadata).toBeDefined();
    });

    it('should calculate analysis completeness', () => {
      const partialResult: Partial<EnhancedValidationResult> = {
        dimensionalScores: {} as any,
        riskMatrix: {} as any,
        competitorAnalysis: {} as any
      };

      const completeness = calculateAnalysisCompleteness(partialResult);
      expect(completeness).toBeGreaterThan(0);
      expect(completeness).toBeLessThanOrEqual(100);
    });
  });

  describe('Industry Frameworks', () => {
    it('should have frameworks for all industry categories', () => {
      const categories = getAllIndustryCategories();
      
      categories.forEach(category => {
        const framework = getIndustryFramework(category);
        expect(framework).toBeDefined();
        expect(framework.category).toBe(category);
        expect(framework.scoringWeights).toBeDefined();
        expect(framework.specificConsiderations).toBeInstanceOf(Array);
        expect(framework.regulatoryFactors).toBeInstanceOf(Array);
        expect(framework.keyMetrics).toBeInstanceOf(Array);
        expect(framework.successPatterns).toBeInstanceOf(Array);
        expect(framework.commonChallenges).toBeInstanceOf(Array);
        expect(framework.typicalTimelines).toBeDefined();
      });
    });

    it('should have proper scoring weights that sum to 1', () => {
      const categories = getAllIndustryCategories();
      
      categories.forEach(category => {
        const framework = getIndustryFramework(category);
        const weights = framework.scoringWeights;
        const sum = weights.marketSize + weights.competition + weights.technical + weights.monetization + weights.timing;
        
        // Allow for small floating point differences
        expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
      });
    });

    it('should have display names for all industries', () => {
      const categories = getAllIndustryCategories();
      
      categories.forEach(category => {
        expect(INDUSTRY_DISPLAY_NAMES[category]).toBeDefined();
        expect(typeof INDUSTRY_DISPLAY_NAMES[category]).toBe('string');
      });
    });
  });

  describe('Risk Level Display', () => {
    it('should have display information for all risk levels', () => {
      const riskLevels = ['Low', 'Medium', 'High'] as const;
      
      riskLevels.forEach(level => {
        const display = RISK_LEVEL_DISPLAY[level];
        expect(display).toBeDefined();
        expect(display.color).toBeDefined();
        expect(display.icon).toBeDefined();
        expect(display.description).toBeDefined();
      });
    });
  });

  describe('Type System Validation', () => {
    it('should have consistent industry categories', () => {
      const categories = getAllIndustryCategories();
      const enumValues = Object.values(IndustryCategory);
      
      expect(categories.length).toBe(enumValues.length);
      categories.forEach(category => {
        expect(enumValues).toContain(category);
      });
    });

    it('should validate enhanced result structure', () => {
      const idea = 'Test idea';
      const industry = IndustryCategory.SAAS_TECH;
      const result = createDefaultEnhancedResult(idea, industry);

      // Check required fields exist
      expect(result.idea).toBeDefined();
      expect(result.industry).toBeDefined();
      expect(result.overallScore).toBeDefined();
      expect(result.analysisMetadata).toBeDefined();
      
      // Check backward compatibility fields
      expect(result.demandScore).toBeDefined();
      expect(result.scoreJustification).toBeDefined();
      expect(result.signalSummary).toBeDefined();
      expect(result.tweetSuggestion).toBeDefined();
      expect(result.redditTitleSuggestion).toBeDefined();
      expect(result.redditBodySuggestion).toBeDefined();
      expect(result.linkedinSuggestion).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid scores gracefully', () => {
      expect(validateScore(NaN)).toBe(0);
      expect(validateScore(Infinity)).toBe(100);
      expect(validateScore(-Infinity)).toBe(0);
    });

    it('should handle empty analysis results', () => {
      const completeness = calculateAnalysisCompleteness({});
      expect(completeness).toBe(0);
    });
  });

  describe('Language Support', () => {
    it('should support multiple languages in metadata', () => {
      const englishMetadata = generateAnalysisMetadata('test', false, 1000, 80, 'en', 90);
      const turkishMetadata = generateAnalysisMetadata('test', false, 1000, 80, 'tr', 90);

      expect(englishMetadata.language).toBe('en');
      expect(turkishMetadata.language).toBe('tr');
    });
  });

  describe('Performance Validation', () => {
    it('should handle large industry framework data efficiently', () => {
      const startTime = Date.now();
      
      // Test accessing all industry frameworks
      const categories = getAllIndustryCategories();
      categories.forEach(category => {
        getIndustryFramework(category);
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should validate score calculations are efficient', () => {
      const startTime = Date.now();
      
      // Test score validation for many values
      for (let i = 0; i < 1000; i++) {
        validateScore(Math.random() * 200 - 50);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 50ms)
      expect(duration).toBeLessThan(50);
    });
  });
});
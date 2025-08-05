import { describe, it, expect } from 'vitest';
import { 
  IndustryKnowledgeBaseService,
  industryKnowledgeBaseService,
  INDUSTRY_KNOWLEDGE_BASE
} from '../industryKnowledgeBase';
import { IndustryCategory } from '../../types';
import { beforeEach } from 'node:test';

describe('IndustryKnowledgeBaseService', () => {
  let service: IndustryKnowledgeBaseService;

  beforeEach(() => {
    service = new IndustryKnowledgeBaseService();
  });

  describe('getIndustryKnowledge', () => {
    it('should return comprehensive knowledge for SaaS/Tech industry', () => {
      const knowledge = service.getIndustryKnowledge(IndustryCategory.SAAS_TECH);

      expect(knowledge).toBeDefined();
      expect(knowledge.framework).toBeDefined();
      expect(knowledge.marketInsights).toBeDefined();
      expect(knowledge.customerProfiles).toBeDefined();
      expect(knowledge.competitiveLandscape).toBeDefined();
      expect(knowledge.technologyFactors).toBeDefined();
      expect(knowledge.businessModelPatterns).toBeDefined();
      expect(knowledge.riskFactors).toBeDefined();

      // Verify specific content
      expect(knowledge.framework.category).toBe(IndustryCategory.SAAS_TECH);
      expect(knowledge.marketInsights.competitionLevel).toBe('High');
      expect(knowledge.technologyFactors.technicalComplexity).toBe('High');
      expect(knowledge.customerProfiles.primaryCustomers).toContain('SMBs');
    });

    it('should return knowledge for all industry categories', () => {
      Object.values(IndustryCategory).forEach(category => {
        const knowledge = service.getIndustryKnowledge(category);
        
        expect(knowledge).toBeDefined();
        expect(knowledge.framework.category).toBe(category);
        expect(knowledge.marketInsights.averageMarketSize).toBeDefined();
        expect(knowledge.customerProfiles.primaryCustomers.length).toBeGreaterThan(0);
        expect(knowledge.competitiveLandscape.majorPlayers.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getIndustryScoringWeights', () => {
    it('should return correct scoring weights for each industry', () => {
      const saasWeights = service.getIndustryScoringWeights(IndustryCategory.SAAS_TECH);
      const ecommerceWeights = service.getIndustryScoringWeights(IndustryCategory.ECOMMERCE);

      // Verify structure
      expect(saasWeights).toHaveProperty('marketSize');
      expect(saasWeights).toHaveProperty('competition');
      expect(saasWeights).toHaveProperty('technical');
      expect(saasWeights).toHaveProperty('monetization');
      expect(saasWeights).toHaveProperty('timing');

      // Verify weights sum to 1.0 (approximately)
      const saasSum = Object.values(saasWeights).reduce((sum, weight) => sum + weight, 0);
      expect(saasSum).toBeCloseTo(1.0, 2);

      // Verify different industries have different weights
      expect(saasWeights.technical).toBeGreaterThan(ecommerceWeights.technical);
      expect(ecommerceWeights.marketSize).toBeGreaterThan(saasWeights.marketSize);
    });
  });

  describe('getIndustryConsiderations', () => {
    it('should return comprehensive considerations for each industry', () => {
      const considerations = service.getIndustryConsiderations(IndustryCategory.HEALTH_FITNESS);

      expect(considerations.specificConsiderations).toBeInstanceOf(Array);
      expect(considerations.regulatoryFactors).toBeInstanceOf(Array);
      expect(considerations.keyMetrics).toBeInstanceOf(Array);
      expect(considerations.successPatterns).toBeInstanceOf(Array);
      expect(considerations.commonChallenges).toBeInstanceOf(Array);

      // Verify health-specific content
      expect(considerations.regulatoryFactors).toContain('HIPAA compliance for health data');
      expect(considerations.specificConsiderations).toContain('User safety and liability concerns');
    });
  });

  describe('getMarketInsights', () => {
    it('should return market insights for industries', () => {
      const fintechInsights = service.getMarketInsights(IndustryCategory.FINTECH);

      expect(fintechInsights.marketSize).toBeDefined();
      expect(fintechInsights.growthRate).toBeDefined();
      expect(fintechInsights.competitionLevel).toBeDefined();
      expect(fintechInsights.barrierToEntry).toBeDefined();
      expect(fintechInsights.capitalRequirements).toBeDefined();

      // Verify fintech-specific insights
      expect(fintechInsights.competitionLevel).toBe('High');
      expect(fintechInsights.barrierToEntry).toBe('High');
      expect(fintechInsights.capitalRequirements).toBe('High');
    });
  });

  describe('getCompetitiveLandscape', () => {
    it('should return competitive information for industries', () => {
      const landscape = service.getCompetitiveLandscape(IndustryCategory.ECOMMERCE);

      expect(landscape.majorPlayers).toBeInstanceOf(Array);
      expect(landscape.competitiveFactors).toBeInstanceOf(Array);
      expect(landscape.differentiationOpportunities).toBeInstanceOf(Array);

      expect(landscape.majorPlayers.length).toBeGreaterThan(0);
      expect(landscape.majorPlayers).toContain('Amazon');
      expect(landscape.competitiveFactors).toContain('Price');
    });
  });

  describe('getBusinessModelPatterns', () => {
    it('should return business model information', () => {
      const patterns = service.getBusinessModelPatterns(IndustryCategory.MARKETPLACE);

      expect(patterns.commonModels).toBeInstanceOf(Array);
      expect(patterns.revenueStreams).toBeInstanceOf(Array);
      expect(patterns.pricingStrategies).toBeInstanceOf(Array);
      expect(patterns.scalabilityFactors).toBeInstanceOf(Array);

      expect(patterns.commonModels).toContain('Commission-based');
      expect(patterns.revenueStreams).toContain('Transaction fees');
      expect(patterns.scalabilityFactors).toContain('Network effects');
    });
  });

  describe('getRiskFactors', () => {
    it('should return comprehensive risk information', () => {
      const risks = service.getRiskFactors(IndustryCategory.HARDWARE);

      expect(risks.primaryRisks).toBeInstanceOf(Array);
      expect(risks.mitigationStrategies).toBeInstanceOf(Array);
      expect(risks.regulatoryRisks).toBeInstanceOf(Array);
      expect(risks.marketRisks).toBeInstanceOf(Array);

      expect(risks.primaryRisks).toContain('Development costs');
      expect(risks.regulatoryRisks).toContain('Safety certifications');
      expect(risks.marketRisks).toContain('Technology shifts');
    });
  });

  describe('getTechnologyFactors', () => {
    it('should return technology information for industries', () => {
      const tech = service.getTechnologyFactors(IndustryCategory.CONSUMER_APP);

      expect(tech.keyTechnologies).toBeInstanceOf(Array);
      expect(tech.emergingTrends).toBeInstanceOf(Array);
      expect(tech.technicalComplexity).toBeDefined();
      expect(tech.developmentTimeline).toBeDefined();

      expect(tech.keyTechnologies).toContain('Mobile development');
      expect(tech.emergingTrends).toContain('AR filters');
      expect(tech.technicalComplexity).toBe('Medium');
    });
  });

  describe('getCustomerProfiles', () => {
    it('should return customer information for industries', () => {
      const profiles = service.getCustomerProfiles(IndustryCategory.B2B_SERVICES);

      expect(profiles.primaryCustomers).toBeInstanceOf(Array);
      expect(profiles.decisionMakers).toBeInstanceOf(Array);
      expect(profiles.buyingProcess).toBeDefined();
      expect(profiles.averageSalesycle).toBeDefined();

      expect(profiles.primaryCustomers).toContain('SMBs');
      expect(profiles.decisionMakers).toContain('CEOs');
      expect(profiles.averageSalesycle).toBe('3-18 months');
    });
  });

  describe('generateAnalysisContext', () => {
    it('should generate comprehensive analysis context', () => {
      const context = service.generateAnalysisContext(IndustryCategory.EDUCATION);

      expect(context).toContain('Industry Context for education');
      expect(context).toContain('Market Overview:');
      expect(context).toContain('Key Success Factors:');
      expect(context).toContain('Common Challenges:');
      expect(context).toContain('Regulatory Considerations:');
      expect(context).toContain('Technology Factors:');
      expect(context).toContain('Business Model Patterns:');

      // Verify education-specific content
      expect(context).toContain('FERPA compliance for student data');
      expect(context).toContain('learning effectiveness');
    });

    it('should generate different contexts for different industries', () => {
      const saasContext = service.generateAnalysisContext(IndustryCategory.SAAS_TECH);
      const healthContext = service.generateAnalysisContext(IndustryCategory.HEALTH_FITNESS);

      expect(saasContext).not.toBe(healthContext);
      expect(saasContext).toContain('saas_tech');
      expect(healthContext).toContain('health_fitness');
      expect(saasContext).toContain('developer experience');
      expect(healthContext).toContain('clinical validation');
    });
  });

  describe('compareIndustries', () => {
    it('should compare multiple industries', () => {
      const comparison = service.compareIndustries([
        IndustryCategory.SAAS_TECH,
        IndustryCategory.ECOMMERCE,
        IndustryCategory.FINTECH
      ]);

      expect(comparison.comparison).toBeDefined();
      expect(comparison.recommendations).toBeInstanceOf(Array);

      // Verify comparison structure
      expect(comparison.comparison[IndustryCategory.SAAS_TECH]).toBeDefined();
      expect(comparison.comparison[IndustryCategory.ECOMMERCE]).toBeDefined();
      expect(comparison.comparison[IndustryCategory.FINTECH]).toBeDefined();

      // Verify comparison content
      expect(comparison.comparison[IndustryCategory.SAAS_TECH].competitionLevel).toBe('High');
      expect(comparison.comparison[IndustryCategory.ECOMMERCE].barrierToEntry).toBe('Low');
      expect(comparison.comparison[IndustryCategory.FINTECH].capitalRequirements).toBe('High');

      // Verify recommendations
      expect(comparison.recommendations.length).toBeGreaterThan(0);
      expect(comparison.recommendations[0]).toContain('market entry barriers');
    });

    it('should handle single industry comparison', () => {
      const comparison = service.compareIndustries([IndustryCategory.HARDWARE]);

      expect(comparison.comparison[IndustryCategory.HARDWARE]).toBeDefined();
      expect(comparison.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('INDUSTRY_KNOWLEDGE_BASE completeness', () => {
    it('should have knowledge entries for all industry categories', () => {
      Object.values(IndustryCategory).forEach(category => {
        expect(INDUSTRY_KNOWLEDGE_BASE[category]).toBeDefined();
        
        const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
        
        // Verify all required sections are present
        expect(knowledge.framework).toBeDefined();
        expect(knowledge.marketInsights).toBeDefined();
        expect(knowledge.customerProfiles).toBeDefined();
        expect(knowledge.competitiveLandscape).toBeDefined();
        expect(knowledge.technologyFactors).toBeDefined();
        expect(knowledge.businessModelPatterns).toBeDefined();
        expect(knowledge.riskFactors).toBeDefined();

        // Verify non-empty arrays
        expect(knowledge.customerProfiles.primaryCustomers.length).toBeGreaterThan(0);
        expect(knowledge.competitiveLandscape.majorPlayers.length).toBeGreaterThan(0);
        expect(knowledge.technologyFactors.keyTechnologies.length).toBeGreaterThan(0);
        expect(knowledge.businessModelPatterns.commonModels.length).toBeGreaterThan(0);
        expect(knowledge.riskFactors.primaryRisks.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent data structure across all industries', () => {
      Object.values(IndustryCategory).forEach(category => {
        const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
        
        // Verify market insights structure
        expect(knowledge.marketInsights.averageMarketSize).toBeDefined();
        expect(knowledge.marketInsights.growthRate).toBeDefined();
        expect(['Low', 'Medium', 'High']).toContain(knowledge.marketInsights.competitionLevel);
        expect(['Low', 'Medium', 'High']).toContain(knowledge.marketInsights.barrierToEntry);
        expect(['Low', 'Medium', 'High']).toContain(knowledge.marketInsights.capitalRequirements);

        // Verify technology factors structure
        expect(['Low', 'Medium', 'High']).toContain(knowledge.technologyFactors.technicalComplexity);
        expect(knowledge.technologyFactors.developmentTimeline).toMatch(/\d+(-\d+)?\s+(months?|years?)/);
      });
    });
  });

  describe('singleton service', () => {
    it('should provide singleton instance', () => {
      expect(industryKnowledgeBaseService).toBeInstanceOf(IndustryKnowledgeBaseService);
      
      const knowledge1 = industryKnowledgeBaseService.getIndustryKnowledge(IndustryCategory.SAAS_TECH);
      const knowledge2 = industryKnowledgeBaseService.getIndustryKnowledge(IndustryCategory.SAAS_TECH);
      
      expect(knowledge1).toBe(knowledge2); // Same reference
    });
  });
});
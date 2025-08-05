import { describe, it, expect } from 'vitest';
import { DimensionalScoreCalculator, ScoreCalculator } from '../scoreCalculator';
import { IndustryCategory } from '../../types';

describe('DimensionalScoreCalculator', () => {
  const calculator = new DimensionalScoreCalculator(IndustryCategory.SAAS_TECH);

  describe('calculateMarketSizeScore', () => {
    it('should calculate high market size score for excellent indicators', () => {
      const indicators = {
        totalAddressableMarket: 9,
        marketGrowthRate: 8,
        customerDemand: 9,
        marketMaturity: 3 // Less mature = more opportunity
      };

      const result = calculator.calculateMarketSizeScore(indicators);

      expect(result.score).toBeGreaterThan(80);
      expect(result.reasoning).toContain('Excellent market opportunity');
      expect(result.keyFactors).toContain('Large addressable market');
      expect(result.keyFactors).toContain('Strong customer demand');
    });

    it('should calculate low market size score for poor indicators', () => {
      const indicators = {
        totalAddressableMarket: 2,
        marketGrowthRate: 3,
        customerDemand: 2,
        marketMaturity: 8 // More mature = less opportunity
      };

      const result = calculator.calculateMarketSizeScore(indicators);

      expect(result.score).toBeLessThan(45);
      expect(result.reasoning).toContain('Limited market size');
      expect(result.improvementAreas).toContain('Expand target market definition');
      expect(result.improvementAreas).toContain('Validate customer demand more thoroughly');
    });

    it('should apply industry-specific weighting', () => {
      const indicators = {
        totalAddressableMarket: 6,
        marketGrowthRate: 6,
        customerDemand: 6,
        marketMaturity: 6
      };

      const saasCalculator = new DimensionalScoreCalculator(IndustryCategory.SAAS_TECH);
      const ecommerceCalculator = new DimensionalScoreCalculator(IndustryCategory.ECOMMERCE);

      const saasResult = saasCalculator.calculateMarketSizeScore(indicators);
      const ecommerceResult = ecommerceCalculator.calculateMarketSizeScore(indicators);

      // E-commerce has higher market size weight (0.30 vs 0.20)
      expect(ecommerceResult.score).toBeGreaterThan(saasResult.score);
    });
  });

  describe('calculateCompetitionScore', () => {
    it('should calculate high competition score for favorable landscape', () => {
      const indicators = {
        numberOfCompetitors: 2, // Few competitors
        competitorStrength: 3, // Weak competitors
        marketSaturation: 2, // Low saturation
        barrierToEntry: 6, // Moderate barriers
        differentiation: 8 // High differentiation
      };

      const result = calculator.calculateCompetitionScore(indicators);

      expect(result.score).toBeGreaterThan(70);
      expect(result.reasoning).toContain('competition');
      expect(result.keyFactors).toContain('Strong differentiation potential');
      expect(result.keyFactors).toContain('Limited direct competition');
    });

    it('should calculate low competition score for saturated market', () => {
      const indicators = {
        numberOfCompetitors: 9, // Many competitors
        competitorStrength: 8, // Strong competitors
        marketSaturation: 9, // High saturation
        barrierToEntry: 3, // Low barriers
        differentiation: 2 // Low differentiation
      };

      const result = calculator.calculateCompetitionScore(indicators);

      expect(result.score).toBeLessThan(40);
      expect(result.reasoning).toContain('Highly competitive environment');
      expect(result.improvementAreas).toContain('Develop stronger differentiation strategy');
      expect(result.improvementAreas).toContain('Find niche market segment');
    });
  });

  describe('calculateTechnicalFeasibilityScore', () => {
    it('should calculate high technical score for simple implementation', () => {
      const indicators = {
        implementationComplexity: 2, // Low complexity
        technologyMaturity: 8, // Mature tech
        resourceRequirements: 3, // Low resources
        technicalRisk: 2, // Low risk
        scalabilityPotential: 9 // High scalability
      };

      const result = calculator.calculateTechnicalFeasibilityScore(indicators);

      expect(result.score).toBeGreaterThan(80);
      expect(result.reasoning).toContain('Highly feasible from technical perspective');
      expect(result.keyFactors).toContain('Low implementation complexity');
      expect(result.keyFactors).toContain('Mature technology stack');
    });

    it('should apply higher technical weight for tech industries', () => {
      const indicators = {
        implementationComplexity: 5,
        technologyMaturity: 5,
        resourceRequirements: 5,
        technicalRisk: 5,
        scalabilityPotential: 5
      };

      const saasCalculator = new DimensionalScoreCalculator(IndustryCategory.SAAS_TECH);
      const ecommerceCalculator = new DimensionalScoreCalculator(IndustryCategory.ECOMMERCE);

      const saasResult = saasCalculator.calculateTechnicalFeasibilityScore(indicators);
      const ecommerceResult = ecommerceCalculator.calculateTechnicalFeasibilityScore(indicators);

      // SaaS has higher technical weight (0.30 vs 0.15)
      expect(saasResult.score).toBeGreaterThan(ecommerceResult.score);
    });
  });

  describe('calculateMonetizationScore', () => {
    it('should calculate high monetization score for clear revenue model', () => {
      const indicators = {
        revenueModelClarity: 9,
        pricingPower: 8,
        customerWillingness: 8,
        revenueStreams: 7,
        profitMargins: 8
      };

      const result = calculator.calculateMonetizationScore(indicators);

      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.reasoning).toContain('Strong monetization potential');
      expect(result.keyFactors).toContain('Clear revenue model');
      expect(result.keyFactors).toContain('Strong pricing power');
    });

    it('should calculate low monetization score for unclear model', () => {
      const indicators = {
        revenueModelClarity: 2,
        pricingPower: 3,
        customerWillingness: 2,
        revenueStreams: 2,
        profitMargins: 3
      };

      const result = calculator.calculateMonetizationScore(indicators);

      expect(result.score).toBeLessThan(40);
      expect(result.reasoning).toContain('Unclear monetization path');
      expect(result.improvementAreas).toContain('Clarify revenue model');
      expect(result.improvementAreas).toContain('Validate willingness to pay');
    });
  });

  describe('calculateTimingScore', () => {
    it('should calculate high timing score for optimal conditions', () => {
      const indicators = {
        marketReadiness: 8,
        trendAlignment: 9,
        technologyReadiness: 8,
        economicConditions: 7,
        competitiveTiming: 8
      };

      const result = calculator.calculateTimingScore(indicators);

      expect(result.score).toBeGreaterThan(75);
      expect(result.reasoning).toContain('Excellent market timing');
      expect(result.keyFactors).toContain('Market ready for solution');
      expect(result.keyFactors).toContain('Strong trend alignment');
    });

    it('should calculate low timing score for poor conditions', () => {
      const indicators = {
        marketReadiness: 2,
        trendAlignment: 3,
        technologyReadiness: 2,
        economicConditions: 2,
        competitiveTiming: 3
      };

      const result = calculator.calculateTimingScore(indicators);

      expect(result.score).toBeLessThan(40);
      expect(result.reasoning).toContain('Poor timing');
      expect(result.improvementAreas).toContain('Wait for market maturation');
      expect(result.improvementAreas).toContain('Align with emerging trends');
    });
  });

  describe('calculateAllDimensionalScores', () => {
    it('should calculate all dimensional scores correctly', () => {
      const indicators = {
        market: {
          totalAddressableMarket: 7,
          marketGrowthRate: 6,
          customerDemand: 7,
          marketMaturity: 5
        },
        competition: {
          numberOfCompetitors: 5,
          competitorStrength: 6,
          marketSaturation: 5,
          barrierToEntry: 6,
          differentiation: 7
        },
        technical: {
          implementationComplexity: 4,
          technologyMaturity: 7,
          resourceRequirements: 5,
          technicalRisk: 4,
          scalabilityPotential: 8
        },
        monetization: {
          revenueModelClarity: 7,
          pricingPower: 6,
          customerWillingness: 7,
          revenueStreams: 6,
          profitMargins: 6
        },
        timing: {
          marketReadiness: 7,
          trendAlignment: 8,
          technologyReadiness: 7,
          economicConditions: 6,
          competitiveTiming: 7
        }
      };

      const result = calculator.calculateAllDimensionalScores(indicators);

      expect(result.marketSize.score).toBeGreaterThan(0);
      expect(result.marketSize.score).toBeLessThanOrEqual(100);
      expect(result.competitionIntensity.score).toBeGreaterThan(0);
      expect(result.competitionIntensity.score).toBeLessThanOrEqual(100);
      expect(result.technicalFeasibility.score).toBeGreaterThan(0);
      expect(result.technicalFeasibility.score).toBeLessThanOrEqual(100);
      expect(result.monetizationPotential.score).toBeGreaterThan(0);
      expect(result.monetizationPotential.score).toBeLessThanOrEqual(100);
      expect(result.timingTrend.score).toBeGreaterThan(0);
      expect(result.timingTrend.score).toBeLessThanOrEqual(100);

      // Verify all scores have required properties
      Object.values(result).forEach(dimensionalScore => {
        expect(dimensionalScore).toHaveProperty('score');
        expect(dimensionalScore).toHaveProperty('reasoning');
        expect(dimensionalScore).toHaveProperty('keyFactors');
        expect(dimensionalScore).toHaveProperty('improvementAreas');
        expect(Array.isArray(dimensionalScore.keyFactors)).toBe(true);
        expect(Array.isArray(dimensionalScore.improvementAreas)).toBe(true);
      });
    });
  });
});

describe('ScoreCalculator utility methods', () => {
  describe('validateScore', () => {
    it('should clamp scores to 0-100 range', () => {
      expect(ScoreCalculator.validateScore(-10)).toBe(0);
      expect(ScoreCalculator.validateScore(150)).toBe(100);
      expect(ScoreCalculator.validateScore(75.7)).toBe(76);
      expect(ScoreCalculator.validateScore(50)).toBe(50);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate weighted overall score correctly', () => {
      const scores = {
        marketSize: { score: 80, reasoning: '', keyFactors: [], improvementAreas: [] },
        competitionIntensity: { score: 70, reasoning: '', keyFactors: [], improvementAreas: [] },
        technicalFeasibility: { score: 90, reasoning: '', keyFactors: [], improvementAreas: [] },
        monetizationPotential: { score: 60, reasoning: '', keyFactors: [], improvementAreas: [] },
        timingTrend: { score: 75, reasoning: '', keyFactors: [], improvementAreas: [] }
      };

      const overallScore = ScoreCalculator.calculateOverallScore(scores, IndustryCategory.SAAS_TECH);

      // SaaS weights: market(0.20), competition(0.25), technical(0.30), monetization(0.15), timing(0.10)
      const expectedScore = Math.round(
        80 * 0.20 + 70 * 0.25 + 90 * 0.30 + 60 * 0.15 + 75 * 0.10
      );

      expect(overallScore).toBe(expectedScore);
      expect(overallScore).toBeGreaterThanOrEqual(0);
      expect(overallScore).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateConfidenceLevel', () => {
    it('should calculate higher confidence for consistent scores', () => {
      const consistentScores = {
        marketSize: { score: 75, reasoning: '', keyFactors: [], improvementAreas: [] },
        competitionIntensity: { score: 73, reasoning: '', keyFactors: [], improvementAreas: [] },
        technicalFeasibility: { score: 77, reasoning: '', keyFactors: [], improvementAreas: [] },
        monetizationPotential: { score: 74, reasoning: '', keyFactors: [], improvementAreas: [] },
        timingTrend: { score: 76, reasoning: '', keyFactors: [], improvementAreas: [] }
      };

      const inconsistentScores = {
        marketSize: { score: 90, reasoning: '', keyFactors: [], improvementAreas: [] },
        competitionIntensity: { score: 20, reasoning: '', keyFactors: [], improvementAreas: [] },
        technicalFeasibility: { score: 85, reasoning: '', keyFactors: [], improvementAreas: [] },
        monetizationPotential: { score: 30, reasoning: '', keyFactors: [], improvementAreas: [] },
        timingTrend: { score: 75, reasoning: '', keyFactors: [], improvementAreas: [] }
      };

      const consistentConfidence = ScoreCalculator.calculateConfidenceLevel(consistentScores);
      const inconsistentConfidence = ScoreCalculator.calculateConfidenceLevel(inconsistentScores);

      expect(consistentConfidence).toBeGreaterThan(inconsistentConfidence);
      expect(consistentConfidence).toBeGreaterThanOrEqual(0);
      expect(consistentConfidence).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeDimensionalStrengths', () => {
    it('should identify strongest and weakest dimensions', () => {
      const scores = {
        marketSize: { score: 90, reasoning: '', keyFactors: [], improvementAreas: [] },
        competitionIntensity: { score: 30, reasoning: '', keyFactors: [], improvementAreas: [] },
        technicalFeasibility: { score: 85, reasoning: '', keyFactors: [], improvementAreas: [] },
        monetizationPotential: { score: 40, reasoning: '', keyFactors: [], improvementAreas: [] },
        timingTrend: { score: 75, reasoning: '', keyFactors: [], improvementAreas: [] }
      };

      const analysis = ScoreCalculator.analyzeDimensionalStrengths(scores);

      expect(analysis.strongest).toHaveLength(2);
      expect(analysis.weakest).toHaveLength(2);
      expect(analysis.strongest[0].score).toBe(90); // Market Size
      expect(analysis.strongest[1].score).toBe(85); // Technical Feasibility
      expect(analysis.weakest[0].score).toBe(40); // Monetization Potential
      expect(analysis.weakest[1].score).toBe(30); // Competition Intensity
    });
  });

  describe('interpretOverallScore', () => {
    it('should provide correct interpretation for different score ranges', () => {
      const excellentInterpretation = ScoreCalculator.interpretOverallScore(85);
      expect(excellentInterpretation.level).toBe('Excellent');
      expect(excellentInterpretation.recommendation).toContain('Proceed with confidence');

      const goodInterpretation = ScoreCalculator.interpretOverallScore(70);
      expect(goodInterpretation.level).toBe('Good');
      expect(goodInterpretation.recommendation).toContain('Address the weaker dimensions');

      const fairInterpretation = ScoreCalculator.interpretOverallScore(55);
      expect(fairInterpretation.level).toBe('Fair');
      expect(fairInterpretation.recommendation).toContain('Substantial improvements needed');

      const poorInterpretation = ScoreCalculator.interpretOverallScore(30);
      expect(poorInterpretation.level).toBe('Poor');
      expect(poorInterpretation.recommendation).toContain('Consider alternative approaches');
    });
  });

  describe('generateScoreSummary', () => {
    it('should generate comprehensive score summary', () => {
      const scores = {
        marketSize: { score: 80, reasoning: '', keyFactors: [], improvementAreas: [] },
        competitionIntensity: { score: 70, reasoning: '', keyFactors: [], improvementAreas: [] },
        technicalFeasibility: { score: 90, reasoning: '', keyFactors: [], improvementAreas: [] },
        monetizationPotential: { score: 60, reasoning: '', keyFactors: [], improvementAreas: [] },
        timingTrend: { score: 75, reasoning: '', keyFactors: [], improvementAreas: [] }
      };

      const summary = ScoreCalculator.generateScoreSummary(scores, IndustryCategory.SAAS_TECH);

      expect(summary).toHaveProperty('overallScore');
      expect(summary).toHaveProperty('confidence');
      expect(summary).toHaveProperty('strengths');
      expect(summary).toHaveProperty('weaknesses');
      expect(summary).toHaveProperty('interpretation');
      expect(summary).toHaveProperty('improvementPotential');

      expect(summary.overallScore).toBeGreaterThan(0);
      expect(summary.overallScore).toBeLessThanOrEqual(100);
      expect(summary.confidence).toBeGreaterThanOrEqual(0);
      expect(summary.confidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(summary.strengths)).toBe(true);
      expect(Array.isArray(summary.weaknesses)).toBe(true);
    });
  });
});
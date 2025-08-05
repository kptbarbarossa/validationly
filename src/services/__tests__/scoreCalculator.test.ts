import { describe, it, expect } from 'vitest';
import { ScoreCalculator, IndustryScoreAdjuster } from '../scoreCalculator';
import { DimensionalScores, IndustryCategory } from '../../types';

describe('ScoreCalculator', () => {
  const mockDimensionalScores: DimensionalScores = {
    marketSize: {
      score: 75,
      reasoning: 'Good market size potential',
      keyFactors: ['Large addressable market'],
      improvementAreas: ['Research international markets']
    },
    competitionIntensity: {
      score: 60,
      reasoning: 'Moderate competition',
      keyFactors: ['Some existing players'],
      improvementAreas: ['Find unique differentiation']
    },
    technicalFeasibility: {
      score: 85,
      reasoning: 'High technical feasibility',
      keyFactors: ['Existing technology stack'],
      improvementAreas: ['Optimize performance']
    },
    monetizationPotential: {
      score: 70,
      reasoning: 'Good monetization potential',
      keyFactors: ['Clear revenue streams'],
      improvementAreas: ['Diversify revenue sources']
    },
    timingTrend: {
      score: 65,
      reasoning: 'Good market timing',
      keyFactors: ['Favorable trends'],
      improvementAreas: ['Monitor market changes']
    }
  };

  describe('validateScore', () => {
    it('should clamp scores to 0-100 range', () => {
      expect(ScoreCalculator.validateScore(-10)).toBe(0);
      expect(ScoreCalculator.validateScore(150)).toBe(100);
      expect(ScoreCalculator.validateScore(75.7)).toBe(76);
      expect(ScoreCalculator.validateScore(50)).toBe(50);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate weighted overall score for SaaS industry', () => {
      const overallScore = ScoreCalculator.calculateOverallScore(
        mockDimensionalScores, 
        IndustryCategory.SAAS_TECH
      );
      
      // SaaS weights: marketSize: 0.20, competition: 0.25, technical: 0.30, monetization: 0.15, timing: 0.10
      // Expected: 75*0.20 + 60*0.25 + 85*0.30 + 70*0.15 + 65*0.10 = 15 + 15 + 25.5 + 10.5 + 6.5 = 72.5
      expect(overallScore).toBeCloseTo(73, 0);
    });

    it('should calculate weighted overall score for E-commerce industry', () => {
      const overallScore = ScoreCalculator.calculateOverallScore(
        mockDimensionalScores, 
        IndustryCategory.ECOMMERCE
      );
      
      // E-commerce weights: marketSize: 0.30, competition: 0.25, technical: 0.15, monetization: 0.20, timing: 0.10
      // Expected: 75*0.30 + 60*0.25 + 85*0.15 + 70*0.20 + 65*0.10 = 22.5 + 15 + 12.75 + 14 + 6.5 = 70.75
      expect(overallScore).toBeCloseTo(71, 0);
    });
  });

  describe('calculateConfidenceLevel', () => {
    it('should calculate confidence based on score consistency', () => {
      const confidence = ScoreCalculator.calculateConfidenceLevel(mockDimensionalScores);
      
      // With scores [75, 60, 85, 70, 65], standard deviation should be moderate
      expect(confidence).toBeGreaterThan(60);
      expect(confidence).toBeLessThan(90);
    });

    it('should return high confidence for consistent scores', () => {
      const consistentScores: DimensionalScores = {
        ...mockDimensionalScores,
        marketSize: { ...mockDimensionalScores.marketSize, score: 70 },
        competitionIntensity: { ...mockDimensionalScores.competitionIntensity, score: 72 },
        technicalFeasibility: { ...mockDimensionalScores.technicalFeasibility, score: 71 },
        monetizationPotential: { ...mockDimensionalScores.monetizationPotential, score: 69 },
        timingTrend: { ...mockDimensionalScores.timingTrend, score: 73 }
      };

      const confidence = ScoreCalculator.calculateConfidenceLevel(consistentScores);
      expect(confidence).toBeGreaterThan(85);
    });
  });

  describe('analyzeDimensionalStrengths', () => {
    it('should identify strongest and weakest dimensions', () => {
      const analysis = ScoreCalculator.analyzeDimensionalStrengths(mockDimensionalScores);
      
      expect(analysis.strongest).toHaveLength(2);
      expect(analysis.weakest).toHaveLength(2);
      
      // Technical feasibility (85) should be strongest
      expect(analysis.strongest[0].dimension).toBe('Technical Feasibility');
      expect(analysis.strongest[0].score).toBe(85);
      
      // Competition intensity (60) should be weakest
      expect(analysis.weakest[1].dimension).toBe('Competition Intensity');
      expect(analysis.weakest[1].score).toBe(60);
    });
  });

  describe('interpretOverallScore', () => {
    it('should interpret excellent scores correctly', () => {
      const interpretation = ScoreCalculator.interpretOverallScore(85);
      expect(interpretation.level).toBe('Excellent');
      expect(interpretation.description).toContain('exceptional potential');
    });

    it('should interpret good scores correctly', () => {
      const interpretation = ScoreCalculator.interpretOverallScore(70);
      expect(interpretation.level).toBe('Good');
      expect(interpretation.description).toContain('solid potential');
    });

    it('should interpret fair scores correctly', () => {
      const interpretation = ScoreCalculator.interpretOverallScore(50);
      expect(interpretation.level).toBe('Fair');
      expect(interpretation.description).toContain('moderate potential');
    });

    it('should interpret poor scores correctly', () => {
      const interpretation = ScoreCalculator.interpretOverallScore(30);
      expect(interpretation.level).toBe('Poor');
      expect(interpretation.description).toContain('major challenges');
    });
  });

  describe('calculateImprovementPotential', () => {
    it('should calculate improvement potential correctly', () => {
      const potential = ScoreCalculator.calculateImprovementPotential(mockDimensionalScores);
      
      // Average improvement room: (25 + 40 + 15 + 30 + 35) / 5 = 29
      expect(potential).toBeCloseTo(29, 0);
    });
  });

  describe('generateScoreSummary', () => {
    it('should generate comprehensive score summary', () => {
      const summary = ScoreCalculator.generateScoreSummary(
        mockDimensionalScores, 
        IndustryCategory.SAAS_TECH
      );
      
      expect(summary.overallScore).toBeGreaterThan(0);
      expect(summary.confidence).toBeGreaterThan(0);
      expect(summary.strengths).toHaveLength(2);
      expect(summary.weaknesses).toHaveLength(2);
      expect(summary.interpretation.level).toBeDefined();
      expect(summary.improvementPotential).toBeGreaterThan(0);
    });
  });
});

describe('IndustryScoreAdjuster', () => {
  const mockScores: DimensionalScores = {
    marketSize: {
      score: 70,
      reasoning: 'Test reasoning',
      keyFactors: ['Test factor'],
      improvementAreas: ['Test improvement']
    },
    competitionIntensity: {
      score: 60,
      reasoning: 'Test reasoning',
      keyFactors: ['Test factor'],
      improvementAreas: ['Test improvement']
    },
    technicalFeasibility: {
      score: 80,
      reasoning: 'Test reasoning',
      keyFactors: ['Test factor'],
      improvementAreas: ['Test improvement']
    },
    monetizationPotential: {
      score: 65,
      reasoning: 'Test reasoning',
      keyFactors: ['Test factor'],
      improvementAreas: ['Test improvement']
    },
    timingTrend: {
      score: 55,
      reasoning: 'Test reasoning',
      keyFactors: ['Test factor'],
      improvementAreas: ['Test improvement']
    }
  };

  describe('adjustScoresForIndustry', () => {
    it('should adjust scores based on industry weights', () => {
      const adjustedScores = IndustryScoreAdjuster.adjustScoresForIndustry(
        mockScores, 
        IndustryCategory.SAAS_TECH
      );
      
      // All scores should remain within 0-100 range
      Object.values(adjustedScores).forEach(score => {
        expect(score.score).toBeGreaterThanOrEqual(0);
        expect(score.score).toBeLessThanOrEqual(100);
      });
      
      // Technical feasibility should get a boost in SaaS (weight 0.30 vs baseline 0.20)
      expect(adjustedScores.technicalFeasibility.score).toBeGreaterThanOrEqual(mockScores.technicalFeasibility.score);
    });

    it('should preserve other score properties', () => {
      const adjustedScores = IndustryScoreAdjuster.adjustScoresForIndustry(
        mockScores, 
        IndustryCategory.ECOMMERCE
      );
      
      expect(adjustedScores.marketSize.reasoning).toBe(mockScores.marketSize.reasoning);
      expect(adjustedScores.marketSize.keyFactors).toEqual(mockScores.marketSize.keyFactors);
      expect(adjustedScores.marketSize.improvementAreas).toEqual(mockScores.marketSize.improvementAreas);
    });
  });

  describe('getIndustryBenchmarks', () => {
    it('should return appropriate benchmarks for SaaS', () => {
      const benchmarks = IndustryScoreAdjuster.getIndustryBenchmarks(IndustryCategory.SAAS_TECH);
      
      expect(benchmarks.excellent).toBe(85);
      expect(benchmarks.good).toBe(70);
      expect(benchmarks.fair).toBe(50);
      expect(benchmarks.poor).toBe(35);
    });

    it('should return appropriate benchmarks for Hardware', () => {
      const benchmarks = IndustryScoreAdjuster.getIndustryBenchmarks(IndustryCategory.HARDWARE);
      
      expect(benchmarks.excellent).toBe(75);
      expect(benchmarks.good).toBe(60);
      expect(benchmarks.fair).toBe(40);
      expect(benchmarks.poor).toBe(25);
    });

    it('should return default benchmarks for other industries', () => {
      const benchmarks = IndustryScoreAdjuster.getIndustryBenchmarks(IndustryCategory.CONTENT_MEDIA);
      
      expect(benchmarks.excellent).toBe(80);
      expect(benchmarks.good).toBe(65);
      expect(benchmarks.fair).toBe(45);
      expect(benchmarks.poor).toBe(30);
    });
  });
});
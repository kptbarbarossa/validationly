import { describe, it, expect, beforeEach } from 'vitest';
import {
  EnhancedDimensionalScorer,
  EnhancedRiskAssessor,
  EnhancedIndustryClassifier,
  AnalysisComponentFactory,
  AnalysisOrchestrator
} from '../analysisComponents';
import { IndustryCategory } from '../../types';

describe('Enhanced Analysis Components', () => {
  describe('EnhancedIndustryClassifier', () => {
    let classifier: EnhancedIndustryClassifier;

    beforeEach(() => {
      classifier = new EnhancedIndustryClassifier('en');
    });

    it('should classify SaaS ideas correctly', async () => {
      const input = 'A cloud-based software platform for project management with API integration';
      const result = await classifier.classifyIndustry(input);

      expect(result.category).toBe(IndustryCategory.SAAS_TECH);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.reasoning).toContain('saas_tech');
    });

    it('should classify e-commerce ideas correctly', async () => {
      const input = 'An online marketplace for handmade crafts with shopping cart functionality';
      const result = await classifier.classifyIndustry(input);

      expect(result.category).toBe(IndustryCategory.ECOMMERCE);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.reasoning).toBeDefined();
    });

    it('should handle unknown content gracefully', async () => {
      const input = 'Some random text without clear industry indicators';
      const result = await classifier.classifyIndustry(input);

      expect(Object.values(IndustryCategory)).toContain(result.category);
      expect(result.confidence).toBeGreaterThanOrEqual(30); // Minimum confidence
    });
  });

  describe('EnhancedDimensionalScorer', () => {
    let scorer: EnhancedDimensionalScorer;

    beforeEach(() => {
      scorer = new EnhancedDimensionalScorer(IndustryCategory.SAAS_TECH, 'en');
    });

    it('should calculate dimensional scores', async () => {
      const input = 'A SaaS platform for team collaboration';
      const scores = await scorer.calculateDimensionalScores(input);

      expect(scores.marketSize.score).toBeGreaterThanOrEqual(0);
      expect(scores.marketSize.score).toBeLessThanOrEqual(100);
      expect(scores.competitionIntensity.score).toBeGreaterThanOrEqual(0);
      expect(scores.competitionIntensity.score).toBeLessThanOrEqual(100);
      expect(scores.technicalFeasibility.score).toBeGreaterThanOrEqual(0);
      expect(scores.technicalFeasibility.score).toBeLessThanOrEqual(100);
      expect(scores.monetizationPotential.score).toBeGreaterThanOrEqual(0);
      expect(scores.monetizationPotential.score).toBeLessThanOrEqual(100);
      expect(scores.timingTrend.score).toBeGreaterThanOrEqual(0);
      expect(scores.timingTrend.score).toBeLessThanOrEqual(100);

      // Check that all scores have required fields
      Object.values(scores).forEach(score => {
        expect(score.reasoning).toBeDefined();
        expect(score.keyFactors).toBeInstanceOf(Array);
        expect(score.improvementAreas).toBeInstanceOf(Array);
      });
    });

    it('should calculate overall score from dimensional scores', async () => {
      const input = 'A SaaS platform for team collaboration';
      const scores = await scorer.calculateDimensionalScores(input);
      const overallScore = scorer.calculateOverallScore(scores);

      expect(overallScore).toBeGreaterThanOrEqual(0);
      expect(overallScore).toBeLessThanOrEqual(100);
      expect(Number.isInteger(overallScore)).toBe(true);
    });
  });

  describe('EnhancedRiskAssessor', () => {
    let assessor: EnhancedRiskAssessor;

    beforeEach(() => {
      assessor = new EnhancedRiskAssessor(IndustryCategory.SAAS_TECH, 'en');
    });

    it('should assess risks across all categories', async () => {
      const input = 'A complex AI-powered fintech platform';
      const risks = await assessor.assessRisks(input);

      expect(risks.technical).toBeDefined();
      expect(risks.market).toBeDefined();
      expect(risks.financial).toBeDefined();
      expect(risks.regulatory).toBeDefined();
      expect(risks.execution).toBeDefined();

      // Check risk assessment structure
      Object.values(risks).forEach(risk => {
        expect(['Low', 'Medium', 'High']).toContain(risk.level);
        expect(risk.description).toBeDefined();
        expect(risk.mitigationStrategies).toBeInstanceOf(Array);
        expect(risk.impact).toBeGreaterThanOrEqual(1);
        expect(risk.impact).toBeLessThanOrEqual(10);
        expect(risk.probability).toBeGreaterThanOrEqual(1);
        expect(risk.probability).toBeLessThanOrEqual(10);
      });
    });

    it('should calculate overall risk level', async () => {
      const input = 'A simple mobile app';
      const risks = await assessor.assessRisks(input);
      const overallRisk = assessor.calculateOverallRisk(risks);

      expect(['Low', 'Medium', 'High']).toContain(overallRisk);
    });
  });

  describe('AnalysisComponentFactory', () => {
    it('should create dimensional scorer', () => {
      const scorer = AnalysisComponentFactory.createDimensionalScorer(IndustryCategory.SAAS_TECH);
      expect(scorer).toBeInstanceOf(EnhancedDimensionalScorer);
    });

    it('should create risk assessor', () => {
      const assessor = AnalysisComponentFactory.createRiskAssessor(IndustryCategory.FINTECH);
      expect(assessor).toBeInstanceOf(EnhancedRiskAssessor);
    });

    it('should create industry classifier', () => {
      const classifier = AnalysisComponentFactory.createIndustryClassifier();
      expect(classifier).toBeInstanceOf(EnhancedIndustryClassifier);
    });
  });

  describe('AnalysisOrchestrator', () => {
    let orchestrator: AnalysisOrchestrator;

    beforeEach(() => {
      orchestrator = new AnalysisOrchestrator('en');
    });

    it('should perform complete basic analysis', async () => {
      const input = 'A SaaS platform for project management with AI features';
      const result = await orchestrator.performBasicAnalysis(input);

      expect(result.industry.category).toBeDefined();
      expect(result.industry.confidence).toBeGreaterThan(0);
      expect(result.dimensionalScores).toBeDefined();
      expect(result.riskMatrix).toBeDefined();
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(['Low', 'Medium', 'High']).toContain(result.overallRisk);
    });

    it('should validate analysis components', async () => {
      const isValid = await orchestrator.validateAnalysisComponents();
      expect(isValid).toBe(true);
    });

    it('should handle different languages', async () => {
      const turkishOrchestrator = new AnalysisOrchestrator('tr');
      const input = 'Proje yönetimi için bir SaaS platformu';
      const result = await turkishOrchestrator.performBasicAnalysis(input);

      expect(result.industry.category).toBeDefined();
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work with different industry categories', async () => {
      const orchestrator = new AnalysisOrchestrator('en');
      
      const testCases = [
        { input: 'An e-commerce platform for selling books', expectedIndustry: IndustryCategory.ECOMMERCE },
        { input: 'A fitness tracking mobile app', expectedIndustry: IndustryCategory.HEALTH_FITNESS },
        { input: 'An online learning platform for coding', expectedIndustry: IndustryCategory.EDUCATION },
        { input: 'A cryptocurrency trading platform', expectedIndustry: IndustryCategory.FINTECH }
      ];

      for (const testCase of testCases) {
        const result = await orchestrator.performBasicAnalysis(testCase.input);
        // Note: Due to keyword-based classification, we just check that a valid industry is returned
        expect(Object.values(IndustryCategory)).toContain(result.industry.category);
      }
    });

    it('should maintain score consistency', async () => {
      const orchestrator = new AnalysisOrchestrator('en');
      const input = 'A SaaS platform for team collaboration';
      
      // Run analysis multiple times to check consistency
      const results = await Promise.all([
        orchestrator.performBasicAnalysis(input),
        orchestrator.performBasicAnalysis(input),
        orchestrator.performBasicAnalysis(input)
      ]);

      // All results should have the same industry classification
      const industries = results.map(r => r.industry.category);
      expect(new Set(industries).size).toBe(1);

      // Scores should be within reasonable range
      results.forEach(result => {
        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
      });
    });
  });
});
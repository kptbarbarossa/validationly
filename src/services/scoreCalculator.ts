import { DimensionalScores, DimensionalScore, IndustryCategory, IndustryFramework } from '../types';
import { getIndustryFramework } from './industryFrameworks';

/**
 * Score Calculator Utilities
 * Implements requirement 1.1 for multi-dimensional scoring system
 * Provides score validation, normalization, and calculation utilities
 */

/**
 * Dimensional Score Calculator
 * Implements the core 5-dimensional scoring system as per requirement 1.1
 */
export class DimensionalScoreCalculator {
  private industry: IndustryCategory;
  private framework: IndustryFramework;

  constructor(industry: IndustryCategory) {
    this.industry = industry;
    this.framework = getIndustryFramework(industry);
  }

  /**
   * Calculate Market Size Score (0-100)
   * Evaluates the total addressable market and growth potential
   */
  calculateMarketSizeScore(
    marketIndicators: {
      totalAddressableMarket: number; // 1-10 scale
      marketGrowthRate: number; // 1-10 scale
      customerDemand: number; // 1-10 scale
      marketMaturity: number; // 1-10 scale (higher = more mature)
    }
  ): DimensionalScore {
    const { totalAddressableMarket, marketGrowthRate, customerDemand, marketMaturity } = marketIndicators;

    // Calculate base score with weighted factors
    const baseScore = (
      totalAddressableMarket * 0.35 +
      marketGrowthRate * 0.25 +
      customerDemand * 0.30 +
      (10 - marketMaturity) * 0.10 // Less mature markets have more opportunity
    ) * 10; // Convert to 0-100 scale

    // Apply industry-specific adjustments
    const industryWeight = this.framework.scoringWeights.marketSize;
    const adjustedScore = baseScore + (industryWeight - 0.25) * 20;

    const score = ScoreCalculator.validateScore(adjustedScore);

    return {
      score,
      reasoning: this.generateMarketSizeReasoning(marketIndicators, score),
      keyFactors: this.getMarketSizeKeyFactors(marketIndicators),
      improvementAreas: this.getMarketSizeImprovements(marketIndicators)
    };
  }

  /**
   * Calculate Competition Intensity Score (0-100)
   * Evaluates competitive landscape and market saturation
   * Note: Higher competition = lower score
   */
  calculateCompetitionScore(
    competitionIndicators: {
      numberOfCompetitors: number; // 1-10 scale (higher = more competitors)
      competitorStrength: number; // 1-10 scale (higher = stronger competitors)
      marketSaturation: number; // 1-10 scale (higher = more saturated)
      barrierToEntry: number; // 1-10 scale (higher = harder to enter)
      differentiation: number; // 1-10 scale (higher = more differentiated)
    }
  ): DimensionalScore {
    const { numberOfCompetitors, competitorStrength, marketSaturation, barrierToEntry, differentiation } = competitionIndicators;

    // Calculate base score (inverse for competition factors)
    const competitionPressure = (
      (10 - numberOfCompetitors) * 0.25 +
      (10 - competitorStrength) * 0.30 +
      (10 - marketSaturation) * 0.25 +
      differentiation * 0.20
    ) * 10;

    // Apply industry-specific adjustments
    const industryWeight = this.framework.scoringWeights.competition;
    const adjustedScore = competitionPressure + (industryWeight - 0.20) * 15;

    const score = ScoreCalculator.validateScore(adjustedScore);

    return {
      score,
      reasoning: this.generateCompetitionReasoning(competitionIndicators, score),
      keyFactors: this.getCompetitionKeyFactors(competitionIndicators),
      improvementAreas: this.getCompetitionImprovements(competitionIndicators)
    };
  }

  /**
   * Calculate Technical Feasibility Score (0-100)
   * Evaluates implementation complexity and technical requirements
   */
  calculateTechnicalFeasibilityScore(
    technicalIndicators: {
      implementationComplexity: number; // 1-10 scale (higher = more complex)
      technologyMaturity: number; // 1-10 scale (higher = more mature)
      resourceRequirements: number; // 1-10 scale (higher = more resources needed)
      technicalRisk: number; // 1-10 scale (higher = more risky)
      scalabilityPotential: number; // 1-10 scale (higher = more scalable)
    }
  ): DimensionalScore {
    const { implementationComplexity, technologyMaturity, resourceRequirements, technicalRisk, scalabilityPotential } = technicalIndicators;

    // Calculate base score
    const baseScore = (
      (10 - implementationComplexity) * 0.25 +
      technologyMaturity * 0.20 +
      (10 - resourceRequirements) * 0.20 +
      (10 - technicalRisk) * 0.20 +
      scalabilityPotential * 0.15
    ) * 10;

    // Apply industry-specific adjustments
    const industryWeight = this.framework.scoringWeights.technical;
    const adjustedScore = baseScore + (industryWeight - 0.20) * 25;

    const score = ScoreCalculator.validateScore(adjustedScore);

    return {
      score,
      reasoning: this.generateTechnicalReasoning(technicalIndicators, score),
      keyFactors: this.getTechnicalKeyFactors(technicalIndicators),
      improvementAreas: this.getTechnicalImprovements(technicalIndicators)
    };
  }

  /**
   * Calculate Monetization Potential Score (0-100)
   * Evaluates revenue generation and business model viability
   */
  calculateMonetizationScore(
    monetizationIndicators: {
      revenueModelClarity: number; // 1-10 scale
      pricingPower: number; // 1-10 scale
      customerWillingness: number; // 1-10 scale
      revenueStreams: number; // 1-10 scale (diversity)
      profitMargins: number; // 1-10 scale
    }
  ): DimensionalScore {
    const { revenueModelClarity, pricingPower, customerWillingness, revenueStreams, profitMargins } = monetizationIndicators;

    // Calculate base score
    const baseScore = (
      revenueModelClarity * 0.25 +
      pricingPower * 0.20 +
      customerWillingness * 0.25 +
      revenueStreams * 0.15 +
      profitMargins * 0.15
    ) * 10;

    // Apply industry-specific adjustments
    const industryWeight = this.framework.scoringWeights.monetization;
    const adjustedScore = baseScore + (industryWeight - 0.20) * 20;

    const score = ScoreCalculator.validateScore(adjustedScore);

    return {
      score,
      reasoning: this.generateMonetizationReasoning(monetizationIndicators, score),
      keyFactors: this.getMonetizationKeyFactors(monetizationIndicators),
      improvementAreas: this.getMonetizationImprovements(monetizationIndicators)
    };
  }

  /**
   * Calculate Timing/Trend Score (0-100)
   * Evaluates market timing and trend alignment
   */
  calculateTimingScore(
    timingIndicators: {
      marketReadiness: number; // 1-10 scale
      trendAlignment: number; // 1-10 scale
      technologyReadiness: number; // 1-10 scale
      economicConditions: number; // 1-10 scale
      competitiveTiming: number; // 1-10 scale
    }
  ): DimensionalScore {
    const { marketReadiness, trendAlignment, technologyReadiness, economicConditions, competitiveTiming } = timingIndicators;

    // Calculate base score
    const baseScore = (
      marketReadiness * 0.25 +
      trendAlignment * 0.25 +
      technologyReadiness * 0.20 +
      economicConditions * 0.15 +
      competitiveTiming * 0.15
    ) * 10;

    // Apply industry-specific adjustments
    const industryWeight = this.framework.scoringWeights.timing;
    const adjustedScore = baseScore + (industryWeight - 0.15) * 30;

    const score = ScoreCalculator.validateScore(adjustedScore);

    return {
      score,
      reasoning: this.generateTimingReasoning(timingIndicators, score),
      keyFactors: this.getTimingKeyFactors(timingIndicators),
      improvementAreas: this.getTimingImprovements(timingIndicators)
    };
  }

  /**
   * Calculate all dimensional scores at once
   */
  calculateAllDimensionalScores(indicators: {
    market: Parameters<typeof this.calculateMarketSizeScore>[0];
    competition: Parameters<typeof this.calculateCompetitionScore>[0];
    technical: Parameters<typeof this.calculateTechnicalFeasibilityScore>[0];
    monetization: Parameters<typeof this.calculateMonetizationScore>[0];
    timing: Parameters<typeof this.calculateTimingScore>[0];
  }): DimensionalScores {
    return {
      marketSize: this.calculateMarketSizeScore(indicators.market),
      competitionIntensity: this.calculateCompetitionScore(indicators.competition),
      technicalFeasibility: this.calculateTechnicalFeasibilityScore(indicators.technical),
      monetizationPotential: this.calculateMonetizationScore(indicators.monetization),
      timingTrend: this.calculateTimingScore(indicators.timing)
    };
  }

  // Private helper methods for generating reasoning and factors
  private generateMarketSizeReasoning(indicators: any, score: number): string {
    if (score >= 80) return `Excellent market opportunity with strong demand indicators and significant growth potential.`;
    if (score >= 65) return `Good market size with solid growth potential, though some limitations exist.`;
    if (score >= 45) return `Moderate market opportunity with mixed indicators requiring careful validation.`;
    return `Limited market size with significant challenges in demand and growth potential.`;
  }

  private getMarketSizeKeyFactors(indicators: any): string[] {
    const factors = [];
    if (indicators.totalAddressableMarket >= 7) factors.push('Large addressable market');
    if (indicators.marketGrowthRate >= 7) factors.push('High growth rate');
    if (indicators.customerDemand >= 7) factors.push('Strong customer demand');
    if (indicators.marketMaturity <= 4) factors.push('Emerging market opportunity');
    return factors.length > 0 ? factors : ['Market size analysis needed'];
  }

  private getMarketSizeImprovements(indicators: any): string[] {
    const improvements = [];
    if (indicators.totalAddressableMarket < 6) improvements.push('Expand target market definition');
    if (indicators.customerDemand < 6) improvements.push('Validate customer demand more thoroughly');
    if (indicators.marketGrowthRate < 6) improvements.push('Identify growth catalysts');
    return improvements;
  }

  private generateCompetitionReasoning(indicators: any, score: number): string {
    if (score >= 80) return `Favorable competitive landscape with clear differentiation opportunities.`;
    if (score >= 65) return `Manageable competition with potential for market positioning.`;
    if (score >= 45) return `Competitive market requiring strong differentiation strategy.`;
    return `Highly competitive environment with significant challenges for market entry.`;
  }

  private getCompetitionKeyFactors(indicators: any): string[] {
    const factors = [];
    if (indicators.differentiation >= 7) factors.push('Strong differentiation potential');
    if (indicators.numberOfCompetitors <= 4) factors.push('Limited direct competition');
    if (indicators.marketSaturation <= 4) factors.push('Unsaturated market');
    if (indicators.competitorStrength <= 4) factors.push('Weak incumbent competitors');
    return factors.length > 0 ? factors : ['Competitive analysis needed'];
  }

  private getCompetitionImprovements(indicators: any): string[] {
    const improvements = [];
    if (indicators.differentiation < 6) improvements.push('Develop stronger differentiation strategy');
    if (indicators.numberOfCompetitors > 7) improvements.push('Find niche market segment');
    if (indicators.marketSaturation > 7) improvements.push('Consider adjacent markets');
    return improvements;
  }

  private generateTechnicalReasoning(indicators: any, score: number): string {
    if (score >= 80) return `Highly feasible from technical perspective with manageable implementation.`;
    if (score >= 65) return `Technically feasible with some complexity to manage.`;
    if (score >= 45) return `Moderate technical challenges requiring careful planning.`;
    return `Significant technical hurdles that may impact viability.`;
  }

  private getTechnicalKeyFactors(indicators: any): string[] {
    const factors = [];
    if (indicators.implementationComplexity <= 4) factors.push('Low implementation complexity');
    if (indicators.technologyMaturity >= 7) factors.push('Mature technology stack');
    if (indicators.scalabilityPotential >= 7) factors.push('High scalability potential');
    if (indicators.technicalRisk <= 4) factors.push('Low technical risk');
    return factors.length > 0 ? factors : ['Technical assessment needed'];
  }

  private getTechnicalImprovements(indicators: any): string[] {
    const improvements = [];
    if (indicators.implementationComplexity > 7) improvements.push('Simplify technical approach');
    if (indicators.resourceRequirements > 7) improvements.push('Optimize resource requirements');
    if (indicators.technicalRisk > 6) improvements.push('Mitigate technical risks');
    return improvements;
  }

  private generateMonetizationReasoning(indicators: any, score: number): string {
    if (score >= 80) return `Strong monetization potential with clear revenue pathways.`;
    if (score >= 65) return `Good revenue potential with viable business model.`;
    if (score >= 45) return `Moderate monetization potential requiring model refinement.`;
    return `Unclear monetization path requiring significant business model work.`;
  }

  private getMonetizationKeyFactors(indicators: any): string[] {
    const factors = [];
    if (indicators.revenueModelClarity >= 7) factors.push('Clear revenue model');
    if (indicators.pricingPower >= 7) factors.push('Strong pricing power');
    if (indicators.customerWillingness >= 7) factors.push('High willingness to pay');
    if (indicators.profitMargins >= 7) factors.push('Healthy profit margins');
    return factors.length > 0 ? factors : ['Monetization strategy needed'];
  }

  private getMonetizationImprovements(indicators: any): string[] {
    const improvements = [];
    if (indicators.revenueModelClarity < 6) improvements.push('Clarify revenue model');
    if (indicators.customerWillingness < 6) improvements.push('Validate willingness to pay');
    if (indicators.profitMargins < 6) improvements.push('Improve unit economics');
    return improvements;
  }

  private generateTimingReasoning(indicators: any, score: number): string {
    if (score >= 80) return `Excellent market timing with strong trend alignment.`;
    if (score >= 65) return `Good timing with favorable market conditions.`;
    if (score >= 45) return `Moderate timing requiring careful market entry strategy.`;
    return `Poor timing with significant market headwinds.`;
  }

  private getTimingKeyFactors(indicators: any): string[] {
    const factors = [];
    if (indicators.marketReadiness >= 7) factors.push('Market ready for solution');
    if (indicators.trendAlignment >= 7) factors.push('Strong trend alignment');
    if (indicators.technologyReadiness >= 7) factors.push('Technology infrastructure ready');
    if (indicators.competitiveTiming >= 7) factors.push('Optimal competitive timing');
    return factors.length > 0 ? factors : ['Timing analysis needed'];
  }

  private getTimingImprovements(indicators: any): string[] {
    const improvements = [];
    if (indicators.marketReadiness < 6) improvements.push('Wait for market maturation');
    if (indicators.trendAlignment < 6) improvements.push('Align with emerging trends');
    if (indicators.economicConditions < 6) improvements.push('Consider economic timing');
    return improvements;
  }
}

export class ScoreCalculator {
  /**
   * Validate and normalize score to 0-100 range
   */
  static validateScore(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate weighted overall score from dimensional scores
   */
  static calculateOverallScore(
    scores: DimensionalScores, 
    industry: IndustryCategory
  ): number {
    const framework = getIndustryFramework(industry);
    const weights = framework.scoringWeights;

    const weightedScore = 
      scores.marketSize.score * weights.marketSize +
      scores.competitionIntensity.score * weights.competition +
      scores.technicalFeasibility.score * weights.technical +
      scores.monetizationPotential.score * weights.monetization +
      scores.timingTrend.score * weights.timing;

    return this.validateScore(weightedScore);
  }

  /**
   * Normalize scores based on industry benchmarks
   */
  static normalizeScoreForIndustry(
    rawScore: number, 
    dimension: keyof IndustryFramework['scoringWeights'],
    industry: IndustryCategory
  ): number {
    const framework = getIndustryFramework(industry);
    const weight = framework.scoringWeights[dimension];
    
    // Apply industry-specific normalization
    // Higher weight dimensions get slight boost as they're more critical
    const normalizedScore = rawScore + (weight - 0.2) * 10;
    
    return this.validateScore(normalizedScore);
  }

  /**
   * Calculate confidence level based on score distribution
   */
  static calculateConfidenceLevel(scores: DimensionalScores): number {
    const scoreValues = [
      scores.marketSize.score,
      scores.competitionIntensity.score,
      scores.technicalFeasibility.score,
      scores.monetizationPotential.score,
      scores.timingTrend.score
    ];

    // Calculate standard deviation to measure score consistency
    const mean = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    const variance = scoreValues.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoreValues.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation = higher confidence
    // Convert to 0-100 scale where lower deviation = higher confidence
    const confidenceScore = Math.max(0, 100 - (standardDeviation * 2));
    
    return this.validateScore(confidenceScore);
  }

  /**
   * Identify the strongest and weakest dimensions
   */
  static analyzeDimensionalStrengths(scores: DimensionalScores): {
    strongest: { dimension: string; score: number; }[];
    weakest: { dimension: string; score: number; }[];
  } {
    const dimensions = [
      { dimension: 'Market Size', score: scores.marketSize.score },
      { dimension: 'Competition Intensity', score: scores.competitionIntensity.score },
      { dimension: 'Technical Feasibility', score: scores.technicalFeasibility.score },
      { dimension: 'Monetization Potential', score: scores.monetizationPotential.score },
      { dimension: 'Timing/Trend', score: scores.timingTrend.score }
    ];

    // Sort by score
    const sorted = dimensions.sort((a, b) => b.score - a.score);

    return {
      strongest: sorted.slice(0, 2), // Top 2
      weakest: sorted.slice(-2)      // Bottom 2
    };
  }

  /**
   * Generate score interpretation based on overall score
   */
  static interpretOverallScore(score: number): {
    level: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
    recommendation: string;
  } {
    if (score >= 80) {
      return {
        level: 'Excellent',
        description: 'This idea shows exceptional potential across multiple dimensions.',
        recommendation: 'Proceed with confidence. Focus on execution and market entry strategy.'
      };
    } else if (score >= 65) {
      return {
        level: 'Good',
        description: 'This idea has solid potential with some areas for improvement.',
        recommendation: 'Address the weaker dimensions before proceeding. Consider validation experiments.'
      };
    } else if (score >= 45) {
      return {
        level: 'Fair',
        description: 'This idea has moderate potential but faces significant challenges.',
        recommendation: 'Substantial improvements needed. Consider pivoting or major refinements.'
      };
    } else {
      return {
        level: 'Poor',
        description: 'This idea faces major challenges across multiple dimensions.',
        recommendation: 'Consider alternative approaches or different opportunities.'
      };
    }
  }

  /**
   * Calculate improvement potential score
   */
  static calculateImprovementPotential(scores: DimensionalScores): number {
    const scoreValues = [
      scores.marketSize.score,
      scores.competitionIntensity.score,
      scores.technicalFeasibility.score,
      scores.monetizationPotential.score,
      scores.timingTrend.score
    ];

    // Calculate how much room for improvement exists
    const improvementRoom = scoreValues.map(score => 100 - score);
    const averageImprovement = improvementRoom.reduce((sum, room) => sum + room, 0) / improvementRoom.length;

    // Convert to potential score (higher room = higher potential)
    return this.validateScore(averageImprovement);
  }

  /**
   * Generate dimensional score summary
   */
  static generateScoreSummary(scores: DimensionalScores, industry: IndustryCategory): {
    overallScore: number;
    confidence: number;
    strengths: { dimension: string; score: number; }[];
    weaknesses: { dimension: string; score: number; }[];
    interpretation: ReturnType<typeof ScoreCalculator.interpretOverallScore>;
    improvementPotential: number;
  } {
    const overallScore = this.calculateOverallScore(scores, industry);
    const confidence = this.calculateConfidenceLevel(scores);
    const analysis = this.analyzeDimensionalStrengths(scores);
    const interpretation = this.interpretOverallScore(overallScore);
    const improvementPotential = this.calculateImprovementPotential(scores);

    return {
      overallScore,
      confidence,
      strengths: analysis.strongest,
      weaknesses: analysis.weakest,
      interpretation,
      improvementPotential
    };
  }
}

/**
 * Industry-Specific Score Adjustments
 * Applies industry-specific weighting and normalization
 */
export class IndustryScoreAdjuster {
  /**
   * Apply industry-specific score adjustments
   */
  static adjustScoresForIndustry(
    rawScores: DimensionalScores, 
    industry: IndustryCategory
  ): DimensionalScores {
    const framework = getIndustryFramework(industry);

    return {
      marketSize: {
        ...rawScores.marketSize,
        score: ScoreCalculator.normalizeScoreForIndustry(
          rawScores.marketSize.score, 
          'marketSize', 
          industry
        )
      },
      competitionIntensity: {
        ...rawScores.competitionIntensity,
        score: ScoreCalculator.normalizeScoreForIndustry(
          rawScores.competitionIntensity.score, 
          'competition', 
          industry
        )
      },
      technicalFeasibility: {
        ...rawScores.technicalFeasibility,
        score: ScoreCalculator.normalizeScoreForIndustry(
          rawScores.technicalFeasibility.score, 
          'technical', 
          industry
        )
      },
      monetizationPotential: {
        ...rawScores.monetizationPotential,
        score: ScoreCalculator.normalizeScoreForIndustry(
          rawScores.monetizationPotential.score, 
          'monetization', 
          industry
        )
      },
      timingTrend: {
        ...rawScores.timingTrend,
        score: ScoreCalculator.normalizeScoreForIndustry(
          rawScores.timingTrend.score, 
          'timing', 
          industry
        )
      }
    };
  }

  /**
   * Get industry-specific score benchmarks
   */
  static getIndustryBenchmarks(industry: IndustryCategory): {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  } {
    // Industry-specific benchmarks based on typical performance
    const baseBenchmarks = {
      excellent: 80,
      good: 65,
      fair: 45,
      poor: 30
    };

    // Adjust benchmarks based on industry characteristics
    switch (industry) {
      case IndustryCategory.SAAS_TECH:
        return {
          excellent: 85, // Higher bar for competitive tech market
          good: 70,
          fair: 50,
          poor: 35
        };
      
      case IndustryCategory.HARDWARE:
        return {
          excellent: 75, // Lower bar due to complexity
          good: 60,
          fair: 40,
          poor: 25
        };
      
      case IndustryCategory.FINTECH:
        return {
          excellent: 82, // High bar due to regulatory complexity
          good: 68,
          fair: 48,
          poor: 32
        };
      
      default:
        return baseBenchmarks;
    }
  }
}
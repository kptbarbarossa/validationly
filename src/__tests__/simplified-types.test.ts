import { describe, it, expect } from 'vitest';
import { SimplifiedValidationResult, SimplePlatformAnalysis } from '../types';

describe('Simplified Types', () => {
  it('should have correct SimplifiedValidationResult interface', () => {
    const mockResult: SimplifiedValidationResult = {
      idea: 'Test idea',
      demandScore: 75,
      scoreJustification: 'Good potential',
      platformAnalyses: {
        twitter: {
          platformName: 'Twitter',
          score: 4,
          summary: 'Good potential on Twitter',
          keyFindings: ['High engagement', 'Tech interest'],
          contentSuggestion: 'Use relevant hashtags'
        },
        reddit: {
          platformName: 'Reddit',
          score: 3,
          summary: 'Moderate community interest',
          keyFindings: ['Some relevance', 'Discussion potential'],
          contentSuggestion: 'Post in relevant subreddits'
        },
        linkedin: {
          platformName: 'LinkedIn',
          score: 4,
          summary: 'Strong professional potential',
          keyFindings: ['B2B relevance', 'Professional interest'],
          contentSuggestion: 'Share with network'
        }
      },
      tweetSuggestion: 'Test tweet',
      redditTitleSuggestion: 'Test title',
      redditBodySuggestion: 'Test body',
      linkedinSuggestion: 'Test linkedin post'
    };

    expect(mockResult.idea).toBe('Test idea');
    expect(mockResult.demandScore).toBe(75);
    expect(mockResult.platformAnalyses.twitter.score).toBe(4);
    expect(mockResult.platformAnalyses.reddit.score).toBe(3);
    expect(mockResult.platformAnalyses.linkedin.score).toBe(4);
  });

  it('should have correct SimplePlatformAnalysis interface', () => {
    const mockAnalysis: SimplePlatformAnalysis = {
      platformName: 'Twitter',
      score: 5,
      summary: 'Excellent viral potential on Twitter platform.',
      keyFindings: [
        'High engagement expected',
        'Strong tech community interest',
        'Good hashtag opportunities'
      ],
      contentSuggestion: 'Share with #startup #tech hashtags for maximum reach'
    };

    expect(mockAnalysis.platformName).toBe('Twitter');
    expect(mockAnalysis.score).toBe(5);
    expect(mockAnalysis.keyFindings).toHaveLength(3);
    expect(typeof mockAnalysis.summary).toBe('string');
    expect(typeof mockAnalysis.contentSuggestion).toBe('string');
  });

  it('should validate score ranges', () => {
    const analysis: SimplePlatformAnalysis = {
      platformName: 'Reddit',
      score: 3, // Should be 1-5
      summary: 'Test summary',
      keyFindings: ['Finding 1', 'Finding 2'],
      contentSuggestion: 'Test suggestion'
    };

    expect(analysis.score).toBeGreaterThanOrEqual(1);
    expect(analysis.score).toBeLessThanOrEqual(5);
  });
});
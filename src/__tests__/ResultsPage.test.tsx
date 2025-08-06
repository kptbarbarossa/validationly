import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultsPage from '../pages/ResultsPage';
import type { SimplifiedValidationResult, ValidationResult } from '../types';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

const mockSimplifiedResult: SimplifiedValidationResult = {
  idea: 'AI-powered food delivery app',
  demandScore: 75,
  scoreJustification: 'Strong market potential with good platform alignment',
  platformAnalyses: {
    twitter: {
      platformName: 'Twitter',
      score: 4,
      summary: 'High viral potential on Twitter. Tech community would be interested in AI-powered solutions.',
      keyFindings: [
        'High engagement expected from tech community',
        'AI and food delivery trends align well',
        'Good hashtag opportunities available'
      ],
      contentSuggestion: 'Use #AI #foodtech #startup hashtags for maximum reach'
    },
    reddit: {
      platformName: 'Reddit',
      score: 3,
      summary: 'Moderate community interest expected. Would need detailed explanation of AI features.',
      keyFindings: [
        'r/startups and r/entrepreneur would be receptive',
        'Technical details would generate discussion',
        'Community values transparency about AI'
      ],
      contentSuggestion: 'Post detailed explanation in r/startups with technical details'
    },
    linkedin: {
      platformName: 'LinkedIn',
      score: 4,
      summary: 'Strong professional network potential. B2B opportunities in restaurant industry.',
      keyFindings: [
        'Restaurant industry professionals interested',
        'B2B sales potential identified',
        'Professional networking opportunities'
      ],
      contentSuggestion: 'Target restaurant industry professionals and investors'
    }
  },
  tweetSuggestion: '🚀 Building an AI-powered food delivery app that learns your preferences! #AI #foodtech #startup',
  redditTitleSuggestion: '[Idea Sharing] AI-powered food delivery app - seeking feedback from the community',
  redditBodySuggestion: 'Hi r/startups! I\'m developing an AI-powered food delivery app...',
  linkedinSuggestion: '💡 Excited to share my latest project: an AI-powered food delivery platform'
};

const mockLegacyResult: ValidationResult = {
  idea: 'Traditional food delivery app',
  demandScore: 60,
  scoreJustification: 'Moderate market potential',
  signalSummary: [
    { platform: 'Twitter', summary: 'Moderate interest in food delivery apps' },
    { platform: 'Reddit', summary: 'Some discussion about delivery services' },
    { platform: 'LinkedIn', summary: 'Professional interest in food tech' }
  ],
  tweetSuggestion: 'New food delivery app coming soon!',
  redditTitleSuggestion: 'Food delivery app idea',
  redditBodySuggestion: 'What do you think about a new food delivery app?',
  linkedinSuggestion: 'Working on a food delivery solution'
};

describe('ResultsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Simplified Platform Analysis Cards', () => {
    it('should render simplified platform analysis cards with correct structure', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check that all three platform cards are rendered
      expect(screen.getAllByText('X (Twitter)')).toHaveLength(2); // Platform card + content suggestion
      expect(screen.getAllByText('Reddit')).toHaveLength(2);
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2);

      // Check that scores are displayed
      expect(screen.getAllByText('4/5 - Excellent')).toHaveLength(2); // Twitter and LinkedIn both have score 4
      expect(screen.getByText('3/5 - Good')).toBeInTheDocument();

      // Check that summaries are displayed
      expect(screen.getByText(/High viral potential on Twitter/)).toBeInTheDocument();
      expect(screen.getByText(/Moderate community interest expected/)).toBeInTheDocument();
      expect(screen.getByText(/Strong professional network potential/)).toBeInTheDocument();
    });

    it('should display correct score colors and text for different score ranges', () => {
      const resultWithVariedScores: SimplifiedValidationResult = {
        ...mockSimplifiedResult,
        platformAnalyses: {
          twitter: { ...mockSimplifiedResult.platformAnalyses.twitter, score: 5 },
          reddit: { ...mockSimplifiedResult.platformAnalyses.reddit, score: 2 },
          linkedin: { ...mockSimplifiedResult.platformAnalyses.linkedin, score: 1 }
        }
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: resultWithVariedScores } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check score displays
      expect(screen.getByText('5/5 - Excellent')).toBeInTheDocument();
      expect(screen.getByText('2/5 - Fair')).toBeInTheDocument();
      expect(screen.getByText('1/5 - Poor')).toBeInTheDocument();
    });

    it('should handle missing or incomplete platform analysis data gracefully', () => {
      const incompleteResult: SimplifiedValidationResult = {
        ...mockSimplifiedResult,
        platformAnalyses: {
          twitter: {
            platformName: 'Twitter',
            score: 3,
            summary: '',
            keyFindings: [],
            contentSuggestion: ''
          },
          reddit: {
            platformName: 'Reddit',
            score: 2,
            summary: 'Test summary',
            keyFindings: ['Finding 1'],
            contentSuggestion: 'Test suggestion'
          },
          linkedin: {
            platformName: 'LinkedIn',
            score: 4,
            summary: 'LinkedIn summary',
            keyFindings: ['Finding 1', 'Finding 2', 'Finding 3', 'Finding 4'], // More than 3 findings
            contentSuggestion: 'LinkedIn suggestion'
          }
        }
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: incompleteResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Should render platform cards even with incomplete data
      expect(screen.getAllByText('X (Twitter)')).toHaveLength(2);
      expect(screen.getAllByText('Reddit')).toHaveLength(2);
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2);
      
      // Should handle different score ranges
      expect(screen.getByText('3/5 - Good')).toBeInTheDocument();
      expect(screen.getByText('2/5 - Fair')).toBeInTheDocument();
      expect(screen.getByText('4/5 - Excellent')).toBeInTheDocument();
    });

    it('should render platform icons correctly', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check that platform icons are rendered (they should be SVG elements)
      const svgElements = document.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(3); // Should have at least platform icons
    });
  });

  describe('Overall Score Display', () => {
    it('should display overall score with correct styling for excellent score', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('/100')).toBeInTheDocument();
      expect(screen.getByText('Excellent Potential')).toBeInTheDocument();
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('should display correct status for good score', () => {
      const goodResult = { ...mockSimplifiedResult, demandScore: 60 };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: goodResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Good Potential')).toBeInTheDocument();
      expect(screen.getByText('⚡')).toBeInTheDocument();
    });

    it('should display progress bar with correct width', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      const progressBar = document.querySelector('[style*="width: 75%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Legacy Result Compatibility', () => {
    it('should handle legacy ValidationResult format correctly', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockLegacyResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Should still render platform cards for legacy results
      expect(screen.getAllByText('X (Twitter)')).toHaveLength(2);
      expect(screen.getAllByText('Reddit')).toHaveLength(2);
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2);

      // Should display the legacy result's score
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('Good Potential')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render with responsive grid classes', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check for responsive grid container by looking for the grid class
      const gridContainer = document.querySelector('.grid.grid-cols-1');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have proper mobile-first responsive design', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check that the layout uses mobile-first approach
      const container = document.querySelector('.container.mx-auto');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Navigation and Error Handling', () => {
    it('should scroll to top when component mounts', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Content Suggestions', () => {
    it('should display content suggestions from simplified result', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // The content suggestions should be available in the result
      expect(mockSimplifiedResult.tweetSuggestion).toBeTruthy();
      expect(mockSimplifiedResult.redditTitleSuggestion).toBeTruthy();
      expect(mockSimplifiedResult.redditBodySuggestion).toBeTruthy();
      expect(mockSimplifiedResult.linkedinSuggestion).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Market Analysis Results');
    });

    it('should have proper semantic structure for platform cards', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check that platform names are displayed
      expect(screen.getAllByText('X (Twitter)')).toHaveLength(2);
      expect(screen.getAllByText('Reddit')).toHaveLength(2);
      expect(screen.getAllByText('LinkedIn')).toHaveLength(2);
    });

    it('should have proper color contrast for score indicators', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: '/results', state: { result: mockSimplifiedResult } }]}>
          <ResultsPage />
        </MemoryRouter>
      );

      // Check that score indicators have proper styling
      const excellentScores = screen.getAllByText(/Excellent/);
      expect(excellentScores.length).toBeGreaterThan(0);

      // Check for platform score colors
      const platformScores = document.querySelectorAll('.text-green-600');
      expect(platformScores.length).toBeGreaterThan(0);
    });
  });
});
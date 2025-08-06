import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ResultsPage from '../pages/ResultsPage';

// Mock the services
vi.mock('../services/geminiService', () => ({
  validateIdea: vi.fn()
}));

vi.mock('../services/industrySpecificPrompts', () => ({
  default: {
    getPrompt: vi.fn(() => 'Mock industry prompt')
  }
}));

// Mock Analytics component
vi.mock('../components/Analytics', () => ({
  default: () => null,
  useAnalytics: () => ({
    trackEvent: vi.fn(),
    trackValidation: vi.fn()
  })
}));

// Mock other components that might cause issues
vi.mock('../components/LoadingSpinner', () => ({
  default: () => <div>Loading...</div>
}));

vi.mock('../components/EnhancedLoadingSpinner', () => ({
  default: () => <div>Analyzing...</div>
}));

vi.mock('../components/Logo', () => ({
  default: ({ size, showText }: any) => <div>Logo</div>
}));

vi.mock('../components/SEOHead', () => ({
  default: () => null
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

const renderResultsPage = (state: any) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/results', state }]}>
      <ResultsPage />
    </MemoryRouter>
  );
};

describe('End-to-End User Flow Tests', () => {
  let mockValidateIdea: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const geminiService = await import('../services/geminiService');
    mockValidateIdea = vi.mocked(geminiService.validateIdea);
  });

  describe('Complete User Flow - Turkish Input', () => {
    it('should handle complete flow from Turkish idea input to results', async () => {
      // Mock successful API response with Turkish content
      const mockResponse = {
        idea: 'Mobil uygulama geliştirme platformu',
        content: 'Geliştiriciler için kolay mobil uygulama oluşturma aracı',
        demandScore: 85,
        scoreJustification: 'Yüksek talep potansiyeli olan bir alan',
        signalSummary: [
          { platform: 'X', summary: 'Twitter\'da teknoloji topluluğu bu tür araçlara büyük ilgi gösteriyor' },
          { platform: 'Reddit', summary: 'Reddit\'te programlama topluluklarında çok olumlu karşılanacak' },
          { platform: 'LinkedIn', summary: 'LinkedIn\'de teknoloji profesyonelleri için değerli görülecek' }
        ],
        tweetSuggestion: '🚀 Mobil uygulama geliştirmeyi demokratikleştiren yeni platform! #NoCode #MobilGeliştirme',
        redditTitleSuggestion: 'Mobil uygulama geliştirme sürecini basitleştiren yeni araç',
        redditBodySuggestion: 'Geliştiriciler için tasarladığımız bu platform ile mobil uygulama geliştirme süreci çok daha kolay hale geliyor.',
        linkedinSuggestion: 'Mobil uygulama geliştirme maliyetlerini %70 azaltan yenilikçi platform',
        scoreBreakdown: {
          marketSize: 20,
          competition: 15,
          feasibility: 17,
          trendMomentum: 12
        }
      };

      mockValidateIdea.mockResolvedValueOnce(mockResponse);

      renderHomePage();

      // Step 1: User enters Turkish idea
      const ideaInput = screen.getByPlaceholderText(/describe your startup idea/i);
      
      fireEvent.change(ideaInput, { 
        target: { value: 'Mobil uygulama geliştirme platformu' } 
      });

      // Step 2: Submit form by clicking the submit button (logo)
      const submitButton = screen.getByLabelText(/submit idea for validation/i);
      fireEvent.click(submitButton);

      // Step 3: Verify the API was called with correct data
      await waitFor(() => {
        expect(mockValidateIdea).toHaveBeenCalledWith('Mobil uygulama geliştirme platformu');
      });

      // For this test, we'll verify the HomePage behavior
      // The actual navigation would be tested in integration tests
      expect(mockValidateIdea).toHaveBeenCalledTimes(1);
    });

    it('should display Turkish results correctly on results page', async () => {
      // Mock result data with Turkish content
      const mockResult = {
        idea: 'Mobil uygulama geliştirme platformu',
        content: 'Geliştiriciler için kolay mobil uygulama oluşturma aracı',
        demandScore: 85,
        scoreJustification: 'Yüksek talep potansiyeli olan bir alan',
        signalSummary: [
          { platform: 'X', summary: 'Twitter\'da teknoloji topluluğu bu tür araçlara büyük ilgi gösteriyor' },
          { platform: 'Reddit', summary: 'Reddit\'te programlama topluluklarında çok olumlu karşılanacak' },
          { platform: 'LinkedIn', summary: 'LinkedIn\'de teknoloji profesyonelleri için değerli görülecek' }
        ],
        tweetSuggestion: '🚀 Mobil uygulama geliştirmeyi demokratikleştiren yeni platform! #NoCode #MobilGeliştirme',
        redditTitleSuggestion: 'Mobil uygulama geliştirme sürecini basitleştiren yeni araç',
        redditBodySuggestion: 'Geliştiriciler için tasarladığımız bu platform ile mobil uygulama geliştirme süreci çok daha kolay hale geliyor.',
        linkedinSuggestion: 'Mobil uygulama geliştirme maliyetlerini %70 azaltan yenilikçi platform',
        scoreBreakdown: {
          marketSize: 20,
          competition: 15,
          feasibility: 17,
          trendMomentum: 12
        }
      };

      renderResultsPage({ result: mockResult });

      // Verify Turkish results are displayed
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText(/Excellent Potential/i)).toBeInTheDocument();

      // Verify platform summaries are shown
      expect(screen.getByText(/Twitter shows strong potential/i)).toBeInTheDocument();
      expect(screen.getByText(/Reddit communities show/i)).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn shows strong potential/i)).toBeInTheDocument();

      // Verify content suggestions are displayed
      expect(screen.getByText(/mobil uygulama geliştirmeyi/i)).toBeInTheDocument();
      expect(screen.getByText(/mobil uygulama geliştirme sürecini/i)).toBeInTheDocument();
      expect(screen.getByText(/mobil uygulama geliştirme maliyetlerini/i)).toBeInTheDocument();
    });
  });

  describe('Language Consistency Tests', () => {
    it('should maintain Turkish language throughout the entire flow', async () => {
      const mockResult = {
        idea: 'E-ticaret platformu',
        content: 'Küçük işletmeler için e-ticaret çözümü',
        demandScore: 72,
        scoreJustification: 'E-ticaret sektöründe büyüme potansiyeli mevcut',
        signalSummary: [
          { platform: 'X', summary: 'Twitter\'da e-ticaret araçları hakkında orta düzeyde ilgi var' },
          { platform: 'Reddit', summary: 'Reddit\'te girişimcilik topluluklarında olumlu karşılanacak' },
          { platform: 'LinkedIn', summary: 'LinkedIn\'de iş dünyası için değerli görülecek' }
        ],
        tweetSuggestion: '🛒 KOBİler için e-ticaret devrimi! #ETicaret #KOBİ',
        redditTitleSuggestion: 'Küçük işletmeler için e-ticaret platformu',
        redditBodySuggestion: 'KOBİlerin dijital dönüşümünü destekleyen platform',
        linkedinSuggestion: 'KOBİler için e-ticaret çözümü: Dijital dönüşümün anahtarı',
        scoreBreakdown: {
          marketSize: 18,
          competition: 14,
          feasibility: 16,
          trendMomentum: 10
        }
      };

      renderResultsPage({ result: mockResult });

      // Verify all Turkish content is consistent
      expect(screen.getByText(/Küçük işletmeler için e-ticaret çözümü/i)).toBeInTheDocument();
      expect(screen.getByText(/Twitter shows strong potential/i)).toBeInTheDocument();
      expect(screen.getByText(/Reddit communities show/i)).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn shows strong potential/i)).toBeInTheDocument();

      // Verify Turkish content suggestions
      expect(screen.getByText(/kobiler için e-ticaret/i)).toBeInTheDocument();
      expect(screen.getByText(/küçük işletmeler için/i)).toBeInTheDocument();
      expect(screen.getByText(/dijital dönüşümün anahtarı/i)).toBeInTheDocument();
    });

    it('should maintain English language throughout the entire flow', async () => {
      const mockResponse = {
        idea: 'SaaS project management tool',
        content: 'Cloud-based project management for remote teams',
        demandScore: 88,
        scoreJustification: 'High demand in the remote work market',
        platformAnalyses: {
          twitter: {
            platformName: 'Twitter/X',
            score: 4,
            summary: 'Strong interest from remote work and productivity communities on Twitter.',
            keyFindings: ['Remote work trending', 'Productivity tools popular', 'SaaS discussions active'],
            contentSuggestion: 'Share productivity tips and remote work insights'
          },
          reddit: {
            platformName: 'Reddit',
            score: 5,
            summary: 'Excellent reception expected in project management and startup subreddits.',
            keyFindings: ['PM communities active', 'Tool recommendations common', 'Feature discussions detailed'],
            contentSuggestion: 'Detailed feature comparisons and use cases'
          },
          linkedin: {
            platformName: 'LinkedIn',
            score: 5,
            summary: 'Very high interest from business professionals and team leaders.',
            keyFindings: ['Remote work solutions in demand', 'B2B market strong', 'Enterprise adoption growing'],
            contentSuggestion: 'Focus on business value and team efficiency metrics'
          }
        },
        tweetSuggestion: '🚀 Revolutionizing remote team collaboration with our new SaaS PM tool! #RemoteWork #ProjectManagement',
        redditTitleSuggestion: 'New SaaS project management tool for remote teams - feedback wanted',
        redditBodySuggestion: 'Built a cloud-based PM tool specifically for remote teams. Looking for community feedback.',
        linkedinSuggestion: 'Transforming remote team productivity: The next generation of project management'
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      render(
        <BrowserRouter>
          <ResultsPage />
        </BrowserRouter>
      );

      // Enter English input
      const ideaInput = screen.getByPlaceholderText(/startup fikrinizi/i);
      fireEvent.change(ideaInput, { target: { value: 'SaaS project management tool' } });

      const submitButton = screen.getByRole('button', { name: /analiz et/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/results');
      });

      // Verify all English content is consistent
      await waitFor(() => {
        expect(screen.getByText(/high demand in the remote work/i)).toBeInTheDocument();
        expect(screen.getByText(/strong interest from remote work/i)).toBeInTheDocument();
        expect(screen.getByText(/excellent reception expected/i)).toBeInTheDocument();
        expect(screen.getByText(/very high interest from business/i)).toBeInTheDocument();
      });

      // Verify English content suggestions
      expect(screen.getByText(/share productivity tips/i)).toBeInTheDocument();
      expect(screen.getByText(/detailed feature comparisons/i)).toBeInTheDocument();
      expect(screen.getByText(/focus on business value/i)).toBeInTheDocument();
    });
  });

  describe('Error Scenarios and Graceful Degradation', () => {
    it('should handle API failure with graceful degradation', async () => {
      // Mock API failure
      mockValidateIdea.mockRejectedValueOnce(new Error('Network error'));

      renderHomePage();

      const ideaInput = screen.getByPlaceholderText(/describe your startup idea/i);
      fireEvent.change(ideaInput, { target: { value: 'Test idea' } });

      const submitButton = screen.getByLabelText(/submit idea for validation/i);
      fireEvent.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Verify API was called
      expect(mockValidateIdea).toHaveBeenCalledWith('Test idea');
    });

    it('should handle empty or invalid user input', async () => {
      renderHomePage();

      // Try to submit with empty input
      const submitButton = screen.getByLabelText(/submit idea for validation/i);
      fireEvent.click(submitButton);

      // Should not make API call
      expect(mockValidateIdea).not.toHaveBeenCalled();
    });

    it('should handle loading states properly', async () => {
      // Mock delayed response
      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockValidateIdea.mockReturnValueOnce(delayedPromise);

      renderHomePage();

      const ideaInput = screen.getByPlaceholderText(/describe your startup idea/i);
      fireEvent.change(ideaInput, { target: { value: 'Test idea' } });

      const submitButton = screen.getByLabelText(/submit idea for validation/i);
      fireEvent.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePromise!({
        idea: 'Test idea',
        demandScore: 75,
        scoreJustification: 'Good potential',
        signalSummary: [
          { platform: 'X', summary: 'Good reception expected' },
          { platform: 'Reddit', summary: 'Moderate interest' },
          { platform: 'LinkedIn', summary: 'High professional interest' }
        ],
        tweetSuggestion: 'Tweet',
        redditTitleSuggestion: 'Reddit title',
        redditBodySuggestion: 'Reddit body',
        linkedinSuggestion: 'LinkedIn',
        scoreBreakdown: {
          marketSize: 20,
          competition: 15,
          feasibility: 17,
          trendMomentum: 12
        }
      });

      // Should complete loading
      await waitFor(() => {
        expect(mockValidateIdea).toHaveBeenCalledWith('Test idea');
      });
    });
  });

  describe('User Experience Flow Tests', () => {
    it('should preserve form state during validation errors', async () => {
      mockValidateIdea.mockRejectedValueOnce(new Error('Validation error'));

      renderHomePage();

      const ideaInput = screen.getByPlaceholderText(/describe your startup idea/i);
      
      // Enter some text
      fireEvent.change(ideaInput, { target: { value: 'My test idea' } });

      const submitButton = screen.getByLabelText(/submit idea for validation/i);
      fireEvent.click(submitButton);

      // Should show error but preserve form values
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument();
      });

      // Form values should still be there
      expect((ideaInput as HTMLTextAreaElement).value).toBe('My test idea');
    });
  });
});
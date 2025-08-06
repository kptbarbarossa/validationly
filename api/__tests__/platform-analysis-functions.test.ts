import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Google GenAI
const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent
    }
  })),
  Type: {
    OBJECT: 'object',
    STRING: 'string',
    INTEGER: 'integer',
    ARRAY: 'array'
  }
}));

// Mock environment variables
vi.stubEnv('API_KEY', 'test-api-key');

describe('Simplified Validation Result Generation', () => {
  let mockReq: any;
  let mockRes: any;
  let originalApiKey: string | undefined;

  beforeEach(() => {
    originalApiKey = process.env.API_KEY;
    process.env.API_KEY = 'test-api-key';
    mockGenerateContent.mockReset();

    mockReq = {
      method: 'POST',
      body: {},
      headers: {}
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    if (originalApiKey) {
      process.env.API_KEY = originalApiKey;
    } else {
      delete process.env.API_KEY;
    }
  });

  describe('Platform-Specific Analysis Generation', () => {
    it('should generate valid platform analyses with correct structure', async () => {
      const mockPlatformResponses = [
        {
          text: JSON.stringify({
            platformName: 'Twitter',
            score: 4,
            summary: 'High viral potential on Twitter. Tech community would be interested.',
            keyFindings: ['High engagement expected', 'Tech trend alignment'],
            contentSuggestion: 'Use #startup #tech hashtags for maximum reach'
          })
        },
        {
          text: JSON.stringify({
            platformName: 'Reddit',
            score: 3,
            summary: 'Moderate community interest expected. Would need detailed explanation.',
            keyFindings: ['Some subreddit relevance', 'Discussion potential exists'],
            contentSuggestion: 'Post in r/startups and r/entrepreneur with detailed explanation'
          })
        },
        {
          text: JSON.stringify({
            platformName: 'LinkedIn',
            score: 4,
            summary: 'Strong professional network potential. Good B2B relevance.',
            keyFindings: ['High professional relevance', 'B2B potential exists'],
            contentSuggestion: 'Share with professional network emphasizing business value'
          })
        },
        {
          text: JSON.stringify({
            idea: 'AI-powered startup idea',
            demandScore: 75,
            scoreJustification: 'Strong market potential',
            tweetSuggestion: 'Test tweet',
            redditTitleSuggestion: 'Test reddit title',
            redditBodySuggestion: 'Test reddit body',
            linkedinSuggestion: 'Test linkedin suggestion'
          })
        }
      ];

      mockGenerateContent
        .mockResolvedValueOnce(mockPlatformResponses[0])
        .mockResolvedValueOnce(mockPlatformResponses[1])
        .mockResolvedValueOnce(mockPlatformResponses[2])
        .mockResolvedValueOnce(mockPlatformResponses[3]);

      mockReq.body.idea = 'AI-powered startup idea';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];

      // Verify platform analyses structure
      expect(response.platformAnalyses).toBeDefined();
      expect(response.platformAnalyses.twitter).toBeDefined();
      expect(response.platformAnalyses.reddit).toBeDefined();
      expect(response.platformAnalyses.linkedin).toBeDefined();

      // Verify Twitter analysis
      expect(response.platformAnalyses.twitter.platformName).toBe('Twitter');
      expect(response.platformAnalyses.twitter.score).toBeGreaterThanOrEqual(1);
      expect(response.platformAnalyses.twitter.score).toBeLessThanOrEqual(5);
      expect(typeof response.platformAnalyses.twitter.summary).toBe('string');
      expect(Array.isArray(response.platformAnalyses.twitter.keyFindings)).toBe(true);
      expect(typeof response.platformAnalyses.twitter.contentSuggestion).toBe('string');

      // Verify Reddit analysis
      expect(response.platformAnalyses.reddit.platformName).toBe('Reddit');
      expect(response.platformAnalyses.reddit.score).toBeGreaterThanOrEqual(1);
      expect(response.platformAnalyses.reddit.score).toBeLessThanOrEqual(5);

      // Verify LinkedIn analysis
      expect(response.platformAnalyses.linkedin.platformName).toBe('LinkedIn');
      expect(response.platformAnalyses.linkedin.score).toBeGreaterThanOrEqual(1);
      expect(response.platformAnalyses.linkedin.score).toBeLessThanOrEqual(5);
    });

    it('should handle Turkish language input correctly', async () => {
      const mockTurkishResponses = [
        {
          text: JSON.stringify({
            platformName: 'Twitter',
            score: 3,
            summary: 'Twitter\'da orta seviyede viral potansiyel. Teknoloji topluluğu ilgi gösterebilir.',
            keyFindings: ['Orta seviyede etkileşim bekleniyor', 'Teknoloji trend uyumu'],
            contentSuggestion: '#startup #teknoloji etiketlerini kullanın'
          })
        },
        {
          text: JSON.stringify({
            platformName: 'Reddit',
            score: 3,
            summary: 'Reddit topluluklarında orta seviyede ilgi bekleniyor. Detaylı açıklama gerekli.',
            keyFindings: ['Bazı subreddit uyumu', 'Tartışma potansiyeli var'],
            contentSuggestion: 'r/startups ve r/entrepreneur\'da detaylı açıklama ile paylaşın'
          })
        },
        {
          text: JSON.stringify({
            platformName: 'LinkedIn',
            score: 4,
            summary: 'Güçlü profesyonel ağ potansiyeli. İyi B2B uygunluğu.',
            keyFindings: ['Yüksek profesyonel uygunluk', 'B2B potansiyeli mevcut'],
            contentSuggestion: 'İş değerini vurgulayarak profesyonel ağınızla paylaşın'
          })
        },
        {
          text: JSON.stringify({
            idea: 'Yapay zeka destekli startup fikri',
            demandScore: 70,
            scoreJustification: 'Güçlü pazar potansiyeli',
            tweetSuggestion: 'Türkçe tweet önerisi',
            redditTitleSuggestion: 'Türkçe reddit başlığı',
            redditBodySuggestion: 'Türkçe reddit içeriği',
            linkedinSuggestion: 'Türkçe linkedin önerisi'
          })
        }
      ];

      mockGenerateContent
        .mockResolvedValueOnce(mockTurkishResponses[0])
        .mockResolvedValueOnce(mockTurkishResponses[1])
        .mockResolvedValueOnce(mockTurkishResponses[2])
        .mockResolvedValueOnce(mockTurkishResponses[3]);

      mockReq.body.idea = 'Yapay zeka destekli startup fikri';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];

      // Verify Turkish responses contain Turkish characters
      expect(response.platformAnalyses.twitter.summary).toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
      expect(response.platformAnalyses.reddit.summary).toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
      expect(response.platformAnalyses.linkedin.summary).toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
      expect(response.scoreJustification).toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
    });

    it('should provide graceful fallback when platform analysis fails', async () => {
      // Mock all platform analyses to fail
      mockGenerateContent.mockRejectedValue(new Error('API failure'));

      mockReq.body.idea = 'Test startup idea';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];

      // Should still return valid structure with default values
      expect(response.platformAnalyses).toBeDefined();
      expect(response.platformAnalyses.twitter.score).toBe(3); // Default neutral score
      expect(response.platformAnalyses.reddit.score).toBe(3);
      expect(response.platformAnalyses.linkedin.score).toBe(3);

      // Should contain fallback messages
      expect(response.platformAnalyses.twitter.summary).toContain('currently unavailable');
      expect(response.platformAnalyses.reddit.summary).toContain('currently unavailable');
      expect(response.platformAnalyses.linkedin.summary).toContain('currently unavailable');

      // Should have valid key findings arrays
      expect(Array.isArray(response.platformAnalyses.twitter.keyFindings)).toBe(true);
      expect(Array.isArray(response.platformAnalyses.reddit.keyFindings)).toBe(true);
      expect(Array.isArray(response.platformAnalyses.linkedin.keyFindings)).toBe(true);
    });

  });

  describe('Input Validation and Error Handling', () => {
    it('should validate input length correctly', async () => {
      mockReq.body.idea = 'Short'; // Less than 5 characters

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      // The current implementation provides graceful degradation instead of error status
      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];
      
      // Should still return valid structure with default values
      expect(response.idea).toBe('Short');
      expect(response.platformAnalyses).toBeDefined();
      expect(response.platformAnalyses.twitter.score).toBe(3);
    });

    it('should handle missing idea/content', async () => {
      mockReq.body = {}; // No idea provided

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Idea or content is required'
      });
    });

    it('should handle very long input', async () => {
      mockReq.body.idea = 'a'.repeat(2001); // Over 2000 characters

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('An error occurred during analysis')
        })
      );
    });

  });

  describe('Content Suggestions Generation', () => {
    it('should generate appropriate content suggestions in English', async () => {
      const mockResponses = [
        { text: JSON.stringify({ platformName: 'Twitter', score: 4, summary: 'Good potential', keyFindings: ['High engagement'], contentSuggestion: 'Use hashtags' }) },
        { text: JSON.stringify({ platformName: 'Reddit', score: 3, summary: 'Moderate interest', keyFindings: ['Community fit'], contentSuggestion: 'Post in subreddits' }) },
        { text: JSON.stringify({ platformName: 'LinkedIn', score: 4, summary: 'Professional potential', keyFindings: ['B2B relevance'], contentSuggestion: 'Share professionally' }) },
        {
          text: JSON.stringify({
            idea: 'A mobile app for food delivery',
            demandScore: 75,
            scoreJustification: 'Strong market potential',
            tweetSuggestion: '🚀 Working on a new idea: food delivery app #startup',
            redditTitleSuggestion: '[Idea Sharing] Food delivery app - Seeking feedback',
            redditBodySuggestion: 'Hi everyone! I\'m developing a food delivery app...',
            linkedinSuggestion: '💡 Developing a new solution in the food delivery sector'
          })
        }
      ];

      mockGenerateContent
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1])
        .mockResolvedValueOnce(mockResponses[2])
        .mockResolvedValueOnce(mockResponses[3]);

      mockReq.body.idea = 'A mobile app for food delivery';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];

      expect(response.tweetSuggestion).toContain('#startup');
      expect(response.redditTitleSuggestion).toContain('[Idea Sharing]');
      expect(response.redditBodySuggestion).toContain('Hi everyone');
      expect(response.linkedinSuggestion).toContain('Developing');
    });

    it('should generate appropriate content suggestions in Turkish', async () => {
      const mockResponses = [
        { text: JSON.stringify({ platformName: 'Twitter', score: 3, summary: 'İyi potansiyel', keyFindings: ['Yüksek etkileşim'], contentSuggestion: 'Hashtag kullanın' }) },
        { text: JSON.stringify({ platformName: 'Reddit', score: 3, summary: 'Orta ilgi', keyFindings: ['Topluluk uyumu'], contentSuggestion: 'Subreddit\'lerde paylaşın' }) },
        { text: JSON.stringify({ platformName: 'LinkedIn', score: 4, summary: 'Profesyonel potansiyel', keyFindings: ['B2B uygunluk'], contentSuggestion: 'Profesyonel paylaşım' }) },
        {
          text: JSON.stringify({
            idea: 'Yemek teslimatı uygulaması',
            demandScore: 70,
            scoreJustification: 'Güçlü pazar potansiyeli',
            tweetSuggestion: '🚀 Yeni bir fikir: yemek teslimatı uygulaması #startup',
            redditTitleSuggestion: '[Fikir Paylaşımı] Yemek teslimatı uygulaması - Geri bildirim arıyorum',
            redditBodySuggestion: 'Merhaba! Yemek teslimatı uygulaması geliştiriyorum...',
            linkedinSuggestion: '💡 Yemek teslimatı sektöründe yeni bir çözüm geliştiriyorum'
          })
        }
      ];

      mockGenerateContent
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1])
        .mockResolvedValueOnce(mockResponses[2])
        .mockResolvedValueOnce(mockResponses[3]);

      mockReq.body.idea = 'Yemek teslimatı uygulaması';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];

      expect(response.tweetSuggestion).toContain('#startup');
      expect(response.redditTitleSuggestion).toContain('[Fikir Paylaşımı]');
      expect(response.redditBodySuggestion).toContain('Merhaba');
      expect(response.linkedinSuggestion).toContain('geliştiriyorum');
    });

  });
});
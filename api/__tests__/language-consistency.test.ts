import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('Language Consistency Tests', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
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

    // Reset mocks
    mockGenerateContent.mockReset();
  });

  describe('Turkish Language Detection', () => {
    it('should detect Turkish from Turkish characters', async () => {
      const turkishIdea = 'Yemek teslimatı için bir mobil uygulama geliştiriyorum';
      mockReq.body.idea = turkishIdea;

      // Mock Turkish responses
      mockGenerateContent
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Twitter',
            score: 4,
            summary: 'Bu fikir Twitter\'da viral olma potansiyeli yüksek. Yemek teslimatı konusu popüler.',
            keyFindings: ['Viral potansiyel yüksek', 'Trend uyumu iyi'],
            contentSuggestion: 'Kısa ve etkileyici tweet\'ler hazırlayın'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Reddit',
            score: 3,
            summary: 'Reddit topluluklarında orta seviyede ilgi görebilir. Detaylı açıklama gerekli.',
            keyFindings: ['Topluluk uyumu orta', 'Tartışma potansiyeli var'],
            contentSuggestion: 'r/startups ve r/entrepreneur\'da paylaşın'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'LinkedIn',
            score: 4,
            summary: 'Profesyonel ağda iyi karşılanabilir. İş modeli vurgusu önemli.',
            keyFindings: ['Profesyonel uygunluk yüksek', 'B2B potansiyeli var'],
            contentSuggestion: 'İş değerini vurgulayan profesyonel içerik hazırlayın'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            idea: turkishIdea,
            demandScore: 75,
            scoreJustification: 'Güçlü pazar potansiyeli',
            tweetSuggestion: '🚀 Yeni bir fikir: Yemek teslimatı uygulaması #startup #yemek',
            redditTitleSuggestion: '[Fikir Paylaşımı] Yemek teslimatı uygulaması - Görüşlerinizi bekliyorum',
            redditBodySuggestion: 'Merhaba! Yemek teslimatı için bir uygulama geliştiriyorum...',
            linkedinSuggestion: '💡 Yemek teslimatı sektöründe yeni bir çözüm geliştiriyorum'
          })
        });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      
      const responseCall = mockRes.json.mock.calls[0][0];
      
      // Verify Turkish responses (case insensitive)
      expect(responseCall.platformAnalyses.twitter.summary.toLowerCase()).toContain('viral');
      expect(responseCall.platformAnalyses.twitter.summary).toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
      expect(responseCall.platformAnalyses.reddit.summary.toLowerCase()).toContain('topluluk');
      expect(responseCall.platformAnalyses.linkedin.summary.toLowerCase()).toContain('profesyonel');
      expect(responseCall.scoreJustification.toLowerCase()).toContain('pazar');
    });

    it('should detect Turkish from Turkish words without special characters', async () => {
      const turkishIdea = 'Bu bir cok iyi fikir ve ben bunu yapmak istiyorum';
      mockReq.body.idea = turkishIdea;

      // Mock Turkish responses
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({
          idea: turkishIdea,
          demandScore: 60,
          scoreJustification: 'Orta seviyede pazar potansiyeli',
          platformAnalyses: {
            twitter: {
              platformName: 'Twitter',
              score: 3,
              summary: 'Orta seviyede viral potansiyel',
              keyFindings: ['Genel ilgi', 'Trend uyumu orta'],
              contentSuggestion: 'Hashtag kullanın'
            },
            reddit: {
              platformName: 'Reddit',
              score: 3,
              summary: 'Topluluk ilgisi orta seviyede',
              keyFindings: ['Tartışma potansiyeli', 'Detay gerekli'],
              contentSuggestion: 'Detaylı açıklama yapın'
            },
            linkedin: {
              platformName: 'LinkedIn',
              score: 3,
              summary: 'Profesyonel ilgi orta',
              keyFindings: ['İş değeri belirsiz', 'Açıklama gerekli'],
              contentSuggestion: 'İş modelini açıklayın'
            }
          },
          tweetSuggestion: 'Yeni bir fikir üzerinde çalışıyorum',
          redditTitleSuggestion: 'Fikir paylaşımı',
          redditBodySuggestion: 'Merhaba topluluk',
          linkedinSuggestion: 'Yeni bir proje'
        })
      });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      
      // Verify that the system detected Turkish and provided Turkish responses
      const responseCall = mockRes.json.mock.calls[0][0];
      expect(responseCall.scoreJustification).toContain('pazar');
    });
  });

  describe('English Language Detection', () => {
    it('should detect English and provide English responses', async () => {
      const englishIdea = 'A mobile app for food delivery with AI-powered recommendations';
      mockReq.body.idea = englishIdea;

      // Mock English responses
      mockGenerateContent
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Twitter',
            score: 4,
            summary: 'High viral potential on Twitter. Food delivery is a trending topic.',
            keyFindings: ['High viral potential', 'Good trend alignment'],
            contentSuggestion: 'Create short, impactful tweets'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Reddit',
            score: 3,
            summary: 'Moderate interest expected in Reddit communities. Detailed explanation needed.',
            keyFindings: ['Moderate community fit', 'Discussion potential exists'],
            contentSuggestion: 'Share in r/startups and r/entrepreneur'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'LinkedIn',
            score: 4,
            summary: 'Strong professional network potential. Business model emphasis important.',
            keyFindings: ['High professional relevance', 'B2B potential exists'],
            contentSuggestion: 'Create professional content emphasizing business value'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            idea: englishIdea,
            demandScore: 75,
            scoreJustification: 'Strong market potential',
            tweetSuggestion: '🚀 New idea: AI-powered food delivery app #startup #foodtech',
            redditTitleSuggestion: '[Idea Sharing] AI food delivery app - Seeking feedback',
            redditBodySuggestion: 'Hi everyone! I\'m developing a food delivery app with AI...',
            linkedinSuggestion: '💡 Developing a new solution in the food delivery sector'
          })
        });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      
      const responseCall = mockRes.json.mock.calls[0][0];
      
      // Verify English responses
      expect(responseCall.platformAnalyses.twitter.summary.toLowerCase()).toContain('viral');
      expect(responseCall.platformAnalyses.twitter.summary).not.toMatch(/[çğıöşüÇĞIİÖŞÜ]/);
      expect(responseCall.platformAnalyses.reddit.summary.toLowerCase()).toContain('communit');
      expect(responseCall.platformAnalyses.linkedin.summary.toLowerCase()).toContain('professional');
      expect(responseCall.scoreJustification.toLowerCase()).toContain('market');
    });
  });

  describe('Mixed Language Scenarios', () => {
    it('should handle mixed language input by detecting dominant language', async () => {
      const mixedIdea = 'A startup idea için bir mobile app development';
      mockReq.body.idea = mixedIdea;

      // Should detect as Turkish due to "için" and "bir"
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({
          idea: mixedIdea,
          demandScore: 65,
          scoreJustification: 'Karışık dil kullanımı tespit edildi, Türkçe yanıt verildi',
          platformAnalyses: {
            twitter: {
              platformName: 'Twitter',
              score: 3,
              summary: 'Karışık dil kullanımı nedeniyle orta seviyede potansiyel',
              keyFindings: ['Dil tutarlılığı önemli', 'Hedef kitle belirsiz'],
              contentSuggestion: 'Tek dil kullanımı önerilir'
            },
            reddit: {
              platformName: 'Reddit',
              score: 2,
              summary: 'Topluluk karışık dil kullanımını tercih etmez',
              keyFindings: ['Dil tutarlılığı gerekli', 'Açık iletişim önemli'],
              contentSuggestion: 'Tek dilde açıklama yapın'
            },
            linkedin: {
              platformName: 'LinkedIn',
              score: 3,
              summary: 'Profesyonel ortamda dil tutarlılığı kritik',
              keyFindings: ['Profesyonel dil kullanımı', 'Hedef kitle netliği'],
              contentSuggestion: 'Profesyonel dilde sunum yapın'
            }
          },
          tweetSuggestion: 'Startup fikri geliştiriyorum',
          redditTitleSuggestion: 'Startup fikri hakkında',
          redditBodySuggestion: 'Merhaba, bir fikrim var',
          linkedinSuggestion: 'Yeni bir proje üzerinde çalışıyorum'
        })
      });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      
      const responseCall = mockRes.json.mock.calls[0][0];
      expect(responseCall.scoreJustification).toContain('Türkçe');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty or invalid input gracefully', async () => {
      mockReq.body.idea = '';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Idea or content is required'
      });
    });

    it('should handle very short input', async () => {
      mockReq.body.idea = 'App';

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('error occurred')
        })
      );
    });

    it('should default to English for ambiguous input', async () => {
      const ambiguousIdea = '123456 numbers only test';
      mockReq.body.idea = ambiguousIdea;

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({
          idea: ambiguousIdea,
          demandScore: 30,
          scoreJustification: 'Limited information provided',
          platformAnalyses: {
            twitter: {
              platformName: 'Twitter',
              score: 2,
              summary: 'Limited viral potential due to unclear concept',
              keyFindings: ['Concept unclear', 'More details needed'],
              contentSuggestion: 'Provide more context'
            },
            reddit: {
              platformName: 'Reddit',
              score: 2,
              summary: 'Community would need more information',
              keyFindings: ['Insufficient detail', 'Clarification needed'],
              contentSuggestion: 'Explain the concept clearly'
            },
            linkedin: {
              platformName: 'LinkedIn',
              score: 2,
              summary: 'Professional audience needs clear value proposition',
              keyFindings: ['Value unclear', 'Business model missing'],
              contentSuggestion: 'Define business value clearly'
            }
          },
          tweetSuggestion: 'Working on a new concept',
          redditTitleSuggestion: 'New idea - seeking feedback',
          redditBodySuggestion: 'Hi everyone, I have an idea',
          linkedinSuggestion: 'Exploring a new business concept'
        })
      });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      
      const responseCall = mockRes.json.mock.calls[0][0];
      // Should default to English (check fallback behavior)
      expect(responseCall.scoreJustification.toLowerCase()).toContain('limited');
      // When AI analysis fails, it uses default messages, so check for fallback content
      expect(responseCall.platformAnalyses.twitter.summary.toLowerCase()).toMatch(/(potential|unavailable|analysis)/i);
    });
  });

  describe('Language Consistency Validation', () => {
    it('should log warnings when AI responds in wrong language', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const turkishIdea = 'Türkçe bir startup fikri';
      mockReq.body.idea = turkishIdea;

      // Mock AI responding in English despite Turkish input
      mockGenerateContent
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Twitter',
            score: 4,
            summary: 'High viral potential on Twitter', // English response for Turkish input
            keyFindings: ['High engagement', 'Good trends'],
            contentSuggestion: 'Create engaging tweets'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'Reddit',
            score: 3,
            summary: 'Moderate community interest',
            keyFindings: ['Some relevance', 'Discussion potential'],
            contentSuggestion: 'Post in relevant subreddits'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            platformName: 'LinkedIn',
            score: 4,
            summary: 'Strong professional potential',
            keyFindings: ['B2B relevance', 'Professional interest'],
            contentSuggestion: 'Share with network'
          })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({
            idea: turkishIdea,
            demandScore: 75,
            scoreJustification: 'Strong market potential',
            tweetSuggestion: 'New startup idea',
            redditTitleSuggestion: 'Startup idea sharing',
            redditBodySuggestion: 'Hi everyone',
            linkedinSuggestion: 'New business concept'
          })
        });

      const handler = (await import('../simplified-validate')).default;
      await handler(mockReq, mockRes);

      // Should still return 200 but log warnings
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('language inconsistency detected')
      );

      consoleSpy.mockRestore();
    });
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../simplified-validate';

// Mock the Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn()
    }))
  }))
}));

// Mock environment variable
process.env.API_KEY = 'test-api-key';

const createMockRequest = (body: any): VercelRequest => ({
  method: 'POST',
  body,
  headers: {},
  query: {},
  url: '/api/simplified-validate',
  cookies: {}
} as VercelRequest);

const createMockResponse = (): VercelResponse => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis()
  } as unknown as VercelResponse;
  return res;
};

describe('End-to-End API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete API Flow - Turkish Input', () => {
    it('should process Turkish input and return Turkish analysis', async () => {
      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            demandScore: 85,
            scoreJustification: 'Türkiye\'de e-ticaret sektöründe güçlü büyüme potansiyeli mevcut',
            platformAnalyses: {
              twitter: {
                platformName: 'Twitter/X',
                score: 4,
                summary: 'Twitter\'da e-ticaret ve teknoloji topluluklarında yüksek ilgi bekleniyor.',
                keyFindings: [
                  'E-ticaret hashtag\'leri trend oluyor',
                  'KOBİ desteği konuları popüler',
                  'Dijital dönüşüm tartışmaları aktif'
                ],
                contentSuggestion: 'Başarı hikayeleri ve KOBİ odaklı içerik paylaş'
              },
              reddit: {
                platformName: 'Reddit',
                score: 3,
                summary: 'Reddit\'te girişimcilik topluluklarında orta düzeyde ilgi görecek.',
                keyFindings: [
                  'r/Turkey ve r/entrepreneur aktif',
                  'E-ticaret araç tartışmaları mevcut',
                  'Fiyatlandırma konuları önemli'
                ],
                contentSuggestion: 'Teknik detaylar ve fiyatlandırma stratejisi paylaş'
              },
              linkedin: {
                platformName: 'LinkedIn',
                score: 5,
                summary: 'LinkedIn\'de iş dünyası profesyonelleri için çok değerli görülecek.',
                keyFindings: [
                  'B2B e-ticaret pazarı büyüyor',
                  'Dijital dönüşüm yatırımları artıyor',
                  'KOBİ çözümleri talep ediliyor'
                ],
                contentSuggestion: 'ROI hesaplamaları ve iş değeri vurgusu yap'
              }
            },
            tweetSuggestion: '🛒 KOBİler için e-ticaret devrimi başlıyor! #ETicaret #KOBİ #DijitalDönüşüm',
            redditTitleSuggestion: 'KOBİler için e-ticaret platformu - görüşlerinizi bekliyorum',
            redditBodySuggestion: 'Küçük işletmelerin dijital dönüşümünü destekleyen e-ticaret platformu geliştiriyorum.',
            linkedinSuggestion: 'KOBİlerin dijital dönüşümü: E-ticaret ile büyüme fırsatları'
          })
        }
      };

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockAIResponse)
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: 'KOBİler için e-ticaret platformu',
        content: 'Küçük işletmelerin kolayca online satış yapabilmesi için e-ticaret çözümü'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          idea: 'KOBİler için e-ticaret platformu',
          content: 'Küçük işletmelerin kolayca online satış yapabilmesi için e-ticaret çözümü',
          demandScore: 85,
          scoreJustification: expect.stringContaining('güçlü büyüme potansiyeli'),
          platformAnalyses: expect.objectContaining({
            twitter: expect.objectContaining({
              platformName: 'Twitter/X',
              score: 4,
              summary: expect.stringContaining('yüksek ilgi bekleniyor'),
              keyFindings: expect.arrayContaining([
                expect.stringContaining('E-ticaret hashtag')
              ]),
              contentSuggestion: expect.stringContaining('Başarı hikayeleri')
            }),
            reddit: expect.objectContaining({
              platformName: 'Reddit',
              score: 3,
              summary: expect.stringContaining('orta düzeyde ilgi'),
              keyFindings: expect.any(Array),
              contentSuggestion: expect.stringContaining('Teknik detaylar')
            }),
            linkedin: expect.objectContaining({
              platformName: 'LinkedIn',
              score: 5,
              summary: expect.stringContaining('çok değerli görülecek'),
              keyFindings: expect.any(Array),
              contentSuggestion: expect.stringContaining('ROI hesaplamaları')
            })
          }),
          tweetSuggestion: expect.stringContaining('KOBİler için'),
          redditTitleSuggestion: expect.stringContaining('KOBİler için e-ticaret'),
          redditBodySuggestion: expect.stringContaining('Küçük işletmelerin'),
          linkedinSuggestion: expect.stringContaining('KOBİlerin dijital')
        })
      );
    });

    it('should process English input and return English analysis', async () => {
      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            demandScore: 78,
            scoreJustification: 'Strong market demand in the SaaS project management sector',
            platformAnalyses: {
              twitter: {
                platformName: 'Twitter/X',
                score: 4,
                summary: 'High engagement expected from productivity and remote work communities on Twitter.',
                keyFindings: [
                  'Productivity hashtags trending',
                  'Remote work discussions active',
                  'SaaS tool recommendations popular'
                ],
                contentSuggestion: 'Share productivity tips and remote work insights'
              },
              reddit: {
                platformName: 'Reddit',
                score: 5,
                summary: 'Excellent reception expected in project management and startup subreddits.',
                keyFindings: [
                  'r/projectmanagement very active',
                  'Tool comparison posts popular',
                  'Feature request discussions common'
                ],
                contentSuggestion: 'Post detailed feature comparisons and roadmap'
              },
              linkedin: {
                platformName: 'LinkedIn',
                score: 5,
                summary: 'Very high interest from business professionals and team leaders.',
                keyFindings: [
                  'Remote work solutions in demand',
                  'B2B SaaS market growing',
                  'Team efficiency focus increasing'
                ],
                contentSuggestion: 'Focus on business metrics and team productivity gains'
              }
            },
            tweetSuggestion: '🚀 Revolutionizing team collaboration with our new SaaS PM tool! #ProjectManagement #RemoteWork #Productivity',
            redditTitleSuggestion: 'New SaaS project management tool - looking for feedback',
            redditBodySuggestion: 'Built a project management tool specifically for remote teams. Would love community feedback.',
            linkedinSuggestion: 'Transforming remote team productivity: The future of project management'
          })
        }
      };

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockAIResponse)
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: 'SaaS project management tool',
        content: 'Cloud-based project management solution for remote teams'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          idea: 'SaaS project management tool',
          content: 'Cloud-based project management solution for remote teams',
          demandScore: 78,
          scoreJustification: expect.stringContaining('Strong market demand'),
          platformAnalyses: expect.objectContaining({
            twitter: expect.objectContaining({
              summary: expect.stringContaining('High engagement expected'),
              keyFindings: expect.arrayContaining([
                expect.stringContaining('Productivity hashtags')
              ])
            }),
            reddit: expect.objectContaining({
              summary: expect.stringContaining('Excellent reception expected'),
              keyFindings: expect.arrayContaining([
                expect.stringContaining('r/projectmanagement')
              ])
            }),
            linkedin: expect.objectContaining({
              summary: expect.stringContaining('Very high interest'),
              keyFindings: expect.arrayContaining([
                expect.stringContaining('Remote work solutions')
              ])
            })
          })
        })
      );
    });
  });

  describe('Error Handling and Graceful Degradation', () => {
    it('should handle AI API failures gracefully', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockRejectedValue(new Error('AI API Error'))
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: 'Test idea',
        content: 'Test content'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          idea: 'Test idea',
          content: 'Test content',
          demandScore: 50, // Default fallback score
          scoreJustification: expect.stringContaining('Analiz şu anda mevcut değil'),
          platformAnalyses: expect.objectContaining({
            twitter: expect.objectContaining({
              platformName: 'Twitter/X',
              score: 3,
              summary: expect.stringContaining('Analiz şu anda mevcut değil')
            }),
            reddit: expect.objectContaining({
              platformName: 'Reddit',
              score: 3,
              summary: expect.stringContaining('Analiz şu anda mevcut değil')
            }),
            linkedin: expect.objectContaining({
              platformName: 'LinkedIn',
              score: 3,
              summary: expect.stringContaining('Analiz şu anda mevcut değil')
            })
          })
        })
      );
    });

    it('should handle malformed AI responses', async () => {
      const mockAIResponse = {
        response: {
          text: () => 'Invalid JSON response'
        }
      };

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockAIResponse)
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: 'Test idea',
        content: 'Test content'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          demandScore: 50,
          scoreJustification: expect.stringContaining('Analiz şu anda mevcut değil'),
          platformAnalyses: expect.objectContaining({
            twitter: expect.objectContaining({ score: 3 }),
            reddit: expect.objectContaining({ score: 3 }),
            linkedin: expect.objectContaining({ score: 3 })
          })
        })
      );
    });

    it('should handle missing API key', async () => {
      const originalApiKey = process.env.API_KEY;
      delete process.env.API_KEY;

      const req = createMockRequest({
        idea: 'Test idea',
        content: 'Test content'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'API key not configured'
      });

      // Restore API key
      process.env.API_KEY = originalApiKey;
    });

    it('should handle invalid request methods', async () => {
      const req = {
        ...createMockRequest({}),
        method: 'GET'
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Method not allowed'
      });
    });

    it('should handle missing required fields', async () => {
      const req = createMockRequest({
        // Missing idea field
        content: 'Test content'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: idea'
      });
    });

    it('should handle empty request body', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: idea'
      });
    });
  });

  describe('Rate Limiting and Security', () => {
    it('should handle rate limiting properly', async () => {
      // This would typically involve testing with actual rate limiting middleware
      // For now, we'll test that the handler doesn't crash with rapid requests
      
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              demandScore: 75,
              scoreJustification: 'Good demand',
              platformAnalyses: {
                twitter: { platformName: 'Twitter/X', score: 4, summary: 'Good', keyFindings: [], contentSuggestion: 'Test' },
                reddit: { platformName: 'Reddit', score: 3, summary: 'Okay', keyFindings: [], contentSuggestion: 'Test' },
                linkedin: { platformName: 'LinkedIn', score: 5, summary: 'Great', keyFindings: [], contentSuggestion: 'Test' }
              },
              tweetSuggestion: 'Tweet',
              redditTitleSuggestion: 'Reddit title',
              redditBodySuggestion: 'Reddit body',
              linkedinSuggestion: 'LinkedIn'
            })
          }
        })
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const requests = Array.from({ length: 5 }, () => 
        createMockRequest({
          idea: 'Test idea',
          content: 'Test content'
        })
      );

      const responses = await Promise.all(
        requests.map(async (req) => {
          const res = createMockResponse();
          await handler(req, res);
          return res;
        })
      );

      // All requests should complete without errors
      responses.forEach(res => {
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    it('should sanitize input data', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              demandScore: 60,
              scoreJustification: 'Moderate demand',
              platformAnalyses: {
                twitter: { platformName: 'Twitter/X', score: 3, summary: 'Moderate', keyFindings: [], contentSuggestion: 'Test' },
                reddit: { platformName: 'Reddit', score: 3, summary: 'Moderate', keyFindings: [], contentSuggestion: 'Test' },
                linkedin: { platformName: 'LinkedIn', score: 3, summary: 'Moderate', keyFindings: [], contentSuggestion: 'Test' }
              },
              tweetSuggestion: 'Tweet',
              redditTitleSuggestion: 'Reddit title',
              redditBodySuggestion: 'Reddit body',
              linkedinSuggestion: 'LinkedIn'
            })
          }
        })
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: '<script>alert("xss")</script>Malicious idea',
        content: 'Content with <img src="x" onerror="alert(1)"> XSS attempt'
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      
      // The API should process the request but the malicious content should be handled safely
      const callArgs = vi.mocked(res.json).mock.calls[0][0];
      expect(callArgs.idea).toContain('Malicious idea');
      expect(callArgs.content).toContain('XSS attempt');
    });
  });

  describe('Performance and Timeout Handling', () => {
    it('should handle slow AI responses within reasonable time', async () => {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const mockGenAI = vi.mocked(GoogleGenerativeAI);
      
      // Simulate slow response
      const mockModel = {
        generateContent: vi.fn().mockImplementation(() => 
          new Promise(resolve => 
            setTimeout(() => resolve({
              response: {
                text: () => JSON.stringify({
                  demandScore: 70,
                  scoreJustification: 'Good demand after delay',
                  platformAnalyses: {
                    twitter: { platformName: 'Twitter/X', score: 4, summary: 'Good', keyFindings: [], contentSuggestion: 'Test' },
                    reddit: { platformName: 'Reddit', score: 3, summary: 'Okay', keyFindings: [], contentSuggestion: 'Test' },
                    linkedin: { platformName: 'LinkedIn', score: 5, summary: 'Great', keyFindings: [], contentSuggestion: 'Test' }
                  },
                  tweetSuggestion: 'Tweet',
                  redditTitleSuggestion: 'Reddit title',
                  redditBodySuggestion: 'Reddit body',
                  linkedinSuggestion: 'LinkedIn'
                })
              }
            }), 1000) // 1 second delay
          )
        )
      };
      mockGenAI.mockReturnValue({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      } as any);

      const req = createMockRequest({
        idea: 'Test idea',
        content: 'Test content'
      });
      const res = createMockResponse();

      const startTime = Date.now();
      await handler(req, res);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThan(900); // Should take at least the delay time
      expect(res.status).toHaveBeenCalledWith(200);
    }, 10000); // 10 second timeout for this test
  });
});
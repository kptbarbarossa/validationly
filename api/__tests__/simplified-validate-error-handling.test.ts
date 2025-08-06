import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Google GenAI to simulate failures
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

describe('Simplified Validate API - Error Handling', () => {
  let mockReq: any;
  let mockRes: any;
  let originalApiKey: string | undefined;

  beforeEach(() => {
    originalApiKey = process.env.API_KEY;
    process.env.API_KEY = 'test-api-key';

    mockReq = {
      method: 'POST',
      body: {
        idea: 'A mobile app for food delivery'
      },
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis()
    };

    // Reset mock
    mockGenerateContent.mockReset();
  });

  afterEach(() => {
    if (originalApiKey) {
      process.env.API_KEY = originalApiKey;
    } else {
      delete process.env.API_KEY;
    }
  });

  it('should provide graceful degradation when AI analysis fails', async () => {
    // Mock AI failure
    mockGenerateContent.mockRejectedValue(new Error('AI service unavailable'));

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    // Should still return 200 with fallback data
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: 'A mobile app for food delivery',
        demandScore: expect.any(Number),
        scoreJustification: expect.any(String),
        platformAnalyses: expect.objectContaining({
          twitter: expect.objectContaining({
            platformName: 'Twitter',
            score: expect.any(Number),
            summary: expect.any(String),
            keyFindings: expect.any(Array),
            contentSuggestion: expect.any(String)
          }),
          reddit: expect.objectContaining({
            platformName: 'Reddit',
            score: expect.any(Number),
            summary: expect.any(String),
            keyFindings: expect.any(Array),
            contentSuggestion: expect.any(String)
          }),
          linkedin: expect.objectContaining({
            platformName: 'LinkedIn',
            score: expect.any(Number),
            summary: expect.any(String),
            keyFindings: expect.any(Array),
            contentSuggestion: expect.any(String)
          })
        }),
        tweetSuggestion: expect.any(String),
        redditTitleSuggestion: expect.any(String),
        redditBodySuggestion: expect.any(String),
        linkedinSuggestion: expect.any(String)
      })
    );
  });

  it('should handle API key missing error gracefully', async () => {
    delete process.env.API_KEY;

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    // The current implementation provides graceful degradation with default values
    // instead of returning an error status
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: 'A mobile app for food delivery',
        demandScore: expect.any(Number),
        scoreJustification: expect.any(String),
        platformAnalyses: expect.objectContaining({
          twitter: expect.objectContaining({
            platformName: 'Twitter',
            score: 3, // Default neutral score
            summary: expect.stringContaining('currently unavailable')
          })
        })
      })
    );
  });

  it('should handle rate limit errors with appropriate message', async () => {
    mockGenerateContent.mockRejectedValue(new Error('rate limit exceeded'));

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    // The current implementation provides graceful degradation with default values
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: 'A mobile app for food delivery',
        platformAnalyses: expect.objectContaining({
          twitter: expect.objectContaining({
            summary: expect.stringContaining('rate limit')
          }),
          reddit: expect.objectContaining({
            summary: expect.stringContaining('rate limit')
          }),
          linkedin: expect.objectContaining({
            summary: expect.stringContaining('rate limit')
          })
        })
      })
    );
  });

  it('should handle network errors with appropriate message', async () => {
    mockGenerateContent.mockRejectedValue(new Error('network timeout'));

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    // The current implementation provides graceful degradation with default values
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: 'A mobile app for food delivery',
        platformAnalyses: expect.objectContaining({
          twitter: expect.objectContaining({
            summary: expect.stringContaining('connection')
          }),
          reddit: expect.objectContaining({
            summary: expect.stringContaining('connection')
          }),
          linkedin: expect.objectContaining({
            summary: expect.stringContaining('connection')
          })
        })
      })
    );
  });

  it('should provide Turkish error messages for Turkish input', async () => {
    mockReq.body.idea = 'Yemek teslimatı için bir mobil uygulama';
    mockGenerateContent.mockRejectedValue(new Error('AI service unavailable'));

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    // The current implementation provides graceful degradation with Turkish messages
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: 'Yemek teslimatı için bir mobil uygulama',
        platformAnalyses: expect.objectContaining({
          twitter: expect.objectContaining({
            summary: expect.stringContaining('mevcut değil')
          }),
          reddit: expect.objectContaining({
            summary: expect.stringContaining('mevcut değil')
          }),
          linkedin: expect.objectContaining({
            summary: expect.stringContaining('mevcut değil')
          })
        })
      })
    );
  });

  it('should validate and fix malformed analysis results', async () => {
    // Mock partial/malformed response
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        // Missing required fields
        platformName: 'Twitter',
        score: 'invalid', // Invalid type
        summary: null // Invalid value
      })
    });

    const handler = (await import('../simplified-validate')).default;
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    const response = mockRes.json.mock.calls[0][0];
    
    // Should have valid structure despite malformed input
    expect(response.platformAnalyses.twitter.score).toBeTypeOf('number');
    expect(response.platformAnalyses.twitter.summary).toBeTypeOf('string');
    expect(Array.isArray(response.platformAnalyses.twitter.keyFindings)).toBe(true);
  });
});
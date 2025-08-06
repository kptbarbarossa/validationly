import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Google GenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          idea: 'Test startup idea',
          demandScore: 75,
          scoreJustification: 'Strong market potential',
          platformAnalyses: {
            twitter: {
              platformName: 'Twitter',
              score: 4,
              summary: 'Good viral potential on Twitter.',
              keyFindings: ['High engagement expected', 'Tech community interest'],
              contentSuggestion: 'Share with relevant hashtags'
            },
            reddit: {
              platformName: 'Reddit',
              score: 3,
              summary: 'Moderate community interest expected.',
              keyFindings: ['Some subreddit relevance', 'Discussion potential'],
              contentSuggestion: 'Post in relevant subreddits'
            },
            linkedin: {
              platformName: 'LinkedIn',
              score: 4,
              summary: 'Strong professional network potential.',
              keyFindings: ['B2B relevance', 'Professional interest'],
              contentSuggestion: 'Share with professional network'
            }
          },
          tweetSuggestion: 'Test tweet suggestion',
          redditTitleSuggestion: 'Test reddit title',
          redditBodySuggestion: 'Test reddit body',
          linkedinSuggestion: 'Test linkedin suggestion'
        })
      })
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

describe('Simplified Validate API', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      method: 'POST',
      body: {
        idea: 'A platform for connecting freelancers with small businesses'
      },
      headers: {}
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis()
    };
  });

  it('should handle POST requests successfully', async () => {
    // Import the handler after mocks are set up
    const handler = (await import('../validate')).default;
    
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        idea: expect.any(String),
        demandScore: expect.any(Number),
        scoreJustification: expect.any(String),
        signalSummary: expect.any(Array),
        tweetSuggestion: expect.any(String),
        redditTitleSuggestion: expect.any(String),
        redditBodySuggestion: expect.any(String),
        linkedinSuggestion: expect.any(String)
      })
    );
  });

  it('should handle missing idea/content', async () => {
    mockReq.body = {};
    
    const handler = (await import('../validate')).default;
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Idea or content is required'
    });
  });

  it('should handle OPTIONS requests', async () => {
    mockReq.method = 'OPTIONS';
    
    const handler = (await import('../validate')).default;
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.end).toHaveBeenCalled();
  });

  it('should handle non-POST methods', async () => {
    mockReq.method = 'GET';
    
    const handler = (await import('../validate')).default;
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Method not allowed'
    });
  });
});
import { EnhancedValidator } from './enhanced-validate';

// Test endpoint for enhanced validation
export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    console.log('🧪 Testing enhanced validation for:', content.substring(0, 100));

    const validator = new EnhancedValidator();
    
    // Health check first
    const health = await validator.healthCheck();
    console.log('🏥 Health check:', health);

    if (!health.overall) {
      return res.status(503).json({ 
        message: 'Validation service temporarily unavailable',
        health 
      });
    }

    // Simple system instruction for testing
    const systemInstruction = `You are a startup idea validator. Analyze the given content and provide a validation score with insights.`;
    
    // Simple response schema
    const responseSchema = {
      type: 'object',
      properties: {
        idea: { type: 'string' },
        demandScore: { type: 'number' },
        scoreJustification: { type: 'string' },
        signalSummary: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              platform: { type: 'string' },
              summary: { type: 'string' }
            }
          }
        },
        tweetSuggestion: { type: 'string' },
        redditTitleSuggestion: { type: 'string' },
        redditBodySuggestion: { type: 'string' },
        linkedinSuggestion: { type: 'string' }
      }
    };

    // Run enhanced validation
    const result = await validator.validateIdea(
      content,
      systemInstruction,
      responseSchema
    );

    console.log('✅ Enhanced validation completed successfully');
    
    return res.status(200).json({
      success: true,
      result,
      metadata: {
        enhanced: true,
        timestamp: new Date().toISOString(),
        health
      }
    });

  } catch (error) {
    console.error('❌ Enhanced validation test failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Validation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
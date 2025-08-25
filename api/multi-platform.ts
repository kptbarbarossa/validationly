import { VercelRequest, VercelResponse } from '@vercel/node';
import { MultiPlatformService } from '../lib/services/multiPlatformService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, maxResults = 10 } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Idea parameter is required and must be a string' });
    }

    if (idea.length < 5 || idea.length > 500) {
      return res.status(400).json({ error: 'Idea must be between 5 and 500 characters' });
    }

    console.log('🔍 Multi-platform analysis request:', { idea: idea.substring(0, 50) + '...', maxResults });

    const multiPlatformService = new MultiPlatformService();
    const analysis = await multiPlatformService.analyzeIdea(idea, maxResults);

    return res.status(200).json({
      success: true,
      data: analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        idea: idea.substring(0, 100) + (idea.length > 100 ? '...' : ''),
        platformsAnalyzed: analysis.platforms.length,
        totalDataPoints: analysis.totalItems
      }
    });

  } catch (error) {
    console.error('Multi-platform analysis error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Multi-platform analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
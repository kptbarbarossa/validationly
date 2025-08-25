import { VercelRequest, VercelResponse } from '@vercel/node';
import { YouTubeService } from '../lib/services/platforms/youtube';

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
    const { query, action = 'search' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    const youtubeService = new YouTubeService(apiKey);

    let result;
    
    switch (action) {
      case 'search':
        result = await youtubeService.searchVideos(query, 20);
        break;
      
      case 'trends':
        result = await youtubeService.analyzeTrends(query);
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(200).json({
      success: true,
      data: result,
      query,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch YouTube data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
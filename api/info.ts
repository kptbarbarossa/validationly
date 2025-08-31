/**
 * API Information Endpoint
 * Provides information about available API versions and status
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  API_VERSIONS, 
  DEFAULT_API_VERSION, 
  getAvailableVersions, 
  getVersionChangelog,
  versionMiddleware,
  formatResponse
} from '../lib/apiVersionManager.js';
import { Logger } from '../lib/logger.js';
import { config } from '../lib/config.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://validationly.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, API-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported for this endpoint'
    });
  }

  try {
    // Apply version middleware
    versionMiddleware(req, res);
    
    const requestedVersion = (req as any).apiVersion || DEFAULT_API_VERSION;

    // Get API information
    const apiInfo = {
      service: 'Validationly API',
      description: 'AI-powered startup idea validation service',
      status: 'operational',
      current_version: DEFAULT_API_VERSION,
      requested_version: requestedVersion,
      available_versions: getAvailableVersions(),
      versions: Object.keys(API_VERSIONS).map(version => getVersionChangelog(version)),
      endpoints: {
        v1: [
          {
            path: '/api/v1/validate',
            method: 'POST',
            description: 'Validate startup ideas with AI analysis',
            parameters: {
              content: 'string (required) - The startup idea to validate',
              analysisType: 'string (optional) - Type of analysis: fast, standard, comprehensive'
            }
          },
          {
            path: '/api/v1/github',
            method: 'POST', 
            description: 'Get GitHub data for keyword analysis'
          },
          {
            path: '/api/v1/hackernews',
            method: 'POST',
            description: 'Get Hacker News data for trend analysis'
          }
        ]
      },
      rate_limits: {
        requests_per_window: 50,
        window_duration: '15 minutes',
        burst_limit: 10
      },
      authentication: {
        required: false,
        optional_user_id_header: 'x-user-id',
        description: 'Authentication is optional but recommended for higher rate limits'
      },
      response_format: {
        success: {
          data: 'object - Response data',
          meta: {
            api_version: 'string - API version used',
            timestamp: 'string - ISO timestamp',
            deprecated: 'boolean - Whether version is deprecated'
          }
        },
        error: {
          error: 'string - Error message',
          code: 'string - Error code',
          timestamp: 'string - ISO timestamp',
          api_version: 'string - API version used'
        }
      },
      documentation: 'https://docs.validationly.com/api',
      support: 'support@validationly.com'
    };

    Logger.info('API info requested', { version: requestedVersion });

    // Format response according to version
    const response = formatResponse(apiInfo, requestedVersion);
    
    return res.status(200).json(response);

  } catch (error) {
    Logger.error('API info endpoint error', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      api_version: DEFAULT_API_VERSION
    });
  }
}

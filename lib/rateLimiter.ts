/**
 * Redis-Based Rate Limiting System
 * Serverless-friendly rate limiting with Upstash Redis
 */

import { Logger } from './logger.js';
import { config } from './config.js';

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  keyPrefix: string;     // Redis key prefix
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Rate limit result
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // API endpoints
  validate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50,
    keyPrefix: 'rl:validate'
  },
  info: {
    windowMs: 1 * 60 * 1000,   // 1 minute
    maxRequests: 100,
    keyPrefix: 'rl:info'
  },
  
  // User-specific limits (higher limits for authenticated users)
  user_validate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200,          // 4x higher for authenticated users
    keyPrefix: 'rl:user:validate'
  },
  user_premium: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,         // Very high for premium users
    keyPrefix: 'rl:premium:validate'
  },

  // Global limits (per IP)
  global: {
    windowMs: 1 * 60 * 1000,   // 1 minute
    maxRequests: 20,           // Burst protection
    keyPrefix: 'rl:global'
  }
} as const;

/**
 * Redis Rate Limiter Class
 * Uses Upstash Redis for serverless-friendly rate limiting
 */
export class RedisRateLimiter {
  private redisUrl: string;
  private redisToken: string;
  private enabled: boolean;

  constructor() {
    this.redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
    this.redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';
    this.enabled = Boolean(this.redisUrl && this.redisToken);

    if (!this.enabled) {
      Logger.warn('Redis rate limiter disabled - missing Upstash credentials');
    }
  }

  /**
   * Check rate limit for a key
   */
  async checkLimit(
    identifier: string, 
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    if (!this.enabled) {
      // Fallback to in-memory rate limiting
      return this.fallbackRateLimit(identifier, config);
    }

    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = [
        // Remove expired entries
        ['ZREMRANGEBYSCORE', key, 0, windowStart],
        // Count current requests in window
        ['ZCARD', key],
        // Add current request
        ['ZADD', key, now, `${now}-${Math.random()}`],
        // Set expiry for cleanup
        ['EXPIRE', key, Math.ceil(config.windowMs / 1000)]
      ];

      const results = await this.executePipeline(pipeline);
      const currentCount = parseInt(results[1] as string) || 0;
      
      // Calculate reset time
      const resetTime = now + config.windowMs;
      const remaining = Math.max(0, config.maxRequests - currentCount - 1);

      if (currentCount >= config.maxRequests) {
        Logger.security('Rate limit exceeded', { 
          identifier, 
          config: config.keyPrefix,
          currentCount,
          limit: config.maxRequests 
        });

        return {
          success: false,
          limit: config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter: Math.ceil(config.windowMs / 1000)
        };
      }

      return {
        success: true,
        limit: config.maxRequests,
        remaining,
        resetTime
      };

    } catch (error) {
      Logger.error('Redis rate limit check failed', error);
      // Fallback to in-memory on Redis failure
      return this.fallbackRateLimit(identifier, config);
    }
  }

  /**
   * Execute Redis pipeline commands
   */
  private async executePipeline(commands: any[][]): Promise<any[]> {
    const response = await fetch(`${this.redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands)
    });

    if (!response.ok) {
      throw new Error(`Redis pipeline failed: ${response.statusText}`);
    }

    const results = await response.json();
    return results.map((result: any) => result.result);
  }

  /**
   * Fallback in-memory rate limiting
   */
  private fallbackRateLimit(
    identifier: string, 
    config: RateLimitConfig
  ): RateLimitResult {
    // Use the existing in-memory rate limiting as fallback
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    
    if (!fallbackStore.has(key)) {
      fallbackStore.set(key, { count: 1, resetTime: now + config.windowMs });
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }

    const data = fallbackStore.get(key)!;
    
    // Reset if window expired
    if (now > data.resetTime) {
      fallbackStore.set(key, { count: 1, resetTime: now + config.windowMs });
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }

    // Check limit
    if (data.count >= config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: data.resetTime,
        retryAfter: Math.ceil((data.resetTime - now) / 1000)
      };
    }

    // Increment count
    data.count++;
    fallbackStore.set(key, data);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - data.count,
      resetTime: data.resetTime
    };
  }

  /**
   * Get multiple rate limits for a request
   */
  async checkMultipleLimits(
    identifiers: { key: string; config: RateLimitConfig }[]
  ): Promise<RateLimitResult[]> {
    const promises = identifiers.map(({ key, config }) => 
      this.checkLimit(key, config)
    );

    return Promise.all(promises);
  }

  /**
   * Check if Redis is available
   */
  async healthCheck(): Promise<boolean> {
    if (!this.enabled) return false;

    try {
      const response = await fetch(`${this.redisUrl}/ping`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.redisToken}`
        }
      });

      return response.ok;
    } catch (error) {
      Logger.error('Redis health check failed', error);
      return false;
    }
  }
}

// Fallback in-memory store for when Redis is unavailable
const fallbackStore = new Map<string, { count: number; resetTime: number }>();

// Global rate limiter instance
export const rateLimiter = new RedisRateLimiter();

/**
 * Rate limiting middleware
 */
export async function rateLimitMiddleware(
  identifier: string,
  endpoint: keyof typeof RATE_LIMIT_CONFIGS,
  userTier?: 'free' | 'pro' | 'premium'
): Promise<RateLimitResult> {
  // Determine which config to use based on user tier
  let configKey = endpoint;
  
  if (userTier === 'premium') {
    configKey = 'user_premium' as keyof typeof RATE_LIMIT_CONFIGS;
  } else if (userTier && userTier !== 'free') {
    configKey = `user_${endpoint}` as keyof typeof RATE_LIMIT_CONFIGS;
  }

  const config = RATE_LIMIT_CONFIGS[configKey] || RATE_LIMIT_CONFIGS[endpoint];
  
  return rateLimiter.checkLimit(identifier, config);
}

/**
 * Comprehensive rate limiting for API endpoints
 */
export async function comprehensiveRateLimit(
  ip: string,
  userId?: string,
  userTier?: 'free' | 'pro' | 'premium',
  endpoint: keyof typeof RATE_LIMIT_CONFIGS = 'validate'
): Promise<{
  allowed: boolean;
  limits: RateLimitResult[];
  headers: Record<string, string>;
}> {
  const checks: { key: string; config: RateLimitConfig }[] = [
    // Global IP-based limit (burst protection)
    {
      key: ip,
      config: RATE_LIMIT_CONFIGS.global
    },
    // Endpoint-specific IP limit
    {
      key: ip,
      config: RATE_LIMIT_CONFIGS[endpoint]
    }
  ];

  // Add user-specific limits if authenticated
  if (userId) {
    const userConfig = userTier === 'premium' 
      ? RATE_LIMIT_CONFIGS.user_premium
      : RATE_LIMIT_CONFIGS.user_validate;
      
    checks.push({
      key: userId,
      config: userConfig
    });
  }

  const results = await rateLimiter.checkMultipleLimits(checks);
  const allowed = results.every(result => result.success);

  // Find the most restrictive limit for headers
  const mostRestrictive = results.reduce((min, current) => 
    current.remaining < min.remaining ? current : min
  );

  const headers = {
    'X-RateLimit-Limit': mostRestrictive.limit.toString(),
    'X-RateLimit-Remaining': mostRestrictive.remaining.toString(),
    'X-RateLimit-Reset': new Date(mostRestrictive.resetTime).toISOString(),
    ...(mostRestrictive.retryAfter && {
      'Retry-After': mostRestrictive.retryAfter.toString()
    })
  };

  return {
    allowed,
    limits: results,
    headers
  };
}

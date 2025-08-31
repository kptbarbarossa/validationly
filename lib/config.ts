/**
 * Environment Configuration and Validation
 * Ensures all required environment variables are present
 */

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  'GOOGLE_API_KEY',
  'SUPABASE_URL', 
  'SUPABASE_ANON_KEY'
] as const;

// Optional environment variables with fallbacks
const OPTIONAL_ENV_VARS = {
  YOUTUBE_API_KEY: null,
  GROQ_API_KEY: null,
  OPENAI_API_KEY: null,
  UPSTASH_REDIS_REST_URL: null,
  UPSTASH_REDIS_REST_TOKEN: null,
  NODE_ENV: 'development',
  VERCEL_URL: 'http://localhost:3000'
} as const;

type RequiredEnvVar = typeof REQUIRED_ENV_VARS[number];
type OptionalEnvVar = keyof typeof OPTIONAL_ENV_VARS;

interface EnvConfig {
  // Required
  GOOGLE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // Optional with defaults
  YOUTUBE_API_KEY: string | null;
  GROQ_API_KEY: string | null;
  OPENAI_API_KEY: string | null;
  UPSTASH_REDIS_REST_URL: string | null;
  UPSTASH_REDIS_REST_TOKEN: string | null;
  NODE_ENV: string;
  VERCEL_URL: string;
  
  // Computed
  isProduction: boolean;
  isDevelopment: boolean;
  isRedisEnabled: boolean;
}

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variables are missing
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file or deployment configuration.`
    );
  }
}

/**
 * Gets a validated and typed configuration object
 * @returns Complete environment configuration
 */
export function getConfig(): EnvConfig {
  // Validate first
  validateEnvironment();
  
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || null;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || null;

  return {
    // Required (validated above)
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    
    // Optional with fallbacks
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || null,
    GROQ_API_KEY: process.env.GROQ_API_KEY || null,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || null,
    UPSTASH_REDIS_REST_URL: redisUrl,
    UPSTASH_REDIS_REST_TOKEN: redisToken,
    NODE_ENV: nodeEnv,
    VERCEL_URL: process.env.VERCEL_URL || 'http://localhost:3000',
    
    // Computed
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development',
    isRedisEnabled: Boolean(redisUrl && redisToken)
  };
}

/**
 * Safely gets an environment variable with optional fallback
 * @param key Environment variable key
 * @param fallback Fallback value if not found
 * @returns Environment variable value or fallback
 */
export function getEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback;
}

/**
 * Gets a required environment variable
 * @param key Environment variable key
 * @throws Error if the variable is not found
 * @returns Environment variable value
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Checks if a specific API service is available
 * @param service Service name
 * @returns Whether the service is configured
 */
export function isServiceAvailable(service: 'youtube' | 'groq' | 'openai' | 'redis'): boolean {
  const serviceKeys = {
    youtube: 'YOUTUBE_API_KEY',
    groq: 'GROQ_API_KEY', 
    openai: 'OPENAI_API_KEY',
    redis: 'UPSTASH_REDIS_REST_URL'
  };
  
  if (service === 'redis') {
    return Boolean(
      process.env.UPSTASH_REDIS_REST_URL && 
      process.env.UPSTASH_REDIS_REST_TOKEN
    );
  }
  
  return Boolean(process.env[serviceKeys[service]]);
}

// Export the config for easy access
export const config = getConfig();

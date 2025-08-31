/**
 * API Client with Version Support
 * Handles versioned API calls with proper headers and error handling
 */

import { Logger } from '../../lib/logger';

export interface ApiResponse<T = any> {
  data: T;
  meta: {
    api_version: string;
    timestamp: string;
    deprecated?: boolean;
    deprecation_notice?: string;
    migration_guide?: string;
  };
}

export interface ApiError {
  error: string;
  code: string;
  timestamp: string;
  api_version: string;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;
  private defaultVersion: string;

  constructor(baseUrl: string = '/api', defaultVersion: string = 'v1') {
    this.baseUrl = baseUrl;
    this.defaultVersion = defaultVersion;
  }

  /**
   * Make a versioned API request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit & { version?: string } = {}
  ): Promise<ApiResponse<T>> {
    const { version = this.defaultVersion, ...fetchOptions } = options;
    
    // Construct URL with version
    const url = `${this.baseUrl}/${version}${endpoint}`;
    
    // Add version headers
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('API-Version', version);
    headers.set('Accept', `application/vnd.validationly.${version}+json`);

    // Add user ID if available (from auth context)
    const user = this.getCurrentUser();
    if (user?.id) {
      headers.set('x-user-id', user.id);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers
      });

      // Check for deprecation warnings
      this.handleDeprecationWarnings(response);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new ApiError(errorData.error, response.status, errorData);
      }

      const data: ApiResponse<T> = await response.json();
      
      // Log successful API call
      Logger.apiCall(endpoint, fetchOptions.method || 'GET', response.status);
      
      return data;

    } catch (error) {
      Logger.error('API request failed', { endpoint, version, error });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error or server unavailable',
        0,
        {
          error: 'Network error',
          code: 'NETWORK_ERROR',
          timestamp: new Date().toISOString(),
          api_version: version
        }
      );
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string, 
    data: any, 
    options: RequestInit & { version?: string } = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string, 
    options: RequestInit & { version?: string } = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * Handle deprecation warnings from API responses
   */
  private handleDeprecationWarnings(response: Response): void {
    const deprecation = response.headers.get('Deprecation');
    const sunset = response.headers.get('Sunset');
    const warning = response.headers.get('Warning');

    if (deprecation || warning) {
      Logger.warn('API version deprecated', {
        version: response.headers.get('API-Version'),
        deprecation,
        sunset,
        warning
      });

      // Show user-friendly deprecation notice
      if (typeof window !== 'undefined') {
        console.warn(
          '⚠️ API Deprecation Notice:', 
          warning || 'This API version is deprecated. Please upgrade to the latest version.'
        );
      }
    }
  }

  /**
   * Get current user from auth context (simplified)
   */
  private getCurrentUser(): { id: string } | null {
    // This would integrate with your auth context
    // For now, return null - implement based on your auth system
    return null;
  }

  /**
   * Get API information
   */
  async getApiInfo(version?: string): Promise<ApiResponse<any>> {
    return this.get('/info', { version });
  }

  /**
   * Validate startup idea
   */
  async validateIdea(
    content: string, 
    analysisType: 'fast' | 'standard' | 'comprehensive' = 'comprehensive',
    version?: string
  ): Promise<ApiResponse<any>> {
    return this.post('/validate', {
      content,
      analysisType
    }, { version });
  }
}

// Custom API Error class
export class ApiError extends Error {
  public status: number;
  public code: string;
  public apiVersion: string;
  public timestamp: string;
  public details?: any;

  constructor(message: string, status: number, errorData: ApiError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = errorData.code;
    this.apiVersion = errorData.api_version;
    this.timestamp = errorData.timestamp;
    this.details = errorData.details;
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Convenience functions
export const validateIdea = (
  content: string, 
  analysisType: 'fast' | 'standard' | 'comprehensive' = 'comprehensive'
) => apiClient.validateIdea(content, analysisType);

export const getApiInfo = () => apiClient.getApiInfo();

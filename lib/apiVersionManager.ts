/**
 * API Version Management System
 * Handles API versioning, routing, and backward compatibility
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Logger } from './logger.js';

// API Version Configuration
export interface ApiVersion {
  version: string;
  releaseDate: string;
  deprecated?: boolean;
  deprecationDate?: string;
  sunsetDate?: string;
  description: string;
  breaking_changes?: string[];
}

// Supported API versions
export const API_VERSIONS: Record<string, ApiVersion> = {
  'v1': {
    version: 'v1',
    releaseDate: '2024-12-31',
    description: 'Initial API version with basic validation features',
    breaking_changes: []
  }
  // Future versions will be added here
  // 'v2': {
  //   version: 'v2',
  //   releaseDate: '2025-03-01',
  //   description: 'Enhanced API with advanced analytics',
  //   breaking_changes: ['Changed response format for /validate endpoint']
  // }
};

// Default version for unversioned requests
export const DEFAULT_API_VERSION = 'v1';

// Version extraction from request
export function extractVersionFromRequest(req: VercelRequest): string {
  // Check URL path first (/api/v1/validate)
  const pathMatch = req.url?.match(/^\/api\/(v\d+)\//);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Check Accept header (Accept: application/vnd.validationly.v1+json)
  const acceptHeader = req.headers.accept;
  if (acceptHeader) {
    const versionMatch = acceptHeader.match(/vnd\.validationly\.(v\d+)\+json/);
    if (versionMatch) {
      return versionMatch[1];
    }
  }

  // Check custom header (API-Version: v1)
  const versionHeader = req.headers['api-version'] as string;
  if (versionHeader && API_VERSIONS[versionHeader]) {
    return versionHeader;
  }

  // Default version
  return DEFAULT_API_VERSION;
}

// Version validation
export function validateApiVersion(version: string): boolean {
  return version in API_VERSIONS;
}

// Get version info
export function getVersionInfo(version: string): ApiVersion | null {
  return API_VERSIONS[version] || null;
}

// Check if version is deprecated
export function isVersionDeprecated(version: string): boolean {
  const versionInfo = API_VERSIONS[version];
  return versionInfo?.deprecated || false;
}

// Check if version is sunset (no longer supported)
export function isVersionSunset(version: string): boolean {
  const versionInfo = API_VERSIONS[version];
  if (!versionInfo?.sunsetDate) return false;
  
  const sunsetDate = new Date(versionInfo.sunsetDate);
  return new Date() > sunsetDate;
}

// Version middleware
export function versionMiddleware(req: VercelRequest, res: VercelResponse, next?: () => void) {
  const version = extractVersionFromRequest(req);
  
  // Validate version
  if (!validateApiVersion(version)) {
    Logger.warn('Invalid API version requested', { version, url: req.url });
    return res.status(400).json({
      error: 'Invalid API version',
      message: `API version '${version}' is not supported`,
      supported_versions: Object.keys(API_VERSIONS),
      current_version: DEFAULT_API_VERSION
    });
  }

  // Check if version is sunset
  if (isVersionSunset(version)) {
    Logger.warn('Sunset API version accessed', { version, url: req.url });
    return res.status(410).json({
      error: 'API version no longer supported',
      message: `API version '${version}' has been sunset and is no longer supported`,
      supported_versions: Object.keys(API_VERSIONS).filter(v => !isVersionSunset(v)),
      migration_guide: `Please upgrade to version '${DEFAULT_API_VERSION}'`
    });
  }

  // Add version info to headers
  const versionInfo = getVersionInfo(version);
  res.setHeader('API-Version', version);
  res.setHeader('API-Version-Release-Date', versionInfo?.releaseDate || '');
  
  // Add deprecation warnings
  if (isVersionDeprecated(version)) {
    Logger.warn('Deprecated API version accessed', { version, url: req.url });
    res.setHeader('Deprecation', versionInfo?.deprecationDate || 'true');
    res.setHeader('Sunset', versionInfo?.sunsetDate || '');
    res.setHeader('Warning', '299 - "This API version is deprecated. Please upgrade to the latest version."');
  }

  // Store version in request for handlers
  (req as any).apiVersion = version;
  
  // Log API usage
  Logger.apiCall(req.url || '', req.method || 'GET', undefined, undefined);
  
  if (next) next();
}

// Response formatter for different versions
export function formatResponse(data: any, version: string): any {
  const versionInfo = getVersionInfo(version);
  
  // Base response structure
  const response = {
    data,
    meta: {
      api_version: version,
      release_date: versionInfo?.releaseDate,
      deprecated: isVersionDeprecated(version),
      timestamp: new Date().toISOString()
    }
  };

  // Add deprecation info if needed
  if (isVersionDeprecated(version)) {
    response.meta = {
      ...response.meta,
      deprecation_notice: 'This API version is deprecated. Please upgrade to the latest version.',
      migration_guide: `https://docs.validationly.com/api/migration/${version}-to-${DEFAULT_API_VERSION}`
    };
  }

  return response;
}

// Version-specific transformations
export function transformResponseForVersion(data: any, version: string): any {
  switch (version) {
    case 'v1':
      // V1 format - current format, no transformation needed
      return data;
      
    // Future versions can have different transformations
    // case 'v2':
    //   return transformToV2Format(data);
      
    default:
      return data;
  }
}

// Error response formatter
export function formatErrorResponse(error: any, version: string): any {
  const baseError = {
    error: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    api_version: version
  };

  // Version-specific error formats
  switch (version) {
    case 'v1':
      return baseError;
      
    default:
      return baseError;
  }
}

// Get all available versions
export function getAvailableVersions(): string[] {
  return Object.keys(API_VERSIONS).filter(v => !isVersionSunset(v));
}

// Get version changelog
export function getVersionChangelog(version: string): any {
  const versionInfo = getVersionInfo(version);
  if (!versionInfo) return null;

  return {
    version: versionInfo.version,
    release_date: versionInfo.releaseDate,
    description: versionInfo.description,
    breaking_changes: versionInfo.breaking_changes || [],
    deprecated: versionInfo.deprecated || false,
    deprecation_date: versionInfo.deprecationDate,
    sunset_date: versionInfo.sunsetDate
  };
}

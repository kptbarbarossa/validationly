/**
 * Secure Logger Utility
 * Prevents sensitive data logging in production
 */

interface LogData {
  [key: string]: any;
}

export class Logger {
  private static isProduction = process.env.NODE_ENV === 'production';

  /**
   * Debug logging - only in development
   */
  static debug(message: string, data?: LogData): void {
    if (!this.isProduction) {
      console.log(`🔍 DEBUG: ${message}`, data || '');
    }
  }

  /**
   * Info logging - only in development
   */
  static info(message: string, data?: LogData): void {
    if (!this.isProduction) {
      console.log(`ℹ️ INFO: ${message}`, data || '');
    }
  }

  /**
   * Success logging - only in development
   */
  static success(message: string, data?: LogData): void {
    if (!this.isProduction) {
      console.log(`✅ SUCCESS: ${message}`, data || '');
    }
  }

  /**
   * Warning logging - always log but sanitize in production
   */
  static warn(message: string, data?: LogData): void {
    if (this.isProduction) {
      console.warn(`⚠️ WARNING: ${message}`);
    } else {
      console.warn(`⚠️ WARNING: ${message}`, data || '');
    }
  }

  /**
   * Error logging - always log but sanitize sensitive data
   */
  static error(message: string, error?: Error | LogData): void {
    if (this.isProduction) {
      // In production, only log the message and error type
      const errorType = error instanceof Error ? error.name : 'Unknown';
      console.error(`❌ ERROR: ${message} [${errorType}]`);
    } else {
      console.error(`❌ ERROR: ${message}`, error || '');
    }
  }

  /**
   * API call logging - sanitized for production
   */
  static apiCall(endpoint: string, method: string, status?: number, duration?: number): void {
    const logMessage = `API ${method.toUpperCase()} ${endpoint}`;
    
    if (this.isProduction) {
      console.log(`🌐 ${logMessage} - ${status || 'pending'}`);
    } else {
      console.log(`🌐 ${logMessage}`, {
        status: status || 'pending',
        duration: duration ? `${duration}ms` : 'measuring...'
      });
    }
  }

  /**
   * Performance logging - only in development
   */
  static perf(operation: string, duration: number): void {
    if (!this.isProduction) {
      console.log(`⚡ PERF: ${operation} completed in ${duration}ms`);
    }
  }

  /**
   * Security event logging - always log but minimal info in production
   */
  static security(event: string, details?: LogData): void {
    if (this.isProduction) {
      console.warn(`🔒 SECURITY: ${event}`);
    } else {
      console.warn(`🔒 SECURITY: ${event}`, details || '');
    }
  }
}

// Convenience exports
export const { debug, info, success, warn, error, apiCall, perf, security } = Logger;

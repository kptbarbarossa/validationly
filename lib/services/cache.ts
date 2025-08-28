// Simple file-based cache system for Vercel
import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

interface CacheItem {
    data: any;
    timestamp: number;
    ttl: number;
}

class SimpleCache {
    private cacheDir = '/tmp/validationly-cache';
    private memoryCache = new Map<string, CacheItem>();
    private maxMemoryItems = 50; // Limit memory cache size for serverless
    private maxFileSize = 200 * 1024 * 1024; // 200MB file cache limit (conservative)

    constructor() {
        this.ensureCacheDir();
        this.startPeriodicCleanup();
    }

    private startPeriodicCleanup() {
        // In serverless, we can't rely on long-running timers
        // Clean up on every 10th cache operation instead
        if (Math.random() < 0.1) { // 10% chance
            this.cleanupMemory();
        }
    }

    private cleanupMemory() {
        // LRU eviction - keep only most recent items
        if (this.memoryCache.size > this.maxMemoryItems) {
            const entries = Array.from(this.memoryCache.entries());
            // Sort by timestamp (most recent first)
            entries.sort((a, b) => b[1].timestamp - a[1].timestamp);

            this.memoryCache.clear();
            // Keep only the most recent items
            entries.slice(0, this.maxMemoryItems).forEach(([key, value]) => {
                this.memoryCache.set(key, value);
            });

            console.log(`Memory cache cleaned up, kept ${this.maxMemoryItems} items`);
        }
    }

    private async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
    }

    private hashKey(key: string): string {
        return createHash('md5').update(key).digest('hex');
    }

    private isExpired(item: CacheItem): boolean {
        return Date.now() > (item.timestamp + item.ttl);
    }

    async get(key: string): Promise<any | null> {
        // Trigger periodic cleanup
        this.startPeriodicCleanup();

        // Check memory cache first (fastest)
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem && !this.isExpired(memoryItem)) {
            // Update access time for LRU
            memoryItem.timestamp = Date.now();
            return memoryItem.data;
        }

        // Check file cache (slower, but persistent across function calls)
        try {
            const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const item: CacheItem = JSON.parse(fileContent);

            if (!this.isExpired(item)) {
                // Warm memory cache for next access
                this.memoryCache.set(key, item);
                return item.data;
            } else {
                // Remove expired file
                await fs.unlink(filePath).catch(() => { });
            }
        } catch (error) {
            // File doesn't exist or is corrupted - this is normal
        }

        return null;
    }

    async set(key: string, data: any, ttlMs: number): Promise<void> {
        const item: CacheItem = {
            data,
            timestamp: Date.now(),
            ttl: ttlMs
        };

        // Set in memory (always)
        this.memoryCache.set(key, item);

        // Set in file (best effort - may fail in serverless)
        try {
            const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);

            // Check if we're approaching file size limits
            const dataSize = JSON.stringify(item).length;
            if (dataSize > 1024 * 1024) { // Skip files larger than 1MB
                console.warn(`Skipping file cache for large item: ${dataSize} bytes`);
                return;
            }

            await fs.writeFile(filePath, JSON.stringify(item));
        } catch (error) {
            // File write failed - this is expected in some serverless environments
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.warn('Cache file write failed (using memory only):', errorMessage);
        }
    }

    async cleanup(): Promise<void> {
        try {
            const files = await fs.readdir(this.cacheDir);
            let totalSize = 0;
            const fileStats: Array<{ path: string; size: number; mtime: Date }> = [];

            // Collect file stats
            for (const file of files) {
                try {
                    const filePath = path.join(this.cacheDir, file);
                    const stats = await fs.stat(filePath);
                    totalSize += stats.size;
                    fileStats.push({
                        path: filePath,
                        size: stats.size,
                        mtime: stats.mtime
                    });

                    // Check if file content is expired
                    const content = await fs.readFile(filePath, 'utf-8');
                    const item: CacheItem = JSON.parse(content);

                    if (this.isExpired(item)) {
                        await fs.unlink(filePath);
                        totalSize -= stats.size;
                    }
                } catch (error) {
                    // Remove corrupted files
                    await fs.unlink(path.join(this.cacheDir, file)).catch(() => { });
                }
            }

            // If still over size limit, remove oldest files
            if (totalSize > this.maxFileSize) {
                fileStats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

                for (const fileInfo of fileStats) {
                    if (totalSize <= this.maxFileSize) break;

                    try {
                        await fs.unlink(fileInfo.path);
                        totalSize -= fileInfo.size;
                    } catch (error) {
                        // File already deleted
                    }
                }
            }

            console.log(`Cache cleanup completed. Total size: ${Math.round(totalSize / 1024 / 1024)}MB`);
        } catch (error) {
            console.error('Cache cleanup error:', error);
        }
    }

    // Get cache statistics
    getCacheStats(): { memoryItems: number; estimatedMemorySize: string } {
        const memoryItems = this.memoryCache.size;
        const estimatedSize = Array.from(this.memoryCache.values())
            .reduce((total, item) => total + JSON.stringify(item).length, 0);

        return {
            memoryItems,
            estimatedMemorySize: `${Math.round(estimatedSize / 1024)}KB`
        };
    }
}

// Cache TTL constants (in milliseconds) - Optimized for serverless
export const CACHE_TTL = {
    REDDIT: 3 * 60 * 60 * 1000,        // 3 hours (frequent updates)
    HACKERNEWS: 6 * 60 * 60 * 1000,    // 6 hours (moderate updates)
    PRODUCTHUNT: 8 * 60 * 60 * 1000,   // 8 hours (daily products)
    GOOGLENEWS: 2 * 60 * 60 * 1000,    // 2 hours (news changes fast)
    GITHUB: 12 * 60 * 60 * 1000,       // 12 hours (repos don't change often)
    STACKOVERFLOW: 6 * 60 * 60 * 1000, // 6 hours (questions/answers)
    YOUTUBE: 12 * 60 * 60 * 1000,      // 12 hours (videos don't change)
  
    UPWORK: 2 * 60 * 60 * 1000,        // 2 hours (job postings change frequently)

    // Short-term cache for API responses
    SHORT: 15 * 60 * 1000,             // 15 minutes
    MEDIUM: 60 * 60 * 1000,            // 1 hour
    LONG: 6 * 60 * 60 * 1000,          // 6 hours
};

export const cache = new SimpleCache();
// Utility function for cache-aware API calls
export async function withCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
    // Try cache first
    const cached = await cache.get(key);
    if (cached) {
        return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();

    // Cache the result
    await cache.set(key, data, ttl);

    return data;
}

// Memory-only cache for session data
class SessionCache {
    private cache = new Map<string, { data: any; expires: number }>();
    private maxItems = 20; // Very limited for memory efficiency

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item || Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }

    set(key: string, data: any, ttlMs: number = CACHE_TTL.SHORT): void {
        // Clean up if we're at capacity
        if (this.cache.size >= this.maxItems) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        this.cache.set(key, {
            data,
            expires: Date.now() + ttlMs
        });
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

export const sessionCache = new SessionCache();
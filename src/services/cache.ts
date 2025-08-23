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

  constructor() {
    this.ensureCacheDir();
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
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data;
    }

    // Check file cache
    try {
      const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const item: CacheItem = JSON.parse(fileContent);
      
      if (!this.isExpired(item)) {
        // Warm memory cache
        this.memoryCache.set(key, item);
        return item.data;
      } else {
        // Remove expired file
        await fs.unlink(filePath).catch(() => {});
      }
    } catch (error) {
      // File doesn't exist or is corrupted
    }

    return null;
  }

  async set(key: string, data: any, ttlMs: number): Promise<void> {
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    };

    // Set in memory
    this.memoryCache.set(key, item);

    // Set in file
    try {
      const filePath = path.join(this.cacheDir, `${this.hashKey(key)}.json`);
      await fs.writeFile(filePath, JSON.stringify(item));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();
      
      for (const file of files) {
        try {
          const filePath = path.join(this.cacheDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const item: CacheItem = JSON.parse(content);
          
          if (this.isExpired(item)) {
            await fs.unlink(filePath);
          }
        } catch (error) {
          // Remove corrupted files
          await fs.unlink(path.join(this.cacheDir, file)).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  REDDIT: 6 * 60 * 60 * 1000,        // 6 hours
  HACKERNEWS: 12 * 60 * 60 * 1000,   // 12 hours
  PRODUCTHUNT: 12 * 60 * 60 * 1000,  // 12 hours
  GOOGLENEWS: 6 * 60 * 60 * 1000,    // 6 hours
  GITHUB: 24 * 60 * 60 * 1000,       // 24 hours
  STACKOVERFLOW: 12 * 60 * 60 * 1000, // 12 hours
  YOUTUBE: 24 * 60 * 60 * 1000,      // 24 hours
};

export const cache = new SimpleCache();
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      storage: options.storage || 'memory'
    };

    // Load from storage if not memory
    if (this.options.storage !== 'memory') {
      this.loadFromStorage();
    }
  }

  private getStorageKey(key: string): string {
    return `validationly_cache_${key}`;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    const storage = this.options.storage === 'localStorage' ? localStorage : sessionStorage;
    
    try {
      const keys = Object.keys(storage).filter(key => key.startsWith('validationly_cache_'));
      
      keys.forEach(storageKey => {
        const data = storage.getItem(storageKey);
        if (data) {
          const entry: CacheEntry<T> = JSON.parse(data);
          const key = storageKey.replace('validationly_cache_', '');
          
          // Check if not expired
          if (entry.expiresAt > Date.now()) {
            this.cache.set(key, entry);
          } else {
            storage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(key: string, entry: CacheEntry<T>): void {
    if (typeof window === 'undefined' || this.options.storage === 'memory') return;

    const storage = this.options.storage === 'localStorage' ? localStorage : sessionStorage;
    
    try {
      storage.setItem(this.getStorageKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }

  private removeFromStorage(key: string): void {
    if (typeof window === 'undefined' || this.options.storage === 'memory') return;

    const storage = this.options.storage === 'localStorage' ? localStorage : sessionStorage;
    storage.removeItem(this.getStorageKey(key));
  }

  set(key: string, data: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.delete(oldestKey);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.options.ttl
    };

    this.cache.set(key, entry);
    this.saveToStorage(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.removeFromStorage(key);
  }

  clear(): void {
    if (typeof window !== 'undefined' && this.options.storage !== 'memory') {
      const storage = this.options.storage === 'localStorage' ? localStorage : sessionStorage;
      const keys = Object.keys(storage).filter(key => key.startsWith('validationly_cache_'));
      keys.forEach(key => storage.removeItem(key));
    }
    
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Global cache instances
const apiCache = new CacheManager<any>({ 
  ttl: 5 * 60 * 1000, // 5 minutes
  storage: 'sessionStorage' 
});

const validationCache = new CacheManager<any>({ 
  ttl: 30 * 60 * 1000, // 30 minutes
  storage: 'localStorage' 
});

const userDataCache = new CacheManager<any>({ 
  ttl: 10 * 60 * 1000, // 10 minutes
  storage: 'sessionStorage' 
});

// React hook for caching
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions & { enabled?: boolean } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cache = options.storage === 'localStorage' ? validationCache : 
                options.storage === 'sessionStorage' ? userDataCache : apiCache;

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (options.enabled === false) return;

    // Check cache first
    if (!forceRefresh) {
      const cachedData = cache.get(key);
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache, options.enabled]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(null);
  }, [key, cache]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    refetch: fetchData
  };
}

// Specialized hooks
export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled = true
) {
  return useCache(key, fetcher, { 
    ttl: 5 * 60 * 1000,
    storage: 'sessionStorage',
    enabled 
  });
}

export function useValidationCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled = true
) {
  return useCache(key, fetcher, { 
    ttl: 30 * 60 * 1000,
    storage: 'localStorage',
    enabled 
  });
}

export function useUserDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  enabled = true
) {
  return useCache(key, fetcher, { 
    ttl: 10 * 60 * 1000,
    storage: 'sessionStorage',
    enabled 
  });
}

// Cache utilities
export const cacheUtils = {
  api: apiCache,
  validation: validationCache,
  userData: userDataCache,
  
  clearAll() {
    apiCache.clear();
    validationCache.clear();
    userDataCache.clear();
  },
  
  getStats() {
    return {
      api: { size: apiCache.size(), keys: apiCache.keys() },
      validation: { size: validationCache.size(), keys: validationCache.keys() },
      userData: { size: userDataCache.size(), keys: userDataCache.keys() }
    };
  }
};

export default useCache;
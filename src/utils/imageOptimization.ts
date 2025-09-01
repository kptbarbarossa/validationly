// Image optimization utilities for better performance

interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
}

// Lazy loading image component props
export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Generate optimized image URL (for services like Cloudinary, ImageKit, etc.)
export function getOptimizedImageUrl(
  src: string, 
  options: ImageOptimizationOptions = {}
): string {
  const {
    quality = 80,
    maxWidth,
    maxHeight,
    format = 'webp'
  } = options;

  // If it's already an external optimized URL, return as is
  if (src.includes('cloudinary.com') || src.includes('imagekit.io')) {
    return src;
  }

  // For local images or basic URLs, we can add query parameters
  // This would work with services that support URL-based transformations
  const url = new URL(src, window.location.origin);
  
  if (quality !== 80) url.searchParams.set('q', quality.toString());
  if (maxWidth) url.searchParams.set('w', maxWidth.toString());
  if (maxHeight) url.searchParams.set('h', maxHeight.toString());
  if (format !== 'webp') url.searchParams.set('f', format);

  return url.toString();
}

// Generate responsive image srcSet
export function generateSrcSet(src: string, widths: number[] = [640, 768, 1024, 1280, 1536]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(src, { maxWidth: width })} ${width}w`)
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizes(breakpoints: { [key: string]: string } = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  default: '33vw'
}): string {
  const entries = Object.entries(breakpoints);
  const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const defaultSize = breakpoints.default || '100vw';
  
  return [...mediaQueries, defaultSize].join(', ');
}

// Preload critical images
export function preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = reject;
    
    // Set srcset for responsive preloading
    if (options.maxWidth) {
      img.src = getOptimizedImageUrl(src, options);
    } else {
      img.srcset = generateSrcSet(src);
      img.sizes = generateSizes();
      img.src = getOptimizedImageUrl(src, { maxWidth: 1024 });
    }
  });
}

// Lazy loading intersection observer
class LazyImageObserver {
  private observer: IntersectionObserver | null = null;
  private images = new Set<HTMLImageElement>();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.observer?.unobserve(img);
              this.images.delete(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }
  }

  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.images.add(img);
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  unobserve(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.unobserve(img);
      this.images.delete(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
    
    if (srcset) {
      img.srcset = srcset;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-loaded');
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

// Global lazy image observer instance
export const lazyImageObserver = new LazyImageObserver();

// Image compression utility
export async function compressImage(
  file: File, 
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Convert image to WebP format
export async function convertToWebP(file: File, quality = 0.8): Promise<Blob> {
  return compressImage(file, { format: 'webp', quality });
}

// Check WebP support
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Generate blur placeholder
export function generateBlurPlaceholder(width = 10, height = 10): string {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

// Performance monitoring for images
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics = new Map<string, {
    loadTime: number;
    size: number;
    format: string;
    cached: boolean;
  }>();

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }

  trackImageLoad(src: string, startTime: number, size?: number): void {
    const loadTime = performance.now() - startTime;
    const format = src.split('.').pop()?.toLowerCase() || 'unknown';
    
    this.metrics.set(src, {
      loadTime,
      size: size || 0,
      format,
      cached: loadTime < 50 // Assume cached if very fast
    });
  }

  getMetrics(): Array<{ src: string; metrics: any }> {
    return Array.from(this.metrics.entries()).map(([src, metrics]) => ({
      src,
      metrics
    }));
  }

  getAverageLoadTime(): number {
    const times = Array.from(this.metrics.values()).map(m => m.loadTime);
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const imagePerformanceMonitor = ImagePerformanceMonitor.getInstance();
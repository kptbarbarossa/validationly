import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './LoadingStates';

// Lazy load heavy components to reduce initial bundle size
export const LazyIdeaHistory = lazy(() => import('./IdeaHistory'));
export const LazyExportShare = lazy(() => import('./ExportShare'));
export const LazyAdvancedFilters = lazy(() => import('./AdvancedFilters'));

// Lazy load pages
export const LazyDashboardPage = lazy(() => import('../pages/DashboardPage'));
export const LazyResultsPage = lazy(() => import('../pages/ResultsPage'));
export const LazyProfilePage = lazy(() => import('../pages/ProfilePage'));

// Loading fallback component
const ComponentLoader: React.FC<{ 
  height?: string;
  message?: string;
}> = ({ height = 'h-32', message = 'Loading...' }) => (
  <div className={`flex items-center justify-center ${height}`}>
    <div className="text-center">
      <LoadingSpinner size="lg" className="mb-2" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  </div>
);

// Wrapper components with suspense
export const IdeaHistoryLazy: React.FC<React.ComponentProps<typeof LazyIdeaHistory>> = (props) => (
  <Suspense fallback={<ComponentLoader height="h-64" message="Loading idea history..." />}>
    <LazyIdeaHistory {...props} />
  </Suspense>
);

export const ExportShareLazy: React.FC<React.ComponentProps<typeof LazyExportShare>> = (props) => (
  <Suspense fallback={<ComponentLoader height="h-48" message="Loading export options..." />}>
    <LazyExportShare {...props} />
  </Suspense>
);

export const AdvancedFiltersLazy: React.FC<React.ComponentProps<typeof LazyAdvancedFilters>> = (props) => (
  <Suspense fallback={<ComponentLoader height="h-24" message="Loading filters..." />}>
    <LazyAdvancedFilters {...props} />
  </Suspense>
);

// Page wrappers
export const DashboardPageLazy: React.FC = () => (
  <Suspense fallback={<ComponentLoader height="h-screen" message="Loading dashboard..." />}>
    <LazyDashboardPage />
  </Suspense>
);

export const ResultsPageLazy: React.FC = () => (
  <Suspense fallback={<ComponentLoader height="h-screen" message="Loading results..." />}>
    <LazyResultsPage />
  </Suspense>
);

export const ProfilePageLazy: React.FC = () => (
  <Suspense fallback={<ComponentLoader height="h-screen" message="Loading profile..." />}>
    <LazyProfilePage />
  </Suspense>
);

// Dynamic import utility for other components
export async function loadComponent<T = any>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): Promise<React.ComponentType> {
  try {
    const module = await importFn();
    return module.default as React.ComponentType;
  } catch (error) {
    console.error('Failed to load component:', error);
    return fallback || (() => React.createElement('div', { children: 'Failed to load component' }));
  }
}

// Code splitting utility for features
export const createLazyFeature = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallbackHeight = 'h-32'
) => {
  const LazyComponent = lazy(importFn);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <Suspense fallback={<ComponentLoader height={fallbackHeight} />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Preload components for better UX
export const preloadComponents = {
  ideaHistory: () => import('./IdeaHistory'),
  exportShare: () => import('./ExportShare'),
  advancedFilters: () => import('./AdvancedFilters'),
  dashboard: () => import('../pages/DashboardPage'),
  results: () => import('../pages/ResultsPage'),
  profile: () => import('../pages/ProfilePage')
};

// Preload on user interaction
export const preloadOnHover = (componentName: keyof typeof preloadComponents) => {
  return {
    onMouseEnter: () => preloadComponents[componentName](),
    onFocus: () => preloadComponents[componentName]()
  };
};

// Bundle analyzer helper (development only)
export const bundleInfo = {
  getChunkInfo: () => {
    if (process.env.NODE_ENV === 'development') {
      return {
        totalChunks: performance.getEntriesByType('navigation').length,
        loadedChunks: document.querySelectorAll('script[src*="chunk"]').length,
        timestamp: Date.now()
      };
    }
    return null;
  },
  
  logBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const totalSize = scripts.reduce((size, script) => {
        const src = (script as HTMLScriptElement).src;
        return size + (src.length * 2); // Rough estimate
      }, 0);
      
      console.log('📦 Bundle Info:', {
        scripts: scripts.length,
        estimatedSize: `${(totalSize / 1024).toFixed(2)}KB`,
        chunks: scripts.filter(s => s.src.includes('chunk')).length
      });
    }
  }
};

export default {
  IdeaHistoryLazy,
  ExportShareLazy,
  AdvancedFiltersLazy,
  DashboardPageLazy,
  ResultsPageLazy,
  ProfilePageLazy,
  createLazyFeature,
  preloadOnHover,
  bundleInfo
};
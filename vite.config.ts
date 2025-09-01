
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
  },
  plugins: [
    react({
      // Disable TypeScript checking in production
      typescript: process.env.NODE_ENV === 'production' ? false : undefined
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'https://validationly.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          // Split pages into smaller chunks
          if (id.includes('src/pages')) {
            if (id.includes('HomePage') || id.includes('AuthPage')) {
              return 'core-pages';
            }
            if (id.includes('ResultsPage') || id.includes('AnalysisPage')) {
              return 'analysis-pages';
            }
            if (id.includes('blog/') || id.includes('BlogPage')) {
              return 'blog-pages';
            }
            if (id.includes('JobTailor') || id.includes('Dashboard') || id.includes('Profile')) {
              return 'user-pages';
            }
            return 'other-pages';
          }
          // Split components
          if (id.includes('src/components')) {
            if (id.includes('PremiumNavBar') || id.includes('Analytics')) {
              return 'core-components';
            }
            return 'ui-components';
          }
          // Services and utilities
          if (id.includes('src/services')) {
            return 'services';
          }
          if (id.includes('src/utils') || id.includes('src/lib')) {
            return 'utils';
          }
          // Context and hooks
          if (id.includes('src/contexts') || id.includes('src/hooks')) {
            return 'contexts';
          }
          // Large third-party libraries
          if (id.includes('node_modules')) {
            // Split large libraries into separate chunks
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('tailwindcss')) return 'tailwind';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('framer-motion')) return 'animations';
            // Other node_modules go to vendor
            return 'vendor';
          }
        }
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    assetsInlineLimit: 4096 // Inline assets smaller than 4KB
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})

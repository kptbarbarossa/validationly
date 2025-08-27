
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})

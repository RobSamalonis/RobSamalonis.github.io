import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For main GitHub Pages site (username.github.io), use root path
  // For project pages (username.github.io/project-name), use '/project-name/'
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Performance optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'animation-vendor': ['framer-motion'],
          
          // Feature chunks
          'sections': [
            './src/components/sections/Hero.tsx',
            './src/components/sections/Resume.tsx', 
            './src/components/sections/Contact.tsx'
          ],
          'common': [
            './src/components/common/AnimatedSection.tsx',
            './src/components/common/EntranceAnimation.tsx',
            './src/components/common/PageTransition.tsx'
          ]
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps for debugging (disable in production for smaller bundles)
    sourcemap: false,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  // Development optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay for better development experience
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'framer-motion'
    ]
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite configuration
 * Defines build settings and aliases
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Optimisations pour environnements restreints
    minify: 'terser',
    sourcemap: false,
    // Augmenter la verbosité pour le débogage
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // Paramètres Terser pour économiser la mémoire
    terserOptions: {
      compress: {
        // Désactiver certaines optimisations coûteuses en mémoire
        passes: 1,
        drop_console: false,
        sequences: false
      }
    }
  }
})

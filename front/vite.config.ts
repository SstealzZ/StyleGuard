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
    // Utiliser esbuild par défaut au lieu de terser
    minify: 'esbuild',
    sourcemap: false,
    // Augmenter la verbosité pour le débogage
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  }
})

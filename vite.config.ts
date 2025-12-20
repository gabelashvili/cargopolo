import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.tsx'),
      },
      output: {
        format: 'iife', // Self-executing function for content scripts
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: assetInfo => {
          // Put CSS in assets folder so relative paths to fonts work
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/content.css'
          }
          return 'assets/[name].[ext]'
        },
        inlineDynamicImports: true, // Bundle everything into one file
      },
    },
    cssCodeSplit: false,
    target: 'es2020', // Modern browser target
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})

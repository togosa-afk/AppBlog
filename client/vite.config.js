import { defineConfig } from 'vitest/config' 
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://server:3003',
        changeOrigin: true
      }
    },
    host: true, 
    port: 5173,
    allowedHosts: true,
    watch: {
      usePolling: true 
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testsetup.js',
  }
})
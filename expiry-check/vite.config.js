import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Any request to /api/* gets proxied to the backend
      // This eliminates ALL CORS issues in development
      '/api': {
        target: 'http://localhost:5129',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

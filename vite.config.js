import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure asset URLs are rooted correctly when deployed under a custom domain
  base: '/',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['zustand', 'date-fns'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  }
})

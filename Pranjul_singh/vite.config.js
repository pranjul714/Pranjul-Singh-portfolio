import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries cached separately — won't re-download on updates
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          ui: ['lucide-react'],
        },
      },
    },
    // Raise warning threshold to avoid noise during build
    chunkSizeWarningLimit: 1000,
  },
})


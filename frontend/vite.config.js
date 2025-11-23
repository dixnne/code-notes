import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Mantenemos la separación de vendor y editor para optimizar
          vendor: ['react', 'react-dom', 'react-router-dom'],
          editor: ['@uiw/react-md-editor', '@uiw/react-codemirror'],
        },
      },
    },
  },
})
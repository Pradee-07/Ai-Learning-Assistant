import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'markdown-vendor': ['react-markdown', 'react-syntax-highlighter'],
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
      }
    }
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  }
})

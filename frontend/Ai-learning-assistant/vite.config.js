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
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react')) return 'react-vendor';
                if (id.includes('lucide-react') || id.includes('react-hot-toast')) return 'ui-vendor';
                if (id.includes('react-markdown') || id.includes('react-syntax-highlighter')) return 'markdown-vendor';
                return 'vendor';
              }
            }
          }
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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  publicDir: 'public',
  ssgOptions: {
    includedRoutes() {
      return [
        '/', '/work', '/work/yuga-platform', '/work/powerflex-multicloud', '/work/emerson-iot',
        '/about', '/resume', '/contact', '/lab', '/privacy', '/404',
      ]
    },
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    target: 'esnext',
    chunkSizeWarningLimit: 550,
    terserOptions: {
      compress: {
        drop_console: true,
        unused: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {}
  },
  server: {
    port: 5173,
    strictPort: false,
    host: '0.0.0.0',
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws'
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    proxy: { '/api': 'http://127.0.0.1:3001' }
  }
})

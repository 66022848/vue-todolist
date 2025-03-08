import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/vue-todolist/',
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'a',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash:6].[ext]',
        chunkFileNames: 'assets/[name].[hash:6].js',
        entryFileNames: 'assets/[name].[hash:6].js',
      }
    }
  }
});
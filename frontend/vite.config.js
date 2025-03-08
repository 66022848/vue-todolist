import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/vue-todolist/', // สำหรับ GitHub Pages
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // ใช้ตอนพัฒนา
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  define: {
    'process.env': {}, // เพื่อให้โค้ดที่ใช้ process.env ทำงานได้
  },
});
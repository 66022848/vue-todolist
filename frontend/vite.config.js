import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
<<<<<<< HEAD
  base: '/vue-todolist/',
  plugins: [vue()],
=======
  plugins: [vue()],
  base: '/vue-todolist/',
>>>>>>> gh-pages
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
<<<<<<< HEAD
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
=======
    assetsDir: 'a',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash:6].[ext]',
        chunkFileNames: 'assets/[name].[hash:6].js',
        entryFileNames: 'assets/[name].[hash:6].js',
>>>>>>> gh-pages
      }
    }
  }
});
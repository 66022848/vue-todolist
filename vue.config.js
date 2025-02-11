const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // URL ของ backend (Node.js)
        changeOrigin: true,  // เปลี่ยน origin ของคำขอ
        secure: false,       // ถ้าไม่ได้ใช้ HTTPS
      },
    },
  },
});

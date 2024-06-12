import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: './',
  server: {
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: 'Cuadrícula de Cajas',
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
});
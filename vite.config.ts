import { defineConfig } from 'vite';

export default defineConfig({
  base: '/PhaserCorp/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
});
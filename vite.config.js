import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      containers: path.resolve(__dirname, './src/containers'),
      context: path.resolve(__dirname, './src/context'),
      library: path.resolve(__dirname, './src/library'),
      settings: path.resolve(__dirname, './src/settings'),
      themes: path.resolve(__dirname, './src/themes'),
    },
  },
  build: {
    outDir: 'build',
  },
  define: {
    global: 'window',
  },
  server: {
    host: true, 
    port: 5173, 
  },
});

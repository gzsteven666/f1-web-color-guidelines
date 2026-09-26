import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    modulePreload: false,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@surface': path.resolve(__dirname, '../assets/surface'),
      'lenis': path.resolve(__dirname, './node_modules/lenis'),
      'three': path.resolve(__dirname, './node_modules/three'),
    },
  },
  server: {
    fs: {
      // 允许访问上级目录 assets/surface 中的共享核心
      allow: ['..'],
    },
  },
})


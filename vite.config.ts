import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
  },
  optimizeDeps: {
    include: ['@tanstack/react-router', '@tanstack/react-start', 'react', 'react-dom'],
  },
  preview: {
    port: 4173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
  plugins: [tanstackStart({ srcDirectory: 'app' }), viteReact(), tailwindcss()],
})

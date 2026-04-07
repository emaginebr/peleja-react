import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'peleja-react/style.css': resolve(__dirname, '..', 'dist', 'peleja-react.css'),
    },
  },
})

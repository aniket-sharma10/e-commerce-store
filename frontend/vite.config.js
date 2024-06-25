import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerce-store-ten-orpin.vercel.app',
        secure: false
      }
    }
  },
  build: {
    outDir: 'frontend/dist', // Specify the output directory
  }
})

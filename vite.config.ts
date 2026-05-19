import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/start-vite-plugin'

export default defineConfig({
  plugins: [
    tanstackStart({ 
      target: 'vercel'  // Add this line
    }),
    react(),
  ],
})

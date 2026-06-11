import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use root-relative paths so /privacy and /terms load assets correctly on Vercel.
  base: '/',
})

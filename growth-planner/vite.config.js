import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pin the dev port so the local URL is stable and matches the Supabase
  // OAuth redirect allow-list. strictPort fails loudly instead of silently
  // bumping to 5174/5175 (which would break the Google sign-in redirect).
  server: { port: 5173, strictPort: true },
})

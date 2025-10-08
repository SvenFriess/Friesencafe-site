import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ exakt Repo-Name beachten (Großbuchstaben zählen)
export default defineConfig({
  base: '/Friesencafe-site/',
  plugins: [react()],
})
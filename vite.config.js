import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BASE_PATH env var is set during GitHub Pages build to /cars24-certificate-portal/
// For Netlify (root deployment) it stays as '/'.
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on 0.0.0.0 so LAN devices can connect
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'jin-parablastic-kathrine.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.lhr.life',      // localhost.run tunnel domains
      '.localhost.run',
      '.serveo.net',    // serveo fallback
      '.trycloudflare.com',
    ],
    // Proxy /api to the background-removal backend so a single public
    // tunnel on :5173 covers everything (no separate backend tunnel needed).
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

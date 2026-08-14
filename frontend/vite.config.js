import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'kora-frontend.gentlestone-6c3db93a.swedencentral.azurecontainerapps.io'
    ]
  }
})
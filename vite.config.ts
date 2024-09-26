
import { defineConfig, loadEnv, type command, type mode, ConfigEnv } from 'vite'

import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig(({ _, mode }: { _: command, mode: mode }) => {
  // Load env file based on `mode` in the current working directory.
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      global: 'globalThis', // Use globalThis to polyfill global
    },
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})


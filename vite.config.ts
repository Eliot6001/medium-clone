import { defineConfig, loadEnv, ConfigEnv } from "vite";

import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  // Load env file based on `mode` in the current working directory.
  loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(),
          visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true }),
    ],
    define: {
      global: "globalThis", // Use globalThis to polyfill global
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "three",
              // any other big libs
            ],
            "vendor-supabase": ["@supabase/supabase-js"],
          },
        },
      },
    },
  };
});

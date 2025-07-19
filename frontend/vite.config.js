import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      '/api/products': {
        target: 'https://www.defya.com.tr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/products/, '/XMLExport/30C05A9154B14A65AF058F8CF7403661'),
      },
    },
  },
});

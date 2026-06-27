// vite.config.ts
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { sitemapPlugin } from 'vite-plugin-sitemap'; // ✅ Add this

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    sitemapPlugin({ // ✅ Sitemap plugin
      hostname: 'https://annatravelagency.com',
      routes: [
        '/',
        '/listings',
        '/schedule',
        '/about',
        '/contact',
        '/login',
        '/signup',
        '/terms',
        '/privacy',
        '/refund',
        '/tickets',
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
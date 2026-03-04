import { v4wp } from "@kucrut/vite-for-wp";
import react from "@vitejs/plugin-react";
import path from "path"

export default {
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    origin: 'http://localhost:5174',
    hmr: {
      host: 'localhost',
      protocol: 'ws'
    },
  },
  plugins: [
    v4wp({
      input: "src/admin/main.jsx",
      outDir: "assets/admin/dist",
    }),
    // wp_scripts(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

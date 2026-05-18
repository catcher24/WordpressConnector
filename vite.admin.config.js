import { defineConfig } from "vite";
import { v4wp } from "@kucrut/vite-for-wp";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      origin: "http://localhost:5174",
      hmr: {
        host: "localhost",
        protocol: "ws",
      },
    },
    plugins: [
      v4wp({
        input: "src/admin/main.tsx",
        outDir: "assets/admin/dist",
      }),
      react(),
    ],
    build: {
      sourcemap: isDev,
    },
    css: {
      devSourcemap: isDev,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

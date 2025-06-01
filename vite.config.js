import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   base: '/homenest/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
  },
  optimizeDeps: {
    include: [
      "@fortawesome/react-fontawesome",
      "@fortawesome/free-solid-svg-icons",
    ],
  },
});

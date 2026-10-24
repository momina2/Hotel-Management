import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Hotel/",

  server: {
    proxy: {
      "/Hotel/api": {
        target: "https://coreops.pk",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.error("API Proxy Error:", err.message);
          });
        },
      },
    },
  },
});

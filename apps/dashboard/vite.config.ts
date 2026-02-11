import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteRefresh } from "./vite-refresh";

console.log("THIS IS PRODUCTION", process.env.ENV);

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ENV === "production" ? "/[[**|DASHBOARD_BASE_URL|**]]" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) return "vendor";
            if (id.includes("/react/")) return "vendor";
            if (id.includes("react-hook-form")) return "vendor";
            if (id.includes("react-scrollbars-custom")) return "vendor";
            if (id.includes("axios")) return "vendor";
            if (id.includes("dayjs")) return "vendor";
            if (id.includes("home-assistant-js-websocket")) return "ha-websocket";
            if (id.includes("@mdi/")) return "icons";
            if (id.includes("react-icons")) return "icons";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("@radix-ui/")) return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    viteRefresh(),
  ],
});

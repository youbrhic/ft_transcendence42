import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const host = process.env.VITE_API_HOST || env.VITE_API_HOST;

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      hmr: {
        protocol: "wss",
        host,
        clientPort: 443,
      },
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration / Vite 配置文件
// The server proxy is NOT needed here because we use CORS on the FastAPI side.
// 不需要代理配置，因为我们在 FastAPI 端配置了 CORS。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port / 默认 Vite 端口
  },
});

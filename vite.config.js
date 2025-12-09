import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [react()],
        server: mode === "development"
            ? {
                port: 5173,
                proxy: {
                    "/api": {
                        target: "http://localhost:3001",
                        changeOrigin: true,
                    },
                },
            }
            : undefined,
    });
});

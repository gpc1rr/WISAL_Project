import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
        // في جهازك: نوصّل طلبات /api لسيرفر alwaysdata (نفس فكرة vercel.json)
        // عشان كوكي تسجيل الدخول يشتغل. حطي في .env.local:
        // VITE_API_URL=http://localhost:5173
        proxy: {
            '/api': {
                target: 'https://wesal-app.alwaysdata.net',
                changeOrigin: true,
                secure: true,
            },
        },
    },
});

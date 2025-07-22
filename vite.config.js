import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
    server: {
    host: true, // للسماح بالوصول من أي IP
    port: 5173,  // المنفذ اللي يشغّل السيرفر عليه
    allowedHosts: ['.ngrok-free.app'] // اسم نطاق ngrok المسموح به
    // لو تريد السماح لكل نطاقات ngrok ممكن تستخدم ['.ngrok-free.app']
  }
});

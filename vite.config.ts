import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';


export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit()
    ],
    server: {
    host: true, // للسماح بالوصول من أي IP
    port: 5173,  // المنفذ اللي يشغّل السيرفر عليه
    allowedHosts: ['.ngrok-free.app'] // اسم نطاق ngrok المسموح به
    // لو تريد السماح لكل نطاقات ngrok ممكن تستخدم ['.ngrok-free.app']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // ملف تحميل jest-dom وغيره
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: [...configDefaults.exclude, 'e2e/*', 'tests/',
			'tests-examples/'],
    projects: [
      {
        name: 'client',
        environment: 'browser',
        browser: {
          enabled: true,
          provider: 'playwright',
          instances: [{ browser: 'chromium' }]
        },
        include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        exclude: ['src/lib/server/**'],
        setupFiles: ['./vitest-setup-client.ts'] // لو عندك ملف إعداد خاص للـclient
      },
      {
        name: 'server',
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
      }
    ]
  }
});

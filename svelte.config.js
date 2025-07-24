// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer'; // <-- Import this

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        // Add visualizer here:
        process.env.NODE_ENV === 'production' && visualizer({
            filename: 'stats.html', // This file will be generated in your project root
            open: true,              // Automatically open the report in your browser
            gzipSize: true,          // Show gzipped sizes
            brotliSize: true,        // Show Brotli compressed sizes
        }),
    ].filter(Boolean), // Filter out false values if visualizer is conditional
    kit: {
        adapter: adapter()
    }
});
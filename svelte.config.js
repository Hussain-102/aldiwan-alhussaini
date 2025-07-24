// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer'; // <-- Ensure this import is there

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        // Make sure visualizer is NOT wrapped in a 'process.env.NODE_ENV === 'production' &&' check
        // OR, if it is, ensure you run your build in production mode locally.
        visualizer({
            filename: 'stats.html', // This is the file name
            open: true,              // This should open it automatically
            gzipSize: true,          // Shows gzip sizes
            brotliSize: true,        // Shows Brotli compressed sizes
        }),
    ],
    kit: {
        adapter: adapter()
    }
});
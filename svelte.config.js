// svelte.config.js
import adapter from '@sveltejs/adapter-vercel'; // THIS LINE IS CRUCIAL
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'; // Assuming this is correct

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
    ],
    kit: {
        adapter: adapter(),
    }
});
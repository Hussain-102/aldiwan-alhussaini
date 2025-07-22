import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        fafafa: '#fafafa',
      },
    },
  },
  plugins: [],
};

export default config;
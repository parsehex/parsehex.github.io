import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	integrations: [
		vue({
			appEntrypoint: '/src/main.ts',
		}),
	],
	vite: {
		define: {
			__DEV__: process.env.NODE_ENV === 'development',
		},
		plugins: [tailwindcss(), nodePolyfills()],
		build: {
			rollupOptions: {
				external: ['jsdom', 'cssstyle'],
			},
		},
	},
});

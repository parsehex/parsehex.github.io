import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

console.log('Using username', process.env.VITE_GITHUB_ACTOR);

export default defineConfig({
	integrations: [
		vue({
			appEntrypoint: '/src/main.ts',
		}),
	],
	vite: {
		define: {
			__DEV__: process.env.NODE_ENV === 'development',
			VITE_GITHUB_ACTOR: process.env.VITE_GITHUB_ACTOR,
		},
		plugins: [tailwindcss(), nodePolyfills()],
		build: {
			rollupOptions: {
				external: ['jsdom', 'cssstyle'],
			},
		},
	},
});

import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const env = loadEnv('', process.cwd());
console.log('Using username', env.VITE_GITHUB_ACTOR);

export default defineConfig({
	integrations: [
		vue({
			appEntrypoint: '/src/main.ts',
		}),
	],
	vite: {
		define: {
			__DEV__: process.env.NODE_ENV === 'development',
			GITHUB_ACTOR: JSON.stringify(
				env.VITE_GITHUB_ACTOR || process.env.VITE_GITHUB_ACTOR || 'gh_username'
			),
		},
		plugins: [tailwindcss(), nodePolyfills()],
		build: {
			rollupOptions: {
				external: ['jsdom', 'cssstyle'],
			},
		},
	},
});

import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

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
	},
});

import { defineConfig } from 'vitepress';

export default defineConfig(({ mode }) => {
	return {
		base: mode === 'production' ? '/SrcGallery/' : '/',
		title: 'SrcGallery Docs',
		description:
			'Documentation for SrcGallery - a zero-maintenance landing page for your GitHub repositories',
		themeConfig: {
			nav: [
				{ text: 'Get Started', link: '/getting-started' },
				{ text: 'Configuration', link: '/configuration' },
				{ text: 'Development', link: '/development' },
				{ text: 'Plans', link: '/plans' },
			],

			socialLinks: [
				{ icon: 'github', link: 'https://github.com/ProjectDepot/SrcGallery' },
			],
		},
		server: {
			watch: {
				ignored: ['**/src/**'],
			},
		},
	};
});

import type { Config } from './types';

export const userConfig: Partial<Config> = {
	// https://projectdepot.github.io/SrcGallery/config.html
	siteTitle: '{username}',
	profileHeaderCenter: true,
	footer: {
		text: '&copy; 2025 Thomas Mays',
	},
	links: [
		{
			name: 'Mastodon',
			icon: 'brand-mastodon',
			url: 'https://indieweb.social/@parsehex',
		},
		{
			name: 'GitHub',
			icon: 'brand-github',
			url: 'https://github.com/parsehex',
		},
		{
			name: 'LinkedIn',
			icon: 'brand-linkedin',
			url: 'https://www.linkedin.com/in/thomas-mays-2036b643/',
		},
		{
			name: 'Buy Me A Coffee',
			icon: 'mug',
			url: 'https://buymeacoffee.com/parsehex',
		},
		{
			name: 'Patreon',
			icon: 'brand-patreon',
			url: 'https://patreon.com/parsehex',
		},
		{
			name: 'Ko-fi',
			url: 'https://ko-fi.com/parsehex',
		},
	],
	extraRepos: ['ProjectDepot/SrcGallery', 'ProjectDepot/vue-node-sqlite-starter'],
	theme: {
		gradientColors: {
			topLeft: 'rgba(56, 189, 248, 0.15)',
			topRight: 'rgba(220, 38, 38, 0.15)',
		},
	},
};

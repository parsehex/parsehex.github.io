import type { Config } from './types';

export const userConfig: Partial<Config> = {
	// https://projectdepot.github.io/SrcGallery/config.html
	siteTitle: '{username}',
	profileHeaderCenter: true,
	footerText: '&copy; 2025-2026 Thomas Mays',
	reposFilter: (data) => data.filter(repo => repo.homepage && repo.description),
	links: [
		{
			name: 'Buy Me A Coffee',
			icon: 'mug',
			url: 'https://buymeacoffee.com/parsehex',
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

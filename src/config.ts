import type { Config } from './types';
import { mergeObject } from './utils';

const defaultConfig: Config = {
	siteTitle: "{username}'s Sites",
	headerText: '',
	profileHeader: true,
	profileHeaderCenter: false,
	hero: true,
	controls: true,
	displayView: 'grid',
	footerText: '',
	creditLink: true,
	links: [],
	theme: {
		gradientColors: {
			topLeft: 'rgba(96, 165, 250, 0.15)',
			topRight: 'rgba(147, 51, 234, 0.15)',
		},
	},
};

export async function getConfig() {
	let config: Config;
	let buildInfo: Record<string, string> = {};
	try {
		const { userConfig } = await import('./config.user');
		config = mergeObject(defaultConfig, userConfig);
	} catch (error: any) {
		console.error('Failed to load user config:', error.message);
		config = defaultConfig;
	}
	try {
		const info = await import('./build-info.json');
		buildInfo = info.default;
	} catch (error: any) {
		console.error('Failed to load user config:', error.message);
		buildInfo = {};
	}
	return mergeObject(config, buildInfo);
}

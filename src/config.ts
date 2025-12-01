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
};

export async function getConfig() {
	let config: Config;
	let buildInfo: Record<string, string> = {};
	try {
		// @ts-ignore: file may not exist
		const { userConfig } = await import('./config.user');
		config = mergeObject(defaultConfig, userConfig);
	} catch (error: any) {
		console.warn('Failed to load user config:', error.message);
		config = defaultConfig;
	}
	try {
		// @ts-ignore: file may not exist
		const info = await import('./build-info.json');
		buildInfo = info.default;
	} catch (error: any) {
		console.warn('Failed to load build info:', error.message);
		buildInfo = {};
	}
	return mergeObject(config, buildInfo);
}

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
	const tsFiles = Object.entries(import.meta.glob('./*.ts'));
	const cfgIndex = tsFiles.findIndex((v) => v[0].includes('config.user'));
	const jsonFiles = Object.entries(import.meta.glob('./*.json'));
	const infoIndex = jsonFiles.findIndex((v) => v[0].includes('build-info'));
	let config: Config;
	let buildInfo: Record<string, string> = {};

	// load user config
	if (cfgIndex > -1) {
		const { userConfig } = (await tsFiles[cfgIndex][1]()) as any;
		config = mergeObject(defaultConfig, userConfig);
	} else {
		config = defaultConfig;
		console.log('User config not available');
	}

	// load build info
	if (infoIndex > -1) {
		const info = ((await jsonFiles[infoIndex][1]()) as any).default;
		buildInfo = info as any;
	} else {
		config = defaultConfig;
		console.log('Build info not available');
	}
	return mergeObject(config, buildInfo);
}

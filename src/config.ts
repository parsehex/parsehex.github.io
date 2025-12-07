import type { Config } from './types';
import { cautiousImport, mergeObject } from './utils';

const defaultConfig: Config = {
	siteTitle: "{username}'s Sites",
	headerText: '',
	profileHeader: true,
	profileHeaderCenter: false,
	showGists: true,
	hero: true,
	controls: true,
	displayView: 'grid',
	footerText: '',
	creditLink: true,
	links: [],
};

export async function getConfig(): Promise<Config> {
	const userConfigImport = await cautiousImport(
		import.meta.glob('./config.user.ts'),
		undefined,
		'userConfig'
	);
	let config: Config;
	const buildInfo: Record<string, string> =
		(await cautiousImport(import.meta.glob('./build-info.json'))) || {};

	// load user config
	if (userConfigImport) {
		config = mergeObject(defaultConfig, userConfigImport);
	} else {
		config = defaultConfig;
		console.log('User config not available');
	}

	return mergeObject(config, buildInfo);
}

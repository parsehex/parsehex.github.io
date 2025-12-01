import type { Config } from './types';
import { userConfig } from './config.user';
import { mergeObject } from './utils';
import buildInfo from './build-info.json';

const defaultConfig: Config = {
	siteTitle: "{username}'s Sites",
	headerText: 'A list of my projects that have a GitHub Pages site.',
	profileHeader: true,
	hero: {
		center: false,
	},
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

export const config: Config = mergeObject(
	mergeObject(defaultConfig, userConfig),
	buildInfo
);

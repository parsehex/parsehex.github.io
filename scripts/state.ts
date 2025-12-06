import { Config } from '../src/types';

interface State {
	config: Config;
	ghUsername: string;
	perPage: number;
	quiet: boolean;
	stats: {
		requests: number;
		cacheHits: number;
		rateLimitUsed: number | null;
		rateLimitRemaining: number | null;
	};
	paths: {
		src: string;
		public: string;
		readmes: string;
		readmeImages: string;
		readmeManifest: string;
		repoList: string;
		buildInfo: string;
		langColors: string;
		userReadme: string;
		userProfile: string;
		avatar: string;
		avatar150: string;
		faviconPng: string;
		faviconIco: string;
		gists: string;
	};
}

export const state: State = {
	config: {} as any,
	ghUsername: '',
	perPage: 100,
	quiet: !process.argv.includes('--debug'),
	stats: {
		requests: 0,
		cacheHits: 0,
		rateLimitUsed: null,
		rateLimitRemaining: null,
	},
	paths: {
		src: '',
		public: '',
		readmes: '',
		readmeImages: '',
		readmeManifest: '',
		repoList: '',
		buildInfo: '',
		langColors: '',
		userReadme: '',
		userProfile: '',
		avatar: '',
		avatar150: '',
		faviconIco: '',
		faviconPng: '',
		gists: '',
	},
};

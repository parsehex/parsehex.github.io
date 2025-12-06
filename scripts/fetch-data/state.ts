interface State {
	ghUsername: string;
	perPage: number;
	quiet: boolean;
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
	};
}

export const state: State = {
	ghUsername: '',
	perPage: 100,
	quiet: true,
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
	},
};

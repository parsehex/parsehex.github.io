export interface Config {
	header: boolean;
	siteTitle: string;
	headerText: string;
	hero: {
		src: string;
		center: boolean;
	};
	display: {
		view: string;
	};
	footer: {
		text: string;
		includeGitCaseLink: boolean;
	};
	extraRepos?: string[];
	links?: Link[];
	lastUpdated?: string;
}

export interface LangColor {
	color: string;
	url: string;
}

export interface SortOption {
	key: string;
	label: string;
}

export interface Repo {
	id: number;
	name: string;
	description: string;
	language: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	homepage: string;
	pulls_url: string;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	topics: string[];
	latest_update?: {
		label: string;
		value: string;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	languages?: { [key: string]: any };
	[key: string]: unknown;
}

export interface ReadmeManifestItem {
	repo: string;
	path: string | null;
	success: boolean;
	timestamp: string;
	error?: string;
}

export interface Link {
	name?: string;
	url: string;
	icon?: string;
}

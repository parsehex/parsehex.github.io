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
	latest_update?: {
		label: string;
		value: string;
	};
	[key: string]: unknown;
}

export interface ReadmeManifestItem {
	repo: string;
	path: string | null;
	success: boolean;
	timestamp: string;
	error?: string;
}

type HeroConfig = {
	/** Whether to center the hero content. */
	center: boolean;
	/**
	 * Size in number of pixels at which to truncate the hero content and
	 * give the user a button to expand.
	 */
	truncationHeight: number;
};
export interface Config {
	siteTitle: string;
	profileHeader: boolean;
	profileHeaderCenter: boolean;
	headerText: string;
	hero: boolean | Partial<HeroConfig>;
	controls: boolean;
	displayView: 'grid' | 'list';
	footerText: string;
	creditLink: boolean;
	showGists: boolean;
	extraRepos?: string[];
	links?: Link[];
	theme?: {
		gradientColors?: {
			topLeft: string;
			topRight: string;
		};
	};
	/**
	 * Use a custom function to filter the fetched GitHub repositories based on desired criteria. Customize this function to change which repos are included in the showcase.
	 * If not provided, then the default filter is used.
	 *
	 * @param {Repo[]} data - The raw array of repository objects from GitHub API
	 * @returns {Repo[]} The filtered array of repositories
	 */
	reposFilter?: (data: Repo[]) => Repo[];
	lastUpdated?: string;
}

export interface GHProfile {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
	name: string | null;
	company: unknown | null;
	blog: string | null;
	location: string;
	email: string | null;
	hireable: boolean;
	bio: string | null;
	twitter_username: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	/** e.g. `"2012-05-26T03:50:24Z"` */
	created_at: string;
	/** e.g. `"2012-05-26T03:50:24Z"` */
	updated_at: string;
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
	full_name: string;
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

export interface GistFile {
	filename: string;
	type: string;
	language: string;
	raw_url: string;
	size: number;
	content?: string;
}

export interface Gist {
	id: string;
	html_url: string;
	public: boolean;
	created_at: string;
	updated_at: string;
	description: string;
	files: { [filename: string]: GistFile };
}

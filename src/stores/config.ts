import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Link } from '../types';

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
}

const DefaultConfig = {
	header: true,
	siteTitle: "{username}'s Sites",
	headerText: 'A list of my projects that have a GitHub Pages site.',
	hero: {
		src: '/hero.md',
		center: true,
	},
	display: {
		view: 'grid',
	},
	footer: {
		text: '',
		includeGitCaseLink: true,
	},
	links: [],
} as Config;

export const useConfigStore = defineStore('config', () => {
	const config = ref<Config | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const ghUsername = import.meta.env.VITE_GITHUB_ACTOR || 'your_username';

	const siteTitle = computed(() => {
		if (!config.value) return '';

		let title = '';

		// if the key hasn't been set, use old value
		if (config.value.siteTitle === undefined) title = DefaultConfig.siteTitle;
		else title = config.value.siteTitle;

		// replace {username} with actual username
		return title.replace(/\{username\}/g, ghUsername);
	});
	const headerText = computed(() => {
		if (!config.value) return '';

		// if the key hasn't been set, use old value
		if (config.value.headerText === undefined)
			return 'A list of my projects that have a GitHub Pages site.';

		// can set to "" / blank string to disable
		return config.value.headerText;
	});

	const loadConfig = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await fetch('/config.json');
			if (response.ok) {
				const configData = await response.json();
				config.value = configData;
			} else {
				throw new Error(`Failed to load config: ${response.status}`);
			}
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'Failed to load config';
			console.error('Error loading config:', err);

			// Fallback to default config
			config.value = DefaultConfig;
		} finally {
			loading.value = false;
		}
	};

	const setConfig = (newConfig: Config) => {
		config.value = newConfig;
	};

	return {
		config: config,
		loading,
		error,
		loadConfig,
		setConfig,
		ghUsername,
		siteTitle,
		headerText,
		links: computed(() => config.value?.links || []),
	};
});

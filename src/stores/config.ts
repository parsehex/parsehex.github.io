import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Config {
	header: boolean;
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
}

export const useConfigStore = defineStore('config', () => {
	const config = ref<Config | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

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
			config.value = {
				header: true,
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
			};
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
	};
});

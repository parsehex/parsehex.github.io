import { state } from '../state';
import { fetchRepos } from './fetch/repos';
import { fetchColors } from './fetch/lang-colors';
import { fetchAvatar } from './fetch/avatar';
import { fetchUserReadme } from './fetch/user-readme';
import { setPaths } from './paths';
import { logStats } from '../log';
import { fetchGists } from './fetch/gists';

(async () => {
	const username = process.env.VITE_GITHUB_ACTOR || process.argv[2];
	if (!username) {
		throw new Error('Did not find username in env (VITE_GITHUB_ACTOR)');
	}

	const { getConfig } = await import('../../src/config');
	state.config = await getConfig();
	state.ghUsername = username;
	setPaths();

	await fetchRepos();
	await fetchColors();
	await fetchAvatar();
	await fetchUserReadme();
	if (state.config.showGists) await fetchGists();

	logStats();
})();

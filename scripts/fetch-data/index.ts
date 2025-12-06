import 'dotenv/config';

import { state } from './state';
import { fetchRepos } from './fetch/repos';
import { fetchColors } from './fetch/lang-colors';
import { fetchAvatar } from './fetch/avatar';
import { fetchUserReadme } from './fetch/user-readme';
import { setPaths } from './paths';

(async () => {
	const username = process.env.VITE_GITHUB_ACTOR || process.argv[2];
	if (!username) {
		throw new Error('Did not find username in env (VITE_GITHUB_ACTOR)');
	}

	state.ghUsername = username;
	state.quiet = !process.argv.includes('--debug');
	setPaths();

	await fetchRepos();
	await fetchColors();
	await fetchAvatar();
	await fetchUserReadme();
})();

import { readFileSync, writeFileSync } from 'fs';
import { isBefore } from 'date-fns/isBefore';
import { Repo } from '../../../../src/types';
import { downloadTextFile } from '../../../utils';
import { state } from '../../../state';
import { log } from '../../../log';
import { fetchExtraRepos } from './extra-repos';
import { fetchReadmes } from './readmes';
import { fetchReposLanguages } from './languages';

function getFilteredReposDefault(data: Repo[]) {
	return data.filter((repo) => repo.homepage);
}

function processRepoLastUpdate(repo: Repo) {
	// Add latest_update helper object to repo
	const updated = new Date(repo.updated_at);
	const pushed = new Date(repo.pushed_at);
	if (isBefore(updated, pushed)) {
		repo.latest_update = {
			label: 'Pushed',
			value: repo.pushed_at,
		};
	} else {
		repo.latest_update = {
			label: 'Updated',
			value: repo.updated_at,
		};
	}
	return repo;
}

export async function fetchRepos() {
	const { ghUsername: username } = state;
	console.log('Fetching repo list for', username);
	try {
		// download profile json
		const profileUrl = `https://api.github.com/users/${username}`;
		await downloadTextFile(profileUrl, state.paths.userProfile);

		const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${state.perPage}`;
		const dataStr = await downloadTextFile(reposUrl, null);
		const data = JSON.parse(dataStr);

		// Update build-info file
		let infoContent = {} as any;
		try {
			const c = JSON.parse(readFileSync(state.paths.buildInfo, 'utf8'));
			infoContent = c;
		} catch (e) {
			infoContent = {};
		}
		infoContent.lastUpdated = new Date().toISOString();
		writeFileSync(state.paths.buildInfo, JSON.stringify(infoContent, null, 2));
		log('Updated build-info file');

		const { getConfig } = await import('../../../../src/config');
		const config = await getConfig();
		const extraRepos = await fetchExtraRepos(config);

		const filteredReposFunc = config.reposFilter || getFilteredReposDefault;
		let sites = filteredReposFunc(data).concat(extraRepos);

		// Remove duplicates by name (prefer main user repos if conflict)
		const seenNames = new Set();
		const uniqueSites = [];
		for (const repo of sites) {
			if (!seenNames.has(repo.name)) {
				seenNames.add(repo.name);
				uniqueSites.push(repo);
			}
		}
		sites = uniqueSites.map(processRepoLastUpdate);

		await fetchReposLanguages(sites);

		writeFileSync(state.paths.repoList, JSON.stringify(sites, null, 2));
		console.log(
			`Fetched ${sites.length} repos and wrote to ${state.paths.repoList}`
		);

		await fetchReadmes(sites);
	} catch (error) {
		console.error('Error fetching repos', error);
		process.exit(1);
	}
}

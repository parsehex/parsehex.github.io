#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const username = 'parsehex';
const perPage = 100;

async function fetchRepos() {
	console.log('Fetching repos for', username);
	try {
		const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}`);
		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status}`);
		}
		const data = await res.json();

		// Optionally, filter the repos to include only your portfolio sites.
		// For instance, if you use a naming convention:
		// const sites = data.filter(repo => repo.name.startsWith('site-'));
		// idea: use a naming conventiong to filter sites
		//   (or something in description?)
		const sites = data;

		const outputPath = join(__dirname, '..', 'src', 'repos.json');
		writeFileSync(outputPath, JSON.stringify(sites, null, 2));
		console.log(`Fetched ${sites.length} repos and wrote to ${outputPath}`);
	} catch (error) {
		console.error('Error fetching repos', error);
		process.exit(1);
	}
}

fetchRepos();

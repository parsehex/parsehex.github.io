#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import * as url from 'url';
import { isBefore } from 'date-fns';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const username = process.env.VITE_GITHUB_Actor;

if (!username) {
	throw new Error('Did not find username in env (VITE_GITHUB_Actor)');
}

const perPage = 100;

async function fetchRepos() {
	console.log('Fetching repo list for', username);
	const token = process.env.GITHUB_TOKEN;
	const headers = token
		? { Authorization: `token ${token}` }
		: {};

	try {
		const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}`, { headers });
		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status}`);
		}
		const data = await res.json();

		// REPO LIST FILTER
		// If you want to filter sites by a naming convention, use e.g.:
		// const sites = data.filter(repo => repo.name.startsWith('portfolio-'));
		const sites = data.filter((r) => r.homepage); // keeps repos with a homepage

		for (const repo of data) {
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
		}

		const outputPath = join(__dirname, '..', 'src', 'repos.json');
		writeFileSync(outputPath, JSON.stringify(sites, null, 2));
		console.log(`Fetched ${sites.length} repos and wrote to ${outputPath}`);
	} catch (error) {
		console.error('Error fetching repos', error);
		process.exit(1);
	}
}

async function fetchColors() {
	console.log('Fetching lang-colors.json');
	const token = process.env.GITHUB_TOKEN;
	const headers = token
		? { Authorization: `token ${token}` }
		: {};
	try {
		const res = await fetch('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json', { headers });
		if (!res.ok) {
			throw new Error(`GitHub error: ${res.status}`);
		}
		const data = await res.json();
		const outputPath = join(__dirname, '..', 'src', 'lang-colors.json');
		writeFileSync(outputPath, JSON.stringify(data, null, 2));
		console.log('Fetched lang-colors.json');
	} catch (error) {
		console.error('Error fetching lang-colors.json', error);
		process.exit(1);
	}
}

fetchRepos();
fetchColors();

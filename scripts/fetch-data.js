#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import * as url from 'url';
import { isBefore } from 'date-fns';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const username = process.env.VITE_GITHUB_ACTOR || process.argv[2];

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
		// If you want to filter repos by a naming convention, use e.g.:
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

		await fetchReadmes(sites);
	} catch (error) {
		console.error('Error fetching repos', error);
		process.exit(1);
	}
}

async function fetchReadmes(repos) {
	console.log('Fetching READMEs for repositories');
	const token = process.env.GITHUB_TOKEN;
	const headers = token
		? {
			Authorization: `token ${token}`,
			Accept: 'application/vnd.github.v3.raw'
		}
		: { Accept: 'application/vnd.github.v3.raw' };

	const readmeManifest = [];
	const publicDir = join(__dirname, '..', 'public', 'readmes');

	// Ensure the public/readmes directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	for (const repo of repos) {
		try {
			const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, { headers });

			const readmeContent = await readmeRes.text();

			if (readmeRes.ok && !readmeContent.startsWith('<!DOCTYPE html>')) {
				const readmeFilePath = join(publicDir, `${repo.name}.md`);

				writeFileSync(readmeFilePath, readmeContent);
				console.log(`Saved README for ${repo.name}`);

				readmeManifest.push({
					repo: repo.name,
					path: `/readmes/${repo.name}.md`,
					success: true,
					timestamp: new Date().toISOString()
				});
			} else {
				console.log(`No README found for ${repo.name} (${readmeRes.status})`);
				readmeManifest.push({
					repo: repo.name,
					path: null,
					success: false,
					timestamp: new Date().toISOString()
				});
			}
		} catch (error) {
			console.error(`Error fetching README for ${repo.name}:`, error.message);
			readmeManifest.push({
				repo: repo.name,
				path: null,
				success: false,
				timestamp: new Date().toISOString(),
				error: error.message
			});
		}
	}

	// Write manifest file
	const manifestPath = join(__dirname, '..', 'public', 'readme-manifest.json');
	writeFileSync(manifestPath, JSON.stringify(readmeManifest, null, 2));
	console.log(`README manifest written to ${manifestPath}`);
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

async function fetchAvatar() {
	console.log('Fetching avatar for', username);
	const avatarUrl = `https://github.com/${username}.png`;
	const publicDir = join(__dirname, '..', 'public');
	const avatarPath = join(publicDir, 'avatar.png');

	// Ensure the public directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	try {
		const response = await fetch(avatarUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch avatar: ${response.status}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		writeFileSync(avatarPath, buffer);
		console.log(`Avatar saved to ${avatarPath}`);
	} catch (error) {
		console.error('Error fetching avatar:', error.message);
		// Don't exit the process for avatar failure, as it's not critical
	}
}

fetchRepos();
fetchColors();
fetchAvatar();

#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { downloadFile } from './utils.js';
import * as url from 'url';
import { isBefore } from 'date-fns';
import sharp from 'sharp';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const username = process.env.VITE_GITHUB_ACTOR || process.argv[2];

if (!username) {
	throw new Error('Did not find username in env (VITE_GITHUB_Actor)');
}

const perPage = 100;

function getFilteredReposDefault(data) {
	return data.filter((repo) => repo.homepage);
}

async function fetchRepos() {
	console.log('Fetching repo list for', username);
	const token = process.env.GITHUB_TOKEN;

	try {
		const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;
		const dataStr = await downloadFile(reposUrl, null, { token });
		const data = JSON.parse(dataStr);

		let getFilteredRepos;

		try {
			const func = (await import('./repo-filter.js')).getFilteredRepos;
			getFilteredRepos = func;
		} catch (e) {
			if (!e.toString().includes('ERR_MODULE_NOT_FOUND'))
				console.log('Did not find repo-filter.js and using default function - Error:', e);
			getFilteredRepos = getFilteredReposDefault;
		}

		const sites = getFilteredRepos(data);

		for (const repo of sites) {
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
	const publicDir = join(__dirname, '..', 'public', 'readmes');

	// Ensure the public/readmes directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	const readmeManifest = [];

	for (const repo of repos) {
		try {
			const readmeUrl = `https://api.github.com/repos/${username}/${repo.name}/readme`;
			const readmeFilePath = join(publicDir, `${repo.name}.md`);
			await downloadFile(readmeUrl, readmeFilePath, {
				token,
				accept: 'application/vnd.github.v3.raw'
			});

			readmeManifest.push({
				repo: repo.name,
				path: `/readmes/${repo.name}.md`,
				success: true,
				timestamp: new Date().toISOString()
			});
		} catch (error) {
			console.log(`No README found for ${repo.name}`);
			readmeManifest.push({
				repo: repo.name,
				path: null,
				success: false,
				timestamp: new Date().toISOString(),
				...(error.message && { error: error.message })
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
	const colorsUrl = 'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
	const outputPath = join(__dirname, '..', 'src', 'lang-colors.json');
	try {
		await downloadFile(colorsUrl, outputPath, { token });
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
	const faviconPath = join(publicDir, 'favicon.png');

	// Ensure the public directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	try {
		const buffer = await downloadFile(avatarUrl, avatarPath, { isBinary: true });

		// Generate favicon.png (32x32)
		const faviconBuffer = await sharp(buffer)
			.resize(32, 32, {
				kernel: sharp.kernel.nearest,
				fit: 'contain',
				background: { r: 255, g: 255, b: 255, alpha: 1 }
			})
			.png()
			.toBuffer();

		writeFileSync(faviconPath, faviconBuffer);

		console.log(`Favicon saved to ${faviconPath}`);
	} catch (error) {
		console.error('Error fetching avatar:', error.message);
		// Don't exit the process for avatar failure, as it's not critical
	}
}

fetchRepos();
fetchColors();
fetchAvatar();

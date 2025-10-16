#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync, copyFileSync } from 'fs';
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
	try {
		const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;
		const dataStr = await downloadFile(reposUrl, null);
		const data = JSON.parse(dataStr);

		// Load extra repos from config.user.json if exists
		let extraReposData = [];
		const userConfigPath = join(__dirname, '..', 'config.user.json');
		if (existsSync(userConfigPath)) {
			try {
				const userConfigStr = await import('fs').then(fs => fs.readFileSync(userConfigPath, 'utf8'));
				const userConfig = JSON.parse(userConfigStr);
				extraReposData = userConfig.extraRepos || [];
			} catch (error) {
				console.log('Error loading config.user.json:', error);
			}
		}

		// Copy config to public directory
		const publicDir = join(__dirname, '..', 'public');
		if (!existsSync(publicDir)) {
			mkdirSync(publicDir, { recursive: true });
		}
		let configToCopy = 'config.json';
		if (existsSync(userConfigPath)) {
			configToCopy = 'config.user.json';
		}
		const sourceConfigPath = join(__dirname, '..', configToCopy);
		const destConfigPath = join(publicDir, 'config.json');
		try {
			copyFileSync(sourceConfigPath, destConfigPath);
			console.log(`Copied ${configToCopy} to ${destConfigPath}`);
		} catch (error) {
			console.log(`Error copying config:`, error.message);
		}

		// Fetch data for extra repos
		let extraRepos = [];
		for (const fullName of extraReposData) {
			if (!fullName || typeof fullName !== 'string') continue;
			try {
				const [owner, repoName] = fullName.split('/');
				if (!owner || !repoName) continue;
				const extraRepoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
				const extraDataStr = await downloadFile(extraRepoUrl, null);
				const extraRepo = JSON.parse(extraDataStr);
				// external repos should use the full name
				extraRepo.name = fullName;
				// Add latest_update
				const updated = new Date(extraRepo.updated_at);
				const pushed = new Date(extraRepo.pushed_at);
				if (isBefore(updated, pushed)) {
					extraRepo.latest_update = {
						label: 'Pushed',
						value: extraRepo.pushed_at,
					};
				} else {
					extraRepo.latest_update = {
						label: 'Updated',
						value: extraRepo.updated_at,
					};
				}
				extraRepos.push(extraRepo);
			} catch (error) {
				console.log(`Error fetching extra repo ${fullName}:`, error.message);
			}
		}

		let getFilteredRepos;

		try {
			const func = (await import('./repo-filter.js')).getFilteredRepos;
			getFilteredRepos = func;
		} catch (e) {
			if (!e.toString().includes('ERR_MODULE_NOT_FOUND'))
				console.log('Did not find repo-filter.js and using default function - Error:', e);
			getFilteredRepos = getFilteredReposDefault;
		}

		let sites = getFilteredRepos(data).concat(extraRepos);

		// Remove duplicates by name (prefer main user repos if conflict)
		const seenNames = new Set();
		const uniqueSites = [];
		for (const repo of sites) {
			if (!seenNames.has(repo.name)) {
				seenNames.add(repo.name);
				uniqueSites.push(repo);
			}
		}
		sites = uniqueSites;

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

		// Fetch languages for each repo
		for (const repo of sites) {
			try {
				const [owner, repoName] = repo.name.includes('/') ? repo.name.split('/') : [username, repo.name];
				const languagesUrl = `https://api.github.com/repos/${owner}/${repoName}/languages`;
				const languagesStr = await downloadFile(languagesUrl, null);
				const rawLanguages = JSON.parse(languagesStr);

				const totalSize = Object.values(rawLanguages).reduce((acc, size) => acc + size, 0);
				if (totalSize > 0) {
					repo.languages = Object.entries(rawLanguages).reduce((acc, [lang, size]) => {
						acc[lang] = (size / totalSize) * 100;
						return acc;
					}, {});
				} else {
					repo.languages = {};
				}
			} catch (error) {
				console.log(`Error fetching languages for ${repo.name}:`, error.message);
				repo.languages = {};
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
	const publicDir = join(__dirname, '..', 'public', 'readmes');

	// Ensure the public/readmes directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	const readmeManifest = [];

	for (const repo of repos) {
		try {
			let repoId = !repo.name.includes('/') ? `${username}/${repo.name}` : repo.name;
			const readmeUrl = `https://api.github.com/repos/${repoId}/readme`;
			repoId = repoId.replace(/\//g, '-');
			const readmeFilePath = join(publicDir, `${repoId}.md`);
			await downloadFile(readmeUrl, readmeFilePath, {
				accept: 'application/vnd.github.v3.raw'
			});

			readmeManifest.push({
				repo: repo.name,
				path: `/readmes/${repoId}.md`,
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
	const colorsUrl = 'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
	const outputPath = join(__dirname, '..', 'src', 'lang-colors.json');
	try {
		await downloadFile(colorsUrl, outputPath);
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

async function fetchUserReadme() {
	console.log('Fetching user profile README for', username);
	const userReadmeUrl = `https://api.github.com/repos/${username}/${username}/readme`;
	const outputPath = join(__dirname, '..', 'public', 'hero.md');

	try {
		await downloadFile(userReadmeUrl, outputPath, {
			accept: 'application/vnd.github.v3.raw'
		});
		console.log(`User profile README saved to ${outputPath}`);
	} catch (error) {
		console.log(`No user profile README found for ${username}. Using a blank one.`);
		writeFileSync(outputPath, '');
	}
}

(async () => {
	await fetchRepos();
	await fetchColors();
	await fetchAvatar();
	await fetchUserReadme();
})();

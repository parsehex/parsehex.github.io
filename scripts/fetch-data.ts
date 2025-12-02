// run with either:
//  npm run fetch-data
//  vite-node scripts/fetch-data.ts
import 'dotenv/config';

import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import * as url from 'url';
import { isBefore } from 'date-fns';
import sharp from 'sharp';
import ico from 'sharp-ico';
import { downloadFile } from './utils';
import { type Repo } from '../src/types';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const username = process.env.VITE_GITHUB_ACTOR || process.argv[2];
const srcDir = join(__dirname, '..', 'src');
const buildInfoPath = join(srcDir, 'build-info.json');

if (!username) {
	throw new Error('Did not find username in env (VITE_GITHUB_Actor)');
}

const perPage = 100;

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

async function fetchRepos() {
	console.log('Fetching repo list for', username);
	try {
		const reposUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;
		const dataStr = (await downloadFile(reposUrl, null)) as string;
		const data = JSON.parse(dataStr);

		// download profile json
		const profileUrl = `https://api.github.com/users/${username}`;
		await downloadFile(profileUrl, join(srcDir, 'profile.json'));

		// Update build-info file
		let infoContent = {};
		try {
			const c = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
			infoContent = c;
		} catch (e) {
			infoContent = {};
		}
		infoContent.lastUpdated = new Date().toISOString();
		writeFileSync(buildInfoPath, JSON.stringify(infoContent, null, 2));
		console.log(`Updated lastUpdated in ${buildInfoPath}`);

		// Fetch data for extra repos
		const { getConfig } = await import('../src/config');
		const config = await getConfig();
		const extraReposData = config.extraRepos || [];
		let extraRepos = [];
		for (const fullName of extraReposData) {
			if (!fullName || typeof fullName !== 'string') continue;
			try {
				const [owner, repoName] = fullName.split('/');
				if (!owner || !repoName) continue;
				const extraRepoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
				const extraDataStr = (await downloadFile(extraRepoUrl, null)) as string;
				const extraRepo = JSON.parse(extraDataStr);
				// external repos should use the full name
				extraRepo.name = fullName;
				extraRepos.push(extraRepo);
			} catch (error: any) {
				console.log(`Error fetching extra repo ${fullName}:`, error.message);
			}
		}

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

		// Fetch languages for each repo
		for (const repo of sites) {
			try {
				const [owner, repoName] = repo.name.includes('/')
					? repo.name.split('/')
					: [username, repo.name];
				const languagesUrl = `https://api.github.com/repos/${owner}/${repoName}/languages`;
				const languagesStr = (await downloadFile(languagesUrl, null)) as string;
				const rawLanguages = JSON.parse(languagesStr);

				const totalSize = Object.values(rawLanguages).reduce(
					(acc: number, size: any) => acc + size,
					0
				);
				if (totalSize > 0) {
					repo.languages = Object.entries(rawLanguages).reduce(
						(acc: any, [lang, size]: any) => {
							acc[lang] = (size / totalSize) * 100;
							return acc;
						},
						{}
					);
				} else {
					repo.languages = {};
				}
			} catch (error: any) {
				console.log(
					`Error fetching languages for ${repo.name}:`,
					error.message
				);
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

async function processReadmeImages(
	repoFullName: string,
	readmeContent: string
) {
	const imageDir = join(__dirname, '..', 'public', 'readme-images');
	if (!existsSync(imageDir)) {
		mkdirSync(imageDir, { recursive: true });
	}

	const baseUrl = `https://raw.githubusercontent.com/${repoFullName}/HEAD/`;
	let updatedReadmeContent = readmeContent;

	// Regex to find markdown images: ![alt text](image/path.png)
	const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
	let match;
	while ((match = markdownImageRegex.exec(readmeContent)) !== null) {
		const relativePath = match[1];
		if (relativePath.includes('http')) continue;
		const imageUrl = new URL(relativePath, baseUrl).href;
		const imageName = basename(relativePath);
		const imageFilePath = join(imageDir, imageName);

		try {
			await downloadFile(imageUrl, imageFilePath, { isBinary: true });
			updatedReadmeContent = updatedReadmeContent.replace(
				relativePath,
				`/readme-images/${imageName}`
			);
		} catch (error: any) {
			console.log(
				`Error downloading image ${imageUrl} for ${repoFullName}:`,
				error.message
			);
		}
	}
	return updatedReadmeContent;
}

async function fetchReadmes(repos: Repo[]) {
	console.log('Fetching READMEs for repositories');
	const publicDir = join(__dirname, '..', 'public', 'readmes');

	// Ensure the public/readmes directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	const readmeManifest = [];

	for (const repo of repos) {
		try {
			let repoId = !repo.name.includes('/')
				? `${username}/${repo.name}`
				: repo.name;
			const readmeUrl = `https://api.github.com/repos/${repoId}/readme`;

			// Download README content as a string first
			const readmeRawContent = (await downloadFile(readmeUrl, null, {
				accept: 'application/vnd.github.v3.raw',
			})) as string;

			const repoFullName = repo.name.includes('/')
				? repo.name
				: `${username}/${repo.name}`;
			const processedReadmeContent = await processReadmeImages(
				repoFullName,
				readmeRawContent
			);

			repoId = repoId.replace(/\//g, '-');
			const readmeFilePath = join(srcDir, `./content/readmes/${repoId}.md`);
			writeFileSync(readmeFilePath, processedReadmeContent);

			readmeManifest.push({
				repo: repo.name,
				path: `/readmes/${repoId}.md`,
				success: true,
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			console.log(`No README found for ${repo.name}`);
			readmeManifest.push({
				repo: repo.name,
				path: null,
				success: false,
				timestamp: new Date().toISOString(),
				...(error.message && { error: error.message }),
			});
		}
	}

	// Write manifest file
	const manifestPath = join(__dirname, '..', 'src', 'readme-manifest.json');
	writeFileSync(manifestPath, JSON.stringify(readmeManifest, null, 2));
	console.log(`README manifest written to ${manifestPath}`);
}

async function fetchColors() {
	console.log('Fetching lang-colors.json');
	const colorsUrl =
		'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
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
	const avatarPath = join(publicDir, 'avatar.webp');
	const faviconPngPath = join(publicDir, 'favicon.png');
	const faviconIcoPath = join(publicDir, 'favicon.ico');

	// Ensure the public directory exists
	if (!existsSync(publicDir)) {
		mkdirSync(publicDir, { recursive: true });
	}

	try {
		const buffer = await downloadFile(avatarUrl, null, {
			isBinary: true,
		});

		// Save avatar as WebP (original size)
		await sharp(buffer).webp().toFile(avatarPath);
		console.log(`Avatar saved to ${avatarPath}`);

		// Save avatar as WebP (150px)
		const avatar150Path = join(publicDir, 'avatar-150.webp');
		await sharp(buffer).resize(150).webp().toFile(avatar150Path);
		console.log(`Avatar (150px) saved to ${avatar150Path}`);

		// Generate favicon.png
		const faviconBuffer = await sharp(buffer)
			.resize(32, 32, {
				kernel: sharp.kernel.nearest,
				fit: 'contain',
				background: { r: 255, g: 255, b: 255, alpha: 1 },
			})
			.png()
			.toBuffer();
		writeFileSync(faviconPngPath, faviconBuffer);
		console.log(`Favicon PNG saved to ${faviconPngPath}`);

		// Generate favicon.ico for other GH Pages sites to
		//   fallback to without changing to point to the png
		ico.sharpsToIco(
			[
				sharp(buffer).resize(32, 32, {
					kernel: sharp.kernel.nearest,
					fit: 'contain',
					background: { r: 255, g: 255, b: 255, alpha: 1 },
				}),
			],
			faviconIcoPath
		);
		console.log(`Favicon ICO saved to ${faviconIcoPath}`);
	} catch (error: any) {
		console.error('Error fetching avatar:', error.message);
		// Don't exit the process for avatar failure, as it's not critical
	}
}

async function fetchUserReadme() {
	console.log('Fetching user profile README for', username);
	const userReadmeUrl = `https://api.github.com/repos/${username}/${username}/readme`;
	const outputPath = join(__dirname, '..', 'src', 'hero.md');

	try {
		await downloadFile(userReadmeUrl, outputPath, {
			accept: 'application/vnd.github.v3.raw',
		});
		console.log(`User profile README saved to ${outputPath}`);
	} catch (error) {
		console.log(
			`No user profile README found for ${username}. Using a blank one.`
		);
		writeFileSync(outputPath, '');
	}
}

(async () => {
	await fetchRepos();
	await fetchColors();
	await fetchAvatar();
	await fetchUserReadme();
})();

import { writeFileSync } from 'fs';
import { join } from 'path';
import { Repo } from '../../../../src/types';
import { downloadTextFile } from '../../../utils';
import { log } from '../../log';
import { state } from '../../state';
import { processReadmeImages } from './readme-images';

export async function fetchReadmes(repos: Repo[]) {
	log('Fetching READMEs for repositories');
	const { ghUsername: username } = state;
	const readmeManifest = [];

	for (const repo of repos) {
		try {
			let repoId = !repo.name.includes('/')
				? `${username}/${repo.name}`
				: repo.name;
			const readmeUrl = `https://api.github.com/repos/${repoId}/readme`;

			// Download README content as a string first
			const readmeRawContent = await downloadTextFile(readmeUrl, null, {
				accept: 'application/vnd.github.v3.raw',
			});

			const repoFullName = repo.name.includes('/')
				? repo.name
				: `${username}/${repo.name}`;
			const processedReadmeContent = await processReadmeImages(
				repoFullName,
				readmeRawContent
			);

			repoId = repoId.replace(/\//g, '-');
			const readmeFilePath = join(state.paths.readmes, `./${repoId}.md`);
			writeFileSync(readmeFilePath, processedReadmeContent);

			readmeManifest.push({
				repo: repo.name,
				path: `/readmes/${repoId}.md`,
				success: true,
				timestamp: new Date().toISOString(),
			});
		} catch (error: any) {
			log(`No README found for ${repo.name}`);
			readmeManifest.push({
				repo: repo.name,
				path: null,
				success: false,
				timestamp: new Date().toISOString(),
				...(error.message && { error: error.message }),
			});
		}
	}

	// Write readme manifest
	writeFileSync(
		state.paths.readmeManifest,
		JSON.stringify(readmeManifest, null, 2)
	);
	log(`README manifest written to ${state.paths.readmeManifest}`);
}

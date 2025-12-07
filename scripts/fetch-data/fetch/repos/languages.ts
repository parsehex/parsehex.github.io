import { Repo } from '../../../../src/types';
import { downloadTextFile } from '../../../utils';
import { log } from '../../../log';
import { state } from '../../../state';

export async function fetchReposLanguages(sites: Repo[]) {
	const username = state.ghUsername;
	// Fetch languages for each repo
	for (const repo of sites) {
		try {
			const [owner, repoName] = repo.name.includes('/')
				? repo.name.split('/')
				: [username, repo.name];
			const languagesUrl = `https://api.github.com/repos/${owner}/${repoName}/languages`;
			const languagesStr = await downloadTextFile(languagesUrl, null);
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
			log(`Error fetching languages for ${repo.name}:`, error.message);
			repo.languages = {};
		}
	}
}

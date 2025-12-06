import { Repo } from '../../../../src/types';
import { downloadTextFile } from '../../../utils';

export async function fetchExtraRepos(config?: any) {
	const extraReposData = config?.extraRepos || [];
	let extraRepos = [];
	for (const fullName of extraReposData) {
		if (!fullName || typeof fullName !== 'string') continue;
		try {
			const [owner, repoName] = fullName.split('/');
			if (!owner || !repoName) continue;
			const extraRepoUrl = `https://api.github.com/repos/${owner}/${repoName}`;
			const extraDataStr = await downloadTextFile(extraRepoUrl, null);
			const extraRepo = JSON.parse(extraDataStr);
			// external repos should use the full name
			extraRepo.name = fullName;
			extraRepos.push(extraRepo);
		} catch (error: any) {
			console.log(`Error fetching extra repo ${fullName}:`, error.message);
		}
	}

	return extraRepos as Repo[];
}

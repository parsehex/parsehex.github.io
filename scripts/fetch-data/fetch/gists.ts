import { writeFileSync } from 'fs';
import { downloadTextFile } from '../../utils';
import { state } from '../../state';
import { Gist } from '../../../src/types';
import { err, log } from '../../log';

export async function fetchGists() {
	const { ghUsername: username } = state;

	log('Fetching gists for', username);

	try {
		const gistsUrl = `https://api.github.com/users/${username}/gists?per_page=${state.perPage}`;
		const dataStr = await downloadTextFile(gistsUrl, null, { token: '' });
		const data: Gist[] = JSON.parse(dataStr);

		for (const gist of data) {
			for (const file of Object.values(gist.files)) {
				if (file.raw_url) {
					try {
						const content = await downloadTextFile(file.raw_url, null, {
							token: '',
						});
						file.content = content;
					} catch (e) {
						err(`Error fetching content for ${file.filename}`, e);
					}
				}
			}
		}

		writeFileSync(state.paths.gists, JSON.stringify(data, null, 2));
		log(`Fetched ${data.length} gists and wrote to ${state.paths.gists}`);
	} catch (error) {
		err('Error fetching gists', error);
		writeFileSync(state.paths.gists, '[]');
	}
}

import { writeFileSync } from 'fs';
import { log, err } from '../../log';
import { state } from '../../state';
import { downloadTextFile } from '../../utils';

export async function fetchUserReadme() {
	const { ghUsername } = state;
	log('Fetching user profile README for', ghUsername);
	const url = `https://api.github.com/repos/${ghUsername}/${ghUsername}/readme`;

	try {
		await downloadTextFile(url, state.paths.userReadme, {
			accept: 'application/vnd.github.v3.raw',
		});
		log('User profile README saved to', state.paths.userReadme);
	} catch (error) {
		err(`No user profile README found for ${ghUsername}. Using a blank one.`);
		writeFileSync(state.paths.userReadme, '');
	}
}

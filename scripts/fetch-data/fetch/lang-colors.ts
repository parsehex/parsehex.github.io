import { state } from '../../state';
import { log, err } from '../../log';
import { downloadTextFile } from '../../utils';
import { writeFileSync } from 'fs';

export async function fetchColors() {
	log('Fetching lang-colors.json');
	const url =
		'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
	try {
		const res = await downloadTextFile(url);
		log('lang-colors.json length:', res.length);
		writeFileSync(state.paths.langColors, res);
	} catch (error) {
		err('Error fetching lang-colors.json', error);
		writeFileSync(state.paths.langColors, '{}');
	}
}

import { state } from '../../state';
import { log, err } from '../../log';
import { downloadTextFile } from '../../utils';

export async function fetchColors() {
	log('Fetching lang-colors.json');
	const url =
		'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
	try {
		await downloadTextFile(url, state.paths.langColors);
	} catch (error) {
		err('Error fetching lang-colors.json', error);
		process.exit(1);
	}
}

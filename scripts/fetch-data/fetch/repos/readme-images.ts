import { basename, join } from 'path';
import { state } from '../../../state';
import { downloadBinFile } from '../../../utils';
import { log } from '../../../log';

export async function processReadmeImages(
	repoFullName: string,
	readmeContent: string
) {
	const imageDir = state.paths.readmeImages;
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
			await downloadBinFile(imageUrl, imageFilePath);
			updatedReadmeContent = updatedReadmeContent.replace(
				relativePath,
				`/readme-images/${imageName}`
			);
		} catch (error: any) {
			log(
				`Error downloading image ${imageUrl} for ${repoFullName}:`,
				error.message
			);
		}
	}
	return updatedReadmeContent;
}

import { writeFileSync } from 'fs';

export async function downloadFile(url, filePath, options = {}) {
	const { accept, isBinary = false } = options;
	let { token } = options;
	const headers = {};
	if (!token) token = process.env.GITHUB_TOKEN;
	if (token) {
		headers.Authorization = `token ${token}`;
	}
	if (accept) {
		headers.Accept = accept;
	}

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw new Error(`Fetch error: ${response.status}`);
		}

		let content;
		if (isBinary) {
			const arrayBuffer = await response.arrayBuffer();
			content = Buffer.from(arrayBuffer);
		} else {
			content = await response.text();
			if (content.startsWith('<!DOCTYPE html>')) {
				throw new Error('Received HTML instead of expected content');
			}
		}

		if (filePath) {
			writeFileSync(filePath, content);
			console.log(`Downloaded and saved to ${filePath}`);
		}
		return content;
	} catch (error) {
		console.error(`Error downloading ${url}:`, error.message);
		throw error;
	}
}

import { writeFileSync } from 'fs';
import { cacheManager } from './cache';
import { err, log } from './log';
import { state } from './state';

interface DownloadOptions {
	accept?: string;
	token?: string;
	isBinary?: boolean;
}

export async function downloadFile(
	url: string,
	filePath?: string | null,
	options: DownloadOptions = {}
) {
	const { accept, isBinary = false } = options;
	let { token } = options;
	const headers: Record<string, string> = {};
	if (token === undefined) token = process.env.GITHUB_TOKEN;
	if (token) {
		headers.Authorization = `token ${token}`;
	}
	if (accept) {
		headers.Accept = accept;
	}

	const cached = cacheManager.get(url);
	if (cached) {
		headers['If-None-Match'] = cached.etag;
	}

	try {
		const response = await fetch(url, { headers });
		if (token) state.stats.requests++;

		if (cached && response.status === 304) {
			if (token) state.stats.cacheHits++;
			log(`Cache hit for ${url}`);
			const content = isBinary ? cached.content : cached.content.toString();
			if (filePath) {
				writeFileSync(filePath, content);
				log(`Downloaded and saved cached copy to ${filePath}`);
			}
			return content;
		}

		if (!response.ok) {
			throw new Error(`Fetch error: ${response.status}`);
		}

		const etag = response.headers.get('etag');
		const rateLimitUsed = response.headers.get('X-RateLimit-Used');
		const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
		if (rateLimitUsed && token)
			state.stats.rateLimitUsed = parseInt(rateLimitUsed);
		if (rateLimitRemaining && token)
			state.stats.rateLimitRemaining = parseInt(rateLimitRemaining);
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

		if (etag) {
			cacheManager.set(url, etag, content);
		} else {
			cacheManager.remove(url);
		}

		if (filePath) {
			writeFileSync(filePath, content);
			log(`Downloaded and saved to ${filePath}`);
		}
		return content;
	} catch (error: any) {
		if (error.message) err(`Error downloading ${url}:`, error.message);
		throw error;
	}
}

export async function downloadTextFile(
	url: string,
	filePath?: string | null,
	options: DownloadOptions = {}
) {
	const res = downloadFile(url, filePath, {
		...options,
		isBinary: false,
	});
	return res as Promise<string>;
}

export async function downloadBinFile(
	url: string,
	filePath?: string | null,
	options: DownloadOptions = {}
) {
	const res = downloadFile(url, filePath, { ...options, isBinary: true });
	return res as Promise<Buffer<ArrayBuffer>>;
}

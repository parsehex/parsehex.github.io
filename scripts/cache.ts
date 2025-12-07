import { createHash } from 'crypto';
import {
	mkdirSync,
	existsSync,
	writeFileSync,
	readFileSync,
	unlinkSync,
} from 'fs';
import { join, dirname, extname } from 'path';
import * as url from 'url';
import { err } from './log';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const CACHE_DIR = join(__dirname, '..', '.cache');
const METADATA_PATH = join(CACHE_DIR, 'metadata.json');

interface CacheMetadata {
	[url: string]: {
		etag: string;
		filePath: string;
	};
}

export class CacheManager {
	private metadata: CacheMetadata = {};

	constructor() {
		this.loadMetadata();
	}

	private loadMetadata() {
		if (existsSync(METADATA_PATH)) {
			try {
				this.metadata = JSON.parse(readFileSync(METADATA_PATH, 'utf-8'));
			} catch (error) {
				err('Error loading cache metadata:', error);
				this.metadata = {};
			}
		}
	}

	private saveMetadata() {
		try {
			mkdirSync(CACHE_DIR, { recursive: true });
			writeFileSync(METADATA_PATH, JSON.stringify(this.metadata, null, 2));
		} catch (error) {
			err('Error saving cache metadata:', error);
		}
	}

	public get(url: string) {
		const entry = this.metadata[url];
		if (!entry) return null;

		const fullPath = join(CACHE_DIR, entry.filePath);
		if (existsSync(fullPath)) {
			return {
				etag: entry.etag,
				content: readFileSync(fullPath),
			};
		}
		return null;
	}

	public set(url: string, etag: string, content: Buffer | string) {
		const filePath = this.getCacheFilePath(url);
		const fullPath = join(CACHE_DIR, filePath);

		try {
			mkdirSync(dirname(fullPath), { recursive: true });
			writeFileSync(fullPath, content);
			this.metadata[url] = { etag, filePath };
			this.saveMetadata();
		} catch (error) {
			err(`Error writing cache file for ${url}:`, error);
		}
	}

	public remove(url: string) {
		const entry = this.metadata[url];
		if (entry) {
			const fullPath = join(CACHE_DIR, entry.filePath);
			if (existsSync(fullPath)) {
				try {
					unlinkSync(fullPath);
				} catch (error) {
					err(`Error deleting cache file for ${url}:`, error);
				}
			}
			delete this.metadata[url];
			this.saveMetadata();
		}
	}

	private getCacheFilePath(url: string): string {
		const hash = createHash('sha256').update(url).digest('hex');
		const extension = extname(url);
		return `data/${hash}${extension}`;
	}
}

export const cacheManager = new CacheManager();

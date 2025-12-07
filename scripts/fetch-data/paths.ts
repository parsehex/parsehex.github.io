import { join } from 'path';
import * as url from 'url';
import { state } from '../state';
import { existsSync, mkdirSync } from 'fs';
import { log } from '../log';

export function setPaths() {
	const { paths } = state;
	const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
	const src = join(__dirname, '../..', 'src');
	const _public = join(__dirname, '../..', 'public');
	const readmes = join(src, 'content/readmes');
	const readmeImages = join(_public, 'readme-images');

	for (const dir of [src, _public, readmes, readmeImages]) {
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
	}

	paths.src = src;
	paths.public = _public;
	paths.readmes = readmes;
	paths.readmeImages = readmeImages;
	paths.repoList = join(src, 'repos.json');
	paths.buildInfo = join(src, 'build-info.json');
	paths.readmeManifest = join(src, 'readme-manifest.json');
	paths.langColors = join(src, 'lang-colors.json');
	paths.userProfile = join(src, 'profile.json');
	paths.userReadme = join(src, 'hero.txt');
	paths.avatar = join(_public, 'avatar.webp');
	paths.avatar150 = join(_public, 'avatar-150.webp');
	paths.faviconIco = join(_public, 'favicon.ico');
	paths.faviconPng = join(_public, 'favicon.png');
	paths.gists = join(src, 'gists.json');
}

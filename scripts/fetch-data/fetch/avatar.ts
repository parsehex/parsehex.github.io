import sharp from 'sharp';
import ico from 'sharp-ico';
import { err, log } from '../log';
import { state } from '../state';
import { downloadBinFile } from '../../utils';
import { writeFileSync } from 'fs';

export async function fetchAvatar() {
	const { ghUsername } = state;
	log('Fetching avatar for', ghUsername);
	const url = `https://github.com/${ghUsername}.png`;

	try {
		const buffer = await downloadBinFile(url, null);
		const {
			avatar: avatarPath,
			avatar150: avatar150Path,
			faviconIco: faviconIcoPath,
			faviconPng: faviconPngPath,
		} = state.paths;

		// avatar.webp (original size)
		await sharp(buffer).webp().toFile(avatarPath);
		log(`Avatar saved to ${avatarPath}`);

		// avatar-150x.webp
		await sharp(buffer).resize(150).webp().toFile(avatar150Path);
		log(`Avatar (150px) saved to ${avatar150Path}`);

		// favicon.png
		const faviconSharp = sharp(buffer).resize(32, 32, {
			kernel: sharp.kernel.nearest,
			fit: 'contain',
			background: { r: 255, g: 255, b: 255, alpha: 1 },
		});
		const faviconBuffer = await faviconSharp.png().toBuffer();
		writeFileSync(faviconPngPath, faviconBuffer);
		log(`Favicon PNG saved to ${faviconPngPath}`);

		// favicon.ico for other GH Pages sites to fallback
		//   to without changing to point to the png
		ico.sharpsToIco([faviconSharp], faviconIcoPath);
		log('Favicon ICO saved to', faviconIcoPath);
	} catch (error: any) {
		err('Error fetching avatar:', error.message);
		// Don't exit the process for avatar failure, as it's not critical
	}
}

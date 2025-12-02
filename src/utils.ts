import { formatDistanceToNow, parseISO, isBefore, subWeeks } from 'date-fns';
import { marked } from 'marked';
import markedAlert from 'marked-alert';
import DOMPurify from 'dompurify';

marked.use(markedAlert());

async function getDOMPurify() {
	try {
		DOMPurify.sanitize('<div>test</div>');
		return DOMPurify;
	} catch (e: any) {
		const { JSDOM } = await import('jsdom');
		const window = new JSDOM('').window;
		return DOMPurify(window);
	}
}

export async function sanitizeHtml(html: string) {
	return (await getDOMPurify()).sanitize(html);
}
export async function sanitizeMdToHtml(md: string) {
	const html = await marked.parse(md);
	return sanitizeHtml(html);
}

export function getColor(lang: string, langColors: any) {
	if (!langColors || ~langColors[lang]) return '#111';
	// @ts-expect-error n/a
	const c = langColors[lang] as LangColor;
	return c.color;
}

// https://stackoverflow.com/a/11868398
// http://24ways.org/2010/calculating-color-contrast
export function getContrastYIQ(hexcolor: string) {
	const r = parseInt(hexcolor.substring(1, 3), 16);
	const g = parseInt(hexcolor.substring(3, 5), 16);
	const b = parseInt(hexcolor.substring(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? 'black' : 'white';
}

export function formatDate(dateStr: string, long = false) {
	const date = new Date(dateStr);
	const cfg = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	} as Intl.DateTimeFormatOptions;
	if (long) {
		Object.assign(cfg, {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short',
		});
	}
	return date.toLocaleDateString(undefined, cfg);
}

export function relativeDate(dateStr: string) {
	return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function showRelativeTime(dateStr: string) {
	const date = new Date(dateStr);
	return isBefore(date, subWeeks(new Date(), 1))
		? formatDate(dateStr)
		: relativeDate(dateStr);
}

export function mergeObject(target: any, source: any): any {
	if (
		typeof target !== 'object' ||
		target === null ||
		typeof source !== 'object' ||
		source === null
	) {
		return source !== undefined ? source : target;
	}

	const result = Array.isArray(target) ? [...target] : { ...target };

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (
				typeof source[key] === 'object' &&
				source[key] !== null &&
				!Array.isArray(source[key])
			) {
				result[key] = mergeObject(result[key], source[key]);
			} else {
				result[key] = source[key];
			}
		}
	}

	return result;
}

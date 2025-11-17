import { formatDistanceToNow, parseISO, isBefore, subWeeks } from 'date-fns';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import langColors from './lang-colors.json';

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

export async function sanitizeMd(md: string) {
	const html = await marked.parse(md);
	return (await getDOMPurify()).sanitize(html);
}

export function getColor(lang: string) {
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

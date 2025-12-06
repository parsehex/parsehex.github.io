import { state } from './state';

export function log(...parts: any[]) {
	if (state.quiet) return;
	console.log(...parts);
}

export function err(...parts: any[]) {
	console.error(...parts);
}

import { state } from './state';

export function log(...parts: any[]) {
	if (state.quiet) return;
	console.log(...parts);
}

export function err(...parts: any[]) {
	console.error(...parts);
}

export function logStats() {
	console.log(`Total requests: ${state.stats.requests}`);
	console.log(`Cache hits: ${state.stats.cacheHits}`);
	if (
		state.stats.rateLimitUsed !== null &&
		state.stats.rateLimitRemaining !== null
	) {
		console.log(
			`API requests used: ${state.stats.rateLimitUsed} (remaining: ${state.stats.rateLimitRemaining})`
		);
	}
}

import { getEnv } from '$lib/server/config/env';

function normalizeTimeZone(value: string | undefined) {
	const candidate = value?.trim().replace(/^:+/, '');
	if (!candidate) return 'UTC';

	try {
		new Intl.DateTimeFormat('en-US', { timeZone: candidate });
		return candidate;
	} catch {
		return candidate.toUpperCase() === 'UTC' ? 'UTC' : 'UTC';
	}
}

export const load = () => {
	const env = getEnv();
	return {
		mode: env.REPORT_DATA_SOURCE,
		database: env.MYSQL_DATABASE,
		timezone: normalizeTimeZone(env.TZ)
	};
};

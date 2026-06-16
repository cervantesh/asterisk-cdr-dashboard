import { getEnv } from '$lib/server/config/env';

function normalizeTimeZone(value: string | undefined) {
	const candidate = value?.trim().replace(/^:+/, '');
	if (!candidate) return 'America/Santo_Domingo';

	try {
		new Intl.DateTimeFormat('en-US', { timeZone: candidate });
		return candidate;
	} catch {
		return candidate.toUpperCase() === 'UTC' ? 'UTC' : 'America/Santo_Domingo';
	}
}

export const load = () => {
	const env = getEnv();
	const timezone = normalizeTimeZone(env.TZ);
	const isDeploymentDefault = timezone === 'UTC';

	return {
		mode: env.REPORT_DATA_SOURCE,
		database: env.MYSQL_DATABASE,
		timezone: isDeploymentDefault ? 'Deployment default' : timezone,
		timezoneHint: isDeploymentDefault
			? 'Server currently runs in UTC. Set TZ to your PBX local zone for parity.'
			: 'Application timezone used for date formatting and reporting context.'
	};
};

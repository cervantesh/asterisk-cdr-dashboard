import { getEnv } from '$lib/server/config/env';

export const load = () => {
	const env = getEnv();
	return {
		mode: env.REPORT_DATA_SOURCE,
		database: env.MYSQL_DATABASE,
		timezone: env.TZ
	};
};

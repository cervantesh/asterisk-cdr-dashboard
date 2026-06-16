import { z } from 'zod';
import { env } from '$env/dynamic/private';

const defaultPasswordHash =
	'$argon2id$v=19$m=19456,t=2,p=1$NwCtHyDF76jmf3XBJKnhDA$b76tzjPL1xzYvCaIXEQ3IwYLWDP4XKgTTjRs21+00Zo';

const schema = z.object({
	REPORT_DATA_SOURCE: z.enum(['demo', 'mysql']).default('demo'),
	MYSQL_HOST: z.string().default('127.0.0.1'),
	MYSQL_PORT: z.coerce.number().int().positive().default(3306),
	MYSQL_DATABASE: z.string().default('asteriskcdrdb'),
	MYSQL_USER: z.string().default('root'),
	MYSQL_PASSWORD: z.string().default(''),
	MYSQL_CONNECTION_LIMIT: z.coerce.number().int().positive().default(10),
	ADMIN_USERNAME: z.string().default('admin'),
	ADMIN_PASSWORD_HASH: z.string().default(defaultPasswordHash),
	SESSION_SECRET: z.string().min(16).default('dev-session-secret-change-me'),
	SESSION_COOKIE_NAME: z.string().default('cdr_session'),
	SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
	TZ: z.string().default('America/Santo_Domingo'),
	PUBLIC_APP_NAME: z.string().default('CDR Dashboard')
});

export type AppEnv = z.infer<typeof schema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
	if (!cachedEnv) {
		cachedEnv = schema.parse(env);
	}

	return cachedEnv;
}

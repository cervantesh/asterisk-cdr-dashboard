import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { getEnv } from '$lib/server/config/env';
import type { Database } from './cdr.types';

let db: Kysely<Database> | null = null;

export function getDb() {
	if (!db) {
		const appEnv = getEnv();
		db = new Kysely<Database>({
			dialect: new MysqlDialect({
				pool: createPool({
					host: appEnv.MYSQL_HOST,
					port: appEnv.MYSQL_PORT,
					database: appEnv.MYSQL_DATABASE,
					user: appEnv.MYSQL_USER,
					password: appEnv.MYSQL_PASSWORD,
					connectionLimit: appEnv.MYSQL_CONNECTION_LIMIT
				})
			})
		});
	}

	return db;
}

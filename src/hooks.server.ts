import type { Handle } from '@sveltejs/kit';
import { readSession } from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = readSession(event.cookies);
	return resolve(event);
};

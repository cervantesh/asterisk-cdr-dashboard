import { error, redirect, type RequestEvent } from '@sveltejs/kit';

export function requirePageUser(event: RequestEvent) {
	if (!event.locals.user) {
		redirect(303, '/login');
	}

	return event.locals.user;
}

export function requireApiUser(event: RequestEvent) {
	if (!event.locals.user) {
		error(401, 'No autenticado');
	}

	return event.locals.user;
}

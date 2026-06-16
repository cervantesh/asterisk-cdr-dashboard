import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/server/auth/session';

export const POST = ({ cookies }) => {
	clearSession(cookies);
	redirect(303, '/login');
};

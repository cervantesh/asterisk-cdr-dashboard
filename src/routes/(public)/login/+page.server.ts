import { fail, redirect } from '@sveltejs/kit';
import { setSession, verifyAdminCredentials } from '$lib/server/auth/session';

export const load = ({ locals }) => {
	if (locals.user) {
		redirect(303, '/app/dashboard');
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = String(formData.get('username') ?? '');
		const password = String(formData.get('password') ?? '');

		if (!(await verifyAdminCredentials(username, password))) {
			return fail(400, {
				message: 'Usuario o contrasena invalida.',
				username
			});
		}

		setSession(cookies, username);
		redirect(303, '/app/dashboard');
	}
};

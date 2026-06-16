import { requirePageUser } from '$lib/server/auth/guards';

export const load = (event) => {
	const user = requirePageUser(event);
	return { user };
};

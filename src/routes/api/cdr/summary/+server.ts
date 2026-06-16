import { json } from '@sveltejs/kit';
import { requireApiUser } from '$lib/server/auth/guards';
import { getCdrRepository } from '$lib/server/db/cdr.repository';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const GET = async (event) => {
	requireApiUser(event);
	const filters = parseFilters(event.url);
	return json(await getCdrRepository().getSummary(filters));
};

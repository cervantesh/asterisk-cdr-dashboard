import { error, json } from '@sveltejs/kit';
import { requireApiUser } from '$lib/server/auth/guards';
import { getReportById } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const GET = async (event) => {
	requireApiUser(event);
	const report = getReportById(event.params.id);
	if (!report) {
		error(404, 'Report not found');
	}

	const filters = parseFilters(event.url, {
		limit: report.defaultLimit ?? 10,
		pageSize: report.id === 'call-details' ? 25 : 50
	});

	return json(await report.run(filters));
};

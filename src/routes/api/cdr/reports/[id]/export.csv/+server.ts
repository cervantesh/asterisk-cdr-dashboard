import { error } from '@sveltejs/kit';
import { requireApiUser } from '$lib/server/auth/guards';
import { renderCsv } from '$lib/server/exports/csv';
import { getReportById } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const GET = async (event) => {
	requireApiUser(event);
	const report = getReportById(event.params.id);
	if (!report) {
		error(404, 'Report not found');
	}

	const filters = parseFilters(event.url, {
		limit: 5000,
		pageSize: 5000,
		page: 1
	});
	const result = await report.run({ ...filters, offset: 0, page: 1, pageSize: 5000 });
	const csv = renderCsv(report, result.rows as Record<string, unknown>[]);

	return new Response(csv, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="${report.id}.csv"`
		}
	});
};

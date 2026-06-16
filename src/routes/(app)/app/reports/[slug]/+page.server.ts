import { error } from '@sveltejs/kit';
import { getReportBySlug } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const load = async ({ params, url }) => {
	const report = getReportBySlug(params.slug);
	if (!report || report.slug === 'calls') {
		error(404, 'Report not found');
	}

	const filters = parseFilters(url, { limit: report.defaultLimit ?? 10, pageSize: 50 });
	const result = await report.run(filters);

	return {
		report: {
			id: report.id,
			slug: report.slug,
			title: report.title,
			description: report.description,
			defaultLimit: report.defaultLimit,
			columns: report.columns
		},
		filters,
		result,
		query: url.searchParams.toString()
	};
};

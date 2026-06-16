import { error } from '@sveltejs/kit';
import { getReportBySlug } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const load = async ({ params, url }) => {
	const report = getReportBySlug(params.slug);
	if (!report || report.slug === 'detalles') {
		error(404, 'Reporte no encontrado');
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
		result,
		query: url.searchParams.toString()
	};
};

import { error } from '@sveltejs/kit';
import { requireApiUser } from '$lib/server/auth/guards';
import { renderPdf } from '$lib/server/exports/pdf';
import { getReportById } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const GET = async (event) => {
	requireApiUser(event);
	const report = getReportById(event.params.id);
	if (!report) {
		error(404, 'Reporte no encontrado');
	}

	const filters = parseFilters(event.url, {
		limit: 5000,
		pageSize: 5000,
		page: 1
	});
	const result = await report.run({ ...filters, offset: 0, page: 1, pageSize: 5000 });
	const pdf = await renderPdf(report, result.rows as Record<string, unknown>[], filters);

	return new Response(new Uint8Array(pdf), {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `attachment; filename="${report.id}.pdf"`
		}
	});
};

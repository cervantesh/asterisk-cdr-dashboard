import { callDetailsReport } from '$lib/server/reports/registry';
import { parseFilters } from '$lib/server/validation/cdr-filters';
import { callDetailsMetadata } from '$lib/reports/shared';

export const load = async ({ url }) => {
	const filters = parseFilters(url, { pageSize: 25, limit: 1000 });
	const result = await callDetailsReport.run(filters);

	return {
		report: callDetailsMetadata,
		result,
		query: url.searchParams.toString()
	};
};

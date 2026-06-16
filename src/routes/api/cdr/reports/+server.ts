import { json } from '@sveltejs/kit';
import { requireApiUser } from '$lib/server/auth/guards';
import { reportDefinitions } from '$lib/server/reports/registry';

export const GET = (event) => {
	requireApiUser(event);
	return json(
		reportDefinitions.map((report) => ({
			id: report.id,
			slug: report.slug,
			title: report.title,
			description: report.description,
			defaultLimit: report.defaultLimit,
			columns: report.columns.map((column) => ({
				key: String(column.key),
				label: column.label,
				align: column.align ?? 'left'
			}))
		}))
	);
};

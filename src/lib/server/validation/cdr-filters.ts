import { z } from 'zod';
import type { ReportFilters } from '$lib/server/db/cdr.types';

const filterSchema = z.object({
	from: z.string().trim().optional().catch(undefined),
	to: z.string().trim().optional().catch(undefined),
	disposition: z.array(z.string()).default([]),
	src: z.string().trim().optional().catch(undefined),
	dst: z.string().trim().optional().catch(undefined),
	did: z.string().trim().optional().catch(undefined),
	search: z.string().trim().optional().catch(undefined),
	limit: z.coerce.number().int().positive().max(5000).default(10),
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(200).default(25)
});

function emptyToUndefined(value: string | undefined) {
	return value && value.length > 0 ? value : undefined;
}

export function parseFilters(url: URL, defaults: Partial<ReportFilters> = {}): ReportFilters {
	const params = url.searchParams;
	const parsed = filterSchema.parse({
		from: params.get('from') ?? defaults.from,
		to: params.get('to') ?? defaults.to,
		disposition: params.getAll('disposition').length
			? params.getAll('disposition')
			: (defaults.disposition ?? []),
		src: params.get('src') ?? defaults.src,
		dst: params.get('dst') ?? defaults.dst,
		did: params.get('did') ?? defaults.did,
		search: params.get('search') ?? defaults.search,
		limit: params.get('limit') ?? defaults.limit ?? 10,
		page: params.get('page') ?? defaults.page ?? 1,
		pageSize: params.get('pageSize') ?? defaults.pageSize ?? 25
	});

	const page = parsed.page;
	const pageSize = parsed.pageSize;

	return {
		from: emptyToUndefined(parsed.from),
		to: emptyToUndefined(parsed.to),
		disposition: parsed.disposition.filter(Boolean),
		src: emptyToUndefined(parsed.src),
		dst: emptyToUndefined(parsed.dst),
		did: emptyToUndefined(parsed.did),
		search: emptyToUndefined(parsed.search),
		limit: parsed.limit,
		page,
		pageSize,
		offset: (page - 1) * pageSize
	};
}

export function filtersToEntries(filters: ReportFilters) {
	const entries: Array<[string, string]> = [];
	for (const key of ['from', 'to', 'src', 'dst', 'did', 'search'] as const) {
		if (filters[key]) entries.push([key, filters[key]]);
	}
	for (const disposition of filters.disposition) {
		entries.push(['disposition', disposition]);
	}
	entries.push(['limit', String(filters.limit)]);
	entries.push(['pageSize', String(filters.pageSize)]);
	return entries;
}

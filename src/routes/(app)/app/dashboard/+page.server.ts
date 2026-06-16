import { getCdrRepository } from '$lib/server/db/cdr.repository';
import { parseFilters } from '$lib/server/validation/cdr-filters';

export const load = async ({ url }) => {
	const filters = parseFilters(url, { pageSize: 8, limit: 6 });
	const repo = getCdrRepository();
	const [summary, timeseries, made, received, missed, recentCalls] = await Promise.all([
		repo.getSummary(filters),
		repo.getTimeseries(filters),
		repo.getTopMade({ ...filters, limit: 5 }),
		repo.getTopReceived({ ...filters, limit: 5 }),
		repo.getMissedDestinations({ ...filters, limit: 5 }),
		repo.getCalls({ ...filters, pageSize: 8 })
	]);
	const failedCalls = Math.max(
		0,
		summary.totalCalls - summary.answeredCalls - summary.missedCalls - summary.busyCalls
	);

	return {
		filters,
		summary,
		timeseries,
		stateRows: [
			{
				rank: 1,
				extension: 'ANSWERED',
				callCount: summary.answeredCalls,
				totalDuration: 0,
				totalBillsec: 0
			},
			{
				rank: 2,
				extension: 'NO ANSWER',
				callCount: summary.missedCalls,
				totalDuration: 0,
				totalBillsec: 0
			},
			{
				rank: 3,
				extension: 'BUSY',
				callCount: summary.busyCalls,
				totalDuration: 0,
				totalBillsec: 0
			},
			{
				rank: 4,
				extension: 'FAILED',
				callCount: failedCalls,
				totalDuration: 0,
				totalBillsec: 0
			}
		],
		made,
		received,
		missed,
		recentCalls: recentCalls.rows
	};
};

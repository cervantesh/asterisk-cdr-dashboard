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
	const busiestDay = [...timeseries].sort((left, right) => right.total - left.total)[0];
	const dominantSource = made[0];
	const dominantDestination = received[0];
	const performanceTone = summary.answerRate >= 70 ? 'success' : 'warning';

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
		insights: [
			{
				eyebrow: 'Answering',
				title: `${summary.answerRate}% of filtered calls were answered`,
				body:
					summary.answerRate >= 70
						? 'Inbound handling is holding steady for the current slice.'
						: 'Answer performance is soft. Review staffing and missed-call windows first.',
				tone: performanceTone
			},
			{
				eyebrow: 'Demand',
				title: busiestDay
					? `${busiestDay.period} is the busiest day in view`
					: 'No traffic peak detected',
				body: busiestDay
					? `${busiestDay.total} calls landed on the highest-volume day in the current range.`
					: 'Expand the date range to surface traffic concentration.',
				tone: 'accent' as const
			},
			{
				eyebrow: 'Routing',
				title: dominantSource
					? `Extension ${dominantSource.extension} is driving the most outbound activity`
					: 'Outbound leaders unavailable',
				body: dominantDestination
					? `Answered demand is concentrating on ${dominantDestination.extension}.`
					: 'No answered destination concentration is available yet.',
				tone: 'neutral' as const
			}
		],
		made,
		received,
		missed,
		recentCalls: recentCalls.rows
	};
};

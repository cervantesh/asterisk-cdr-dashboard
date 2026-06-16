import { describe, expect, it } from 'vitest';
import { getReportById, missedReport, topMadeReport, topReceivedReport } from './registry';

const filters = {
	disposition: [],
	limit: 10,
	offset: 0,
	page: 1,
	pageSize: 25
};

describe('report registry', () => {
	it('looks up report definitions by id', () => {
		expect(getReportById('top-made-sources')?.title).toBe('Top Made Calls');
	});

	it('preserves legacy aggregation definitions', async () => {
		const [made, received, missed] = await Promise.all([
			topMadeReport.run(filters),
			topReceivedReport.run(filters),
			missedReport.run(filters)
		]);

		expect(made.rows[0]).toMatchObject({ rank: 1, extension: expect.any(String) });
		expect(received.rows.every((row) => row.callCount > 0)).toBe(true);
		expect(missed.rows.every((row) => row.callCount > 0)).toBe(true);
	});
});

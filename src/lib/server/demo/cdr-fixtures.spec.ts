import { describe, expect, it } from 'vitest';
import { createDemoCdrRows } from './cdr-fixtures';

describe('createDemoCdrRows', () => {
	it('creates deterministic CDR rows with legacy dispositions', () => {
		const rows = createDemoCdrRows();
		const dispositions = new Set(rows.map((row) => row.disposition));

		expect(rows).toHaveLength(360);
		expect(dispositions.has('ANSWERED')).toBe(true);
		expect(dispositions.has('NO ANSWER')).toBe(true);
		expect(dispositions.has('BUSY')).toBe(true);
		expect(rows[0]).toMatchObject({
			src: '1001',
			dst: '1003',
			uniqueid: 'demo-00001'
		});
	});
});

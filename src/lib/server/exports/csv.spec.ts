import { describe, expect, it } from 'vitest';
import { renderCsv } from './csv';

describe('renderCsv', () => {
	it('escapes commas and quotes with stable headers', () => {
		const csv = renderCsv(
			{
				columns: [
					{ key: 'src', label: 'Source' },
					{ key: 'clid', label: 'Caller ID' }
				]
			},
			[{ src: '1001', clid: '"Demo Customer" <1001>' }]
		);

		expect(csv).toBe('Source,Caller ID\n1001,"""Demo Customer"" <1001>"\n');
	});
});

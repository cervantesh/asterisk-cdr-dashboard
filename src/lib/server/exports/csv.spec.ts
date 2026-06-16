import { describe, expect, it } from 'vitest';
import { renderCsv } from './csv';

describe('renderCsv', () => {
	it('escapes commas and quotes with stable headers', () => {
		const csv = renderCsv(
			{
				columns: [
					{ key: 'src', label: 'Origen' },
					{ key: 'clid', label: 'Caller ID' }
				]
			},
			[{ src: '1001', clid: '"Cliente, Demo" <1001>' }]
		);

		expect(csv).toBe('Origen,Caller ID\n1001,"""Cliente, Demo"" <1001>"\n');
	});
});

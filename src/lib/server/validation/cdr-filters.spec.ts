import { describe, expect, it } from 'vitest';
import { parseFilters } from './cdr-filters';

describe('parseFilters', () => {
	it('normalizes paging and repeated dispositions', () => {
		const url = new URL(
			'http://localhost/app/calls?page=2&pageSize=50&disposition=ANSWERED&disposition=BUSY&src=1001'
		);

		const filters = parseFilters(url);

		expect(filters).toMatchObject({
			page: 2,
			pageSize: 50,
			offset: 50,
			disposition: ['ANSWERED', 'BUSY'],
			src: '1001'
		});
	});
});

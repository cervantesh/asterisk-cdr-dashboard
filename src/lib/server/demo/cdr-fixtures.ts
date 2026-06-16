import type { CallDetailRow } from '$lib/server/db/cdr.types';

const dispositions = ['ANSWERED', 'NO ANSWER', 'BUSY', 'FAILED'] as const;
const extensions = ['1001', '1002', '1003', '1004', '1005', '1010', '1020', '1030'];
const dids = ['8095550100', '8095550110', '8295550140'];

export function createDemoCdrRows(): CallDetailRow[] {
	const now = new Date('2026-06-16T14:00:00-04:00').getTime();

	return Array.from({ length: 360 }, (_, index) => {
		const src = extensions[(index * 3) % extensions.length];
		const dst = extensions[(index * 5 + 2) % extensions.length];
		const disposition = dispositions[index % dispositions.length];
		const duration = 18 + ((index * 37) % 540);
		const billsec = disposition === 'ANSWERED' ? Math.max(0, duration - ((index * 7) % 18)) : 0;
		const calldate = new Date(now - index * 42 * 60 * 1000).toISOString();

		return {
			recid: index + 1,
			calldate,
			src,
			dst,
			clid: `"Customer ${100 + (index % 80)}" <${src}>`,
			duration,
			billsec,
			disposition,
			did: dids[index % dids.length],
			uniqueid: `demo-${String(index + 1).padStart(5, '0')}`,
			recordingfile:
				disposition === 'ANSWERED' && index % 4 === 0 ? `demo-call-${index + 1}.wav` : ''
		};
	});
}

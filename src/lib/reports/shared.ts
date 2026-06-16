import type { CallDetailRow, ReportId, ReportSlug, TopReportRow } from '$lib/types/cdr';

export type ReportColumn<Row> = {
	key: keyof Row;
	label: string;
	align?: 'left' | 'right';
	format?: 'date' | 'seconds' | 'text' | 'number';
};

export type DisplayColumn = {
	key: string;
	label: string;
	align?: 'left' | 'right';
	format?: 'date' | 'seconds' | 'text' | 'number';
};

export type ReportMetadata<Row> = {
	id: ReportId;
	slug: ReportSlug | 'calls';
	title: string;
	description: string;
	defaultLimit?: number;
	columns: ReportColumn<Row>[];
};

export type DisplayReport = Omit<ReportMetadata<Record<string, unknown>>, 'columns'> & {
	columns: DisplayColumn[];
};

function seconds(value: unknown) {
	const numeric = Number(value ?? 0);
	const minutes = Math.floor(numeric / 60);
	const remainder = numeric % 60;
	return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function dateValue(value: unknown) {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(String(value)));
}

export function formatCell<Row>(column: ReportColumn<Row>, row: Row) {
	const value = row[column.key];
	switch (column.format) {
		case 'date':
			return dateValue(value);
		case 'seconds':
			return seconds(value);
		case 'number':
			return new Intl.NumberFormat('en-US').format(Number(value ?? 0));
		default:
			return String(value ?? '');
	}
}

export function formatCellValue(column: DisplayColumn, row: Record<string, unknown>) {
	const value = row[column.key];
	switch (column.format) {
		case 'date':
			return dateValue(value);
		case 'seconds':
			return seconds(value);
		case 'number':
			return new Intl.NumberFormat('en-US').format(Number(value ?? 0));
		default:
			return String(value ?? '');
	}
}

export const callDetailsMetadata: ReportMetadata<CallDetailRow> = {
	id: 'call-details',
	slug: 'calls',
	title: 'Call Details',
	description: 'Paginated CDR call list with duration and billed seconds.',
	columns: [
		{ key: 'calldate', label: 'Date', format: 'date' },
		{ key: 'src', label: 'Source' },
		{ key: 'dst', label: 'Destination' },
		{ key: 'disposition', label: 'Status' },
		{ key: 'duration', label: 'Duration', align: 'right', format: 'seconds' },
		{ key: 'billsec', label: 'Billed', align: 'right', format: 'seconds' },
		{ key: 'did', label: 'DID' },
		{ key: 'uniqueid', label: 'Unique ID' }
	]
};

export const topMadeMetadata: ReportMetadata<TopReportRow> = {
	id: 'top-made-sources',
	slug: 'made',
	title: 'Top Made Calls',
	description: 'Source extensions with the highest outbound call volume.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Source Extension' },
		{ key: 'callCount', label: 'Calls', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Total Duration', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Total Billed', align: 'right', format: 'seconds' }
	]
};

export const topReceivedMetadata: ReportMetadata<TopReportRow> = {
	id: 'top-received-destinations',
	slug: 'received',
	title: 'Top Received Calls',
	description: 'Destination extensions with the most answered calls.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Destination Extension' },
		{ key: 'callCount', label: 'Answered', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Total Duration', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Total Billed', align: 'right', format: 'seconds' }
	]
};

export const missedMetadata: ReportMetadata<TopReportRow> = {
	id: 'missed-destinations',
	slug: 'missed',
	title: 'Missed Calls',
	description: 'Destination extensions with the most NO ANSWER or BUSY calls.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Destination Extension' },
		{ key: 'callCount', label: 'Missed', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Total Duration', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Total Billed', align: 'right', format: 'seconds' }
	]
};

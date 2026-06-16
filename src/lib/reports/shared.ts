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
	slug: ReportSlug | 'detalles';
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
	return new Intl.DateTimeFormat('es-DO', {
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
			return new Intl.NumberFormat('es-DO').format(Number(value ?? 0));
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
			return new Intl.NumberFormat('es-DO').format(Number(value ?? 0));
		default:
			return String(value ?? '');
	}
}

export const callDetailsMetadata: ReportMetadata<CallDetailRow> = {
	id: 'call-details',
	slug: 'detalles',
	title: 'Detalles de llamadas',
	description: 'Listado paginado de llamadas CDR con duracion y tiempo facturado.',
	columns: [
		{ key: 'calldate', label: 'Fecha', format: 'date' },
		{ key: 'src', label: 'Origen' },
		{ key: 'dst', label: 'Destino' },
		{ key: 'disposition', label: 'Estado' },
		{ key: 'duration', label: 'Duracion', align: 'right', format: 'seconds' },
		{ key: 'billsec', label: 'Facturado', align: 'right', format: 'seconds' },
		{ key: 'did', label: 'DID' },
		{ key: 'uniqueid', label: 'Unique ID' }
	]
};

export const topMadeMetadata: ReportMetadata<TopReportRow> = {
	id: 'top-made-sources',
	slug: 'realizadas',
	title: 'Mas llamadas realizadas',
	description: 'Extensiones fuente con mayor volumen de llamadas.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Extension fuente' },
		{ key: 'callCount', label: 'Cantidad', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Duracion total', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Facturado total', align: 'right', format: 'seconds' }
	]
};

export const topReceivedMetadata: ReportMetadata<TopReportRow> = {
	id: 'top-received-destinations',
	slug: 'recibidas',
	title: 'Mas llamadas recibidas',
	description: 'Extensiones destino con mas llamadas contestadas.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Extension destino' },
		{ key: 'callCount', label: 'Contestadas', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Duracion total', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Facturado total', align: 'right', format: 'seconds' }
	]
};

export const missedMetadata: ReportMetadata<TopReportRow> = {
	id: 'missed-destinations',
	slug: 'no-contestadas',
	title: 'No contestadas',
	description: 'Extensiones destino con mas llamadas NO ANSWER o BUSY.',
	defaultLimit: 10,
	columns: [
		{ key: 'rank', label: '#', align: 'right', format: 'number' },
		{ key: 'extension', label: 'Extension destino' },
		{ key: 'callCount', label: 'Perdidas', align: 'right', format: 'number' },
		{ key: 'totalDuration', label: 'Duracion total', align: 'right', format: 'seconds' },
		{ key: 'totalBillsec', label: 'Facturado total', align: 'right', format: 'seconds' }
	]
};

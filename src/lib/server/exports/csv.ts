import { formatCellValue } from '$lib/reports/shared';
import type { DisplayColumn } from '$lib/reports/shared';

function escapeCell(value: string) {
	if (/[",\r\n]/.test(value)) {
		return `"${value.replaceAll('"', '""')}"`;
	}

	return value;
}

type ExportableReport = {
	columns: DisplayColumn[];
};

export function renderCsv(report: ExportableReport, rows: Record<string, unknown>[]) {
	const headers = report.columns.map((column) => escapeCell(column.label)).join(',');
	const body = rows
		.map((row) =>
			report.columns.map((column) => escapeCell(formatCellValue(column, row))).join(',')
		)
		.join('\n');

	return `${headers}\n${body}\n`;
}

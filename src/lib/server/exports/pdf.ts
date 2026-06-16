import PDFDocument from 'pdfkit';
import { formatCellValue, type DisplayColumn } from '$lib/reports/shared';
import type { ReportFilters } from '$lib/server/db/cdr.types';

function filterSummary(filters: ReportFilters) {
	const parts = [
		filters.from ? `From: ${filters.from}` : null,
		filters.to ? `To: ${filters.to}` : null,
		filters.src ? `Source: ${filters.src}` : null,
		filters.dst ? `Destination: ${filters.dst}` : null,
		filters.disposition.length ? `Status: ${filters.disposition.join(', ')}` : null
	].filter(Boolean);

	return parts.length ? parts.join(' | ') : 'No filters applied';
}

type ExportableReport = {
	title: string;
	description: string;
	columns: DisplayColumn[];
};

export function renderPdf(
	report: ExportableReport,
	rows: Record<string, unknown>[],
	filters: ReportFilters
): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ margin: 36, size: 'LETTER' });
		const chunks: Buffer[] = [];

		doc.on('data', (chunk: Buffer) => chunks.push(chunk));
		doc.on('end', () => resolve(Buffer.concat(chunks)));
		doc.on('error', reject);

		doc.fontSize(18).text(report.title, { continued: false });
		doc.moveDown(0.25);
		doc.fontSize(9).fillColor('#4b5563').text(report.description);
		doc.text(filterSummary(filters));
		doc.text(`Generated: ${new Date().toLocaleString('en-US')}`);
		doc.moveDown();

		const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
		const columnWidth = usableWidth / report.columns.length;
		let y = doc.y;

		doc.fontSize(8).fillColor('#111827');
		for (const column of report.columns) {
			doc.text(column.label, doc.x, y, { width: columnWidth, continued: false });
			doc.x += columnWidth;
		}
		doc.x = doc.page.margins.left;
		doc.moveDown(0.5);
		doc
			.moveTo(doc.page.margins.left, doc.y)
			.lineTo(doc.page.width - doc.page.margins.right, doc.y)
			.stroke();
		doc.moveDown(0.25);

		for (const row of rows) {
			if (doc.y > doc.page.height - 72) {
				doc.addPage();
			}

			y = doc.y;
			for (const column of report.columns) {
				const value = formatCellValue(column, row);
				doc.text(value, doc.x, y, {
					width: columnWidth,
					height: 22,
					ellipsis: true,
					align: column.align ?? 'left',
					continued: false
				});
				doc.x += columnWidth;
			}
			doc.x = doc.page.margins.left;
			doc.y = y + 24;
		}

		if (!rows.length) {
			doc.fontSize(10).fillColor('#6b7280').text('No rows for the selected filters.');
		}

		doc.end();
	});
}

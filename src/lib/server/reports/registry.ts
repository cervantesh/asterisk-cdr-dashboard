import { getCdrRepository } from '$lib/server/db/cdr.repository';
import type { CallDetailRow, ReportFilters, TopReportRow } from '$lib/server/db/cdr.types';
import {
	callDetailsMetadata,
	formatCell,
	type DisplayColumn,
	missedMetadata,
	topMadeMetadata,
	topReceivedMetadata,
	type ReportColumn,
	type ReportMetadata
} from '$lib/reports/shared';

export type ReportResult<Row> = {
	rows: Row[];
	total?: number;
	page?: number;
	pageSize?: number;
};

export type ReportDefinition<Row> = Omit<ReportMetadata<Row>, 'columns'> & {
	columns: DisplayColumn[];
	run: (filters: ReportFilters) => Promise<ReportResult<Row>>;
};

export const callDetailsReport: ReportDefinition<CallDetailRow> = {
	...callDetailsMetadata,
	run: async (filters) => getCdrRepository().getCalls(filters)
};

export const topMadeReport: ReportDefinition<TopReportRow> = {
	...topMadeMetadata,
	run: async (filters) => ({ rows: await getCdrRepository().getTopMade(filters) })
};

export const topReceivedReport: ReportDefinition<TopReportRow> = {
	...topReceivedMetadata,
	run: async (filters) => ({ rows: await getCdrRepository().getTopReceived(filters) })
};

export const missedReport: ReportDefinition<TopReportRow> = {
	...missedMetadata,
	run: async (filters) => ({ rows: await getCdrRepository().getMissedDestinations(filters) })
};

export const reportDefinitions = [
	callDetailsReport,
	topMadeReport,
	topReceivedReport,
	missedReport
] as const;

export function getReportById(id: string) {
	return reportDefinitions.find((report) => report.id === id);
}

export function getReportBySlug(slug: string) {
	return reportDefinitions.find((report) => report.slug === slug);
}

export { formatCell, type ReportColumn };

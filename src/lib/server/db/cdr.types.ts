import type { Generated, Selectable } from 'kysely';
import type {
	CallDetailRow,
	CdrDisposition,
	PaginatedResult,
	ReportFilters,
	ReportId,
	ReportSlug,
	SummaryMetrics,
	TimeseriesRow,
	TopReportRow
} from '$lib/types/cdr';

export interface CdrTable {
	recid: Generated<number>;
	calldate: Date | string;
	clid: string;
	src: string;
	dst: string;
	dcontext: string;
	channel: string;
	dstchannel: string;
	lastapp: string;
	lastdata: string;
	duration: number;
	billsec: number;
	disposition: CdrDisposition | string;
	amaflags: number;
	accountcode: string;
	uniqueid: string;
	userfield: string;
	did: string;
	recordingfile: string;
	cnum: string;
	cnam: string;
	outbound_cnum: string;
	outbound_cnam: string;
	dst_cnam: string;
}

export interface Database {
	cdr: CdrTable;
}

export type CdrRow = Selectable<CdrTable>;

export interface CdrRepository {
	getSummary(filters: ReportFilters): Promise<SummaryMetrics>;
	getCalls(filters: ReportFilters): Promise<PaginatedResult<CallDetailRow>>;
	getTopMade(filters: ReportFilters): Promise<TopReportRow[]>;
	getTopReceived(filters: ReportFilters): Promise<TopReportRow[]>;
	getMissedDestinations(filters: ReportFilters): Promise<TopReportRow[]>;
	getTimeseries(filters: ReportFilters): Promise<TimeseriesRow[]>;
}

export type {
	CallDetailRow,
	PaginatedResult,
	ReportFilters,
	ReportId,
	ReportSlug,
	SummaryMetrics,
	TimeseriesRow,
	TopReportRow
};

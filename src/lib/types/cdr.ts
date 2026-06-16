export type CdrDisposition = 'ANSWERED' | 'NO ANSWER' | 'BUSY' | 'FAILED' | 'CONGESTION';

export type ReportId =
	| 'call-details'
	| 'top-made-sources'
	| 'top-received-destinations'
	| 'missed-destinations';

export type ReportSlug = 'realizadas' | 'recibidas' | 'no-contestadas';

export type ReportFilters = {
	from?: string;
	to?: string;
	disposition: string[];
	src?: string;
	dst?: string;
	did?: string;
	search?: string;
	limit: number;
	offset: number;
	page: number;
	pageSize: number;
};

export type CallDetailRow = {
	recid: number;
	calldate: string;
	src: string;
	dst: string;
	clid: string;
	duration: number;
	billsec: number;
	disposition: string;
	did: string;
	uniqueid: string;
	recordingfile: string;
};

export type TopReportRow = {
	rank: number;
	extension: string;
	callCount: number;
	totalDuration: number;
	totalBillsec: number;
};

export type SummaryMetrics = {
	totalCalls: number;
	answeredCalls: number;
	missedCalls: number;
	busyCalls: number;
	answerRate: number;
	averageDuration: number;
	averageBillsec: number;
	busiestSource: string;
	busiestDestination: string;
};

export type TimeseriesRow = {
	period: string;
	answered: number;
	missed: number;
	busy: number;
	failed: number;
	total: number;
};

export type PaginatedResult<T> = {
	rows: T[];
	total: number;
	page: number;
	pageSize: number;
};

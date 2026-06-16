import { sql, type RawBuilder } from 'kysely';
import { getEnv } from '$lib/server/config/env';
import { createDemoCdrRows } from '$lib/server/demo/cdr-fixtures';
import { getDb } from './pool';
import type {
	CallDetailRow,
	CdrRepository,
	PaginatedResult,
	ReportFilters,
	SummaryMetrics,
	TimeseriesRow,
	TopReportRow
} from './cdr.types';

const demoRows = createDemoCdrRows();

function matchesFilters(row: CallDetailRow, filters: ReportFilters) {
	const date = new Date(row.calldate).getTime();
	if (filters.from && date < new Date(filters.from).getTime()) return false;
	if (filters.to && date >= new Date(filters.to).getTime()) return false;
	if (filters.disposition.length && !filters.disposition.includes(row.disposition)) return false;
	if (filters.src && row.src !== filters.src) return false;
	if (filters.dst && row.dst !== filters.dst) return false;
	if (filters.did && row.did !== filters.did) return false;
	if (filters.search) {
		const needle = filters.search.toLowerCase();
		return [row.clid, row.src, row.dst, row.uniqueid, row.did].some((value) =>
			value.toLowerCase().includes(needle)
		);
	}

	return true;
}

function filteredDemoRows(filters: ReportFilters) {
	return demoRows.filter((row) => matchesFilters(row, filters));
}

function topRows(rows: CallDetailRow[], key: 'src' | 'dst', limit: number) {
	const grouped = new Map<
		string,
		{ callCount: number; totalDuration: number; totalBillsec: number }
	>();

	for (const row of rows) {
		const extension = row[key] || 'Sin extension';
		const current = grouped.get(extension) ?? { callCount: 0, totalDuration: 0, totalBillsec: 0 };
		current.callCount += 1;
		current.totalDuration += row.duration;
		current.totalBillsec += row.billsec;
		grouped.set(extension, current);
	}

	return [...grouped.entries()]
		.sort((a, b) => b[1].callCount - a[1].callCount || a[0].localeCompare(b[0]))
		.slice(0, limit)
		.map(([extension, values], index) => ({
			rank: index + 1,
			extension,
			...values
		}));
}

function summarizeRows(rows: CallDetailRow[]): SummaryMetrics {
	const totalCalls = rows.length;
	const answeredCalls = rows.filter((row) => row.disposition === 'ANSWERED').length;
	const missedCalls = rows.filter((row) => row.disposition === 'NO ANSWER').length;
	const busyCalls = rows.filter((row) => row.disposition === 'BUSY').length;
	const averageDuration = totalCalls
		? Math.round(rows.reduce((sum, row) => sum + row.duration, 0) / totalCalls)
		: 0;
	const averageBillsec = totalCalls
		? Math.round(rows.reduce((sum, row) => sum + row.billsec, 0) / totalCalls)
		: 0;

	return {
		totalCalls,
		answeredCalls,
		missedCalls,
		busyCalls,
		answerRate: totalCalls ? Math.round((answeredCalls / totalCalls) * 1000) / 10 : 0,
		averageDuration,
		averageBillsec,
		busiestSource: topRows(rows, 'src', 1)[0]?.extension ?? 'N/A',
		busiestDestination: topRows(rows, 'dst', 1)[0]?.extension ?? 'N/A'
	};
}

function timeseriesRows(rows: CallDetailRow[]): TimeseriesRow[] {
	const grouped = new Map<string, TimeseriesRow>();

	for (const row of rows) {
		const period = row.calldate.slice(0, 10);
		const current = grouped.get(period) ?? {
			period,
			answered: 0,
			missed: 0,
			busy: 0,
			failed: 0,
			total: 0
		};

		current.total += 1;
		if (row.disposition === 'ANSWERED') current.answered += 1;
		else if (row.disposition === 'NO ANSWER') current.missed += 1;
		else if (row.disposition === 'BUSY') current.busy += 1;
		else current.failed += 1;
		grouped.set(period, current);
	}

	return [...grouped.values()].sort((a, b) => a.period.localeCompare(b.period));
}

class DemoCdrRepository implements CdrRepository {
	async getSummary(filters: ReportFilters) {
		return summarizeRows(filteredDemoRows(filters));
	}

	async getCalls(filters: ReportFilters): Promise<PaginatedResult<CallDetailRow>> {
		const rows = filteredDemoRows(filters).sort((a, b) => b.calldate.localeCompare(a.calldate));
		return {
			rows: rows.slice(filters.offset, filters.offset + filters.pageSize),
			total: rows.length,
			page: filters.page,
			pageSize: filters.pageSize
		};
	}

	async getTopMade(filters: ReportFilters) {
		return topRows(filteredDemoRows(filters), 'src', filters.limit);
	}

	async getTopReceived(filters: ReportFilters) {
		return topRows(
			filteredDemoRows(filters).filter((row) => row.disposition === 'ANSWERED'),
			'dst',
			filters.limit
		);
	}

	async getMissedDestinations(filters: ReportFilters) {
		return topRows(
			filteredDemoRows(filters).filter((row) => ['NO ANSWER', 'BUSY'].includes(row.disposition)),
			'dst',
			filters.limit
		);
	}

	async getTimeseries(filters: ReportFilters) {
		return timeseriesRows(filteredDemoRows(filters));
	}
}

function whereClause(filters: ReportFilters, extraClauses: RawBuilder<unknown>[] = []) {
	const clauses: RawBuilder<unknown>[] = [...extraClauses];
	if (filters.from) clauses.push(sql`calldate >= ${filters.from}`);
	if (filters.to) clauses.push(sql`calldate < ${filters.to}`);
	if (filters.disposition.length) {
		clauses.push(
			sql`disposition in (${sql.join(filters.disposition.map((value) => sql`${value}`))})`
		);
	}
	if (filters.src) clauses.push(sql`src = ${filters.src}`);
	if (filters.dst) clauses.push(sql`dst = ${filters.dst}`);
	if (filters.did) clauses.push(sql`did = ${filters.did}`);
	if (filters.search) {
		const like = `%${filters.search}%`;
		clauses.push(
			sql`(clid like ${like} or src like ${like} or dst like ${like} or uniqueid like ${like})`
		);
	}

	return clauses.length ? sql`where ${sql.join(clauses, sql` and `)}` : sql``;
}

function numberValue(value: unknown) {
	return Number(value ?? 0);
}

class MysqlCdrRepository implements CdrRepository {
	async getSummary(filters: ReportFilters): Promise<SummaryMetrics> {
		const db = getDb();
		const where = whereClause(filters);
		const result = await sql<{
			totalCalls: number;
			answeredCalls: number;
			missedCalls: number;
			busyCalls: number;
			averageDuration: number;
			averageBillsec: number;
		}>`
			select
				count(*) as totalCalls,
				sum(case when disposition = 'ANSWERED' then 1 else 0 end) as answeredCalls,
				sum(case when disposition = 'NO ANSWER' then 1 else 0 end) as missedCalls,
				sum(case when disposition = 'BUSY' then 1 else 0 end) as busyCalls,
				coalesce(avg(duration), 0) as averageDuration,
				coalesce(avg(billsec), 0) as averageBillsec
			from cdr
			${where}
		`.execute(db);
		const row = result.rows[0];
		const made = await this.getTopMade({ ...filters, limit: 1 });
		const received = await this.getTopReceived({ ...filters, limit: 1 });
		const totalCalls = numberValue(row.totalCalls);
		const answeredCalls = numberValue(row.answeredCalls);

		return {
			totalCalls,
			answeredCalls,
			missedCalls: numberValue(row.missedCalls),
			busyCalls: numberValue(row.busyCalls),
			answerRate: totalCalls ? Math.round((answeredCalls / totalCalls) * 1000) / 10 : 0,
			averageDuration: Math.round(numberValue(row.averageDuration)),
			averageBillsec: Math.round(numberValue(row.averageBillsec)),
			busiestSource: made[0]?.extension ?? 'N/A',
			busiestDestination: received[0]?.extension ?? 'N/A'
		};
	}

	async getCalls(filters: ReportFilters): Promise<PaginatedResult<CallDetailRow>> {
		const db = getDb();
		const where = whereClause(filters);
		const rows = await sql<CallDetailRow>`
			select recid, calldate, src, dst, clid, duration, billsec, disposition, did, uniqueid, recordingfile
			from cdr
			${where}
			order by calldate desc, recid desc
			limit ${filters.pageSize} offset ${filters.offset}
		`.execute(db);
		const total = await sql<{ total: number }>`
			select count(*) as total
			from cdr
			${where}
		`.execute(db);

		return {
			rows: rows.rows.map((row) => ({
				...row,
				calldate: new Date(row.calldate).toISOString()
			})),
			total: numberValue(total.rows[0]?.total),
			page: filters.page,
			pageSize: filters.pageSize
		};
	}

	private async groupedTop(
		filters: ReportFilters,
		groupColumn: 'src' | 'dst',
		extraClauses: RawBuilder<unknown>[] = []
	): Promise<TopReportRow[]> {
		const db = getDb();
		const where = whereClause(filters, extraClauses);
		const result = await sql<{
			extension: string;
			callCount: number;
			totalDuration: number;
			totalBillsec: number;
		}>`
			select
				${sql.ref(groupColumn)} as extension,
				count(uniqueid) as callCount,
				coalesce(sum(duration), 0) as totalDuration,
				coalesce(sum(billsec), 0) as totalBillsec
			from cdr
			${where}
			group by ${sql.ref(groupColumn)}
			order by callCount desc, extension asc
			limit ${filters.limit}
		`.execute(db);

		return result.rows.map((row, index) => ({
			rank: index + 1,
			extension: row.extension,
			callCount: numberValue(row.callCount),
			totalDuration: numberValue(row.totalDuration),
			totalBillsec: numberValue(row.totalBillsec)
		}));
	}

	async getTopMade(filters: ReportFilters) {
		return this.groupedTop(filters, 'src');
	}

	async getTopReceived(filters: ReportFilters) {
		return this.groupedTop(filters, 'dst', [sql`disposition = 'ANSWERED'`]);
	}

	async getMissedDestinations(filters: ReportFilters) {
		return this.groupedTop(filters, 'dst', [sql`disposition in ('NO ANSWER', 'BUSY')`]);
	}

	async getTimeseries(filters: ReportFilters): Promise<TimeseriesRow[]> {
		const db = getDb();
		const where = whereClause(filters);
		const result = await sql<TimeseriesRow>`
			select
				date_format(calldate, '%Y-%m-%d') as period,
				sum(case when disposition = 'ANSWERED' then 1 else 0 end) as answered,
				sum(case when disposition = 'NO ANSWER' then 1 else 0 end) as missed,
				sum(case when disposition = 'BUSY' then 1 else 0 end) as busy,
				sum(case when disposition not in ('ANSWERED', 'NO ANSWER', 'BUSY') then 1 else 0 end) as failed,
				count(*) as total
			from cdr
			${where}
			group by date_format(calldate, '%Y-%m-%d')
			order by period asc
		`.execute(db);

		return result.rows.map((row) => ({
			period: row.period,
			answered: numberValue(row.answered),
			missed: numberValue(row.missed),
			busy: numberValue(row.busy),
			failed: numberValue(row.failed),
			total: numberValue(row.total)
		}));
	}
}

let repository: CdrRepository | null = null;

export function getCdrRepository() {
	if (!repository) {
		repository =
			getEnv().REPORT_DATA_SOURCE === 'mysql' ? new MysqlCdrRepository() : new DemoCdrRepository();
	}

	return repository;
}

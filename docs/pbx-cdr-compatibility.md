# PBX CDR Compatibility Notes

This project integrates with Asterisk-style Call Detail Records, specifically the MySQL/MariaDB table commonly exposed as:

```txt
asteriskcdrdb.cdr
```

The dashboard is intentionally based on the CDR reporting structure instead of FreePBX administrative tables. That keeps the app portable across plain Asterisk, FreePBX, and Incredible PBX installations as long as they write compatible CDR rows to MySQL/MariaDB.

## Target PBX Versions

The current compatibility target is based on the CDR schema used by these PBX families:

| PBX family     | Versions considered | Notes                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asterisk       | 18 LTS, 20 LTS, 21  | The app uses generic CDR fields documented by Asterisk, not version-specific dialplan internals.                                                                                                                                                                                                                                                              |
| FreePBX        | 15, 16, 17          | FreePBX 17 is Debian 12 based and supports Asterisk 18, 20, and 21. Older FreePBX 15/16 systems remain relevant because Incredible PBX releases commonly bundle them.                                                                                                                                                                                         |
| Incredible PBX | 2021, 2025, 2027    | Considered because the legacy project was built around Incredible PBX-era CDR reporting. Incredible PBX 2021 is documented as Asterisk 18 + FreePBX 15. Incredible PBX 2027 for Ubuntu 22.04 is documented as Asterisk 20 LTS + FreePBX 16 GPL modules. Incredible PBX 2025 is treated as an expected FreePBX 17-era target, but still needs live validation. |

Compatibility here means "the dashboard queries the expected CDR data shape." It does not mean every PBX distribution above has been live-tested yet.

## External References Used

- Asterisk CDR concepts and behavior: [Asterisk CDR Specification](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/CDR-Specification/)
- Asterisk CDR reporting overview: [Asterisk Call Detail Records](https://docs.asterisk.org/Configuration/Reporting/Call-Detail-Records-CDR/)
- FreePBX 17 release family: [FreePBX 17](https://www.freepbx.org/freepbx17/)
- FreePBX 17 supported OS/Asterisk versions: [FreePBX 17 Wiki](https://sangomakb.atlassian.net/wiki/spaces/FP/pages/222101505/FreePBX%2B17)
- FreePBX 17 installer target: [FreePBX 17 Debian install script](https://github.com/FreePBX/sng_freepbx_debian_install)
- Incredible PBX product lineage: [Incredible PBX Wiki Products](https://wiki.incrediblepbx.com/Products)
- Incredible PBX 2027 package notes: [SourceForge Incredible PBX 2027 for Ubuntu 22.04](https://sourceforge.net/projects/pbxinaflash/files/IncrediblePBX2027%20for%20Ubuntu%2022.04/)

## Database Structure Used By The App

The typed database contract lives in `src/lib/server/db/cdr.types.ts`.

The app expects a `cdr` table with these fields available:

| Field           | Type expected by app | Used for                                                                                                                |
| --------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `recid`         | numeric id           | Stable ordering fallback for call detail pagination.                                                                    |
| `calldate`      | date/time            | Date filters, call detail ordering, time series grouping.                                                               |
| `clid`          | text                 | Searchable caller ID / display identity.                                                                                |
| `src`           | text                 | Source extension filter and "Made Calls" grouping.                                                                      |
| `dst`           | text                 | Destination extension filter, "Received Calls", and "Missed Calls" grouping.                                            |
| `dcontext`      | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `channel`       | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `dstchannel`    | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `lastapp`       | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `lastdata`      | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `duration`      | number of seconds    | Total call duration and aggregate duration metrics.                                                                     |
| `billsec`       | number of seconds    | Answered/billed duration and aggregate billed metrics.                                                                  |
| `disposition`   | text enum-like value | Status filters and report definitions. Expected common values: `ANSWERED`, `NO ANSWER`, `BUSY`, `FAILED`, `CONGESTION`. |
| `amaflags`      | numeric              | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `accountcode`   | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `uniqueid`      | text                 | Call detail display, search, and grouped count basis in MySQL queries.                                                  |
| `userfield`     | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `did`           | text                 | DID filter and call detail display.                                                                                     |
| `recordingfile` | text                 | Call detail metadata; recording download is intentionally out of scope for v1.                                          |
| `cnum`          | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `cnam`          | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `outbound_cnum` | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `outbound_cnam` | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |
| `dst_cnam`      | text                 | Present in schema contract for compatibility; not used in v1 reports.                                                   |

The current implementation only requires a subset of those fields for reports, but the wider interface mirrors the practical shape seen in FreePBX/Asterisk CDR databases.

## Report Data Shapes

The server converts raw CDR rows into these report-facing structures.

### `CallDetailRow`

Used by `Call Details` and CSV/PDF exports:

```ts
type CallDetailRow = {
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
```

### `TopReportRow`

Used by `Made Calls`, `Received Calls`, and `Missed Calls`:

```ts
type TopReportRow = {
	rank: number;
	extension: string;
	callCount: number;
	totalDuration: number;
	totalBillsec: number;
};
```

### `SummaryMetrics`

Used by the dashboard KPI cards:

```ts
type SummaryMetrics = {
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
```

### `TimeseriesRow`

Used by dashboard charts:

```ts
type TimeseriesRow = {
	period: string;
	answered: number;
	missed: number;
	busy: number;
	failed: number;
	total: number;
};
```

## Query Assumptions

The MySQL adapter in `src/lib/server/db/cdr.repository.ts` makes these assumptions:

- The active database is selected through `MYSQL_DATABASE`, usually `asteriskcdrdb`.
- The table name is `cdr`.
- Date filtering uses `calldate >= from` and `calldate < to`.
- Source/destination filters use exact matches on `src` and `dst`.
- DID filtering uses exact match on `did`.
- Search checks `clid`, `src`, `dst`, and `uniqueid`.
- `Made Calls` groups by `src`.
- `Received Calls` groups by `dst` and forces `disposition = 'ANSWERED'`.
- `Missed Calls` groups by `dst` and forces `disposition in ('NO ANSWER', 'BUSY')`.
- Both `duration` and `billsec` are preserved because older reporting workflows can be ambiguous about which duration mattered.

## Demo Data Contract

`REPORT_DATA_SOURCE=demo` uses seeded rows that mimic the same `CallDetailRow` structure. This keeps the Vercel demo independent from a live PBX while exercising the same report registry, filters, exports, charts, and table rendering path.

The demo mode is not a separate fake report engine. It is a repository adapter with the same interface as the MySQL adapter:

```ts
interface CdrRepository {
	getSummary(filters: ReportFilters): Promise<SummaryMetrics>;
	getCalls(filters: ReportFilters): Promise<PaginatedResult<CallDetailRow>>;
	getTopMade(filters: ReportFilters): Promise<TopReportRow[]>;
	getTopReceived(filters: ReportFilters): Promise<TopReportRow[]>;
	getMissedDestinations(filters: ReportFilters): Promise<TopReportRow[]>;
	getTimeseries(filters: ReportFilters): Promise<TimeseriesRow[]>;
}
```

## Validation Still Needed

Before claiming production compatibility with a specific PBX install, validate against at least one real database dump from each target family:

- FreePBX 15 or Incredible PBX 2021.
- FreePBX 16 or Incredible PBX 2027.
- FreePBX 17 on Debian 12 with Asterisk 20 or 21.

Recommended validation query:

```sql
select
  recid,
  calldate,
  clid,
  src,
  dst,
  duration,
  billsec,
  disposition,
  did,
  uniqueid,
  recordingfile
from cdr
order by calldate desc
limit 10;
```

If any install lacks `recid`, `did`, or `recordingfile`, the MySQL adapter should be updated to use defensive projections or compatibility aliases.

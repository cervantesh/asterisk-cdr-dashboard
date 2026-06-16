# Asterisk CDR Dashboard

SvelteKit full-stack dashboard for Asterisk/FreePBX call detail records. The app modernizes an older Java Swing/JasperReports project while preserving the original report behavior:

- `Call Details`: paginated CDR rows.
- `Made Calls`: calls grouped by source extension.
- `Received Calls`: answered calls grouped by destination extension.
- `Missed Calls`: `NO ANSWER` and `BUSY` calls grouped by destination extension.

The default data source is deterministic demo data, so the dashboard runs without a PBX.

## Stack

- SvelteKit + TypeScript
- Vercel adapter in Vercel, Node adapter for local builds
- Kysely + mysql2 for MySQL/MariaDB CDR access
- Zod for validation
- Bcrypt password-hash login
- PDFKit and CSV export
- Vitest, Playwright, `svelte-check`

## Development

```sh
npm install
npm run dev
```

Default local login:

```txt
username: admin
password: admin123
```

## Configuration

Copy `.env.example` to `.env` and adjust values.

```sh
REPORT_DATA_SOURCE=demo
```

For a real PBX database:

```sh
REPORT_DATA_SOURCE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=asteriskcdrdb
MYSQL_USER=...
MYSQL_PASSWORD=...
```

The PBX integration is based on the Asterisk/FreePBX `asteriskcdrdb.cdr` data shape, not on FreePBX administrative tables. See [PBX CDR compatibility notes](docs/pbx-cdr-compatibility.md) for the fields, report data structures, query assumptions, and PBX versions considered.

## Connecting to a Real PBX Database

The app reads from the Asterisk-style CDR table only:

```txt
asteriskcdrdb.cdr
```

It does not connect to FreePBX GUI tables.

### Required environment variables

```sh
REPORT_DATA_SOURCE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=asteriskcdrdb
MYSQL_USER=pbx_report_user
MYSQL_PASSWORD=replace_me
MYSQL_CONNECTION_LIMIT=10
```

### Recommended database user

Use a read-only user instead of the PBX admin account:

```sql
create user 'pbx_report_user'@'%' identified by 'replace_me';
grant select on asteriskcdrdb.cdr to 'pbx_report_user'@'%';
flush privileges;
```

If you know the dashboard server IP, narrow the host:

```sql
create user 'pbx_report_user'@'10.0.0.25' identified by 'replace_me';
grant select on asteriskcdrdb.cdr to 'pbx_report_user'@'10.0.0.25';
flush privileges;
```

### Minimum validation query

Before switching the app to MySQL mode, confirm the PBX database exposes the fields the dashboard expects:

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

If that query fails, the app will need a compatibility update in the repository layer.

### Local setup example

Update `.env`:

```sh
REPORT_DATA_SOURCE=mysql
MYSQL_HOST=192.168.1.50
MYSQL_PORT=3306
MYSQL_DATABASE=asteriskcdrdb
MYSQL_USER=pbx_report_user
MYSQL_PASSWORD=replace_me
MYSQL_CONNECTION_LIMIT=10
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$12$ZdbOq1yhtHuv/uJE/Bv2u.R65sTgPgAAPSzt0rsQ1P2qPasxe0Kxu
SESSION_SECRET=dev-session-secret-change-me
SESSION_COOKIE_NAME=cdr_session
SESSION_TTL_DAYS=7
PUBLIC_APP_NAME=CDR Dashboard
```

Then run:

```sh
npm run dev
```

Open `/app/settings` and confirm:

- `Data Mode` is `mysql`
- `CDR Database` matches your target database

### Vercel note

Vercel can host the app, but the PBX database still has to be reachable from Vercel's runtime. Many PBX installs keep MySQL bound to `127.0.0.1`, so direct Vercel access usually will not work without a tunnel, VPN, replicated reporting database, or moving the dashboard closer to the PBX.

### First troubleshooting checks

1. Confirm `REPORT_DATA_SOURCE=mysql`.
2. Confirm the database host is reachable from the app runtime.
3. Confirm the MySQL user can run `select ... from cdr`.
4. Confirm the table is really named `cdr`.
5. Confirm your PBX writes `NO ANSWER` and `BUSY` exactly as expected if you care about the missed-call report.
6. Check whether your PBX schema is missing `recid`, `did`, or `recordingfile`.

More detail is available in [Connecting to a real PBX database](docs/connect-real-pbx-database.md).

## Vercel Hobby demo

The portfolio demo is intended to run on Vercel Hobby with demo data and no PBX database.

The build config uses `adapter-vercel` when Vercel sets `VERCEL=1`; local builds use `adapter-node` so Windows development does not require symlink permissions.

On Windows, forcing `VERCEL=1 npm run build` locally can fail if Developer Mode or administrator symlink permissions are disabled. Vercel's Linux build environment is the intended validation path for the Vercel adapter.

1. Import `cervantesh/asterisk-cdr-dashboard` in Vercel.
2. Use the default SvelteKit build command:

```sh
npm run build
```

3. Set these environment variables for Production and Preview:

```sh
REPORT_DATA_SOURCE=demo
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$12$ZdbOq1yhtHuv/uJE/Bv2u.R65sTgPgAAPSzt0rsQ1P2qPasxe0Kxu
SESSION_SECRET=<generate-a-long-random-value>
SESSION_COOKIE_NAME=cdr_session
SESSION_TTL_DAYS=7
PUBLIC_APP_NAME=CDR Dashboard
```

Default demo login remains:

```txt
username: admin
password: admin123
```

## Verification

```sh
npm run check
npm run test:unit -- --run
npm run build
npm run test:e2e
```

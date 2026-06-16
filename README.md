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

For a step-by-step setup against a live PBX database, see [Connecting to a real PBX database](docs/connect-real-pbx-database.md).

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

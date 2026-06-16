# Asterisk CDR Dashboard

SvelteKit full-stack dashboard for Asterisk/FreePBX call detail records. The app modernizes an older Java Swing/JasperReports project while preserving the original report behavior:

- `Detalles`: paginated CDR rows.
- `Realizadas`: calls grouped by source extension.
- `Recibidas`: answered calls grouped by destination extension.
- `No contestadas`: `NO ANSWER` and `BUSY` calls grouped by destination extension.

The default data source is deterministic demo data, so the dashboard runs without a PBX.

## Stack

- SvelteKit + TypeScript
- Adapter Node
- Kysely + mysql2 for MySQL/MariaDB CDR access
- Zod for validation
- Argon2id session login
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

## Verification

```sh
npm run check
npm run test:unit -- --run
npm run build
npm run test:e2e
```

The concept image used as the UI direction is in `docs/design/dashboard-concept.png`.

# Connecting to a Real PBX Database

This dashboard can read directly from a real Asterisk, FreePBX, or Incredible PBX CDR database when the PBX writes call detail records into MySQL or MariaDB.

The app does not connect to FreePBX GUI tables. It reads the CDR table only:

```txt
asteriskcdrdb.cdr
```

## What You Need

- A PBX that writes CDR rows to MySQL or MariaDB.
- Network access from the dashboard runtime to the database host and port.
- A database user with `SELECT` access on the `cdr` table.
- These environment variables:

```sh
REPORT_DATA_SOURCE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=asteriskcdrdb
MYSQL_USER=pbx_report_user
MYSQL_PASSWORD=replace_me
MYSQL_CONNECTION_LIMIT=10
```

## Recommended Database User

Create a read-only user instead of reusing the PBX admin account.

Example:

```sql
create user 'pbx_report_user'@'%' identified by 'replace_me';
grant select on asteriskcdrdb.cdr to 'pbx_report_user'@'%';
flush privileges;
```

Tighten the host portion if you know the dashboard server IP:

```sql
create user 'pbx_report_user'@'10.0.0.25' identified by 'replace_me';
grant select on asteriskcdrdb.cdr to 'pbx_report_user'@'10.0.0.25';
flush privileges;
```

## Minimum Validation Query

Before changing the app config, confirm the PBX database actually has the fields the dashboard expects.

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

If that query fails, the dashboard will not work without an adapter change.

## Local Connection

For local development, update `.env`:

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

Then start the app:

```sh
npm run dev
```

Open `/app/settings` and check:

- `Data Mode` should be `mysql`
- `CDR Database` should match your target database name

## Vercel Connection

Vercel can host the app, but the database must still be reachable from Vercel's serverless runtime.

Practical constraints:

- The PBX database must allow inbound connections from the internet, a tunnel, or a private connectivity layer.
- Many PBX installs keep MySQL bound to `127.0.0.1`, which means Vercel cannot reach it directly.
- Opening MySQL publicly without an allowlist, TLS, or a bastion is a bad idea.

Because of that, the realistic deployment patterns are:

1. Run the dashboard near the PBX on the same LAN/VPS and use `adapter-node`.
2. Expose the database through a secure tunnel or VPN.
3. Replicate the CDR table into another MySQL/MariaDB instance that Vercel can reach safely.

For Vercel, set these environment variables:

```sh
REPORT_DATA_SOURCE=mysql
MYSQL_HOST=<reachable-db-host>
MYSQL_PORT=3306
MYSQL_DATABASE=asteriskcdrdb
MYSQL_USER=pbx_report_user
MYSQL_PASSWORD=<secret>
MYSQL_CONNECTION_LIMIT=10
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>
SESSION_SECRET=<long-random-secret>
SESSION_COOKIE_NAME=cdr_session
SESSION_TTL_DAYS=7
PUBLIC_APP_NAME=CDR Dashboard
```

## How the App Uses the Data

The MySQL adapter lives in `src/lib/server/db/cdr.repository.ts`.

It assumes:

- The table name is `cdr`
- `Made Calls` groups by `src`
- `Received Calls` groups by `dst` with `disposition = 'ANSWERED'`
- `Missed Calls` groups by `dst` with `disposition in ('NO ANSWER', 'BUSY')`
- Search applies to `clid`, `src`, `dst`, and `uniqueid`
- Date filtering applies to `calldate`

The full data contract is documented in [PBX CDR compatibility notes](./pbx-cdr-compatibility.md).

## First Troubleshooting Checks

If the dashboard does not load data:

1. Confirm `REPORT_DATA_SOURCE=mysql`.
2. Confirm the database host is reachable from the app runtime.
3. Confirm the MySQL user can run `select ... from cdr`.
4. Confirm the table is really named `cdr`.
5. Confirm your PBX writes `NO ANSWER` and `BUSY` exactly as expected if you care about the missed-call report.
6. Check whether your PBX schema is missing `recid`, `did`, or `recordingfile`.

If the schema differs, the right fix is to adapt the repository query layer, not to force the data into the current query shape blindly.

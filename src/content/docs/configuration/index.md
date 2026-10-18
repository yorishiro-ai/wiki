---
title: "Configuration"
description: "Settings for the server, database, queue, logging, and security."
sidebar:
  order: 1
---

Yorishiro reads its settings from environment variables. For the settings on these pages you need no configuration file.

Related pages: [Embedding](embedding/), [Workers and queues](workers-and-queues/), and [Enterprise configuration](enterprise/).

## Configuration files

Yorishiro loads `config/<environment>.yaml`. `LOCO_ENV` selects the environment. It defaults to `development` for source runs, and Docker and the packages set it to `production`. `LOCO_CONFIG_FOLDER` points to another directory that holds the file.

The files read environment variables for deploy-time values such as `DATABASE_URL`. A configuration file you supply replaces the built-in one; the two are not merged. To keep a local override beside the built-in file, name it `production.local.yaml`.

Package installs read `/etc/yorishiro/production.yaml` if it exists, and the packaged `production.yaml.example` otherwise. Docker installs read `/app/config/production.yaml`.

## Server address

| Variable | Default | Description |
| --- | --- | --- |
| `BINDING` | `0.0.0.0` (production), `localhost` (development) | Interface the server listens on |
| `PORT` | `5150` | Listening port |
| `HOST` | `http://localhost` | Public URL used in links. It is not the listening address. In development the value is fixed and the variable is ignored. |
| `YORISHIRO_MCP_ALLOWED_HOSTS` | Unset | Extra `Host` values the `/mcp` endpoint accepts, comma-separated. By default it accepts `localhost`, `127.0.0.1`, and `::1`. Wildcards are not allowed. |

If clients reach the server through another hostname (for example behind a reverse proxy), add that hostname to `YORISHIRO_MCP_ALLOWED_HOSTS`. Otherwise MCP requests are rejected.

OAuth login, an Enterprise feature, also needs a public callback URL. See [Enterprise configuration](enterprise/).

## Database and queue

Application data uses SQLite or PostgreSQL. The queue is chosen separately. With nothing set, both use SQLite files, so you need no external service.

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///var/lib/yorishiro/yorishiro.sqlite3?mode=rwc` (production) | Use a `postgres://` URI for PostgreSQL. In development the default is `sqlite://yorishiro.sqlite3?mode=rwc`. |
| `YORISHIRO_QUEUE_KIND` | Follows `DATABASE_URL` | Queue type: `Sqlite`, `Postgres`, or `Redis` (any Redis-compatible service such as Valkey) |
| `QUEUE_URL` | Provider default | Queue URI, for example `redis://valkey:6379` or `rediss://…` |
| `DB_AUTO_MIGRATE` | `true` | Apply database migrations on start. Turn it off when you run several server instances and migrate separately. |

Supported combinations are:

- SQLite database with a SQLite queue
- PostgreSQL database with a PostgreSQL queue
- Either database with a Valkey queue

The other pairs (SQLite database with a PostgreSQL queue, or the reverse) are rejected at start. When both use SQLite, they must use separate files. The packaged default queue file is `sqlite:///var/lib/yorishiro/yorishiro_queue.sqlite3?mode=rwc`. Set `QUEUE_URL` explicitly when you move an existing installation or choose another location.

PostgreSQL needs the `vector` and `pg_trgm` extensions.

For queue sizing and worker processes, see [Workers and queues](workers-and-queues/).

## Tenants

| Variable | Default | Description |
| --- | --- | --- |
| `YORISHIRO_MAX_TENANTS` | `1` | Maximum number of tenants. Only Enterprise with a valid licence honors other values. `0` means unlimited and turns off the first-run setup endpoint. Community and unlicensed Enterprise always allow one tenant and log a warning if you set another value. Negative values are rejected. |

SQLite always allows one tenant.

## Search quota

| Variable | Default | Description |
| --- | --- | --- |
| `YORISHIRO_SEARCH_TOKENS_PER_MINUTE` | `100000` | Search tokens a workspace can spend per minute. Each query is charged, and the API and MCP share the quota. The default is high and mainly stops runaway automated queries. With the default estimate, Japanese text costs about half as many tokens as English, so the same quota allows more Japanese queries. |

## Sign-in rate limit

| Variable | Default | Description |
| --- | --- | --- |
| `YORISHIRO_AUTH_RATE_LIMIT_MAX` | `10` | Sign-in and sign-up requests allowed per window |
| `YORISHIRO_AUTH_RATE_LIMIT_WINDOW_SECS` | `60` | Window length in seconds |

Both must be greater than zero.

## Database load guard

The load guard can switch a PostgreSQL deployment to read-only mode when the database is busy. It is off by default.

Set `YORISHIRO_DB_LOAD_THRESHOLD` to the number of active connections that counts as busy. The guard samples every 5 seconds. It turns on read-only mode when the count stays at or above the threshold for 30 seconds, and it turns it off again after the same quiet period. It never clears a read-only or full-lock state that an operator set. It does nothing on SQLite.

| Variable | Default | Description |
| --- | --- | --- |
| `YORISHIRO_DB_LOAD_THRESHOLD` | `0` (off) | Active PostgreSQL connections at or above which the database counts as busy |
| `YORISHIRO_DB_LOAD_SUSTAIN_SECS` | `30` | How long the busy or quiet state must last. Must be greater than zero. |
| `YORISHIRO_DB_LOAD_POLL_SECS` | `5` | Seconds between samples. Must be greater than zero. |

`yorishiro task db_load_guard` reports one sample without changing the maintenance state.

## Logging

`LOG_LEVEL` sets the verbosity: `debug`, `info`, `warn`, or `error`. `RUST_LOG` also works and takes priority. Logs are written as JSON in production.

API keys, webhook secrets, OAuth credentials, OIDC tokens, and licence owner details are kept out of the logs. Error responses from providers are also left out because they can repeat credentials. Access logs record the request path but not the query string, so OAuth codes and state values are never logged.

## Mail

Yorishiro does not send mail by default. To enable it, add a `mailer:` block to your configuration file. Then set `MAILER_HOST`, `MAILER_PORT` (default `587`), `MAILER_USER`, and `MAILER_PASSWORD` in the environment. The block is used only in production when `MAILER_HOST` is set.

## API keys

Tenant owners and admins manage workspace API keys through `/api/api-keys`.

- `POST /api/api-keys` takes a `name` of 1 to 100 characters and returns the full key only in that response.
- `GET /api/api-keys` lists names, prefixes, IDs, and creation times. It never returns key secrets.
- `DELETE /api/api-keys/{id}` revokes a key immediately. It returns `404` if the ID does not exist or belongs to another tenant.

You can revoke the key you are using for the request. This lets an administrator retire an old key without a second credential.

## Time zone

The default time zone is `UTC`. To use another zone, set `settings.timezone` in your configuration file to an IANA name such as `Asia/Tokyo`, then restart. You can also keep the existing environment-variable expression in the file and start with `YORISHIRO_TIMEZONE=Asia/Tokyo`. An invalid name prevents start.

```yaml
settings:
  timezone: Asia/Tokyo
```

Timestamps in workspace details, API key and audit responses, and log events use this zone. Changing it does not change when recorded events happened or when jobs run or expire. Use the same value on every server and worker that shares a database.

---
title: "Docker Compose"
description: "Run the server, worker, and scheduler with Docker Compose."
sidebar:
  order: 3
---

Copy one of the files below to `compose.yml` and run it from that directory. Replace `<VERSION>` with a release tag from the [Releases](https://github.com/yorishiro-ai/yorishiro/releases) page, for example `20261015-1`.

Each setup starts three services from one image: the server (`app`), a worker, and a scheduler. See [What runs](../#what-runs). The `80:5150` mapping publishes the server on host port `80`.

Start with `docker compose up -d` and stop with `docker compose down`. Then follow [First run](../first-run/); the URL there is `http://localhost`.

The local embedding provider downloads its model on first use (about 522 MiB), and the first start waits for it. To skip the download, set `YORISHIRO_EMBEDDING_PROVIDER=none` on the `x-yorishiro` environment.

## SQLite

```yaml
x-yorishiro: &yorishiro
  image: ghcr.io/yorishiro-ai/yorishiro:<VERSION>-ce
  restart: unless-stopped
  volumes:
    - data:/var/lib/yorishiro
    - model-cache:/home/yorishiro/.cache/yorishiro

services:
  app:
    <<: *yorishiro
    ports:
      - "80:5150"

  worker:
    <<: *yorishiro
    command: ["start", "--worker=worker-target:shared"]
    healthcheck:
      disable: true
    depends_on:
      - app

  scheduler:
    <<: *yorishiro
    command: ["scheduler"]
    healthcheck:
      disable: true
    depends_on:
      - app

volumes:
  data:
  model-cache:
```

All three services share one volume, because SQLite keeps both the database and the queue in files. SQLite supports a single tenant and is meant for evaluation and personal use. See [SQLite mode](../../guides/sqlite/).

## PostgreSQL and Valkey

Use this setup for multi-tenant hosting (Enterprise edition with a licence) or when several workers share one queue. PostgreSQL stores the data, and Valkey (Redis-compatible) holds the job queue.

Create `init-extensions.sql` next to `compose.yml`. PostgreSQL runs it once, when the data volume is first created:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

```yaml
x-yorishiro: &yorishiro
  image: ghcr.io/yorishiro-ai/yorishiro:<VERSION>-ce
  restart: unless-stopped
  volumes:
    - model-cache:/home/yorishiro/.cache/yorishiro
  environment:
    DATABASE_URL: postgres://yorishiro:change-me@db:5432/yorishiro
    YORISHIRO_QUEUE_KIND: Redis
    QUEUE_URL: redis://valkey:6379

services:
  db:
    image: pgvector/pgvector:pg18
    restart: unless-stopped
    environment:
      POSTGRES_USER: yorishiro
      POSTGRES_PASSWORD: change-me
      POSTGRES_DB: yorishiro
    volumes:
      - pg-data:/var/lib/postgresql
      - ./init-extensions.sql:/docker-entrypoint-initdb.d/init-extensions.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yorishiro"]
      interval: 5s
      timeout: 3s
      retries: 5

  valkey:
    image: valkey/valkey:9.1
    restart: unless-stopped
    volumes:
      - valkey-data:/data
    healthcheck:
      test: ["CMD", "valkey-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  app:
    <<: *yorishiro
    ports:
      - "80:5150"
    healthcheck:
      start_period: 15m
    depends_on:
      db:
        condition: service_healthy
      valkey:
        condition: service_healthy

  worker:
    <<: *yorishiro
    command: ["start", "--worker=worker-target:shared"]
    healthcheck:
      disable: true
    depends_on:
      app:
        condition: service_healthy
      valkey:
        condition: service_healthy

  scheduler:
    <<: *yorishiro
    command: ["scheduler"]
    healthcheck:
      disable: true
    depends_on:
      app:
        condition: service_healthy

volumes:
  pg-data:
  valkey-data:
  model-cache:
```

Change the passwords before you use this beyond a local trial. The worker waits for a healthy server because the server applies the database migrations on start.

To use PostgreSQL for the queue as well, remove `YORISHIRO_QUEUE_KIND` and `QUEUE_URL`, and drop the `valkey` service. With PostgreSQL as the database, the queue then uses PostgreSQL too.

## Use a local embedding model offline

If the host already has the model files, put `model.safetensors` and `tokenizer.json` in a `models/` directory and mount it into each service that needs it:

```yaml
volumes:
  - ./models:/app/models:ro
```

Provide both files or neither. If only one is present, the server fails to start.

## Configuration

See [Configuration](../../configuration/) for all settings.

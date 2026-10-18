---
title: "First run"
description: "Create the first account and an API key."
sidebar:
  order: 6
---

Yorishiro has no web setup screen. You create the first account and your first API key through the API.

The examples assume the server answers at `http://localhost:5150`. In the Docker examples on these pages, use `http://localhost` instead, because the container port is published on port `80`.

## 1. Check the server

```console
$ curl http://localhost:5150/_ping
```

The server is ready when this succeeds. The first start can take a while because the local embedding model downloads on first use (about 522 MiB). Set `YORISHIRO_EMBEDDING_PROVIDER=none` to skip the download. See [Embedding](../../configuration/embedding/).

## 2. Create the first account

```console
$ curl http://localhost:5150/setup/status
{"setup_required":true}

$ curl -X POST http://localhost:5150/setup \
    -H 'Content-Type: application/json' \
    -d '{"email":"you@example.com","password":"choose-a-password","display_name":"You"}'
```

The response contains your `user_id`, `tenant_id`, `workspace_id`, and an `api_key`. **The API key is shown only once. Store it now.**

Setup works once, while the deployment has no tenant. A second call returns `409`. Setup is also unavailable when `YORISHIRO_MAX_TENANTS=0` (Enterprise with a licence). See [Configuration](../../configuration/).

## 3. Use the API key

Send the key as a bearer token:

```console
$ curl http://localhost:5150/api/api-keys -H 'Authorization: Bearer <api-key>'
```

Owners and admins can create more keys with `POST /api/api-keys`, list them with `GET /api/api-keys`, and revoke them with `DELETE /api/api-keys/{id}`. A new key is returned only in the response that creates it. Listing never returns key secrets.

## 4. Connect an MCP client

Point your MCP client at `http://localhost:5150/mcp` and send the API key in the `Authorization: Bearer <api-key>` header. See [MCP tools](../../reference/mcp-tools/) for the available tools and the scope each one needs.

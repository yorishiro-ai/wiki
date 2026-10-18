---
title: "Queue start times"
description: "How Yorishiro measures how long background jobs wait, and how to monitor it."
sidebar:
  order: 1
---

Yorishiro records the life of every background job it submits: when it was queued, when a worker started it, and how it ended. You can use this to see whether jobs start as fast as you expect.

## How timing is measured

- **Queued time** is recorded just before Yorishiro submits the job to the queue.
- **Start time** is when a worker first receives the job. The queue reports no separate claim time, so claim and start are the same moment.
- **Queue start time** is start time minus queued time.

A retry or redelivery keeps the original queued time. The queue start time therefore includes the time a job spent waiting for another attempt.

## Job status

A job is `queued`, `running`, `retrying`, `completed`, `failed`, `cancelled`, or `unavailable`. Missing queue capacity and provider failures do not count as successful starts. If the queue is unavailable when a request submits a job, the job becomes `unavailable` and the request gets an error.

A running job holds a lease. A worker renews the lease about once a minute while it works, and a lease not renewed for five minutes counts as expired. A duplicate delivery during the lease is ignored. After the lease expires, the next delivery counts as a new attempt, and the previous worker can no longer complete or retry the job.

The job records stay in the application database, even when the queue itself is in Valkey. When you diagnose a job, check both the queue and the job record.

## Monitor start times

When a job starts, the log contains the message `queue job admitted` with the fields `queue_start_seconds` and `lifecycle_id`. Filter for these events in your logging system to chart start times.

Terminal failures log `terminal worker failure`. With Enterprise plan policy on, a job held back by its target limit logs `worker capacity saturated`, with fields such as `worker_class`, `scheduling_priority`, `capacity_limit`, and `active_capacity`.

If more and more jobs stay `queued`, `retrying`, or `unavailable`, check worker capacity and queue health before you judge start times.

## Objectives by plan

Enterprise plans define these objectives for how long a job should wait before it starts:

| Plan | Objective |
| --- | --- |
| Free | Best effort |
| Pro | 60 seconds |
| Team | 15 seconds |

Yorishiro records the timings but does not enforce the objectives. Compare your recorded start times with them. Automatic Official bursts and compute charging are not available.

## Capacity

Run workers for the targets you need to reserve capacity for. See [Workers and queues](../../configuration/workers-and-queues/). A worker that serves several targets shares its slots across them and reserves none.

When a target reaches its limit, the job waits and tries again at its original priority and target. It does not move to another target. The Enterprise limits are described in [Enterprise configuration](../../configuration/enterprise/#plan-policy-and-job-limits).

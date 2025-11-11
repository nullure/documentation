---
title: Temporal API
description: time-aware facts and timelines under /api/temporal
---

# temporal api

openmemory tracks time-bound facts in `temporal_facts` and links in `temporal_edges`. use these endpoints:

- `POST /api/temporal/fact` — insert/update fact `{ subject, predicate, object, valid_from?, confidence?, metadata? }`
- `GET /api/temporal/fact` — query facts valid at `at?`, optional `min_confidence`
- `GET /api/temporal/fact/current` — current fact for `subject`+`predicate`
- `PATCH /api/temporal/fact/:id` — update confidence or metadata
- `DELETE /api/temporal/fact/:id` — invalidate (set `valid_to`)
- `GET /api/temporal/timeline` — full timeline for a `subject` (and optional `predicate`)
- `GET /api/temporal/subject/:subject` — all facts for a subject (filters: `at`, `include_historical`)
- `GET /api/temporal/search` — regex/like match on subject/predicate/object
- `GET /api/temporal/compare` — compare states between two timestamps `{ subject, time1, time2 }`
- `GET /api/temporal/stats` — counts + historical percentage
- `POST /api/temporal/decay` — apply confidence decay `{ decay_rate }`
- `GET /api/temporal/volatile` — most frequently changing facts

references

- router: `backend/src/server/routes/temporal.ts`
- storage: `backend/src/temporal_graph/store.ts`
- queries: `backend/src/temporal_graph/query.ts`
- timelines: `backend/src/temporal_graph/timeline.ts`
- schema: `backend/src/core/db.ts`

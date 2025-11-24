---
title: API Routes | OpenMemory
description: Comprehensive reference of all OpenMemory Backend API endpoints.
keywords: openmemory api, api reference, rest api, memory endpoints, temporal api
---

# API Routes

The OpenMemory Backend exposes a RESTful API on port `8080` (default).

## Authentication

All requests should include the `x-api-key` header if an API key is configured.

```bash
x-api-key: your-secret-key
```

## Memory Operations

### Add Memory
Store a new memory.

- **POST** `/memory/add`
- **Body**:
  ```json
  {
    "content": "User likes blue widgets",
    "tags": ["preference"],
    "metadata": { "source": "chat" },
    "user_id": "user_123"
  }
  ```

### Query Memory
Retrieve relevant memories.

- **POST** `/memory/query`
- **Body**:
  ```json
  {
    "query": "What widgets does the user like?",
    "k": 5,
    "filters": {
      "sector": "semantic",
      "min_score": 0.5,
      "user_id": "user_123"
    }
  }
  ```

### Update Memory
Modify an existing memory.

- **PATCH** `/memory/:id`
- **Body**:
  ```json
  {
    "content": "Updated content",
    "tags": ["new-tag"],
    "user_id": "user_123"
  }
  ```

### Delete Memory
Remove a memory and its vectors/waypoints.

- **DELETE** `/memory/:id`
- **Query/Body**: `user_id` (optional, for ownership check)

### Get All Memories
List memories with pagination.

- **GET** `/memory/all`
- **Query Params**:
  - `l`: Limit (default 100)
  - `u`: Offset (default 0)
  - `sector`: Filter by sector
  - `user_id`: Filter by user

### Get Single Memory
- **GET** `/memory/:id`

### Reinforce Memory
Manually boost a memory's salience.

- **POST** `/memory/reinforce`
- **Body**: `{ "id": "...", "boost": 0.1 }`

## Ingestion

### Ingest Document
Upload and process a file (PDF, DOCX, MD, TXT, Audio, Video).

- **POST** `/memory/ingest`
- **Body**:
  ```json
  {
    "content_type": "pdf",
    "data": "base64_encoded_string...",
    "metadata": { "filename": "doc.pdf" },
    "user_id": "user_123"
  }
  ```

### Ingest URL
Scrape and ingest a webpage.

- **POST** `/memory/ingest/url`
- **Body**:
  ```json
  {
    "url": "https://example.com",
    "user_id": "user_123"
  }
  ```

## Temporal Graph

### Create Fact
- **POST** `/api/temporal/fact`
- **Body**:
  ```json
  {
    "subject": "Company",
    "predicate": "has_CEO",
    "object": "Alice",
    "valid_from": "2024-01-01",
    "confidence": 1.0
  }
  ```

### Get Facts
- **GET** `/api/temporal/fact`
- **Query**: `subject`, `predicate`, `object`, `at` (date)

### Get Current Fact
- **GET** `/api/temporal/fact/current`
- **Query**: `subject`, `predicate`

### Update Fact
- **PATCH** `/api/temporal/fact/:id`
- **Body**: `{ "confidence": 0.8, "metadata": {...} }`

### Invalidate Fact
Close a fact's validity period.

- **DELETE** `/api/temporal/fact/:id`
- **Body**: `{ "valid_to": "2024-12-31" }`

### Timeline & Analysis
- **GET** `/api/temporal/timeline`: Get entity timeline.
- **GET** `/api/temporal/search`: Search facts by pattern.
- **GET** `/api/temporal/compare`: Compare facts between two dates.
- **GET** `/api/temporal/stats`: Get graph statistics.
- **GET** `/api/temporal/volatile`: Find most changing facts.

## Users

### Get User Summary
- **GET** `/users/:user_id/summary`

### Regenerate Summary
- **POST** `/users/:user_id/summary/regenerate`

### Get User Memories
- **GET** `/users/:user_id/memories`

### Delete User Memories
- **DELETE** `/users/:user_id/memories`

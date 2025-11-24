---
title: Query Memory API | OpenMemory
description: API reference for querying memories from the OpenMemory Backend Server.
keywords: openmemory api, query memory api, search memory, vector search endpoint
---

# Query Memory API

> [!NOTE]
> This reference is for the **Backend Server API**. If you are using Standalone Mode, use the [JavaScript SDK](/docs/sdks/javascript) or [Python SDK](/docs/sdks/python) directly.

Search for relevant memories using semantic similarity and graph traversal.

## Endpoint

```http
POST /memory/query
```

## Request Body

```typescript
interface QueryMemoryRequest {
  query: string;
  k?: number; // Number of results (default: 5)
  user_id?: string;
  min_score?: number; // Minimum similarity score (0-1)
}
```

## Example

```bash
curl -X POST http://localhost:8080/memory/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "query": "What are the user preferences?",
    "k": 3
  }'
```

## Response

```json
{
  "query": "What are the user preferences?",
  "matches": [
    {
      "id": "mem_abc123",
      "content": "User prefers dark mode",
      "score": 0.89,
      "primary_sector": "semantic"
    }
  ]
}
```

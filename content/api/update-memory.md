---
title: Update Memory API | OpenMemory
description: API reference for updating existing memories in the OpenMemory Backend Server.
keywords: update memory api, modify memory, openmemory api
---

# Update Memory API

> [!NOTE]
> This reference is for the **Backend Server API**. For Standalone Mode, use `mem.update(id, content)`.

Modify the content or metadata of an existing memory.

## Endpoint

```http
PUT /memory/{id}
```

## Request Body

```typescript
interface UpdateMemoryRequest {
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

## Example

```bash
curl -X PUT http://localhost:8080/memory/mem_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content": "User PREFERS light mode now",
    "tags": ["preferences", "ui", "updated"]
  }'
```

## Response

```json
{
  "id": "mem_abc123",
  "updated": true
}
```

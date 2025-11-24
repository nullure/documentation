---
title: Add Memory API | OpenMemory
description: API reference for adding memories to the OpenMemory Backend Server.
keywords: openmemory api, add memory api, backend api, memory storage endpoint
---

# Add Memory API

> [!NOTE]
> This reference is for the **Backend Server API**. If you are using Standalone Mode, use the [JavaScript SDK](/docs/sdks/javascript) or [Python SDK](/docs/sdks/python) directly.

Add new memories to OpenMemory with full control over content, metadata, and salience parameters.

## Endpoint

```http
POST /memory/add
```

## Authentication

```bash
Authorization: Bearer your_api_key_here
```

## Request Body

```typescript
interface AddMemoryRequest {
  content: string;
  tags?: string[];
  metadata?: Record<string, any>;
  user_id?: string;
}
```

### Parameters

| Parameter  | Type     | Required | Default | Description                      |
| ---------- | -------- | -------- | ------- | -------------------------------- |
| `content`  | string   | Yes      | -       | The memory content to store      |
| `tags`     | string[] | No       | `[]`    | Tags for categorization          |
| `metadata` | object   | No       | `{}`    | Additional metadata              |
| `user_id`  | string   | No       | -       | User ID for multi-user isolation |

## Example

```bash
curl -X POST http://localhost:8080/memory/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content": "User prefers dark mode",
    "tags": ["preferences", "ui"],
    "metadata": {
      "source": "settings_page"
    }
  }'
```

## Response

```json
{
  "id": "mem_abc123",
  "primary_sector": "semantic",
  "sectors": ["semantic", "procedural"]
}
```

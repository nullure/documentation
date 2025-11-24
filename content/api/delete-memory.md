---
title: Delete Memory API | OpenMemory
description: API reference for deleting memories from the OpenMemory Backend Server.
keywords: delete memory api, remove memory, openmemory api
---

# Delete Memory API

> [!NOTE]
> This reference is for the **Backend Server API**. For Standalone Mode, use `mem.delete(id)`.

Remove a memory by its ID.

## Endpoint

```http
DELETE /memory/{id}
```

## Example

```bash
curl -X DELETE http://localhost:8080/memory/mem_abc123 \
  -H "Authorization: Bearer your_api_key"
```

## Response

```json
{
  "success": true,
  "id": "mem_abc123"
}
```

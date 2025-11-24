---
title: Reinforce Memory API | OpenMemory
description: API reference for reinforcing memories to prevent decay.
keywords: reinforce memory, memory decay, prevent forgetting, openmemory api
---

# Reinforce Memory API

> [!NOTE]
> This reference is for the **Backend Server API**. For Standalone Mode, use `mem.reinforce(id)`.

Strengthen a memory to prevent it from decaying.

## Endpoint

```http
POST /memory/reinforce
```

## Request Body

```typescript
interface ReinforceRequest {
  id: string;
  boost?: number; // 0.0 to 1.0 (default: 0.1)
}
```

## Example

```bash
curl -X POST http://localhost:8080/memory/reinforce \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "id": "mem_abc123",
    "boost": 0.2
  }'
```

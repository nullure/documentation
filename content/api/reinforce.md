---
title: Reinforcement
description: Strengthen memories through explicit reinforcement signals
---

# Reinforcement

Strengthen memories through explicit reinforcement signals to prevent decay.

## Endpoint

```
POST /memory/reinforce
```

## Authentication

```bash
Authorization: Bearer your_api_key_here
```

## Request

```typescript
interface ReinforceRequest {
  id: string;
  boost?: number;
}
```

### Parameters

| Parameter | Type   | Required | Default | Description              |
| --------- | ------ | -------- | ------- | ------------------------ |
| `id`      | string | Yes      | -       | Memory ID to reinforce   |
| `boost`   | number | No       | `0.2`   | Salience increase amount |

## Response

```typescript
interface ReinforceResponse {
  ok: boolean;
}
```

## Examples

### Basic Reinforcement

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key", base_url="http://localhost:8080")

# Strengthen a memory
result = om.reinforce(
    memory_id="mem_abc123",
    boost=0.1  # Increase salience by 0.1
)

print(f"Memory reinforced: {result['ok']}")
```

### Stronger Reinforcement

```python
# Apply stronger boost for important memories
om.reinforce(
    memory_id="mem_xyz789",
    boost=0.3  # Larger salience boost
)
```

### Automatic Reinforcement on Query

```python
# Reinforce memories when they're retrieved and used
result = om.query("important project details", k=5)

for match in result["matches"]:
    # Reinforce the memory that was useful
    om.reinforce(match["id"], boost=0.05)
```

### TypeScript/Node.js

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your_api_key',
});

// Reinforce a memory
await om.reinforce('mem_abc123', 0.2);
```

### cURL

```bash
curl -X POST http://localhost:8080/memory/reinforce \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "id": "mem_abc123",
    "boost": 0.2
  }'
```

See [Decay Algorithm](/docs/concepts/decay) for how reinforcement affects memory persistence.

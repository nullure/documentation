---
title: Reinforcement
description: Strengthen memories through explicit reinforcement signals
---

# Reinforcement

Strengthen memories through explicit reinforcement signals.

## Endpoint

```
POST /api/reinforce
```

## Request

```typescript
interface ReinforceRequest {
  id: string;
  boost?: number;
}
```

## Examples

### Basic Reinforcement

```python
from openmemory import OpenMemory

om = OpenMemory(base_url="http://localhost:8080", api_key="your_api_key")

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

### Spaced Repetition Pattern

```python
# Implement spaced repetition
def schedule_review(memory_id):
    om.reinforce(
        memory_id=memory_id,
        boost=0.2
    )
```

See [HMD v2 Specification](/docs/concepts/hmd-v2) for decay mechanics and [Decay Algorithm](/docs/concepts/decay) for reinforcement strategies.

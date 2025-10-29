---
title: Update Memory
description: Update existing memories with new content, tags, or metadata
---

# Update Memory

Update existing memories with new content, tags, or metadata while preserving the memory's history and relationships.

## Endpoint

```
PATCH /memory/:id
```

## Authentication

```bash
X-API-Key: your_api_key_here
```

## URL Parameters

| Parameter | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| `id`      | string | Yes      | Memory ID to update |

## Request Body

```typescript
interface UpdateMemoryRequest {
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### Parameters

| Parameter  | Type     | Required | Description                    |
| ---------- | -------- | -------- | ------------------------------ |
| `content`  | string   | No       | New content for the memory     |
| `tags`     | string[] | No       | Updated tags array             |
| `metadata` | object   | No       | Updated or additional metadata |

## Response

```typescript
interface UpdateMemoryResponse {
  id: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
  updated_at: string;
  version: number;
  sectors: string[];
  primary_sector: string;
}
```

## Examples

### Update Content

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key")

# Update memory content
result = om.update_memory(
    memory_id="mem_7k9n2x4p8q",
    content="Updated: Python uses duck typing and dynamic typing"
)

print(f"Memory updated at: {result.updated_at}")
print(f"Version: {result.version}")
```

### Update Tags

```python
# Add or replace tags
result = om.update_memory(
    memory_id="mem_7k9n2x4p8q",
    tags=["python", "typing", "programming", "updated"]
)

print(f"Updated tags: {result.tags}")
```

### Update Metadata

```python
# Update metadata fields
result = om.update_memory(
    memory_id="mem_7k9n2x4p8q",
    metadata={
        "category": "programming",
        "language": "python",
        "verified": True,
        "last_reviewed": "2025-01-20",
        "importance": "high"
    }
)

print(f"Updated metadata: {result.metadata}")
```

### Update Multiple Fields

```python
# Update content, tags, and metadata together
result = om.update_memory(
    memory_id="mem_7k9n2x4p8q",
    content="Python supports duck typing for flexible polymorphism",
    tags=["python", "oop", "design-patterns"],
    metadata={
        "category": "programming",
        "difficulty": "intermediate",
        "verified": True
    }
)

print(f"Memory fully updated: {result.id}")
```

### TypeScript/Node.js

```typescript
import { OpenMemory } from "@openmemory/sdk";

const om = new OpenMemory({ apiKey: "your_api_key" });

// Update memory
const result = await om.updateMemory("mem_7k9n2x4p8q", {
  content: "GraphQL provides strongly-typed API queries with introspection",
  tags: ["graphql", "api", "typescript", "web-development"],
  metadata: {
    category: "web_development",
    verified: true,
    updated_by: "user_123",
  },
});

console.log(`Updated version: ${result.version}`);
```

### cURL

```bash
curl -X PATCH https://your-domain.com/memory/mem_7k9n2x4p8q \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "content": "Kubernetes orchestrates containerized applications at scale",
    "tags": ["kubernetes", "containers", "orchestration", "devops"],
    "metadata": {
      "category": "devops",
      "difficulty": "advanced",
      "verified": true
    }
  }'
```

## Response Examples

### Success Response

```json
{
  "id": "mem_7k9n2x4p8q",
  "content": "Python uses duck typing for flexible polymorphism",
  "tags": ["python", "oop", "design-patterns"],
  "metadata": {
    "category": "programming",
    "difficulty": "intermediate",
    "verified": true
  },
  "updated_at": "2025-01-20T14:35:00Z",
  "version": 2,
  "sectors": ["sector_abc123", "sector_def456"],
  "primary_sector": "sector_abc123"
}
```

### Error Responses

#### Memory Not Found

```json
{
  "err": "nf"
}
```

Status Code: `404`

#### Missing ID

```json
{
  "err": "id"
}
```

Status Code: `400`

#### Internal Error

```json
{
  "err": "internal"
}
```

Status Code: `500`

## Behavior Notes

### Content Updates

- Updating content will **regenerate embeddings** for the memory
- Vector representations will be recalculated across all sectors
- The memory's position in the semantic space may change
- Existing waypoints are preserved but may become less relevant

### Tag Updates

- Tags are **replaced entirely**, not merged
- Pass all desired tags, including existing ones you want to keep
- Empty array `[]` will remove all tags

### Metadata Updates

- Metadata fields are **merged** with existing metadata
- New fields are added
- Existing fields are overwritten
- To remove a field, set it to `null`

### Version Tracking

- Each update increments the `version` number
- Version starts at `1` when memory is created
- Use versions to track memory evolution

## Use Cases

### Correcting Errors

```python
# Fix a typo or incorrect information
om.update_memory(
    memory_id="mem_xyz",
    content="Corrected: React 18 introduced automatic batching"
)
```

### Enriching Metadata

```python
# Add verification or additional context
existing = om.get_memory("mem_xyz")
om.update_memory(
    memory_id="mem_xyz",
    metadata={
        **existing.metadata,
        "verified": True,
        "verified_by": "expert_user_123",
        "verification_date": "2025-01-20"
    }
)
```

### Updating Status

```python
# Update task or issue status
om.update_memory(
    memory_id="mem_task_123",
    metadata={
        "status": "completed",
        "completed_at": "2025-01-20T10:00:00Z",
        "completed_by": "user_456"
    }
)
```

### Refining Content

```python
# Improve memory with more detail
om.update_memory(
    memory_id="mem_xyz",
    content="Docker Compose simplifies multi-container deployments by defining services, networks, and volumes in a single YAML file",
    tags=["docker", "compose", "containers", "devops", "yaml"]
)
```

## Best Practices

### 1. Preserve Important Data

```python
# Get existing memory first
memory = om.get_memory("mem_xyz")

# Preserve tags while updating content
om.update_memory(
    memory_id="mem_xyz",
    content="New content",
    tags=memory.tags  # Keep existing tags
)
```

### 2. Track Changes

```python
# Add update metadata
om.update_memory(
    memory_id="mem_xyz",
    content="Updated content",
    metadata={
        **existing.metadata,
        "last_updated": datetime.now().isoformat(),
        "updated_by": "user_123",
        "update_reason": "Added more detail"
    }
)
```

### 3. Batch Updates

```python
# Update multiple memories efficiently
memory_ids = ["mem_1", "mem_2", "mem_3"]

for mem_id in memory_ids:
    om.update_memory(
        memory_id=mem_id,
        metadata={"batch_updated": True, "batch_date": "2025-01-20"}
    )
```

### 4. Validate Before Updating

```python
def safe_update(memory_id, **updates):
    try:
        # Check if memory exists
        existing = om.get_memory(memory_id)

        # Perform update
        result = om.update_memory(memory_id, **updates)
        return result
    except NotFoundError:
        print(f"Memory {memory_id} not found")
        return None
    except Exception as e:
        print(f"Update failed: {e}")
        return None
```

### 5. Semantic Consistency

```python
# When updating content, ensure semantic consistency
# Consider whether the memory should be split or merged

# Before: Too broad
old = "Python is a programming language with many features"

# After: More specific
om.update_memory(
    memory_id="mem_xyz",
    content="Python uses dynamic typing and automatic memory management"
)
```

## Performance Considerations

### Embedding Regeneration

- Content updates trigger embedding regeneration (~50-200ms)
- Updates to tags/metadata only are faster (~10-20ms)
- Consider batching content updates during off-peak times

### Vector Index Updates

- Updated embeddings are re-indexed across all sectors
- May affect query performance briefly
- Typically completes in <100ms

### Waypoint Preservation

- Existing waypoints remain but may need adjustment
- Consider using [Reinforce](/docs/api/reinforce) after major updates
- Waypoint strengths are not automatically recalculated

## Partial Updates

You can update any combination of fields:

```python
# Content only
om.update_memory(memory_id="mem_xyz", content="New content")

# Tags only
om.update_memory(memory_id="mem_xyz", tags=["new", "tags"])

# Metadata only
om.update_memory(memory_id="mem_xyz", metadata={"key": "value"})

# Any combination
om.update_memory(
    memory_id="mem_xyz",
    content="New content",
    tags=["tag1", "tag2"]
)
```

## Related Endpoints

- [Add Memory](/docs/api/add-memory) - Create new memories
- [Get Memory](/docs/api/get-memory) - Retrieve memory details
- [Delete Memory](/docs/api/delete-memory) - Remove memories
- [Reinforce Memory](/docs/api/reinforce) - Strengthen memory connections

## Next Steps

- Learn about [Memory Versioning](/docs/concepts/versioning)
- Understand [Decay Mechanics](/docs/concepts/hmd-v2)
- Explore [Metadata Strategies](/docs/advanced/metadata)

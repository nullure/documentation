---
title: Delete Memory
description: Permanently remove memories and all associated data from the system
---

# Delete Memory

Permanently remove memories and all associated data including vectors, full-text search indices, and waypoint connections.

## Endpoint

```
DELETE /memory/:id
```

## Authentication

```bash
X-API-Key: your_api_key_here
```

## URL Parameters

| Parameter | Type   | Required | Description         |
| --------- | ------ | -------- | ------------------- |
| `id`      | string | Yes      | Memory ID to delete |

## Request

No request body required.

## Response

```typescript
interface DeleteMemoryResponse {
  ok: boolean;
}
```

## Examples

### Basic Delete

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key")

# Delete a memory
result = om.delete_memory("mem_7k9n2x4p8q")

if result.ok:
    print("Memory deleted successfully")
```

### Delete with Verification

```python
# Verify memory exists before deleting
memory_id = "mem_7k9n2x4p8q"

try:
    # Check if memory exists
    memory = om.get_memory(memory_id)
    print(f"Deleting: {memory.content[:50]}...")

    # Confirm deletion
    result = om.delete_memory(memory_id)
    print(f"Deleted: {result.ok}")

except NotFoundError:
    print("Memory not found")
```

### Batch Delete

```python
# Delete multiple memories
memory_ids = ["mem_1", "mem_2", "mem_3"]

deleted_count = 0
for memory_id in memory_ids:
    try:
        result = om.delete_memory(memory_id)
        if result.ok:
            deleted_count += 1
    except Exception as e:
        print(f"Failed to delete {memory_id}: {e}")

print(f"Deleted {deleted_count}/{len(memory_ids)} memories")
```

### Conditional Delete

```python
# Delete old or low-strength memories
memories = om.query_all(limit=1000)

for memory in memories:
    # Delete if strength is too low
    if memory.strength < 0.2:
        om.delete_memory(memory.id)
        print(f"Deleted weak memory: {memory.id}")
```

### TypeScript/Node.js

```typescript
import { OpenMemory } from "@openmemory/sdk";

const om = new OpenMemory({ apiKey: "your_api_key" });

// Delete a memory
try {
  const result = await om.deleteMemory("mem_7k9n2x4p8q");
  console.log(`Deleted: ${result.ok}`);
} catch (error) {
  if (error.statusCode === 404) {
    console.log("Memory not found");
  } else {
    console.error("Delete failed:", error);
  }
}
```

### cURL

```bash
curl -X DELETE https://your-domain.com/memory/mem_7k9n2x4p8q \
  -H "X-API-Key: your_api_key"
```

## Response Examples

### Success Response

```json
{
  "ok": true
}
```

Status Code: `200`

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

## What Gets Deleted

When you delete a memory, the following data is permanently removed:

### 1. Memory Record

- Content
- Tags
- Metadata
- Created/updated timestamps
- Salience score
- Decay parameters
- Version information

### 2. Vector Embeddings

- All vector representations across sectors
- Multi-sector embeddings
- Embedding metadata

### 3. Full-Text Search Index

- FTS entries for content search
- Indexed tokens
- Search rankings

### 4. Waypoint Connections

- All waypoints **from** this memory to others
- All waypoints **to** this memory from others
- Path information
- Connection strengths

## Important Considerations

### ⚠️ Permanent Action

**Deletion is permanent and cannot be undone.** Once deleted:

- The memory cannot be recovered
- Connected memories lose their waypoints to this memory
- Queries will no longer return this memory
- The memory ID cannot be reused

### Orphaned Connections

Deleting a memory affects the navigation graph:

```python
# Before deletion
Memory A ←→ Memory B ←→ Memory C

# After deleting Memory B
Memory A     (orphaned)     Memory C

# A and C are no longer connected via B
```

### Performance Impact

- Single deletion: ~10-50ms
- Batch deletions: May temporarily affect query performance
- Index rebuilding happens asynchronously

## Use Cases

### 1. Clean Up Outdated Information

```python
# Delete deprecated or incorrect memories
memories = om.query("outdated python 2 syntax")

for memory in memories:
    if "python 2" in memory.metadata.get("version", ""):
        om.delete_memory(memory.id)
        print(f"Deleted outdated: {memory.content[:50]}")
```

### 2. Privacy Compliance

```python
# Delete user data upon request (GDPR, etc.)
user_id = "user_123"

# Find all memories related to user
memories = om.query_all(metadata_filter={"user_id": user_id})

for memory in memories:
    om.delete_memory(memory.id)

print(f"Deleted {len(memories)} memories for user {user_id}")
```

### 3. Prune Low-Quality Memories

```python
# Remove weak or decayed memories
threshold = 0.15

memories = om.query_all(limit=10000)
deleted = 0

for memory in memories:
    if memory.strength < threshold:
        om.delete_memory(memory.id)
        deleted += 1

print(f"Pruned {deleted} weak memories")
```

### 4. Clear Temporary Context

```python
# Delete session-specific memories after session ends
session_id = "session_xyz"

memories = om.query_all(
    metadata_filter={"session_id": session_id, "temporary": True}
)

for memory in memories:
    om.delete_memory(memory.id)

print(f"Cleaned up session {session_id}")
```

### 5. Remove Test Data

```python
# Clean up after testing
test_memories = om.query_all(
    metadata_filter={"environment": "test"}
)

for memory in test_memories:
    om.delete_memory(memory.id)

print("Test data removed")
```

## Best Practices

### 1. Verify Before Deleting

```python
def safe_delete(memory_id):
    """Safely delete a memory with verification."""
    try:
        # Verify existence
        memory = om.get_memory(memory_id)

        # Optional: Archive before deleting
        archive_memory(memory)

        # Delete
        result = om.delete_memory(memory_id)
        return result.ok
    except NotFoundError:
        print(f"Memory {memory_id} not found")
        return False
    except Exception as e:
        print(f"Deletion failed: {e}")
        return False
```

### 2. Archive Important Data

```python
# Archive to external storage before deletion
import json

def archive_and_delete(memory_id):
    memory = om.get_memory(memory_id)

    # Archive to file
    archive_data = {
        "id": memory.id,
        "content": memory.content,
        "metadata": memory.metadata,
        "archived_at": datetime.now().isoformat()
    }

    with open(f"archive/{memory_id}.json", "w") as f:
        json.dump(archive_data, f)

    # Now safe to delete
    om.delete_memory(memory_id)
```

### 3. Batch Deletions Carefully

```python
# Rate limit batch deletions
import time

def batch_delete(memory_ids, delay=0.1):
    """Delete memories with rate limiting."""
    deleted = []
    failed = []

    for memory_id in memory_ids:
        try:
            result = om.delete_memory(memory_id)
            if result.ok:
                deleted.append(memory_id)
            time.sleep(delay)  # Rate limit
        except Exception as e:
            failed.append((memory_id, str(e)))

    return deleted, failed
```

### 4. Log Deletions

```python
# Keep audit trail
def logged_delete(memory_id, reason=""):
    """Delete with audit logging."""
    memory = om.get_memory(memory_id)

    # Log deletion
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "memory_id": memory_id,
        "content_preview": memory.content[:100],
        "reason": reason,
        "deleted_by": get_current_user()
    }

    log_deletion(log_entry)

    # Perform deletion
    return om.delete_memory(memory_id)
```

### 5. Consider Alternatives

Before deleting, consider if another approach is better:

```python
# Instead of deleting, you might:

# 1. Mark as deprecated
om.update_memory(
    memory_id,
    metadata={"deprecated": True, "deprecated_at": "2025-01-20"}
)

# 2. Reduce strength
om.update_memory(
    memory_id,
    decay_rate=0.80  # Faster decay
)

# 3. Move to archive sector
om.update_memory(
    memory_id,
    sector_id="archive/old_data"
)
```

## Bulk Operations

### Delete by Query

```python
def delete_by_query(query, limit=100):
    """Delete memories matching a query."""
    results = om.query(query, limit=limit)

    deleted_ids = []
    for result in results:
        try:
            om.delete_memory(result.id)
            deleted_ids.append(result.id)
        except Exception as e:
            print(f"Failed to delete {result.id}: {e}")

    return deleted_ids
```

### Delete by Metadata

```python
def delete_by_metadata(filters):
    """Delete memories matching metadata filters."""
    memories = om.query_all(metadata_filter=filters)

    for memory in memories:
        om.delete_memory(memory.id)

    return len(memories)

# Usage
deleted = delete_by_metadata({
    "source": "old_api",
    "version": "1.0"
})
print(f"Deleted {deleted} memories")
```

### Delete Old Memories

```python
from datetime import datetime, timedelta

def delete_older_than(days):
    """Delete memories older than specified days."""
    cutoff = datetime.now() - timedelta(days=days)
    memories = om.query_all(limit=10000)

    deleted = 0
    for memory in memories:
        created = datetime.fromisoformat(memory.created_at)
        if created < cutoff:
            om.delete_memory(memory.id)
            deleted += 1

    return deleted

# Delete memories older than 1 year
count = delete_older_than(365)
print(f"Deleted {count} old memories")
```

## Recovery Options

Since deletion is permanent, consider implementing recovery options:

### Soft Delete Pattern

```python
# Instead of hard delete, mark as deleted
def soft_delete(memory_id):
    om.update_memory(
        memory_id,
        metadata={
            "deleted": True,
            "deleted_at": datetime.now().isoformat(),
            "deleted_by": get_current_user()
        }
    )

# Query with filter
def query_active_only(query):
    results = om.query(query)
    return [r for r in results if not r.metadata.get("deleted")]

# Permanent cleanup (run periodically)
def purge_soft_deleted():
    memories = om.query_all(metadata_filter={"deleted": True})
    for memory in memories:
        om.delete_memory(memory.id)
```

## Rate Limits

| Plan       | Deletes/min | Daily Limit |
| ---------- | ----------- | ----------- |
| Free       | 50          | 1,000       |
| Pro        | 500         | 50,000      |
| Enterprise | Unlimited   | Unlimited   |

## Related Endpoints

- [Add Memory](/docs/api/add-memory) - Create new memories
- [Update Memory](/docs/api/update-memory) - Modify existing memories
- [Query Memory](/docs/api/query) - Search for memories
- [Get Memory](/docs/api/get-memory) - Retrieve memory details

## Next Steps

- Learn about [Data Management](/docs/concepts/data-management)
- Understand [Memory Lifecycle](/docs/concepts/lifecycle)
- Explore [Backup Strategies](/docs/advanced/backup)

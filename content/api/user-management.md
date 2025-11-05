---
title: User Management
description: Multi-user memory isolation with user summaries and per-user memory operations
---

# User Management

OpenMemory supports multi-user applications with user isolation, automatic user summaries, and user-specific memory operations.

## Overview

All memory operations support an optional `user_id` parameter for multi-tenant applications. Each user's memories are isolated and can be managed independently.

## Add Memory with User ID

```
POST /memory/add
```

### Request

```typescript
{
  content: string
  tags?: string[]
  metadata?: Record<string, unknown>
  user_id?: string  // Add this for user isolation
}
```

### Example

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key", base_url="http://localhost:8080")

# Add memory for specific user
result = om.add(
    content="User prefers dark mode in applications",
    tags=["preferences", "ui"],
    user_id="user_123"
)
```

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your_api_key',
});

await om.add('User completed Python course', {
  tags: ['learning', 'achievement'],
  user_id: 'user_123',
});
```

## Query User Memories

```
POST /memory/query
```

### Request

```typescript
{
  query: string
  k?: number
  filters?: {
    sector?: string
    min_score?: number
    user_id?: string  // Filter by user
  }
}
```

### Example

```python
# Query specific user's memories
result = om.query(
    query="What are the user's preferences?",
    k=10,
    filters={"user_id": "user_123"}
)

for match in result["matches"]:
    print(f"{match['score']:.2f} - {match['content']}")
```

```typescript
// Query with user filter
const result = await om.query('user preferences', {
  k: 10,
  filters: { user_id: 'user_123' },
});
```

## Get User Memories

Retrieve all memories for a specific user with pagination.

### Endpoint

```
GET /users/:user_id/memories?l=100&u=0
```

### Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| `user_id` | string | ✅       | -       | User ID (URL parameter) |
| `l`       | number | ❌       | 100     | Limit (max results)     |
| `u`       | number | ❌       | 0       | Offset (pagination)     |

### Response

```typescript
{
  user_id: string
  items: Memory[]
}
```

### Example

```python
# Get all memories for a user
result = om.get_user_memories("user_123", limit=50, offset=0)

print(f"User {result['user_id']} has {len(result['items'])} memories")

for memory in result["items"]:
    print(f"- {memory['content'][:50]}...")
```

```typescript
const result = await om.getUserMemories('user_123', {
  limit: 50,
  offset: 0,
});

console.log(`Found ${result.items.length} memories`);
```

```bash
curl -X GET "http://localhost:8080/users/user_123/memories?l=50&u=0" \
  -H "Authorization: Bearer your_api_key"
```

## Get User Summary

Retrieve an AI-generated summary of a user's memories and activity.

### Endpoint

```
GET /users/:user_id/summary
```

### Response

```typescript
{
  user_id: string;
  summary: string;
  reflection_count: number;
  updated_at: number;
}
```

### Example

```python
# Get user summary
summary = om.get_user_summary("user_123")

print(f"User: {summary['user_id']}")
print(f"Summary: {summary['summary']}")
print(f"Reflections: {summary['reflection_count']}")
print(f"Last updated: {summary['updated_at']}")
```

```typescript
const summary = await om.getUserSummary('user_123');

console.log(`Summary: ${summary.summary}`);
console.log(`Reflections: ${summary.reflection_count}`);
```

```bash
curl -X GET "http://localhost:8080/users/user_123/summary" \
  -H "Authorization: Bearer your_api_key"
```

## Regenerate User Summary

Manually trigger a user summary regeneration based on their current memories.

### Endpoint

```
POST /users/:user_id/summary/regenerate
```

### Response

```typescript
{
  ok: boolean;
  user_id: string;
  summary: string;
  reflection_count: number;
}
```

### Example

```python
# Force regeneration of user summary
result = om.regenerate_user_summary("user_123")

print(f"Summary regenerated: {result['ok']}")
print(f"New summary: {result['summary']}")
```

```typescript
const result = await om.regenerateUserSummary('user_123');

console.log(`Updated summary: ${result.summary}`);
```

```bash
curl -X POST "http://localhost:8080/users/user_123/summary/regenerate" \
  -H "Authorization: Bearer your_api_key"
```

## User Summary Auto-Generation

OpenMemory automatically generates and updates user summaries:

- Triggered after adding memories with `user_id`
- Updates every N memories (configurable with `OM_USER_SUMMARY_INTERVAL`)
- Reflects user's preferences, patterns, and key information
- Used for faster context retrieval in `OM_USE_SUMMARY_ONLY` mode

### Configuration

```env
# Auto-update user summary every 30 memories
OM_USER_SUMMARY_INTERVAL=30

# Use summary for context instead of full memory retrieval
OM_USE_SUMMARY_ONLY=true

# Maximum summary length (tokens)
OM_SUMMARY_MAX_LENGTH=200
```

## Multi-User Application Example

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key", base_url="http://localhost:8080")

class UserMemoryService:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.om = om

    def add_memory(self, content: str, tags: list = None):
        """Add memory for this user"""
        return self.om.add(
            content=content,
            tags=tags or [],
            user_id=self.user_id
        )

    def search(self, query: str, limit: int = 10):
        """Search user's memories"""
        return self.om.query(
            query=query,
            k=limit,
            filters={"user_id": self.user_id}
        )

    def get_all(self, limit: int = 100):
        """Get all user memories"""
        return self.om.get_user_memories(
            user_id=self.user_id,
            limit=limit
        )

    def get_summary(self):
        """Get user summary"""
        return self.om.get_user_summary(self.user_id)

    def refresh_summary(self):
        """Regenerate user summary"""
        return self.om.regenerate_user_summary(self.user_id)


# Usage
user_service = UserMemoryService("user_123")

# Add memory
user_service.add_memory("Completed React tutorial", ["learning"])

# Search
results = user_service.search("What has user learned?")

# Get summary
summary = user_service.get_summary()
print(f"User profile: {summary['summary']}")
```

## TypeScript Multi-User Example

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your_api_key',
});

class UserMemoryService {
  constructor(private userId: string) {}

  async addMemory(content: string, tags: string[] = []) {
    return om.add(content, { tags, user_id: this.userId });
  }

  async search(query: string, limit = 10) {
    return om.query(query, {
      k: limit,
      filters: { user_id: this.userId },
    });
  }

  async getAll(limit = 100) {
    return om.getUserMemories(this.userId, { limit });
  }

  async getSummary() {
    return om.getUserSummary(this.userId);
  }

  async refreshSummary() {
    return om.regenerateUserSummary(this.userId);
  }
}

// Usage
const userService = new UserMemoryService('user_123');

await userService.addMemory('Prefers TypeScript over JavaScript', [
  'preferences',
]);
const results = await userService.search('programming preferences');
const summary = await userService.getSummary();

console.log(`User profile: ${summary.summary}`);
```

## Best Practices

### 1. Always Use User IDs in Multi-User Apps

```python
# ✅ Good - Isolated per user
om.add("User data", user_id="user_123")

# ❌ Bad - Memories are shared across all users
om.add("User data")
```

### 2. Filter Queries by User

```python
# ✅ Good - Only returns user's memories
om.query("preferences", filters={"user_id": "user_123"})

# ❌ Bad - Returns memories from all users
om.query("preferences")
```

### 3. Use User Summaries for Context

```python
# Get quick user profile without retrieving all memories
summary = om.get_user_summary("user_123")
context = summary["summary"]

# Use in AI prompts
prompt = f"User context: {context}\n\nUser question: {user_question}"
```

### 4. Periodic Summary Refresh

```python
# Refresh summaries for active users periodically
def refresh_active_users(user_ids: list):
    for user_id in user_ids:
        try:
            om.regenerate_user_summary(user_id)
        except Exception as e:
            print(f"Failed to refresh {user_id}: {e}")
```

### 5. Privacy and Data Isolation

```python
# Ensure users can only access their own data
def verify_user_access(current_user: str, target_user: str):
    if current_user != target_user:
        raise PermissionError("Access denied")

# Before operations
verify_user_access(current_user_id, requested_user_id)
```

## Error Handling

### User Not Found

When querying a user that doesn't exist, you'll get an empty result:

```python
result = om.get_user_memories("nonexistent_user")
# result["items"] will be []
```

### Invalid User ID

```bash
# 400 Bad Request
{
  "err": "user_id required"
}
```

## Related Endpoints

- [Add Memory](/docs/api/add-memory) - Create memories with user isolation
- [Query Memory](/docs/api/query) - Search with user filters
- [Update Memory](/docs/api/update-memory) - Modify user memories
- [Delete Memory](/docs/api/delete-memory) - Remove user memories

## Next Steps

- Learn about [Memory Sectors](/docs/concepts/sectors)
- Understand [User Summaries](/docs/concepts/user-summaries)
- Explore [Multi-Tenancy](/docs/advanced/multi-tenancy)

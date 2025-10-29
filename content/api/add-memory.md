---
title: Add Memory
description: Add new memories to OpenMemory with full control over content, metadata, and decay parameters
---

# Add Memory

Add new memories to OpenMemory with full control over content, metadata, and decay parameters.

## Endpoint

```
POST /api/memory
```

## Authentication

```bash
X-API-Key: your_api_key_here
```

## Request Body

```typescript
interface AddMemoryRequest {
  content: string;
  tags?: string[];
  metadata?: Record<string, any>;
  salience?: number;
  decay_lambda?: number;
}
```

### Parameters

| Parameter      | Type     | Required | Default | Description                                    |
| -------------- | -------- | -------- | ------- | ---------------------------------------------- |
| `content`      | string   | Yes      | -       | The memory content to store                    |
| `tags`         | string[] | No       | `[]`    | Tags for categorization                        |
| `metadata`     | object   | No       | `{}`    | Additional metadata (can include 'sector' key) |
| `salience`     | number   | No       | `0.5`   | Memory importance/strength (0.0-1.0)           |
| `decay_lambda` | number   | No       | sector  | Custom decay rate (overrides sector default)   |

## Response

```typescript
interface AddMemoryResponse {
  id: string;
  content: string;
  primary_sector: string;
  sectors: string[];
  salience: number;
  decay_lambda: number;
  created_at: string;
  version: number;
}
```

## Examples

### Basic Usage

```python
from openmemory import OpenMemory

om = OpenMemory(base_url="http://localhost:8080", api_key="your_api_key")

# Simple memory addition
result = om.add(
    content="Python uses duck typing for polymorphism"
)

print(f"Memory created: {result['id']}")
print(f"Assigned to sector: {result['primary_sector']}")
```

### With Tags and Metadata

```python
result = om.add(
    content="Docker Compose simplifies multi-container deployments",
    tags=["docker", "containers", "devops"],
    metadata={
        "category": "devops",
        "source": "tutorial",
        "difficulty": "intermediate"
    }
)
```

### Custom Salience and Decay

```python
# Important memory - high salience, slow decay
important = om.add(
    content="Database backup runs daily at 2 AM UTC",
    salience=0.9,  # High importance
    decay_lambda=0.05,  # Slow decay
    metadata={"importance": "critical"}
)

# Temporary context - faster decay
temp = om.add(
    content="User is currently debugging authentication bug",
    salience=0.6,
    decay_lambda=0.2,  # Faster decay
    metadata={"type": "session_context"}
)
```

### Specific Sector

```python
# Add to specific brain sector
result = om.add(
    content="React hooks must follow the rules of hooks",
    metadata={"sector": "semantic"},  # Explicit sector assignment
    tags=["react", "rules", "hooks"]
)
```

### Batch Addition

```python
# Add multiple memories
memories = [
    "User prefers dark mode in IDE",
    "Favorite programming language is Python",
    "Works best in the morning"
]

for content in memories:
    result = om.add(content=content, tags=["preferences"])
print(f"Added {len(results)} memories")
```

### TypeScript/Node.js

```typescript
import { OpenMemory } from "@openmemory/sdk";

const om = new OpenMemory({ apiKey: "your_api_key" });

// Add memory
const result = await om.addMemory({
  content: "GraphQL provides type-safe API queries",
  metadata: {
    category: "web_development",
    topics: ["graphql", "api", "typescript"],
  },
  decayRate: 0.96,
  initialStrength: 0.85,
});

console.log(`Memory ID: ${result.id}`);
```

### cURL

```bash
curl -X POST https://your-domain.com/api/memory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "content": "Kubernetes orchestrates containerized applications",
    "metadata": {
      "category": "devops",
      "difficulty": "advanced"
    },
    "decay_rate": 0.97,
    "initial_strength": 0.9,
    "tags": ["kubernetes", "containers", "orchestration"]
  }'
```

## Response Examples

### Success Response

```json
{
  "id": "mem_7k9n2x4p8q",
  "content": "Python uses duck typing for polymorphism",
  "sector_id": "sector_abc123",
  "strength": 0.8,
  "decay_rate": 0.95,
  "embedding_dimensions": 384,
  "created_at": "2025-01-20T14:30:00Z",
  "waypoints_created": 3
}
```

### Error Responses

#### Invalid Content

```json
{
  "error": "ValidationError",
  "message": "Content cannot be empty",
  "code": 400
}
```

#### Invalid Decay Rate

```json
{
  "error": "ValidationError",
  "message": "decay_rate must be between 0.0 and 1.0",
  "code": 400
}
```

#### Sector Not Found

```json
{
  "error": "NotFoundError",
  "message": "Sector 'invalid_sector' does not exist",
  "code": 404
}
```

## Advanced Options

### Rich Metadata

```python
result = om.add(
    content="User reported bug in payment processing",
    tags=["issue", "bug", "payment"],
    metadata={
        "type": "issue",
        "priority": "high",
        "status": "open",
        "reporter": {
            "id": "user_123",
            "email": "[email protected]"
        },
        "timestamps": {
            "created": "2025-01-20T10:00:00Z",
            "updated": "2025-01-20T10:00:00Z"
        },
        "affected_components": ["payment", "api", "database"],
        "related_issues": ["issue_456", "issue_789"]
    }
)
```

### Brain Sector Routing

OpenMemory automatically routes memories to appropriate brain sectors:

```python
# Episodic (event memory)
om.add(
    content="Met with client at 3pm to discuss Q4 roadmap",
    metadata={"sector": "episodic"}
)

# Semantic (facts & knowledge)
om.add(
    content="Python uses dynamic typing and GC",
    metadata={"sector": "semantic"}
)

# Procedural (habits & patterns)
om.add(
    content="User always commits before switching branches",
    metadata={"sector": "procedural"}
)

# Emotional (sentiment states)
om.add(
    content="User expressed frustration with slow build times",
    metadata={"sector": "emotional"}
)

# Reflective (meta-memory & logs)
om.add(
    content="Memory system recalculated sector weights",
    metadata={"sector": "reflective"}
)
```

## Best Practices

### Choose Appropriate Salience and Decay

```python
# System configuration - high salience, slow decay
om.add("API key: abc123", salience=0.95, decay_lambda=0.03)

# User preferences - medium-high salience
om.add("User prefers dark mode", salience=0.8, decay_lambda=0.1)

# General knowledge - medium salience
om.add("Python tip: use enumerate()", salience=0.6)

# Session context - medium salience, faster decay
om.add("User editing profile.tsx", salience=0.5, decay_lambda=0.15)

# Temporary data - low salience, fast decay
om.add("Cache warmed", salience=0.3, decay_lambda=0.25)
```

### Use Meaningful Metadata

```python
# Good metadata structure
om.add(
    content="...",
    tags=["python", "tutorial"],
    metadata={
        "source": "documentation",
        "version": "2.0",
        "language": "python",
        "confidence": 0.95,
        "author": "system",
        "verified": True
    }
)
```

### Organize with Brain Sectors

```python
# Automatic sector assignment
om.add(content="Content")  # Sector determined by content

# Manual sector specification
om.add(content="Content", metadata={"sector": "semantic"})
```

### Batch Operations

```python
# Add multiple memories with loop
for item in ["fact 1", "fact 2", "fact 3"]:
    om.add(content=item, tags=["batch"])
```

### Handle Errors Gracefully

```python
try:
    result = om.add(content="...")
except Exception as e:
    print(f"Error: {e}")
```

## Performance Considerations

### Content Length

- **Optimal**: 50-1000 characters per memory
- **Maximum**: 10,000 characters
- **Recommendation**: Split long documents using ingestion API

### Embedding Generation

- **Local embeddings**: ~50-100ms per memory
- **Remote API**: ~200-500ms per memory
- **Multi-sector**: 5x embedding calls in advanced mode

### Memory Operations

- Add operation: ~100-500ms depending on embedding mode
- Automatic sector classification based on content
- Vector indexing happens synchronously

## Related Endpoints

- [Query Memory](/docs/api/query) - Search and retrieve memories
- [Update Memory](/docs/api/update-memory) - Modify existing memories
- [Delete Memory](/docs/api/delete-memory) - Remove memories
- [Multimodal Ingestion](/docs/api/ingestion) - Add files and images

## Next Steps

- Learn about [Memory Sectors](/docs/concepts/sectors)
- Understand [HMD v2 decay](/docs/concepts/hmd-v2)
- Explore [Chunking Strategies](/docs/advanced/chunking)

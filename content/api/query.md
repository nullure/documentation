---
title: Query Memory
description: Search and retrieve memories using semantic search with multi-hop navigation
---

# Query Memory

Search and retrieve memories using semantic search with multi-hop navigation.

## Endpoint

```
POST /api/query
```

## Request Body

```typescript
interface QueryRequest {
  query: string;
  k?: number;
  filters?: {
    sector?: string;
    min_score?: number;
    tags?: string[];
  };
}
```

### Parameters

| Parameter | Type   | Required | Default | Description                          |
| --------- | ------ | -------- | ------- | ------------------------------------ |
| `query`   | string | Yes      | -       | Search query text                    |
| `k`       | number | No       | `8`     | Number of results to return          |
| `filters` | object | No       | `{}`    | Optional filters (sector, min_score) |

## Response

```typescript
interface QueryResponse {
  query: string;
  matches: MemoryMatch[];
}

interface MemoryMatch {
  id: string;
  content: string;
  score: number;
  sectors: string[];
  primary_sector: string;
  path: string[];
  salience: number;
  last_seen_at: string;
}
```

## Examples

### Basic Query

```python
from openmemory import OpenMemory

om = OpenMemory(base_url="http://localhost:8080", api_key="your_api_key")

# Simple search
result = om.query(
    query="How does Python handle memory management?",
    k=5
)

for match in result["matches"]:
    print(f"Score: {match['score']:.3f}")
    print(f"Content: {match['content']}")
    print(f"Sector: {match['primary_sector']}")
    print("---")
```

### Query Specific Sector

```python
# Query within a specific brain sector
result = om.query_sector(
    query="user preferences",
    sector="semantic",
    k=10
)

for match in result["matches"]:
    print(f"{match['score']:.2f} - {match['content']}")
```

### Filtered Query

```python
# Filter by minimum score
result = om.query(
    query="authentication patterns",
    k=10,
    filters={
        "sector": "semantic",
        "min_score": 0.7
    }
)

print(f"Found {len(result['matches'])} high-confidence matches")
```

### TypeScript Example

```typescript
const om = new OpenMemory({
  baseUrl: "http://localhost:8080",
  apiKey: "your_api_key",
});

const result = await om.query({
  query: "React hooks best practices",
  k: 10,
  filters: {
    sector: "semantic",
  },
});

result.matches.forEach((match) => {
  console.log(`${match.score}: ${match.content}`);
});
```

## Brain Sector Queries

Query specific brain sectors for targeted retrieval:

```python
# Query episodic memories (events, temporal data)
events = om.query_sector("What happened yesterday?", "episodic")

# Query semantic memories (facts, preferences)
facts = om.query_sector("What's the user's favorite IDE?", "semantic")

# Query procedural memories (habits, patterns)
habits = om.query_sector("How does user typically start coding?", "procedural")

# Query emotional memories (sentiment states)
emotions = om.query_sector("When was user frustrated?", "emotional")

# Query reflective memories (meta-memory, logs)
logs = om.query_sector("System activity logs", "reflective")
```

## Understanding Scores

The `score` returned for each match combines multiple factors:

- **Similarity**: Vector cosine similarity to the query
- **Salience**: Memory importance (boosted by reinforcement)
- **Decay**: Time-based decay using exponential function
- **Sector match**: Bonus for querying within the correct sector

Higher scores indicate better matches. Typical score ranges:

- `0.8-1.0`: Excellent match
- `0.6-0.8`: Good match
- `0.4-0.6`: Moderate match
- `<0.4`: Weak match

See [Add Memory](/docs/api/add-memory) for creating memories and [Reinforce](/docs/api/reinforce) for strengthening them.

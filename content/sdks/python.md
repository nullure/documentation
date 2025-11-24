---
title: Python SDK - Complete API Reference | OpenMemory
description: Complete guide to the OpenMemory Python SDK. Learn initialization, configuration, memory operations, embedding providers, and advanced features.
keywords: openmemory python sdk, python memory api, python ai memory, llm memory python, openmemory-py, standalone mode
---

# OpenMemory Python SDK

The **openmemory-py** package is the official Python SDK for OpenMemory. It brings the complete local-first memory engine to Python with a simple, Pythonic API.

## Installation

```bash
pip install openmemory-py
```

## Quick Start

### Standalone Mode (Local)

```python
from openmemory import OpenMemory

mem = OpenMemory(
    mode="local",
    path="./memory.sqlite",
    tier="smart",
    embeddings={
        "provider": "openai",
        "apiKey": "sk-..."
    }
)

# Add a memory
mem.add("User is learning Python", tags=["education"])

# Query memories
results = mem.query("What is the user learning?")
print(results[0]["content"])  # "User is learning Python"
```

### Remote Mode (Backend Connection)

```python
mem = OpenMemory(
    mode="remote",
    url="http://localhost:8080",
    apiKey="your-secret-key"  # Optional
)

# Same API as local mode
mem.add("Meeting at 3 PM")
results = mem.query("When is the meeting?")
```

## Configuration Options

### Constructor Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mode` | `str` | No | `"local"` or `"remote"` (default: `"local"`) |
| `path` | `str` | Yes (local) | Path to SQLite database file |
| `url` | `str` | Yes (remote) | Backend server URL |
| `apiKey` | `str` | No | API key for remote authentication |
| `tier` | `str` | Yes (local) | `"fast"`, `"smart"`, `"deep"`, or `"hybrid"` |
| `embeddings` | `dict` | Yes (local) | Embedding provider configuration |
| `compression` | `dict` | No | Compression settings |
| `decay` | `dict` | No | Automatic decay configuration |
| `reflection` | `dict` | No | Auto-reflection settings |
| `vectorStore` | `dict` | No | Vector backend selection |
| `langGraph` | `dict` | No | LangGraph mode settings |

### Memory Tiers

- **`fast`**: Single embedding per memory. Fastest ingestion.
- **`smart`**: Hybrid approach with 1-3 sector embeddings.
- **`deep`**: 5 sector embeddings for maximum accuracy.
- **`hybrid`**: Adaptive tier selection.

### Embeddings Configuration

```python
embeddings = {
    "provider": "openai",  # or "gemini", "ollama", "aws", "synthetic"
    "apiKey": "...",
    "model": "text-embedding-3-small",
    "mode": "advanced",  # or "simple"
    "dimensions": 1536
}
```

#### Provider Examples

**OpenAI:**
```python
import os

mem = OpenMemory(
    path="./memory.db",
    tier="smart",
    embeddings={
        "provider": "openai",
        "apiKey": os.getenv("OPENAI_API_KEY"),
        "model": "text-embedding-3-small"
    }
)
```

**Gemini:**
```python
embeddings={
    "provider": "gemini",
    "apiKey": os.getenv("GEMINI_API_KEY"),
    "model": "embedding-001"
}
```

**Ollama (Local):**
```python
embeddings={
    "provider": "ollama",
    "ollama": {
        "url": "http://localhost:11434"
    },
    "model": "nomic-embed-text"
}
```

**AWS Bedrock:**
```python
embeddings={
    "provider": "aws",
    "aws": {
        "accessKeyId": os.getenv("AWS_ACCESS_KEY_ID"),
        "secretAccessKey": os.getenv("AWS_SECRET_ACCESS_KEY"),
        "region": "us-east-1"
    },
    "model": "amazon.titan-embed-text-v1"
}
```

**Synthetic (Testing):**
```python
embeddings={
    "provider": "synthetic"  # No API key needed
}
```

## Core Methods

### `add(content, **options)`

Add a new memory.

**Parameters:**
- `content` (str): Memory content
- `tags` (list[str]): Categorical tags
- `metadata` (dict): Arbitrary metadata
- `userId` (str): User identifier
- `salience` (float): Initial importance (0-1, default: 0.5)
- `decayLambda` (float): Decay rate

**Returns:** `dict` with `id`, `primarySector`, and `sectors`

**Example:**
```python
result = mem.add(
    "User completed Python course",
    tags=["education", "achievement"],
    metadata={"course": "Advanced Python", "score": 95},
    userId="user_123",
    salience=0.9
)

print(result)
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "primarySector": "episodic",
#   "sectors": ["episodic", "semantic"]
# }
```

### `query(query, k=10, filters=None)`

Search for relevant memories.

**Parameters:**
- `query` (str): Search query
- `k` (int): Number of results (default: 10)
- `filters` (dict): Optional filters
  - `sectors` (list[str]): Filter by sectors
  - `minSalience` (float): Minimum salience
  - `user_id` (str): Filter by user

**Returns:** `list[dict]` of matching memories

**Example:**
```python
results = mem.query(
    "What courses has the user completed?",
    k=5,
    filters={
        "sectors": ["episodic", "semantic"],
        "minSalience": 0.5,
        "user_id": "user_123"
    }
)

for memory in results:
    print(f"[{memory['score']:.2f}] {memory['content']}")
    print(f"  Sectors: {', '.join(memory['sectors'])}")
    print(f"  Salience: {memory['salience']}")
```

### `delete(id)`

Remove a memory and all associated data.

**Parameters:**
- `id` (str): Memory ID

**Returns:** `None`

**Example:**
```python
mem.delete("550e8400-e29b-41d4-a716-446655440000")
```

### `getAll(limit=100, offset=0, sector=None)`

Retrieve all memories with pagination.

**Parameters:**
- `limit` (int): Max results (default: 100)
- `offset` (int): Pagination offset (default: 0)
- `sector` (str): Filter by sector

**Returns:** `list[dict]` of memories

**Example:**
```python
memories = mem.getAll(limit=50, offset=0, sector="episodic")

for m in memories:
    print(f"{m['id']}: {m['content'][:50]}...")
```

### `close()`

Close the database connection.

**Example:**
```python
mem.close()
```

## Advanced Features

### Compression

```python
mem = OpenMemory(
    path="./memory.db",
    tier="smart",
    embeddings={"provider": "openai", "apiKey": "..."},
    compression={
        "enabled": True,
        "algorithm": "semantic",  # or "syntactic", "aggressive", "auto"
        "minLength": 500
    }
)
```

### Automatic Decay

```python
mem = OpenMemory(
    path="./memory.db",
    tier="smart",
    embeddings={"provider": "openai", "apiKey": "..."},
    decay={
        "intervalMinutes": 60,
        "threads": 2,
        "coldThreshold": 0.1,
        "reinforceOnQuery": True
    }
)
```

### Auto-Reflection

```python
mem = OpenMemory(
    path="./memory.db",
    tier="smart",
    embeddings={"provider": "openai", "apiKey": "..."},
    reflection={
        "enabled": True,
        "intervalMinutes": 1440,  # Daily
        "minMemories": 10
    }
)
```

### Multi-User Support

```python
# Add user-specific memories
mem.add("Alice prefers Python", userId="alice")
mem.add("Bob prefers Rust", userId="bob")

# Query for specific user
alice_results = mem.query(
    "What language?",
    filters={"user_id": "alice"}
)
```

## Ingestion

The SDK includes helpers for document ingestion.

```python
from openmemory.ops.extract import extract_text

# PDF
with open("document.pdf", "rb") as f:
    pdf_data = f.read()

result = extract_text("pdf", pdf_data)
mem.add(result["text"], metadata=result["metadata"])

# Audio (requires OpenAI API key and FFmpeg)
with open("meeting.mp3", "rb") as f:
    audio_data = f.read()

result = extract_text("audio/mp3", audio_data)
mem.add(result["text"], tags=["meeting", "transcription"])
```

## Context Manager

Use OpenMemory as a context manager for automatic cleanup:

```python
with OpenMemory(path="./memory.db", tier="smart", embeddings={"provider": "synthetic"}) as mem:
    mem.add("Temporary memory")
    results = mem.query("memory")
# Automatically closed
```

## Async Support (Future)

> **Note**: Async support is planned for a future release. The current SDK uses synchronous methods with `asyncio.run()` internally.

## Error Handling

```python
try:
    mem.add("Some content")
except ValueError as e:
    if "API key" in str(e):
        print("Invalid embedding provider API key")
    elif "path" in str(e):
        print("Database path is required for local mode")
    else:
        raise
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Type Hints

```python
from typing import Dict, List, Optional

def process_memories(
    mem: OpenMemory,
    queries: List[str],
    filters: Optional[Dict] = None
) -> List[List[Dict]]:
    return [mem.query(q, filters=filters) for q in queries]
```

## Best Practices

1. **Use Environment Variables**: Store API keys securely
2. **Choose the Right Tier**: Match tier to use case
3. **Enable Compression**: For verbose content
4. **Set User IDs**: For multi-tenant applications
5. **Monitor Salience**: Track memory health
6. **Use Context Managers**: For automatic resource cleanup
7. **Filter Queries**: Use sector and salience filters
8. **Handle Errors**: Catch and handle provider-specific errors

## Comparison with JavaScript SDK

| Feature | Python SDK | JavaScript SDK |
|---------|------------|----------------|
| Async/Await | Planned | ✅ Supported |
| Ingestion | ✅ Supported | ✅ Supported |
| MCP Server | ❌ Not Available | ✅ Supported |
| Context Manager | ✅ Supported | ❌ Not Applicable |
| Type Hints | ✅ Supported | ✅ TypeScript |

## Related

- [JavaScript SDK](/docs/sdks/javascript)
- [API Routes](/docs/api/routes)
- [Embedding Modes](/docs/advanced/embedding-modes)
- [Ingestion](/docs/advanced/ingestion)

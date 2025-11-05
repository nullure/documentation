---
title: Quick Start Guide
description: Get OpenMemory up and running in 5 minutes
---

# Quick Start Guide

Get OpenMemory running in just a few minutes.

## Prerequisites

- **Node.js 18+** and npm/yarn
- **Python 3.8+** (for Python SDK)
- An API key for embedding provider (OpenAI, Gemini, or Voyage AI)

## Installation

### Clone the Repository

```bash
git clone https://github.com/caviraoss/openmemory.git
cd openmemory
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Configure Environment

Create a `.env` file in the `backend` directory:

```env
# Embedding Provider (openai, gemini, or voyage)
OM_EMBED_PROVIDER=openai
OM_OPENAI_API_KEY=your_openai_key_here

# Server Configuration
OM_PORT=8080

# Database (SQLite is default, no setup required)
OM_DB_TYPE=sqlite
OM_DB_PATH=./data/openmemory.sqlite

# Memory Tier (fast, smart, deep, hybrid)
OM_TIER=smart

# Vector Dimensions
OM_VEC_DIM=1536
```

**Gemini Example:**

```env
OM_EMBED_PROVIDER=gemini
OM_GEMINI_API_KEY=your_gemini_key_here
OM_VEC_DIM=768
```

**Voyage AI Example:**

```env
OM_EMBED_PROVIDER=voyage
OM_VOYAGE_API_KEY=your_voyage_key_here
OM_VEC_DIM=1024
```

### Build and Start the Server

```bash
npm run build
npm start
```

The server will start on `http://localhost:8080`.

## First Memory

### Add a Memory

```bash
curl -X POST http://localhost:8080/memory/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content": "User prefers dark mode and minimal design",
    "tags": ["preferences", "ui"],
    "metadata": {
      "source": "preferences",
      "category": "ui"
    }
  }'
```

**Response:**

```json
{
  "id": "mem_abc123",
  "primary_sector": "semantic",
  "sectors": ["semantic", "procedural"]
}
```

### Query Memories

```bash
curl -X POST http://localhost:8080/memory/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "query": "What are the UI preferences?",
    "k": 5
  }'
```

**Response:**

```json
{
  "query": "What are the UI preferences?",
  "matches": [
    {
      "id": "mem_abc123",
      "content": "User prefers dark mode and minimal design",
      "score": 0.89,
      "sectors": ["semantic", "procedural"],
      "primary_sector": "semantic",
      "path": [],
      "salience": 0.5,
      "last_seen_at": 1730880000000
    }
  ]
}
```

## Python SDK

### Install SDK

```bash
pip install openmemory-py
```

### Use the SDK

```python
from openmemory import OpenMemory

# Initialize client
om = OpenMemory(base_url="http://localhost:8080", api_key="your_api_key")

# Add memory
result = om.add(
    content="User loves hiking and outdoor activities",
    tags=["hobbies", "outdoor"],
    salience=0.8
)
print(f"Memory ID: {result['id']}")
print(f"Sector: {result['primary_sector']}")

# Query memories
result = om.query(
    query="What does the user enjoy?",
    k=5
)

for match in result['matches']:
    print(f"Score: {match['score']:.2f} - {match['content']}")
    print(f"Sector: {match['primary_sector']}")
```

### Brain Sectors

OpenMemory automatically routes memories to brain sectors:

```python
# Query specific sectors
episodic = om.query_sector("what happened yesterday", "episodic", k=5)
semantic = om.query_sector("user preferences", "semantic", k=5)
procedural = om.query_sector("user habits", "procedural", k=5)
emotional = om.query_sector("frustrations", "emotional", k=5)
reflective = om.query_sector("system logs", "reflective", k=5)

# Get all sectors information
sectors = om.sectors()
print(sectors)
```

## JavaScript/TypeScript SDK

### Install SDK

```bash
npm install openmemory-js
```

### Use the SDK

```typescript
import OpenMemory from "openmemory-js";

// Initialize client
const om = new OpenMemory({
  baseUrl: "http://localhost:8080",
  apiKey: "your_api_key",
});

// Add memory
const result = await om.add("User loves hiking and outdoor activities", {
  tags: ["hobbies", "outdoor"],
  metadata: { category: "hobbies" },
});

console.log(`Memory ID: ${result.id}`);
console.log(`Sector: ${result.primary_sector}`);

// Query memories
const queryResult = await om.query("What does the user enjoy?", { k: 5 });

for (const match of queryResult.matches) {
  console.log(`Score: ${match.score.toFixed(2)} - ${match.content}`);
  console.log(`Sector: ${match.primary_sector}`);
}
```

## Document Ingestion

### Ingest a Document

```bash
curl -X POST http://localhost:8080/memory/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content_type": "text/plain",
    "data": "Long document content here...",
    "metadata": {"source": "document"}
  }'
```

### Ingest a URL

```bash
curl -X POST http://localhost:8080/memory/ingest/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "url": "https://example.com/article",
    "metadata": {"source": "web"}
  }'
```

For large documents, OpenMemory automatically chunks them into manageable sections.

## Reinforce Memories

Boost important memories to prevent decay:

```bash
curl -X POST http://localhost:8080/memory/reinforce \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "id": "mem_abc123",
    "boost": 0.2
  }'
```

Or with Python:

```python
# Reinforce a memory
om.reinforce(memory_id="mem_abc123", boost=0.2)
```

Or with JavaScript:

```typescript
// Reinforce a memory
await om.reinforce("mem_abc123", 0.2);
```

## Next Steps

- **[Core Concepts](/docs/concepts/sectors)**: Understand brain-inspired sectors
- **[API Reference](/docs/api/add-memory)**: Explore all endpoints
- **[Decay Algorithm](/docs/concepts/decay)**: Understand memory decay mechanics
- **[Memory Tiers](/docs/advanced/providers)**: Learn about fast, smart, deep, and hybrid tiers

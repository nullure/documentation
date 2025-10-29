---
title: Introduction to OpenMemory
description: Learn about OpenMemory's long-term memory system for AI agents
---

# Introduction to OpenMemory

OpenMemory is a production-ready **long-term memory system** designed specifically for AI agents and conversational systems. It implements the **HMD v2 (Holistic Memory Descriptor v2) specification** with advanced features like multi-sector embeddings, time-based decay, and graph-based waypoints.

## Why OpenMemory is Needed

### The Problem: Stateless AI

Modern AI assistants face a critical limitation: **they can't remember**. Every conversation starts from scratch. Even with large context windows (100K+ tokens), AI systems struggle with:

- **Session Boundaries**: Context resets after each conversation
- **Scalability**: Can't handle thousands of interactions efficiently
- **Relevance**: Important information gets buried in long contexts
- **Cost**: Large context windows are expensive to process repeatedly
- **Temporal Understanding**: No sense of "yesterday" vs "last week"
- **Knowledge Evolution**: Can't update or refine past memories

### The Solution: Persistent, Intelligent Memory

OpenMemory provides **human-like memory** for AI systems:

1. **Remember Across Sessions**: Conversations build on past interactions
2. **Semantic Retrieval**: Find relevant memories without scanning everything
3. **Natural Decay**: Old, unused information fades automatically
4. **Reinforcement Learning**: Important memories strengthen over time
5. **Contextual Understanding**: Multi-dimensional embeddings capture nuance
6. **Knowledge Graphs**: Related memories connect and inform each other

**Real-world impact**: Instead of re-explaining your project setup every conversation, your AI assistant remembers your tech stack, coding preferences, and past issues—making every interaction smarter and faster.

## How OpenMemory Works: Dataflow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Your Application                      │
│              (AI Agent, Chatbot, Tool)                  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 OpenMemory Server                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Layer (Express.js)                   │  │
│  │  /memory/add  /query  /reinforce  /update       │  │
│  └──────┬──────────────────────┬────────────────────┘  │
│         │                      │                        │
│  ┌──────▼──────┐        ┌─────▼─────┐                 │
│  │  Embedding  │        │   Query   │                 │
│  │   Engine    │        │  Engine   │                 │
│  │  (5-sector) │        │ (HMD v2)  │                 │
│  └──────┬──────┘        └─────┬─────┘                 │
│         │                      │                        │
│  ┌──────▼──────────────────────▼─────┐                │
│  │      Memory Management Core        │                │
│  │   • Decay calculation              │                │
│  │   • Waypoint traversal             │                │
│  │   • Salience scoring               │                │
│  └──────────────┬─────────────────────┘                │
│                 │                                       │
│  ┌──────────────▼─────────────────────┐               │
│  │         SQLite Database             │               │
│  │  • memories (content, metadata)     │               │
│  │  • vectors (5-sector embeddings)    │               │
│  │  • waypoints (graph connections)    │               │
│  │  • fts (full-text search index)     │               │
│  └─────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

### Dataflow: Adding a Memory

```
1. API Request
   POST /memory/add
   { "content": "User prefers TypeScript over JavaScript" }
                  │
                  ▼
2. Content Processing
   • Generate embeddings for 5 sectors:
     - Factual: "TypeScript, JavaScript, programming language"
     - Emotional: "preference, satisfaction"
     - Temporal: timestamp → "recent preference"
     - Relational: "User → TypeScript"
     - Behavioral: "chooses, prefers"
                  │
                  ▼
3. Database Storage
   • Insert into `memories` table (content, metadata)
   • Insert 5 vectors into `vectors` table (one per sector)
   • Index in `fts` table (for keyword search)
   • Create waypoints to similar memories
                  │
                  ▼
4. Response
   { "id": "mem_abc123", "sectors": [...], "waypoints_created": 3 }
```

### Dataflow: Querying Memories

```
1. API Request
   POST /memory/query
   { "query": "What languages does the user like?", "k": 5 }
                  │
                  ▼
2. Query Processing
   • Embed query across 5 sectors
   • Determine primary sector (Factual + Relational)
                  │
                  ▼
3. Vector Search
   • Search each sector's vector space
   • Calculate cosine similarity scores
   • Apply decay formula: score × exp(-λ × age)
                  │
                  ▼
4. Multi-Hop Traversal (Optional)
   • Follow waypoints from top results
   • Expand context with connected memories
   • Re-rank combined results
                  │
                  ▼
5. Salience Boosting
   • Memories recently accessed → higher scores
   • Reinforced memories → higher scores
   • Update `last_seen_at` timestamps
                  │
                  ▼
6. Response
   { "matches": [
       { "id": "mem_abc123", "content": "...", "score": 0.89 },
       { "id": "mem_def456", "content": "...", "score": 0.76 }
   ]}
```

### Dataflow: Memory Lifecycle

```
Time = T₀ (Creation)
├─ Memory added with initial salience = 0.8
├─ Embedded in 5 sectors
└─ Waypoints created to 3 similar memories

Time = T₀ + 1 day
├─ Query matches this memory → salience boosted to 0.85
├─ `last_seen_at` updated
└─ Reinforcement +1

Time = T₀ + 7 days
├─ Natural decay applied: salience = 0.85 × exp(-0.1 × 7) ≈ 0.42
└─ Still retrievable but ranked lower

Time = T₀ + 30 days (unused)
├─ Heavy decay: salience = 0.85 × exp(-0.1 × 30) ≈ 0.04
└─ Rarely retrieved unless explicitly queried

Time = T₀ + 60 days
├─ User reinforces: salience boosted back to 0.7
└─ Memory becomes relevant again
```

## Key Concepts

### 1. Multi-Sector Embeddings (HMD v2)

Each memory is embedded across 5 specialized dimensions:

- **Factual**: What happened? Core information and facts
- **Emotional**: How did it feel? Sentiment and emotional context
- **Temporal**: When did it occur? Time-based ordering and recency
- **Relational**: Who was involved? Entity relationships
- **Behavioral**: What actions were taken? Intent and behavior patterns

This allows retrieval to be context-aware. A query about "frustrations" will match the emotional sector, while "yesterday's meeting" targets the temporal sector.

### 2. Decay Algorithm

Memories decay over time using a configurable formula:

```
salience(t) = initial_strength × (1 + log(1 + reinforcements)) × exp(-λ × age_days)
```

- **Initial Strength**: Starting salience (default: 0.8)
- **Reinforcements**: Number of times accessed or explicitly reinforced
- **λ (Lambda)**: Decay rate (default: 0.1)
- **Age**: Days since creation or last reinforcement

This mimics human memory—recent and frequently accessed memories rank higher.

### 3. Graph Waypoints

Memories can be connected via **waypoints**—bidirectional edges that link related content:

```
Memory A ←──waypoint──→ Memory B
```

When you query for Memory A, the system can traverse waypoints to fetch related memories, creating context-aware retrieval chains (multi-hop navigation).

### 4. Root-Child Memory Strategy

For large documents (>8000 tokens), OpenMemory automatically:

1. Creates a **root memory** with a reflective summary
2. Splits the document into **child sections** (~3000 chars each)
3. Links children to the root via waypoints
4. Allows querying the summary while drilling down to specific sections

## Technical Stack

```
┌─────────────────────────────────────────┐
│  Language: TypeScript/Node.js           │
├─────────────────────────────────────────┤
│  Framework: Express.js (REST API)       │
├─────────────────────────────────────────┤
│  Database: SQLite + better-sqlite3      │
│  • memories table (content, metadata)   │
│  • vectors table (5 embeddings/memory)  │
│  • waypoints table (graph edges)        │
│  • fts table (full-text search)         │
├─────────────────────────────────────────┤
│  Embeddings:                            │
│  • Local: @xenova/transformers          │
│  • Remote: OpenAI, Cohere, Voyage       │
├─────────────────────────────────────────┤
│  Search: Vector similarity + FTS + Decay│
└─────────────────────────────────────────┘
```

## What's Next?

- **[Quick Start](/docs/quick-start)**: Get OpenMemory running in 5 minutes
- **[Installation](/docs/installation)**: Detailed setup guide
- **[API Reference](/docs/api/add-memory)**: Explore all endpoints
- **[HMD v2 Specification](/docs/concepts/hmd-v2)**: Deep dive into multi-sector embeddings
- **[Embedding Modes](/docs/advanced/embedding-modes)**: Simple vs Advanced strategies

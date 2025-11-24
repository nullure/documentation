---
title: Embedding Modes | OpenMemory
description: "Understand the different embedding modes in OpenMemory: Simple vs Advanced (Multi-Sector). Optimize for speed or accuracy."
keywords: embedding modes, multi-sector embeddings, hmd v2, openmemory embeddings, vector dimensions
---

# Embedding Modes

OpenMemory offers two primary embedding modes to balance performance and cognitive depth.

## 1. Simple Mode (Fast)

In Simple Mode, OpenMemory behaves like a traditional vector database. It generates a single embedding vector for the entire memory content.

- **Pros**: Fast, low storage usage.
- **Cons**: Less nuance.
- **Use Case**: Simple search, high-throughput logs.

```typescript
const mem = new OpenMemory({
  tier: "fast" // Enables Simple Mode
});
```

## 2. Advanced Mode (HMD v2)

In Advanced Mode, OpenMemory implements the **Holistic Memory Descriptor v2** specification. It generates **5 separate embeddings** for each memory, corresponding to different cognitive sectors:

1.  **Episodic**: Events and timeline.
2.  **Semantic**: Facts and knowledge.
3.  **Procedural**: Instructions and how-to.
4.  **Emotional**: Sentiment and tone.
5.  **Reflective**: Meta-analysis.

- **Pros**: Extremely accurate, context-aware retrieval.
- **Cons**: Slower ingestion (5x embedding calls), higher storage.
- **Use Case**: AI Agents, Personal Assistants, Complex RAG.

```typescript
const mem = new OpenMemory({
  tier: "deep" // Enables Advanced Mode
});
```

## Hybrid Mode (Smart)

The default "Smart" tier uses a hybrid approach. It generates a primary embedding and selectively generates sector embeddings based on content analysis.

```typescript
const mem = new OpenMemory({
  tier: "smart" // Default
});
```

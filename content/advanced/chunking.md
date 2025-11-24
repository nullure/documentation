---
title: Chunking Strategies | OpenMemory
description: Learn about OpenMemory's intelligent chunking strategies for handling large documents. Recursive, semantic, and markdown chunking explained.
keywords: chunking strategies, document chunking, semantic chunking, recursive character text splitter, openmemory chunking
---

# Chunking Strategies

OpenMemory automatically handles large documents by splitting them into smaller, semantically meaningful chunks. This ensures that retrieval is precise and context-aware.

## Default Strategy: Recursive Character

By default, OpenMemory uses a recursive character splitter that respects document structure.

- **Separators**: `["\n\n", "\n", " ", ""]`
- **Chunk Size**: 1000 tokens
- **Overlap**: 200 tokens

## Semantic Chunking

For deeper understanding, you can enable semantic chunking. This groups sentences based on their semantic similarity rather than just character count.

```typescript
const mem = new OpenMemory({
  chunking: {
    strategy: "semantic",
    minChunkSize: 100,
    maxChunkSize: 2000
  }
});
```

## Markdown Chunking

Optimized for Markdown files, this strategy splits content by headers (`#`, `##`, `###`).

```typescript
const mem = new OpenMemory({
  chunking: {
    strategy: "markdown"
  }
});
```

## Configuration

You can tune chunking parameters in the `ingest` function or global config.

```typescript
await ingest(mem, "paper.pdf", {
  chunkSize: 500,
  chunkOverlap: 50
});
```

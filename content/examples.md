---
title: Examples | OpenMemory
description: Code snippets and patterns for OpenMemory. Learn how to add memories, ingest documents, and integrate with LangChain.
keywords: openmemory examples, ai memory code, langchain memory, document ingestion, memory decay example
---

# Examples

## Basic Memory Operations

### Add and Query

```typescript
import { OpenMemory } from "openmemory-js";
const mem = new OpenMemory(); // Standalone mode

await mem.add("I am allergic to peanuts.");
const result = await mem.query("food allergies");
console.log(result);
```

## Ingestion

### Ingesting a Document

```typescript
import { ingest } from "openmemory-js/ingest";

await ingest(mem, "./specs/project-alpha.pdf");
```

## Agents

### LangChain Integration

```typescript
import { OpenMemoryStore } from "openmemory-js/langchain";
import { VectorStoreRetriever } from "langchain/vectorstores/base";

const store = new OpenMemoryStore(mem);
const retriever = new VectorStoreRetriever({ vectorStore: store });

// Use with any LangChain chain
// const chain = RetrievalQAChain.fromLLM(model, retriever);
```

## Advanced

### Manual Decay

Force a decay cycle to run immediately:

```typescript
await mem.decay();
```

### Inspection

Get internal stats:

```typescript
const stats = await mem.stats();
console.log(`Total memories: ${stats.count}`);
console.log(`Sectors: ${stats.sectors.join(", ")}`);
```

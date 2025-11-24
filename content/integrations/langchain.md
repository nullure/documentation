---
title: LangChain Integration | OpenMemory
description: Use OpenMemory as a VectorStore and Memory for LangChain applications. Build stateful agents with persistent long-term memory.
keywords: langchain integration, langchain memory, vectorstore, openmemory langchain, persistent agent memory, langgraph state
---

# LangChain Integration

OpenMemory provides first-class support for **LangChain**, allowing you to use it as a `VectorStore` or a persistent `BaseMemory` class.

## Installation

```bash
npm install openmemory-js langchain @langchain/core
```

## VectorStore Usage

You can use OpenMemory as a standard VectorStore for RAG applications.

```typescript
import { OpenMemoryStore } from "openmemory-js/langchain";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenMemory } from "openmemory-js";

// 1. Initialize OpenMemory
const mem = new OpenMemory({ path: "./brain.sqlite" });

// 2. Wrap in LangChain Store
const vectorStore = new OpenMemoryStore(mem, new OpenAIEmbeddings());

// 3. Use in a Retriever
const retriever = vectorStore.asRetriever({ k: 5 });

// 4. Search
const docs = await retriever.getRelevantDocuments("What is the user's favorite color?");
```

## Agent Memory

Give your LangChain agents persistent memory that survives restarts.

```typescript
import { OpenMemoryHistory } from "openmemory-js/langchain";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  chatHistory: new OpenMemoryHistory({
    sessionId: "user_123",
    client: mem
  })
});

const chain = new ConversationChain({ llm, memory });
```

## LangGraph

For advanced state management, OpenMemory integrates with **LangGraph** as a checkpointer.

See the [LangGraph API Reference](/docs/api/langgraph) for details.

---
title: Embedding Providers | OpenMemory
description: Configure embedding providers for OpenMemory. Support for OpenAI, Gemini, Ollama, and local models.
keywords: embedding providers, openai embeddings, gemini embeddings, ollama embeddings, local embeddings, openmemory config
---

# Embedding Providers

OpenMemory supports multiple embedding providers. You can configure these in the `embeddings` object when initializing the SDK or Server.

## OpenAI (Recommended)

Best balance of performance and quality.

```typescript
const mem = new OpenMemory({
  embeddings: {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small" // Default
  }
});
```

## Gemini

Good for Google ecosystem integration.

```typescript
const mem = new OpenMemory({
  embeddings: {
    provider: "gemini",
    apiKey: process.env.GEMINI_API_KEY
  }
});
```

## Ollama (Local)

Run completely offline with local models like `nomic-embed-text`.

```typescript
const mem = new OpenMemory({
  embeddings: {
    provider: "ollama",
    model: "nomic-embed-text",
    ollama: {
      url: "http://localhost:11434"
    }
  }
});
```

## Synthetic (Testing)

Fast, random embeddings for testing without API keys.

```typescript
const mem = new OpenMemory({
  embeddings: { provider: "synthetic" }
});
```

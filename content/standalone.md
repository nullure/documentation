---
title: Standalone Mode | OpenMemory
description: Run OpenMemory locally without a backend server. Learn how the local-first architecture works for privacy and speed.
keywords: standalone memory, local ai memory, private ai memory, openmemory local, no backend memory
---

# Standalone Mode

<img src="/dashboard.png" alt="OpenMemory Architecture" width="100%" style={{ borderRadius: '8px', marginBottom: '2rem' }} />

OpenMemory is designed to be **local-first**. You do not need to run a backend server to use it. The core cognitive engine is embedded directly into the JavaScript and Python SDKs.

## How it works

In Standalone Mode, OpenMemory runs entirely within your application's process.

1.  **Storage**: Uses a local SQLite database file (default: `./memory.sqlite`) or an in-memory instance.
2.  **Embeddings**: Uses local embeddings (e.g., ONNX, Transformers) or calls external APIs (OpenAI, Gemini) directly from your client.
3.  **No Network**: No HTTP requests are made to a separate OpenMemory server.

## When to use Standalone vs Backend

| Feature | Standalone Mode | Backend Mode |
| :--- | :--- | :--- |
| **Setup** | `npm install` / `pip install` (Zero config) | Docker / Node server required |
| **Data Location** | Local file in your project | Centralized database (Postgres/SQLite) |
| **Multi-user** | Single-tenant (usually) | Multi-tenant (built-in auth) |
| **Use Case** | CLI tools, local agents, scripts, single-user apps | Web apps, teams, shared memory, dashboards |
| **Performance** | In-process (Fastest) | Network overhead |

## Configuration

Standalone mode accepts a configuration object to tune behavior:

```typescript
const mem = new OpenMemory({
  path: "./memory.db",
  embeddings: {
    provider: "openai", // or 'local', 'gemini', 'ollama'
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY
  },
  // ... other options
});
```

## Limitations

- **Concurrency**: SQLite handles concurrent reads well, but heavy concurrent writes from multiple processes might encounter locks.
- **Scaling**: For massive datasets (millions of memories) shared across many concurrent users, Backend Mode with Postgres is recommended.

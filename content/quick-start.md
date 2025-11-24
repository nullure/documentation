---
title: Quick Start Guide | OpenMemory
description: Get started with OpenMemory in 5 minutes. Learn how to add local-first, long-term memory to your AI agents using JavaScript or Python. No backend required.
keywords: openmemory quick start, ai memory tutorial, local llm memory, javascript ai memory, python ai memory, standalone memory
---

# Quick Start Guide

<img src="/dashboard.png" alt="OpenMemory Dashboard" width="100%" style={{ borderRadius: '8px', marginBottom: '2rem' }} />

OpenMemory is the **fastest** way to give your AI agent a persistent brain. It runs locally, requires no infrastructure, and integrates in minutes.

You can run OpenMemory in two modes:
1.  **Standalone Mode** (Recommended): Runs inside your app.
2.  **Backend Mode**: Runs as a server.

## Option A: Standalone Mode (Recommended)

The easiest way to start. No Docker, no servers, just code.

### JavaScript / TypeScript

1.  **Install**
    ```bash
    npm install openmemory-js
    ```

2.  **Initialize & Use**
    ```typescript
    import { OpenMemory } from "openmemory-js";

    // Initialize (creates ./memory.sqlite by default)
    const mem = new OpenMemory({
      path: "./memory.sqlite",
      tier: "fast",
      embeddings: { provider: "synthetic" } // Use 'openai' for production
    });

    // Add a memory
    await mem.add("User prefers dark mode", { tags: ["preferences"] });

    // Query
    const result = await mem.query("What does the user like?");
    console.log(result);
    ```

### Python

1.  **Install**
    ```bash
    pip install openmemory-py
    ```

2.  **Initialize & Use**
    ```python
    from openmemory import OpenMemory

    # Initialize
    mem = OpenMemory(
        path="./memory.sqlite",
        tier="fast",
        embeddings={"provider": "synthetic"} # Use 'openai' for production
    )

    # Add
    mem.add("User prefers dark mode", tags=["preferences"])

    # Query
    print(mem.query("What does the user like?"))
    ```

---

## Option B: Backend Mode

Use this if you need a centralized memory server for multiple agents or a team dashboard.

### 1. Setup Server

```bash
git clone https://github.com/caviraoss/openmemory.git
cd backend
npm install
npm run dev
```
*Server runs on `http://localhost:8080`*

### 2. Connect via SDK

**JavaScript**
```typescript
import { OpenMemoryClient } from "openmemory-js/client";
const client = new OpenMemoryClient("http://localhost:8080");
await client.add("Hello world");
```

**Python**
```python
from openmemory.client import OpenMemoryClient
client = OpenMemoryClient("http://localhost:8080")
client.add("Hello world")
```

## Next Steps

- **[Explore the Dashboard](/dashboard)**: Visualize your agent's memory.
- **[Read the Concepts](/docs/concepts/sectors)**: Understand how the brain works.
- **[View Examples](/docs/examples)**: See real-world code snippets.

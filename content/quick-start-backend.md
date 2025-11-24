---
title: Quick Start (Backend) | OpenMemory
description: Get started with OpenMemory Backend Server. Deploy a centralized memory server for your AI agents.
keywords: openmemory backend, memory server, docker openmemory, centralized ai memory
---

# Quick Start (Backend)

Use this mode if you need a centralized memory server for multiple agents, a team dashboard, or if you are building a SaaS.

## 1. Setup Server

The easiest way to run the backend is with Docker.

```bash
git clone https://github.com/caviraoss/openmemory.git
cd backend
npm install
npm run dev
```

*Server runs on `http://localhost:8080`*

## 2. Connect via SDK

Once the server is running, you can connect to it using the SDKs in "Client Mode".

### JavaScript

```typescript
import { OpenMemory } from "openmemory-js";

const client = new OpenMemory({
  mode: "remote",
  url: "http://localhost:8080"
});

await client.add("Hello world");
const result = await client.query("Hello");
```

### Python

```python
from openmemory import OpenMemory

client = OpenMemory(mode="remote", url="http://localhost:8080")

client.add("Hello world")
print(client.query("Hello"))
```

## Next Steps

- **[Deployment Guide](/docs/deployment/backend)**: Learn how to deploy to production.
- **[API Reference](/docs/api/add-memory)**: Explore the HTTP API.

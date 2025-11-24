---
title: Backend Setup | OpenMemory
description: Guide to setting up the OpenMemory backend server for production.
keywords: openmemory backend, production setup, server deployment, self-hosted memory
---

# Backend Setup

For production use cases, you should run the OpenMemory backend as a standalone service.

## Requirements

- Node.js 18+
- 2GB RAM (minimum)
- Persistent Disk (for SQLite/Vector storage)

## Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/caviraoss/openmemory.git
    cd backend
    ```

2.  **Install dependencies**
    ```bash
    npm install --production
    ```

3.  **Build**
    ```bash
    npm run build
    ```

4.  **Start**
    ```bash
    npm start
    ```

## Configuration

Configure via `.env`:

```env
PORT=8080
STORAGE_PATH=/data/memory.sqlite
AUTH_TOKEN=your-secret-token
```

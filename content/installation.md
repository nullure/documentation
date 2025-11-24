---
title: Installation Guide | OpenMemory
description: Comprehensive installation guide for OpenMemory. Choose between Standalone Mode (local-first) or Backend Mode (server).
keywords: openmemory installation, install openmemory, local ai memory setup, docker openmemory, npm install openmemory
---

# Installation Guide

OpenMemory can be installed in two ways depending on your needs:

1.  **Standalone Mode**: Run as a library in your app (Recommended).
2.  **Backend Mode**: Run as a standalone server.

## Method 1: Standalone Mode (Recommended)

Best for local agents, CLI tools, and single-user applications.

### JavaScript / TypeScript

```bash
npm install openmemory-js
```

### Python

```bash
pip install openmemory-py
```

## Method 2: Backend Mode (Server)

Best for multi-user apps, teams, and centralized memory.

### Using Docker (Easiest)

```bash
git clone https://github.com/caviraoss/openmemory.git
cd openmemory
docker-compose up -d
```

### From Source

```bash
git clone https://github.com/caviraoss/openmemory.git
cd openmemory/backend
npm install
npm run build
npm start
```

## System Requirements

- **Node.js**: 18+
- **Python**: 3.10+ (for Python SDK)
- **RAM**: 4GB minimum
- **Storage**: SQLite (default) or PostgreSQL (production)

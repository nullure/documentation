---
title: Migrate from Mem0 | OpenMemory
description: Guide for migrating from Mem0 to OpenMemory using the migration tool.
keywords: mem0 migration, switch to openmemory, mem0 vs openmemory, import mem0
---

# Migrating from Mem0

OpenMemory provides a dedicated CLI tool to import your data from Mem0.

## Prerequisites

- Mem0 API Key
- OpenMemory Backend running (or use Standalone mode)

## Usage

The migration tool is located in the `migrate` directory of the OpenMemory repository.

```bash
cd migrate
npm install
```

Run the migration:

```bash
node index.js --from mem0 --api-key YOUR_MEM0_KEY
```

### Options

- `--output <dir>`: Directory to save exported JSON (default: `./exports`)
- `--verify`: Run verification after import to ensure data integrity
- `--rate-limit <n>`: Requests per second (default: 20)

```bash
node index.js --from mem0 --api-key ... --verify --rate-limit 10
```

## What gets migrated?

- **Memories**: All text content
- **User IDs**: Preserved
- **Metadata**: Preserved as JSON
- **Timestamps**: Created/Updated times are preserved

---
title: Migrate from Zep | OpenMemory
description: Guide for migrating from Zep to OpenMemory using the migration tool.
keywords: zep migration, zep memory, switch to openmemory, import zep
---

# Migrating from Zep

OpenMemory provides a dedicated CLI tool to import your data from Zep.

## Prerequisites

- Zep API Key
- Zep URL (if self-hosted)

## Usage

The migration tool is located in the `migrate` directory.

```bash
cd migrate
npm install
```

Run the migration:

```bash
node index.js --from zep --api-key YOUR_ZEP_KEY
```

### Options

- `--url <url>`: Custom Zep URL (default: Zep Cloud)
- `--output <dir>`: Directory to save exported JSON
- `--verify`: Verify data integrity
- `--rate-limit <n>`: Requests per second (default: 1)

```bash
node index.js --from zep --api-key ... --url http://localhost:8000 --verify
```

## What gets migrated?

- **Sessions**: Mapped to OpenMemory Users
- **Messages**: Converted to Memories
- **Metadata**: Preserved

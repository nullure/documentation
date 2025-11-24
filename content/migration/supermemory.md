---
title: Migrate from Supermemory | OpenMemory
description: Guide for migrating from Supermemory to OpenMemory using the migration tool.
keywords: supermemory migration, switch to openmemory, import supermemory
---

# Migrating from Supermemory

OpenMemory provides a dedicated CLI tool to import your data from Supermemory.

## Prerequisites

- Supermemory API Key

## Usage

The migration tool is located in the `migrate` directory.

```bash
cd migrate
npm install
```

Run the migration:

```bash
node index.js --from supermemory --api-key YOUR_SUPERMEMORY_KEY
```

### Options

- `--output <dir>`: Directory to save exported JSON
- `--verify`: Verify data integrity
- `--rate-limit <n>`: Requests per second (default: 5)

```bash
node index.js --from supermemory --api-key ... --verify
```

## What gets migrated?

- **Documents**: Bookmarks and saved pages
- **Tags**: Converted to OpenMemory tags
- **Content**: Full text content

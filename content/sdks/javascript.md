---
title: JavaScript SDK - Complete API Reference | OpenMemory
description: Complete guide to the OpenMemory JavaScript/TypeScript SDK. Learn initialization, configuration, memory operations, embedding providers, and advanced features.
keywords: openmemory js sdk, javascript memory api, typescript ai memory, nodejs llm memory, openmemory-js, standalone mode, embedding providers
---

# OpenMemory JavaScript SDK

The **openmemory-js** package is the official JavaScript/TypeScript SDK for OpenMemory. It provides a complete local-first memory engine for Node.js applications with zero dependencies on external services.

## Installation

```bash
npm install openmemory-js
# or
yarn add openmemory-js
# or
pnpm add openmemory-js
```

## Quick Start

### Standalone Mode (Local)

```typescript
import { OpenMemory } from 'openmemory-js';

const mem = new OpenMemory({
  mode: 'local',
  path: './memory.sqlite',
  tier: 'smart',
  embeddings: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
});

// Add a memory
await mem.add('User prefers dark mode', {
  tags: ['preference', 'ui'],
  metadata: { source: 'settings' }
});

// Query memories
const results = await mem.query('What does the user prefer?');
console.log(results[0].content); // "User prefers dark mode"
```

### Remote Mode (Backend Connection)

```typescript
const mem = new OpenMemory({
  mode: 'remote',
  url: 'http://localhost:8080',
  apiKey: 'your-secret-key' // Optional
});

// Same API as local mode
await mem.add('Meeting at 3 PM');
const results = await mem.query('When is the meeting?');
```

## Configuration Options

### `OpenMemoryOptions`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `mode` | `'local' \| 'remote'` | No | `'local'` for standalone, `'remote'` for backend connection (default: `'local'`) |
| `path` | `string` | Yes (local) | Path to SQLite database file |
| `url` | `string` | Yes (remote) | Backend server URL |
| `apiKey` | `string` | No | API key for remote authentication |
| `tier` | `'fast' \| 'smart' \| 'deep' \| 'hybrid'` | Yes (local) | Memory tier (see below) |
| `embeddings` | `EmbeddingsConfig` | Yes (local) | Embedding provider config |
| `compression` | `CompressionConfig` | No | Memory compression settings |
| `decay` | `DecayConfig` | No | Automatic decay configuration |
| `reflection` | `ReflectionConfig` | No | Auto-reflection settings |
| `vectorStore` | `VectorStoreConfig` | No | Vector backend selection |
| `langGraph` | `LangGraphConfig` | No | LangGraph mode settings |
| `telemetry` | `boolean` | No | Enable/disable telemetry (default: `true`) |

### Memory Tiers

- **`fast`**: Single embedding per memory. Fastest ingestion, lower accuracy.
- **`smart`**: Hybrid approach. Generates 1-3 sector embeddings based on content.
- **`deep`**: 5 sector embeddings (Episodic, Semantic, Procedural, Emotional, Reflective). Highest accuracy.
- **`hybrid`**: Adaptive tier selection based on content type.

### Embeddings Configuration

```typescript
interface EmbeddingsConfig {
  provider: 'openai' | 'gemini' | 'ollama' | 'aws' | 'local' | 'synthetic';
  apiKey?: string;
  model?: string;
  mode?: 'simple' | 'advanced';
  dimensions?: number;
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  ollama?: {
    url: string;
  };
  localPath?: string;
}
```

#### Provider Examples

**OpenAI:**
```typescript
embeddings: {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small' // or text-embedding-3-large
}
```

**Gemini:**
```typescript
embeddings: {
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY,
  model: 'embedding-001'
}
```

**Ollama (Local):**
```typescript
embeddings: {
  provider: 'ollama',
  ollama: {
    url: 'http://localhost:11434'
  },
  model: 'nomic-embed-text'
}
```

**AWS Bedrock:**
```typescript
embeddings: {
  provider: 'aws',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
  },
  model: 'amazon.titan-embed-text-v1'
}
```

**Synthetic (Testing):**
```typescript
embeddings: {
  provider: 'synthetic' // No API key needed, generates random vectors
}
```

## Core Methods

### `add(content, options)`

Add a new memory.

**Parameters:**
- `content` (string): The memory content
- `options` (object):
  - `tags` (string[]): Categorical tags
  - `metadata` (object): Arbitrary metadata
  - `userId` (string): User identifier for multi-user apps
  - `salience` (number): Initial importance (0-1, default: 0.5)
  - `decayLambda` (number): Decay rate (default: sector-specific)

**Returns:** `Promise<{ id: string; primarySector: string; sectors: string[] }>`

**Example:**
```typescript
const result = await mem.add('User is learning TypeScript', {
  tags: ['education', 'programming'],
  metadata: { course: 'Advanced TS', progress: 0.3 },
  userId: 'user_123',
  salience: 0.8
});

console.log(result);
// {
//   id: "550e8400-e29b-41d4-a716-446655440000",
//   primarySector: "semantic",
//   sectors: ["semantic", "procedural"]
// }
```

### `query(query, options)`

Search for relevant memories.

**Parameters:**
- `query` (string): Search query
- `options` (object):
  - `k` (number): Number of results (default: 10)
  - `filters` (object):
    - `sectors` (string[]): Filter by sectors
    - `minSalience` (number): Minimum salience score
    - `user_id` (string): Filter by user

**Returns:** `Promise<Memory[]>`

**Example:**
```typescript
const results = await mem.query('What programming languages does the user know?', {
  k: 5,
  filters: {
    sectors: ['semantic', 'episodic'],
    minSalience: 0.3,
    user_id: 'user_123'
  }
});

results.forEach(m => {
  console.log(`[${m.score.toFixed(2)}] ${m.content}`);
  console.log(`  Sectors: ${m.sectors.join(', ')}`);
  console.log(`  Salience: ${m.salience}`);
});
```

### `delete(id)`

Remove a memory and all associated vectors/waypoints.

**Parameters:**
- `id` (string): Memory ID

**Returns:** `Promise<void>`

**Example:**
```typescript
await mem.delete('550e8400-e29b-41d4-a716-446655440000');
```

### `getAll(options)`

Retrieve all memories with pagination.

**Parameters:**
- `options` (object):
  - `limit` (number): Max results (default: 100)
  - `offset` (number): Pagination offset (default: 0)
  - `sector` (string): Filter by sector

**Returns:** `Promise<Memory[]>`

**Example:**
```typescript
const memories = await mem.getAll({
  limit: 50,
  offset: 0,
  sector: 'episodic'
});
```

## Advanced Features

### Compression

Automatically compress verbose memories while preserving semantic meaning.

```typescript
const mem = new OpenMemory({
  path: './memory.sqlite',
  tier: 'smart',
  embeddings: { provider: 'openai', apiKey: '...' },
  compression: {
    enabled: true,
    algorithm: 'semantic', // 'semantic' | 'syntactic' | 'aggressive' | 'auto'
    minLength: 500 // Only compress memories longer than this
  }
});
```

### Automatic Decay

Memories naturally fade over time unless reinforced by queries.

```typescript
const mem = new OpenMemory({
  path: './memory.sqlite',
  tier: 'smart',
  embeddings: { provider: 'openai', apiKey: '...' },
  decay: {
    intervalMinutes: 60, // Run decay every hour
    threads: 2,
    coldThreshold: 0.1, // Archive memories below this salience
    reinforceOnQuery: true // Boost salience when queried
  }
});
```

### Auto-Reflection

Periodically generate summaries of memory clusters.

```typescript
const mem = new OpenMemory({
  path: './memory.sqlite',
  tier: 'smart',
  embeddings: { provider: 'openai', apiKey: '...' },
  reflection: {
    enabled: true,
    intervalMinutes: 1440, // Daily
    minMemories: 10 // Only reflect if 10+ memories exist
  }
});
```

### Multi-User Support

```typescript
// Add user-specific memories
await mem.add('Alice prefers Python', { userId: 'alice' });
await mem.add('Bob prefers Rust', { userId: 'bob' });

// Query for specific user
const aliceResults = await mem.query('What language?', {
  filters: { user_id: 'alice' }
});
```

## Ingestion

The SDK includes built-in document ingestion for PDFs, DOCX, Markdown, URLs, Audio, and Video.

```typescript
import { extractText } from 'openmemory-js/ops/extract';
import fs from 'fs';

// PDF
const pdfBuffer = fs.readFileSync('./document.pdf');
const { text, metadata } = await extractText('pdf', pdfBuffer);
await mem.add(text, { metadata });

// Audio (requires OpenAI API key and FFmpeg)
const audioBuffer = fs.readFileSync('./meeting.mp3');
const { text } = await extractText('audio/mp3', audioBuffer);
await mem.add(text, { tags: ['meeting', 'transcription'] });

// Video
const videoBuffer = fs.readFileSync('./lecture.mp4');
const { text } = await extractText('video/mp4', videoBuffer);
await mem.add(text);
```

## Error Handling

```typescript
try {
  await mem.add('Some content');
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Invalid embedding provider API key');
  } else if (error.message.includes('database')) {
    console.error('Database error:', error);
  } else {
    throw error;
  }
}
```

## TypeScript Types

```typescript
import type { OpenMemoryOptions, Memory } from 'openmemory-js';

const config: OpenMemoryOptions = {
  mode: 'local',
  path: './db.sqlite',
  tier: 'smart',
  embeddings: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY!
  }
};

const mem = new OpenMemory(config);
```

## Best Practices

1. **Use Environment Variables**: Store API keys in `.env` files
2. **Choose the Right Tier**: Use `fast` for logs, `smart` for apps, `deep` for critical agents
3. **Enable Compression**: For verbose content like meeting transcripts
4. **Set User IDs**: For multi-tenant applications
5. **Monitor Salience**: Periodically check memory health
6. **Use Filters**: Narrow queries with sector and salience filters
7. **Close Connections**: Call `mem.close()` when done (if needed)

## Related

- [Python SDK](/docs/sdks/python)
- [API Routes](/docs/api/routes)
- [Embedding Modes](/docs/advanced/embedding-modes)
- [Ingestion](/docs/advanced/ingestion)

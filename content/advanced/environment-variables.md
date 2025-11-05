---
title: Environment Variables
description: Complete reference for OpenMemory backend configuration via environment variables
---

# Environment Variables

Configure OpenMemory's backend behavior using environment variables in your `.env` file.

## Quick Start

Create a `.env` file in your backend directory:

```bash
# Required
OM_API_KEY=your_secure_api_key_here
OM_TIER=hybrid

# Recommended
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-...
OM_PORT=8080
```

## Core Configuration

### OM_TIER

**Type**: `string`  
**Options**: `fast` | `smart` | `deep` | `hybrid`  
**Default**: `hybrid`  
**Required**: ⚠️ **Yes** (will warn if not set)

Sets the embedding tier and vector dimensions:

| Tier   | Dimensions | Cache Segments | Max Active | Best For                    |
| ------ | ---------- | -------------- | ---------- | --------------------------- |
| fast   | 256        | 2              | 32         | Speed, basic similarity     |
| smart  | 384        | 3              | 64         | Balanced performance        |
| deep   | 1536       | 5              | 128        | Accuracy, complex semantics |
| hybrid | 256 + BM25 | 3              | 64         | Best of both worlds         |

```bash
OM_TIER=hybrid
```

### OM_API_KEY

**Type**: `string`  
**Default**: None  
**Required**: Recommended for production

API key for authentication. If not set, the server runs without authentication (development only).

```bash
OM_API_KEY=your_secure_random_key_here
```

### OM_PORT

**Type**: `number`  
**Default**: `8080`

Port for the HTTP server.

```bash
OM_PORT=8080
```

### OM_DB_PATH

**Type**: `string`  
**Default**: `./data/openmemory.sqlite`

Path to SQLite database file.

```bash
OM_DB_PATH=/var/lib/openmemory/data.sqlite
```

## Embedding Providers

### OM_EMBEDDINGS

**Type**: `string`  
**Options**: `openai` | `gemini` | `voyage` | `ollama` | `synthetic`  
**Default**: `synthetic`

Embedding provider to use.

```bash
OM_EMBEDDINGS=openai
```

### OpenAI Configuration

```bash
# OpenAI API key (or OPENAI_API_KEY)
OM_OPENAI_API_KEY=sk-...

# Optional: Custom OpenAI endpoint
OM_OPENAI_BASE_URL=https://api.openai.com/v1

# Optional: Model override
OM_OPENAI_MODEL=text-embedding-3-small
```

### Gemini Configuration

```bash
# Gemini API key (or GEMINI_API_KEY)
OM_GEMINI_API_KEY=your_gemini_key
```

### Ollama Configuration

```bash
# Ollama server URL (or OLLAMA_URL)
OM_OLLAMA_URL=http://localhost:11434
```

### Local Model Configuration

```bash
# Path to local embedding model (or LOCAL_MODEL_PATH)
OM_LOCAL_MODEL_PATH=/path/to/model
```

### OM_VEC_DIM

**Type**: `number`  
**Default**: Determined by `OM_TIER`

Override vector dimensions. Usually set automatically by tier.

```bash
OM_VEC_DIM=384
```

## Memory Decay

### OM_DECAY_LAMBDA

**Type**: `number`  
**Default**: `0.02`

Base decay rate (λ) for memory strength. Higher = faster decay.

```bash
OM_DECAY_LAMBDA=0.02
```

### OM_DECAY_INTERVAL_MINUTES

**Type**: `number`  
**Default**: `1440` (24 hours)

How often to run decay calculations (in minutes).

```bash
OM_DECAY_INTERVAL_MINUTES=1440
```

### OM_DECAY_RATIO

**Type**: `number`  
**Default**: `0.03`

Decay ratio per update cycle.

```bash
OM_DECAY_RATIO=0.03
```

### OM_DECAY_SLEEP_MS

**Type**: `number`  
**Default**: `200`

Sleep time between decay batch operations (milliseconds).

```bash
OM_DECAY_SLEEP_MS=200
```

### OM_DECAY_THREADS

**Type**: `number`  
**Default**: `3`

Number of parallel threads for decay calculations.

```bash
OM_DECAY_THREADS=3
```

### OM_DECAY_COLD_THRESHOLD

**Type**: `number`  
**Default**: `0.25`

Salience threshold below which memories are considered "cold".

```bash
OM_DECAY_COLD_THRESHOLD=0.25
```

### OM_DECAY_REINFORCE_ON_QUERY

**Type**: `boolean`  
**Default**: `true`

Automatically reinforce memories when queried.

```bash
OM_DECAY_REINFORCE_ON_QUERY=true
```

## Query Configuration

### OM_MIN_SCORE

**Type**: `number`  
**Default**: `0.3`

Minimum similarity score for query results (0.0 to 1.0).

```bash
OM_MIN_SCORE=0.3
```

### OM_SEG_SIZE

**Type**: `number`  
**Default**: `10000`

Memory segment size for hierarchical indexing.

```bash
OM_SEG_SIZE=10000
```

### OM_CACHE_SEGMENTS

**Type**: `number`  
**Default**: Determined by `OM_TIER`

Number of memory segments to cache.

```bash
OM_CACHE_SEGMENTS=3
```

### OM_MAX_ACTIVE

**Type**: `number`  
**Default**: Determined by `OM_TIER`

Maximum active memories in working set.

```bash
OM_MAX_ACTIVE=64
```

## Compression

### OM_COMPRESSION_ENABLED

**Type**: `boolean`  
**Default**: `false`

Enable automatic text compression.

```bash
OM_COMPRESSION_ENABLED=true
```

### OM_COMPRESSION_ALGORITHM

**Type**: `string`  
**Options**: `semantic` | `syntactic` | `aggressive` | `auto`  
**Default**: `auto`

Compression algorithm to use.

```bash
OM_COMPRESSION_ALGORITHM=auto
```

### OM_COMPRESSION_MIN_LENGTH

**Type**: `number`  
**Default**: `100`

Minimum text length (chars) to trigger compression.

```bash
OM_COMPRESSION_MIN_LENGTH=100
```

## User Management

### OM_USER_SUMMARY_INTERVAL

**Type**: `number`  
**Default**: `30`

How often to regenerate user summaries (in days).

```bash
OM_USER_SUMMARY_INTERVAL=30
```

### OM_USE_SUMMARY_ONLY

**Type**: `boolean`  
**Default**: `true`

Use only summaries instead of individual memories for user context.

```bash
OM_USE_SUMMARY_ONLY=true
```

### OM_SUMMARY_MAX_LENGTH

**Type**: `number`  
**Default**: `200`

Maximum length of user summaries (words).

```bash
OM_SUMMARY_MAX_LENGTH=200
```

### OM_SUMMARY_LAYERS

**Type**: `number`  
**Default**: `3`

Number of hierarchical summary layers.

```bash
OM_SUMMARY_LAYERS=3
```

## Auto-Reflection

### OM_AUTO_REFLECT

**Type**: `boolean`  
**Default**: `false`

Enable automatic reflection generation.

```bash
OM_AUTO_REFLECT=true
```

### OM_REFLECT_INTERVAL

**Type**: `number`  
**Default**: `10`

Days between automatic reflection generation.

```bash
OM_REFLECT_INTERVAL=10
```

### OM_REFLECT_MIN_MEMORIES

**Type**: `number`  
**Default**: `20`

Minimum memories required before reflection.

```bash
OM_REFLECT_MIN_MEMORIES=20
```

## LangGraph Integration

### OM_LG_NAMESPACE

**Type**: `string`  
**Default**: `default`

Default namespace for LangGraph memories.

```bash
OM_LG_NAMESPACE=default
```

### OM_LG_MAX_CONTEXT

**Type**: `number`  
**Default**: `50`

Maximum memories in LangGraph context.

```bash
OM_LG_MAX_CONTEXT=50
```

### OM_LG_REFLECTIVE

**Type**: `boolean`  
**Default**: `true`

Enable reflective learning in LangGraph.

```bash
OM_LG_REFLECTIVE=true
```

## IDE Integration

### OM_IDE_MODE

**Type**: `boolean`  
**Default**: `false`

Enable IDE-specific features and endpoints.

```bash
OM_IDE_MODE=true
```

### OM_IDE_ALLOWED_ORIGINS

**Type**: `string` (comma-separated)  
**Default**: `http://localhost:5173,http://localhost:3000`

CORS allowed origins for IDE integrations.

```bash
OM_IDE_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8000
```

## Advanced Configuration

### OM_MODE

**Type**: `string`  
**Default**: `standard`

Operating mode for advanced features.

```bash
OM_MODE=standard
```

### OM_EMBED_MODE

**Type**: `string`  
**Default**: `simple`

Embedding mode (simple or advanced).

```bash
OM_EMBED_MODE=simple
```

### OM_ADV_EMBED_PARALLEL

**Type**: `boolean`  
**Default**: `false`

Enable parallel embedding generation.

```bash
OM_ADV_EMBED_PARALLEL=true
```

### OM_EMBED_DELAY_MS

**Type**: `number`  
**Default**: `200`

Delay between embedding API calls (milliseconds) for rate limiting.

```bash
OM_EMBED_DELAY_MS=200
```

### OM_MAX_PAYLOAD_SIZE

**Type**: `number`  
**Default**: `1000000` (1MB)

Maximum request payload size (bytes).

```bash
OM_MAX_PAYLOAD_SIZE=2000000
```

## Rate Limiting

### OM_RATE_LIMIT_ENABLED

**Type**: `boolean`  
**Default**: `false`

Enable API rate limiting.

```bash
OM_RATE_LIMIT_ENABLED=true
```

### OM_RATE_LIMIT_WINDOW_MS

**Type**: `number`  
**Default**: `60000` (1 minute)

Rate limit window duration (milliseconds).

```bash
OM_RATE_LIMIT_WINDOW_MS=60000
```

### OM_RATE_LIMIT_MAX_REQUESTS

**Type**: `number`  
**Default**: `100`

Maximum requests per window.

```bash
OM_RATE_LIMIT_MAX_REQUESTS=100
```

## Storage Backends

### OM_METADATA_BACKEND

**Type**: `string`  
**Default**: `sqlite`

Backend for metadata storage.

```bash
OM_METADATA_BACKEND=sqlite
```

### OM_VECTOR_BACKEND

**Type**: `string`  
**Default**: `sqlite`

Backend for vector storage.

```bash
OM_VECTOR_BACKEND=sqlite
```

## Regeneration

### OM_REGENERATION_ENABLED

**Type**: `boolean`  
**Default**: `true`

Enable memory regeneration features.

```bash
OM_REGENERATION_ENABLED=true
```

### OM_MAX_VECTOR_DIM

**Type**: `number`  
**Default**: Determined by `OM_TIER`

Maximum vector dimensions.

```bash
OM_MAX_VECTOR_DIM=1536
```

### OM_MIN_VECTOR_DIM

**Type**: `number`  
**Default**: `64`

Minimum vector dimensions.

```bash
OM_MIN_VECTOR_DIM=64
```

## Keyword Search

### OM_KEYWORD_BOOST

**Type**: `number`  
**Default**: `2.5`

Boost factor for keyword matches in hybrid search.

```bash
OM_KEYWORD_BOOST=2.5
```

### OM_KEYWORD_MIN_LENGTH

**Type**: `number`  
**Default**: `3`

Minimum keyword length for indexing.

```bash
OM_KEYWORD_MIN_LENGTH=3
```

## Example Configurations

### Development Setup

```bash
# .env.development
OM_TIER=fast
OM_EMBEDDINGS=synthetic
OM_PORT=8080
OM_DB_PATH=./data/dev.sqlite
OM_DECAY_INTERVAL_MINUTES=60
```

### Production Setup (OpenAI)

```bash
# .env.production
OM_TIER=hybrid
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-...
OM_API_KEY=your_secure_production_key
OM_PORT=8080
OM_DB_PATH=/var/lib/openmemory/prod.sqlite
OM_COMPRESSION_ENABLED=true
OM_COMPRESSION_ALGORITHM=auto
OM_RATE_LIMIT_ENABLED=true
OM_RATE_LIMIT_MAX_REQUESTS=1000
OM_DECAY_INTERVAL_MINUTES=1440
OM_AUTO_REFLECT=true
OM_REFLECT_INTERVAL=7
```

### Production Setup (Ollama)

```bash
# .env.production.ollama
OM_TIER=smart
OM_EMBEDDINGS=ollama
OM_OLLAMA_URL=http://localhost:11434
OM_API_KEY=your_secure_production_key
OM_PORT=8080
OM_DB_PATH=/var/lib/openmemory/prod.sqlite
OM_COMPRESSION_ENABLED=true
OM_USER_SUMMARY_INTERVAL=14
```

### High-Performance Setup

```bash
# .env.performance
OM_TIER=deep
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-...
OM_API_KEY=your_key
OM_VEC_DIM=1536
OM_CACHE_SEGMENTS=5
OM_MAX_ACTIVE=128
OM_ADV_EMBED_PARALLEL=true
OM_DECAY_THREADS=6
OM_SEG_SIZE=20000
```

### LangGraph Agent Setup

```bash
# .env.langgraph
OM_TIER=hybrid
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-...
OM_API_KEY=your_key
OM_LG_NAMESPACE=my_agent
OM_LG_MAX_CONTEXT=100
OM_LG_REFLECTIVE=true
OM_AUTO_REFLECT=true
OM_REFLECT_INTERVAL=3
OM_USER_SUMMARY_INTERVAL=7
```

## Loading Environment Variables

### Node.js/TypeScript

Environment variables are automatically loaded from `.env` using `dotenv`:

```typescript
import dotenv from 'dotenv';
dotenv.config();

// Variables are available in process.env
console.log(process.env.OM_TIER);
```

### Docker

Pass environment variables via Docker:

```bash
# Via command line
docker run -e OM_TIER=hybrid -e OM_API_KEY=key openmemory

# Via env file
docker run --env-file .env openmemory

# Via docker-compose.yml
services:
  openmemory:
    image: openmemory
    env_file: .env
    environment:
      - OM_TIER=hybrid
      - OM_PORT=8080
```

### Kubernetes

Use ConfigMaps and Secrets:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: openmemory-config
data:
  OM_TIER: 'hybrid'
  OM_PORT: '8080'
  OM_EMBEDDINGS: 'openai'
---
apiVersion: v1
kind: Secret
metadata:
  name: openmemory-secrets
stringData:
  OM_API_KEY: 'your_key'
  OPENAI_API_KEY: 'sk-...'
---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: openmemory
          envFrom:
            - configMapRef:
                name: openmemory-config
            - secretRef:
                name: openmemory-secrets
```

## Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong API keys** in production - Generate random 32+ char keys
3. **Set appropriate tier** - Match your performance/cost needs
4. **Configure decay** - Adjust based on your use case
5. **Enable compression** - Save storage and costs in production
6. **Set rate limits** - Protect your API in production
7. **Use environment-specific configs** - `.env.development`, `.env.production`
8. **Monitor performance** - Adjust cache and active memory settings
9. **Secure secrets** - Use secret management tools (Vault, AWS Secrets Manager)
10. **Document custom settings** - Keep notes on why you changed defaults

## Next Steps

- Learn about [Embedding Providers](/docs/advanced/providers)
- Explore [Embedding Modes](/docs/advanced/embedding-modes)
- See [Compression API](/docs/api/compression)
- Read about [Brain Sectors](/docs/concepts/sectors)

---
title: Embedding Providers
description: Backend configuration for different embedding API providers
---

# Embedding Providers

Configure the OpenMemory backend to use different embedding API providers. **This is backend-only configuration** - SDKs don't need to know about providers.

## Supported Providers

| Provider      | Status   | Best For                                |
| ------------- | -------- | --------------------------------------- |
| **synthetic** | ✅ Ready | Development, testing, no API key needed |
| **openai**    | ✅ Ready | Production, high quality, reliable      |
| **gemini**    | ✅ Ready | Google ecosystem, free tier             |
| **voyage**    | ✅ Ready | Specialized embeddings                  |
| **ollama**    | ✅ Ready | Privacy, offline, self-hosted           |

## Configuration

Set the provider in your backend `.env` file:

```env
# Choose provider
OM_EMBEDDINGS=openai

# Provider-specific settings below
```

## OpenAI

High-quality embeddings with excellent API reliability.

### Setup

```env
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-proj-...
OM_OPENAI_MODEL=text-embedding-3-small
OM_OPENAI_BASE_URL=https://api.openai.com/v1
```

### Models

| Model                  | Dimensions | Cost (per 1M tokens) | Use Case                   |
| ---------------------- | ---------- | -------------------- | -------------------------- |
| text-embedding-3-small | 1536       | $0.02                | Recommended for most cases |
| text-embedding-3-large | 3072       | $0.13                | Maximum quality            |
| text-embedding-ada-002 | 1536       | $0.10                | Legacy model               |

### Rate Limits

- **Tier 1**: 3,000 RPM, 1,000,000 TPM
- **Tier 2**: 3,500 RPM, 5,000,000 TPM
- **Tier 3**: 7,000 RPM, 10,000,000 TPM

[Check your tier](https://platform.openai.com/settings/organization/limits)

## Gemini

Google's embedding model with free tier.

### Setup

```env
OM_EMBEDDINGS=gemini
GEMINI_API_KEY=...
```

### Models

- **embedding-001**: 768 dimensions, free tier available

### Rate Limits

- Free tier: 60 requests per minute
- May encounter 429 errors under load
- Backend includes automatic retry with exponential backoff

## Voyage AI

Specialized embeddings optimized for different domains.

### Setup

```env
OM_EMBEDDINGS=voyage
VOYAGE_API_KEY=...
```

### Models

- **voyage-2**: General purpose
- **voyage-large-2**: Higher quality
- **voyage-code-2**: Code-specific embeddings

## Ollama

Self-hosted local embedding models.

### Setup

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull nomic-embed-text`
3. Configure backend:

```env
OM_EMBEDDINGS=ollama
OM_OLLAMA_URL=http://localhost:11434
```

### Benefits

✅ **Privacy**: Data never leaves your server  
✅ **No API costs**: Free after setup  
✅ **Offline**: Works without internet  
✅ **Control**: Full model customization

### Drawbacks

❌ **Hardware**: Requires GPU for good performance  
❌ **Setup**: More complex than cloud APIs  
❌ **Quality**: May be lower than OpenAI/Gemini

## Synthetic

Built-in random embeddings for development.

### Setup

```env
OM_EMBEDDINGS=synthetic
```

### Use Cases

- **Development**: No API key required
- **Testing**: Instant, no API calls
- **CI/CD**: Fast automated tests
- **Demos**: No costs or rate limits

### Limitations

⚠️ **Not for production**: Random vectors, no semantic meaning  
⚠️ **No similarity**: Queries won't return relevant results

## Tier Configuration

Each memory tier has optimized dimensions:

```env
OM_TIER=hybrid  # 256 dimensions + BM25 keyword matching
# OM_TIER=fast   # 256 dimensions
# OM_TIER=smart  # 384 dimensions
# OM_TIER=deep   # 1536 dimensions
```

The backend automatically adjusts embedding dimensions based on tier.

## Switching Providers

1. Update `.env` with new provider settings
2. Restart the backend: `npm run dev`
3. Existing memories continue to work
4. New memories use the new provider

**No SDK changes needed** - client code stays identical.

## Cost Comparison

For 1 million memories (5 sectors each = 5M embeddings):

| Provider           | Monthly Cost | Notes               |
| ------------------ | ------------ | ------------------- |
| **Synthetic**      | $0           | Free, dev only      |
| **Ollama**         | $0           | Hardware costs      |
| **OpenAI (small)** | ~$100        | $0.02/1M tokens     |
| **Gemini**         | $0-$50       | Free tier available |
| **Voyage**         | Varies       | Contact for pricing |

## Performance Comparison

Benchmark on 1,000 memories (single sector):

| Provider     | Latency (avg) | QPS     | Quality    |
| ------------ | ------------- | ------- | ---------- |
| Synthetic    | &lt;1ms       | 10,000+ | ❌         |
| Ollama (GPU) | 50ms          | 200     | ⭐⭐⭐     |
| OpenAI       | 150ms         | 500     | ⭐⭐⭐⭐⭐ |
| Gemini       | 200ms         | 300     | ⭐⭐⭐⭐   |

## Best Practices

### Production Setup

```env
# Use OpenAI for reliability
OM_EMBEDDINGS=openai
OPENAI_API_KEY=sk-...
OM_OPENAI_MODEL=text-embedding-3-small

# Set appropriate tier
OM_TIER=hybrid
```

### Development Setup

```env
# Use synthetic for speed
OM_EMBEDDINGS=synthetic
OM_TIER=fast
```

### Privacy-First Setup

```env
# Use Ollama for data privacy
OM_EMBEDDINGS=ollama
OM_OLLAMA_URL=http://localhost:11434
OM_TIER=smart
```

## Troubleshooting

### OpenAI 429 Errors

```env
# Add rate limiting
OM_RATE_LIMIT_ENABLED=true
OM_RATE_LIMIT_MAX_REQUESTS=100
OM_RATE_LIMIT_WINDOW_MS=60000
```

### Gemini Timeout

```env
# Backend automatically retries with backoff
# Fallback to synthetic if all retries fail
```

### Ollama Connection Refused

```bash
# Check Ollama is running
ollama serve

# Verify URL is correct
curl http://localhost:11434/api/version
```

## SDK Usage

SDKs work identically regardless of backend provider:

### Python

```python
from openmemory import OpenMemory

# Works with any backend provider
om = OpenMemory(api_key="your_key", base_url="http://localhost:8080")
result = om.add("Your content here")
```

### TypeScript

```typescript
import OpenMemory from "openmemory-js";

// Works with any backend provider
const om = new OpenMemory({
  apiKey: "your_key",
  baseUrl: "http://localhost:8080",
});

await om.add("Your content here");
```

## Related Documentation

- [Embedding Modes](/docs/advanced/embedding-modes) - Backend embedding strategies
- [Memory Tiers](/docs/concepts/memory-tiers) - HSG tier system
- [Environment Variables](/docs/configuration/environment-variables) - All OM\_\* settings

## Next Steps

1. Choose a provider based on your needs
2. Set environment variables in backend `.env`
3. Restart the backend
4. Use SDKs normally - no changes needed

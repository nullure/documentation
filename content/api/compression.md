---
title: Compression API
description: Intelligent text compression to optimize storage and reduce token usage
---

# Compression API

OpenMemory's compression system intelligently reduces text size while preserving semantic meaning. Use compression to optimize storage, reduce costs, and improve query performance.

## Overview

The compression API supports three strategies:

- **Semantic**: Preserves meaning, removes redundancy
- **Syntactic**: Grammar-aware compression, maintains structure
- **Aggressive**: Maximum compression, may lose some nuance

## Compress Single Text

Compress a single piece of text using a specific algorithm or auto-detection.

### Endpoint

```
POST /api/compression/compress
```

### Request Body

```json
{
  "text": "string (required) - Text to compress",
  "algorithm": "string (optional) - semantic | syntactic | aggressive | auto"
}
```

### Response

```json
{
  "ok": true,
  "comp": "compressed text",
  "m": {
    "og": 1234,
    "comp": 856,
    "saved": 378,
    "pct": 30.6,
    "latency": 45.2
  },
  "hash": "abc123def456"
}
```

### Python Example

```python
from openmemory import OpenMemory

om = OpenMemory(
    api_key="your_api_key",
    base_url="http://localhost:8080"
)

# Compress with semantic algorithm
result = om.compress(
    text="This is a very long piece of text that contains redundant information and could be compressed to save space and tokens.",
    algorithm="semantic"
)

print(f"Original: {result['m']['og']} chars")
print(f"Compressed: {result['m']['comp']} chars")
print(f"Saved: {result['m']['pct']}%")
print(f"Result: {result['comp']}")

# Auto-detect best algorithm
result = om.compress(
    text="Your text here"
    # algorithm defaults to 'auto'
)
```

### TypeScript Example

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  apiKey: 'your_api_key',
  baseUrl: 'http://localhost:8080',
});

// Compress with syntactic algorithm
const result = await om.compress({
  text: 'Long text with complex grammar structures...',
  algorithm: 'syntactic',
});

console.log(`Saved ${result.m.pct}% (${result.m.saved} chars)`);
console.log(`Compressed: ${result.comp}`);

// Auto-detect
const autoResult = await om.compress({
  text: 'Your text here',
});
```

### cURL Example

```bash
curl -X POST http://localhost:8080/api/compression/compress \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here...",
    "algorithm": "semantic"
  }'
```

## Batch Compression

Compress multiple texts in a single request.

### Endpoint

```
POST /api/compression/batch
```

### Request Body

```json
{
  "texts": ["string array (required) - Array of texts to compress"],
  "algorithm": "string (required) - semantic | syntactic | aggressive"
}
```

### Response

```json
{
  "ok": true,
  "results": [
    {
      "comp": "compressed text 1",
      "m": { "og": 100, "comp": 70, "saved": 30, "pct": 30, "latency": 12.5 },
      "hash": "hash1"
    },
    {
      "comp": "compressed text 2",
      "m": { "og": 200, "comp": 140, "saved": 60, "pct": 30, "latency": 15.2 },
      "hash": "hash2"
    }
  ],
  "total": 90
}
```

### Python Example

```python
# Compress multiple texts
texts = [
    "First long text to compress...",
    "Second text with redundant information...",
    "Third text that needs optimization..."
]

result = om.compress_batch(
    texts=texts,
    algorithm="semantic"
)

print(f"Total saved: {result['total']} chars")

for i, item in enumerate(result['results']):
    print(f"Text {i+1}: {item['m']['pct']}% reduction")
    print(f"  Compressed: {item['comp']}")
```

### TypeScript Example

```typescript
const texts = ['First text...', 'Second text...', 'Third text...'];

const result = await om.compressBatch({
  texts,
  algorithm: 'aggressive',
});

console.log(`Total saved: ${result.total} chars`);

result.results.forEach((item, i) => {
  console.log(`Text ${i + 1}: ${item.m.pct}% reduction`);
});
```

## Analyze Compression

Analyze text to determine the best compression algorithm without actually compressing.

### Endpoint

```
POST /api/compression/analyze
```

### Request Body

```json
{
  "text": "string (required) - Text to analyze"
}
```

### Response

```json
{
  "ok": true,
  "analysis": {
    "semantic": {
      "og": 1234,
      "comp": 856,
      "saved": 378,
      "pct": 30.6,
      "latency": 45.2
    },
    "syntactic": {
      "og": 1234,
      "comp": 912,
      "saved": 322,
      "pct": 26.1,
      "latency": 38.5
    },
    "aggressive": {
      "og": 1234,
      "comp": 723,
      "saved": 511,
      "pct": 41.4,
      "latency": 52.3
    }
  },
  "rec": {
    "algo": "aggressive",
    "save": "41.4%",
    "lat": "52.3ms"
  }
}
```

### Python Example

```python
# Analyze to find best compression algorithm
analysis = om.analyze_compression(
    text="Your text to analyze..."
)

print(f"Recommended algorithm: {analysis['rec']['algo']}")
print(f"Expected savings: {analysis['rec']['save']}")
print(f"Latency: {analysis['rec']['lat']}")

# Compare all algorithms
for algo, metrics in analysis['analysis'].items():
    print(f"{algo}: {metrics['pct']}% savings, {metrics['latency']}ms")
```

### TypeScript Example

```typescript
const analysis = await om.analyzeCompression({
  text: 'Your text to analyze...',
});

console.log(`Best: ${analysis.rec.algo} (${analysis.rec.save} savings)`);

// Compare algorithms
Object.entries(analysis.analysis).forEach(([algo, metrics]) => {
  console.log(`${algo}: ${metrics.pct}% in ${metrics.latency}ms`);
});
```

## Compression Statistics

Get global compression statistics across all compression operations.

### Endpoint

```
GET /api/compression/stats
```

### Response

```json
{
  "ok": true,
  "stats": {
    "total": 1234,
    "ogTok": 500000,
    "compTok": 350000,
    "saved": 150000,
    "avgRatio": "30.00%",
    "totalPct": "30.00%",
    "lat": "45678.50ms",
    "avgLat": "37.02ms",
    "cache": {
      "hits": 234,
      "misses": 1000,
      "size": 234
    }
  }
}
```

### Python Example

```python
# Get compression stats
stats = om.get_compression_stats()

print(f"Total compressions: {stats['stats']['total']}")
print(f"Average reduction: {stats['stats']['avgRatio']}")
print(f"Total saved: {stats['stats']['saved']} chars")
print(f"Cache hits: {stats['stats']['cache']['hits']}")
print(f"Cache misses: {stats['stats']['cache']['misses']}")
```

### TypeScript Example

```typescript
const stats = await om.getCompressionStats();

console.log(`Total: ${stats.stats.total} compressions`);
console.log(`Avg reduction: ${stats.stats.avgRatio}`);
console.log(
  `Cache efficiency: ${stats.stats.cache.hits}/${
    stats.stats.cache.hits + stats.stats.cache.misses
  }`,
);
```

### cURL Example

```bash
curl http://localhost:8080/api/compression/stats \
  -H "Authorization: Bearer your_api_key"
```

## Reset Compression

Reset compression engine statistics and clear cache.

### Endpoint

```
POST /api/compression/reset
```

### Response

```json
{
  "ok": true,
  "msg": "reset done"
}
```

### Python Example

```python
# Reset compression stats and cache
result = om.reset_compression()
print(result['msg'])
```

### TypeScript Example

```typescript
const result = await om.resetCompression();
console.log(result.msg);
```

### cURL Example

```bash
curl -X POST http://localhost:8080/api/compression/reset \
  -H "Authorization: Bearer your_api_key"
```

## Compression Algorithms

### Semantic Compression

**Best for**: Natural language, documentation, conversations

- Removes redundant phrases
- Preserves meaning and context
- Maintains readability
- Typical savings: 25-35%

Example:

```
Original: "The quick brown fox jumps over the lazy dog. The fox is very quick and brown."
Semantic: "Quick brown fox jumps over lazy dog. Fox is very quick, brown."
```

### Syntactic Compression

**Best for**: Technical content, code comments, structured text

- Grammar-aware reduction
- Maintains structure
- Preserves technical terms
- Typical savings: 20-30%

Example:

```
Original: "To initialize the database, you need to first install dependencies and then run the migration script."
Syntactic: "Initialize DB: install dependencies, run migration script."
```

### Aggressive Compression

**Best for**: Cache data, temporary storage, non-critical content

- Maximum compression
- May lose nuance
- Abbreviations and shortcuts
- Typical savings: 35-50%

Example:

```
Original: "The user clicked the button and then navigated to the settings page."
Aggressive: "User clicked btn → settings pg."
```

## Configuration

Compression can be enabled/disabled via environment variables:

```bash
# Enable compression globally
OM_COMPRESSION_ENABLED=true

# Set default algorithm (semantic, syntactic, aggressive, auto)
OM_COMPRESSION_ALGORITHM=auto

# Minimum text length to compress (chars)
OM_COMPRESSION_MIN_LENGTH=100
```

See [Environment Variables](/docs/advanced/environment-variables) for full configuration.

## Best Practices

1. **Use analyze first** for important content to choose optimal algorithm
2. **Batch compress** multiple texts for better performance
3. **Monitor statistics** to track compression effectiveness
4. **Choose semantic** for user-facing content
5. **Choose aggressive** for backend/cache data
6. **Use auto mode** when unsure - lets the system decide

## Integration with Memory Storage

Compression can be applied automatically when storing memories:

```python
# Store memory with automatic compression
om.add(
    content="Long content that will be automatically compressed...",
    metadata={
        "compress": True,
        "compression_algorithm": "semantic"
    }
)
```

## Next Steps

- Learn about [LangGraph Integration](/docs/api/langgraph)
- Explore [Environment Variables](/docs/advanced/environment-variables)
- See [Advanced Configuration](/docs/advanced/embedding-modes)

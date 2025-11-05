---
title: HMD v2 (HSG) Specification
description: OpenMemory's Hierarchical Semantic Graph with tiered decay and adaptive compression
---

# HMD v2 (HSG) Specification

**Hierarchical Memory Decay version 2** implements a **Hierarchical Semantic Graph (HSG)** architecture with tiered decay, adaptive compression, and automatic regeneration.

## Overview

HMD v2 differs from traditional caching and memory systems by:

- **Three-tier classification** (hot/warm/cold) based on recency and activity
- **Adaptive vector compression** preserving semantic meaning while reducing storage
- **Fingerprinting** for cold memories with automatic regeneration
- **Brain-inspired sectors** with sector-specific decay characteristics
- **Coactivation tracking** to boost frequently accessed memories

This creates a memory system that mimics human cognition: recent and important memories remain vivid, while old memories compress but stay retrievable.

## Core Architecture

### Tiered Memory States

```
┌─────────────────────────────────────────────────┐
│  HOT (λ=0.005)                                  │
│  • Recent + High activity                       │
│  • Full resolution vectors                      │
│  • No compression                               │
│  • Criteria: <6 days AND (coact>5 OR sal>0.7)  │
└─────────────────────────────────────────────────┘
           ↓ (aging or low activity)
┌─────────────────────────────────────────────────┐
│  WARM (λ=0.02)                                  │
│  • Recent OR moderate salience                  │
│  • Compressed when f<0.7                        │
│  • Accessible with minimal latency              │
│  • Criteria: <6 days OR sal>0.4                 │
└─────────────────────────────────────────────────┘
           ↓ (continued inactivity)
┌─────────────────────────────────────────────────┐
│  COLD (λ=0.05)                                  │
│  • Old + low salience                           │
│  • Heavy compression or fingerprinting          │
│  • Regenerates on access                        │
│  • Criteria: Not hot/warm                       │
└─────────────────────────────────────────────────┘
```

### HSG Tier Configuration

Memory storage tier affects maximum vector dimensions:

| Tier   | Dimensions | Cache | Max Active | Features           |
| ------ | ---------- | ----- | ---------- | ------------------ |
| Fast   | 256        | 2 seg | 32         | Speed-optimized    |
| Smart  | 384        | 3 seg | 64         | Balanced           |
| Deep   | 1536       | 5 seg | 128        | High accuracy      |
| Hybrid | 256 + BM25 | 3 seg | 64         | Semantic + keyword |

Set via environment variable:

```bash
OM_TIER=hybrid  # Recommended default
```

## Mathematical Model

### Tier Classification

```typescript
function classify_tier(memory, now_ts): 'hot' | 'warm' | 'cold' {
  const dt = now_ts - memory.last_seen_at
  const recent = dt < 6_days
  const high = memory.coactivations > 5 || memory.salience > 0.7

  if (recent && high) return 'hot'
  if (recent || memory.salience > 0.4) return 'warm'
  return 'cold'
}
```

### Decay Formula

```
f = exp(-λ × dt / (salience + 0.1))
```

Where:

- `λ` = Tier decay constant (0.005 hot, 0.02 warm, 0.05 cold)
- `dt` = Days elapsed since last access
- `salience` = Current strength, boosted by coactivations

### Salience Calculation

```
boosted_salience = clamp(
  base_salience × (1 + ln(1 + coactivations)),
  0,
  1
)
```

Logarithmic coactivation boost prevents unbounded growth while rewarding access.

### New Salience After Decay

```
new_salience = clamp(salience × f, 0, 1)
```

### Compression Target Dimensions

```
target_dim = floor(original_dim × f)
target_dim = clamp(target_dim, min_vec_dim, max_vec_dim)
```

Defaults:

- `min_vec_dim` = 64 (configurable via `OM_MIN_VECTOR_DIM`)
- `max_vec_dim` = 256/384/1536 (based on `OM_TIER`)

## Implementation Details

### Memory Structure

```typescript
interface HSGMemory {
  id: string;
  content: string;
  summary: string;
  primary_sector:
    | "episodic"
    | "semantic"
    | "procedural"
    | "emotional"
    | "reflective";
  sectors: string[];
  salience: number; // 0.0-1.0
  decay_lambda: number; // Sector-specific
  coactivations: number; // Access count
  last_seen_at: number; // Timestamp
  created_at: number;
  updated_at: number;
  version: number;
}

interface HSGVector {
  id: string;
  sector: string;
  vector: number[]; // Adaptive dimensions
}
```

### Brain Sector Integration

Each sector has specialized decay characteristics:

```typescript
const sector_configs = {
  episodic: {
    decay_lambda: 0.015, // Medium-fast (events fade)
    weight: 1.2, // Boosted importance
  },
  semantic: {
    decay_lambda: 0.005, // Very slow (facts persist)
    weight: 1.0, // Standard
  },
  procedural: {
    decay_lambda: 0.008, // Slow (habits stable)
    weight: 1.1, // Slightly boosted
  },
  emotional: {
    decay_lambda: 0.02, // Fast (emotions fade quickly)
    weight: 1.3, // Highly boosted
  },
  reflective: {
    decay_lambda: 0.001, // Extremely slow (learnings persist)
    weight: 0.8, // Background context
  },
};
```

See [Brain Sectors](/docs/concepts/sectors) for detailed sector information.

### Compression Algorithm

```typescript
function compress_vector(
  vec: number[],
  f: number,
  min_dim: number,
  max_dim: number
): number[] {
  const target_dim = Math.floor(vec.length * f);
  const dim = clamp(target_dim, min_dim, Math.min(max_dim, vec.length));

  if (dim >= vec.length) return vec;

  // Pooling-based compression
  const bucket_size = Math.ceil(vec.length / dim);
  const compressed = [];

  for (let i = 0; i < vec.length; i += bucket_size) {
    const bucket = vec.slice(i, i + bucket_size);
    compressed.push(mean(bucket));
  }

  return normalize(compressed);
}
```

**Example Compression Path**:

```
1536d (f=1.0) → 1075d (f=0.7) → 614d (f=0.4) → 307d (f=0.2) → 64d (min)
```

### Summary Compression

```typescript
function compress_summary(
  text: string,
  f: number,
  layers: number
): string {
  if (f > 0.8) {
    // Light: truncate to 200 chars
    return truncate(text, 200)
  }
  if (f > 0.4) {
    // Medium: extractive summary
    return summarize_quick(text, max_length: 80)
  }
  // Heavy: keywords only
  return top_keywords(text, count: 5).join(' ')
}
```

### Fingerprinting

When `f < cold_threshold` (default 0.25):

```typescript
function fingerprint_memory(memory: HSGMemory): Fingerprint {
  // Create deterministic hash vector
  const hash_input = memory.id + "|" + memory.summary;
  const fingerprint_vec = hash_to_vec(hash_input, 32); // 32 dimensions

  // Extract top keywords
  const keywords = top_keywords(memory.content, 3);
  const fingerprint_summary = keywords.join(" ");

  return {
    vector: normalize(fingerprint_vec),
    summary: fingerprint_summary,
  };
}
```

Fingerprinted memories:

- Use ~95% less storage
- Still searchable via keywords
- Automatically regenerate when accessed

## Decay Process

### Periodic Execution

```typescript
// Runs every OM_DECAY_INTERVAL_MINUTES (default: 1440 = 24 hours)
// Skips if:
// - Active queries running (active_q > 0)
// - Cooldown period not elapsed (<60s since last decay)

async function apply_decay() {
  for (const segment of memory_segments) {
    // Process batch (OM_DECAY_RATIO × segment_size)
    const batch = select_random_batch(segment, ratio: 0.03)

    // Parallel processing across threads
    await parallelize(batch, threads: OM_DECAY_THREADS)
  }
}
```

### Per-Memory Decay Steps

```typescript
for (const memory of batch) {
  // 1. Classify tier
  const tier = classify_tier(memory, now)

  // 2. Get tier-specific lambda
  const λ = tier === 'hot' ? 0.005 : tier === 'warm' ? 0.02 : 0.05

  // 3. Calculate decay factor
  const dt = days_since(memory.last_seen_at)
  const boosted_sal = memory.salience × (1 + ln(1 + memory.coactivations))
  const f = exp(-λ × dt / (boosted_sal + 0.1))

  // 4. Apply salience decay
  const new_salience = clamp(boosted_sal × f, 0, 1)

  // 5. Compress if needed (f < 0.7)
  if (f < 0.7) {
    const new_vec = compress_vector(memory.vector, f)
    const new_summary = compress_summary(memory.summary, f)
    update_vector(memory.id, new_vec)
    update_summary(memory.id, new_summary)
  }

  // 6. Fingerprint if very cold (f < cold_threshold)
  if (f < 0.25) {
    const fp = fingerprint_memory(memory)
    update_vector(memory.id, fp.vector)  // 32d fingerprint
    update_summary(memory.id, fp.summary)  // Keywords only
  }

  // 7. Update salience
  update_salience(memory.id, new_salience)
}
```

### Batch Processing Strategy

```typescript
// Stochastic sampling prevents processing same memories repeatedly
const batch_size = floor(segment_size × OM_DECAY_RATIO)
const random_start = random(0, segment_size - batch_size)
const batch = memories.slice(random_start, random_start + batch_size)

// Distribute across threads for parallelization
const threads = OM_DECAY_THREADS  // default: 3
const chunks = chunkify(batch, threads)

// Process in parallel
await Promise.all(chunks.map(process_chunk))

// Sleep between segments to avoid overwhelming system
await sleep(OM_DECAY_SLEEP_MS)  // default: 200ms
```

## Regeneration on Access

### Automatic Regeneration

When a fingerprinted memory is queried:

```typescript
async function on_query_hit(
  memory_id: string,
  sector: string,
  reembed: (text: string) => Promise<number[]>
) {
  const memory = await get_memory(memory_id);
  const vector = await get_vector(memory_id, sector);

  // Check if fingerprinted (≤64 dimensions)
  if (vector.length <= 64) {
    // Regenerate full embedding
    const original_text = memory.summary || memory.content;
    const new_vector = await reembed(original_text);

    // Replace fingerprint with full vector
    await update_vector(memory_id, sector, new_vector);

    console.log(`[hsg] regenerated memory ${memory_id}`);
  }

  // Reinforce salience
  if (OM_DECAY_REINFORCE_ON_QUERY) {
    const new_salience = clamp(memory.salience + 0.5, 0, 1);
    await update_salience(memory_id, new_salience);
    await update_last_seen(memory_id, now());
  }
}
```

### Reinforce-on-Query

```typescript
// Enabled by default (OM_DECAY_REINFORCE_ON_QUERY=true)
// Prevents useful memories from fading

function reinforce_on_query(memory: HSGMemory) {
  // Significant boost to salience
  memory.salience = min(1.0, memory.salience + 0.5);

  // Update access tracking
  memory.last_seen_at = now();
  memory.coactivations++;

  // Effect: Memory likely moves to hot/warm tier
}
```

## Configuration

### Environment Variables

```bash
# Tier system (affects max vector dimensions)
OM_TIER=hybrid  # fast=256d, smart=384d, deep=1536d, hybrid=256d+BM25

# Decay behavior
OM_DECAY_THREADS=3  # Parallel processing threads
OM_DECAY_RATIO=0.03  # Portion of memories to decay per cycle (3%)
OM_DECAY_SLEEP_MS=200  # Sleep between segment processing
OM_DECAY_COLD_THRESHOLD=0.25  # Fingerprint threshold

# Compression limits
OM_MAX_VECTOR_DIM=1536  # Maximum dimensions (set by tier)
OM_MIN_VECTOR_DIM=64  # Minimum dimensions after compression
OM_SUMMARY_LAYERS=3  # Summary compression layers (1-3)

# Regeneration and reinforcement
OM_DECAY_REINFORCE_ON_QUERY=true  # Auto-reinforce matched memories
OM_REGENERATION_ENABLED=true  # Regenerate fingerprinted memories

# Decay interval
OM_DECAY_INTERVAL_MINUTES=1440  # Run decay every 24 hours
```

See [Environment Variables](/docs/advanced/environment-variables) for complete reference.

### Sector-Specific Configuration

Sectors are configured in `models.yml`:

```yaml
episodic:
  ollama: nomic-embed-text
  openai: text-embedding-3-small
  gemini: models/embedding-001

semantic:
  ollama: nomic-embed-text
  openai: text-embedding-3-small
  gemini: models/embedding-001
# ... procedural, emotional, reflective
```

Each sector has hardcoded decay lambda in the implementation:

- `episodic`: λ = 0.015
- `semantic`: λ = 0.005
- `procedural`: λ = 0.008
- `emotional`: λ = 0.020
- `reflective`: λ = 0.001

## Performance Characteristics

### Storage Efficiency

Compression dramatically reduces storage requirements:

| State          | Vector Dims | Summary Length | Storage vs Hot |
| -------------- | ----------- | -------------- | -------------- |
| Hot (full)     | 1536d       | Full text      | 100%           |
| Warm (partial) | 1075d       | Summarized     | ~70%           |
| Warm (more)    | 614d        | Keywords+      | ~40%           |
| Cold (heavy)   | 307d        | Keywords       | ~20%           |
| Cold (minimal) | 64d         | 3-5 keywords   | ~5%            |
| Fingerprinted  | 32d         | 3 keywords     | ~2%            |

**Example**: 100,000 memories at 1536d = 100K memories

- All hot: ~600MB vector storage
- 50% fingerprinted: ~300MB (50% savings)
- 80% fingerprinted: ~120MB (80% savings)

### Query Performance

Tier distribution affects query speed:

```
Hot memories:  <1ms retrieval (full vectors, cached)
Warm memories: 1-5ms retrieval (compressed but loaded)
Cold memories: 5-10ms retrieval (heavily compressed)
Fingerprinted: 10-50ms if matched (requires regeneration)
```

**Optimization**: Frequently queried memories naturally migrate to hot tier through reinforcement.

### Memory Distribution

Healthy distribution example for knowledge base:

```
Hot:   15% (recently accessed, high activity)
Warm:  45% (moderately recent or important)
Cold:  40% (archived but retrievable)
```

Adjust `OM_DECAY_COLD_THRESHOLD` to shift distribution:

- Lower threshold (0.15): More hot/warm, less aggressive
- Higher threshold (0.35): More cold/fingerprinted, more aggressive

## Advanced Features

### Waypoints and Graph Structure

HSG maintains semantic connections between memories:

```typescript
interface Waypoint {
  src_id: string;
  dst_id: string;
  weight: number; // Semantic similarity
  created_at: number;
  updated_at: number;
}
```

Waypoints enable:

- Cross-sector memory navigation
- Related memory discovery
- Context-aware retrieval
- Graph-based reasoning

### Coactivation Tracking

Memories accessed together strengthen their connection:

```typescript
function track_coactivation(memory_ids: string[]) {
  for (const id of memory_ids) {
    memory.coactivations++

    // Boost salience via logarithmic scaling
    memory.salience = clamp(
      memory.salience × (1 + ln(1 + memory.coactivations)),
      0,
      1
    )
  }
}
```

High coactivation count:

- Pushes memory toward hot tier
- Slows decay rate
- Increases query relevance

### Query-Time Scoring

Memory relevance combines multiple factors:

```typescript
function calculate_score(
  memory: HSGMemory,
  query_vec: number[],
  sector_weight: number
): number {
  // Semantic similarity
  const similarity = cosine_similarity(memory.vector, query_vec)

  // Sector-specific weight (emotional=1.3, reflective=0.8, etc.)
  const weighted_sim = similarity × sector_weight

  // Salience boost
  const salience_factor = memory.salience

  // Recency boost
  const hours_since = (now() - memory.last_seen_at) / 3600000
  const recency_boost = hours_since < 24 ? 1.2 : 1.0

  // Combined score
  return weighted_sim × (0.7 + salience_factor × 0.3) × recency_boost
}
```

This ensures hot, important, and recent memories rank higher.

## Monitoring and Observability

### Decay Logs

```bash
# Typical output
[decay-2.0] 127/3456 | tiers: hot=512 warm=1823 cold=1121 | compressed=23 fingerprinted=8 | 1534.2ms across 18 segments
```

**Key metrics**:

- `127/3456`: 127 memories changed out of 3456 processed
- `hot=512`: 512 memories in hot tier (14.8%)
- `warm=1823`: 1823 in warm tier (52.7%)
- `cold=1121`: 1121 in cold tier (32.4%)
- `compressed=23`: 23 vectors compressed this cycle
- `fingerprinted=8`: 8 memories fingerprinted
- `1534.2ms`: Processing time
- `18 segments`: Memory segments processed

### Health Indicators

**Good distribution**:

```
hot: 10-20%   (active working set)
warm: 40-60%  (readily accessible)
cold: 30-50%  (archived, efficient)
```

**Warning signs**:

```
hot: >50%     → Decay too slow, storage inefficient
cold: >70%    → Decay too aggressive, poor recall
hot: <5%      → Everything decaying, check reinforcement
```

**Tuning**:

- Increase `OM_DECAY_COLD_THRESHOLD` → More aggressive
- Decrease `OM_DECAY_COLD_THRESHOLD` → More conservative
- Enable `OM_DECAY_REINFORCE_ON_QUERY` → Keep useful memories hot

## Comparison with Alternatives

| System     | Decay Model        | Compression | Regeneration | Sectors | Cost  |
| ---------- | ------------------ | ----------- | ------------ | ------- | ----- |
| **HMD v2** | 3-tier exponential | Adaptive    | Yes          | Yes     | $$    |
| Redis      | TTL (binary)       | None        | No           | No      | $     |
| LRU Cache  | Eviction-based     | None        | No           | No      | $     |
| Vector DB  | No decay           | None        | N/A          | No      | $$$$  |
| Pinecone   | No decay           | None        | N/A          | Limited | $$$$$ |

HMD v2 uniquely combines:

- Natural decay patterns
- Storage optimization
- Automatic recovery
- Brain-inspired organization

## Best Practices

### Choose Appropriate Tier

Match your use case:

```bash
# Speed-critical applications
OM_TIER=fast  # 256d, fastest queries

# Balanced production
OM_TIER=hybrid  # 256d + BM25, best of both

# High-accuracy knowledge base
OM_TIER=deep  # 1536d, maximum semantic fidelity
```

### Configure Decay Aggressiveness

```bash
# Long-term knowledge preservation
OM_DECAY_COLD_THRESHOLD=0.15  # Less aggressive fingerprinting

# Storage-constrained environment
OM_DECAY_COLD_THRESHOLD=0.35  # More aggressive compression

# Production balanced (default)
OM_DECAY_COLD_THRESHOLD=0.25
```

### Enable Reinforcement

```bash
# Recommended for all production deployments
OM_DECAY_REINFORCE_ON_QUERY=true

# Prevents frequently-used memories from decaying
```

### Monitor Distribution

```bash
# Watch decay logs for tier distribution
# Adjust thresholds if distribution is unhealthy
```

### Plan for Regeneration Costs

```bash
# Regeneration requires embedding API calls
# Budget for ~5-10% of memories regenerating per day

# Enable regeneration (recommended)
OM_REGENERATION_ENABLED=true
```

## Next Steps

- Learn about [Decay Algorithm](/docs/concepts/decay) implementation details
- Understand [Brain Sectors](/docs/concepts/sectors) and sector-specific decay
- Explore [Waypoints](/docs/concepts/waypoints) for graph navigation
- Configure [Environment Variables](/docs/advanced/environment-variables)
- Read about [Embedding Modes](/docs/advanced/embedding-modes) and tier selection

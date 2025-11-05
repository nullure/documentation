---
title: Decay Algorithm
description: OpenMemory's HSG-based tiered decay system with hot/warm/cold memory states
---

# Decay Algorithm

OpenMemory uses a **Hierarchical Semantic Graph (HSG)** decay system with three memory tiers that automatically adjust based on access patterns and age.

## Overview

Unlike simple time-based decay, OpenMemory's HSG system:

- **Classifies memories into tiers** (hot/warm/cold) based on recency and usage
- **Applies tier-specific decay rates** (λ values)
- **Compresses vectors** as memories cool down
- **Fingerprints cold memories** to minimal representations
- **Regenerates on access** when needed

## Three-Tier System

### Hot Memories (Active)

**Criteria**: Recently accessed AND high activity

- Last seen < 6 days AND (coactivations > 5 OR salience > 0.7)

**Decay Rate**: λ = 0.005 (very slow decay)

**Behavior**:

- Full vector dimensions maintained
- No compression applied
- Highest priority in queries
- Optimal retrieval performance

**Example**:

```python
# Recently queried important memory
# Last seen: 2 days ago, coactivations: 8, salience: 0.85
# Status: HOT
# Vector: Full dimensions (256d/384d/1536d depending on tier)
```

---

### Warm Memories (Recent)

**Criteria**: Recent OR moderate salience

- Last seen < 6 days OR salience > 0.4

**Decay Rate**: λ = 0.02 (moderate decay)

**Behavior**:

- Vectors begin compressing when f < 0.7
- Summary starts condensing
- Still readily accessible
- Balanced performance

**Example**:

```python
# Memory accessed a few days ago
# Last seen: 4 days ago, salience: 0.55
# Status: WARM
# Vector: May be compressed if decay factor drops
```

---

### Cold Memories (Archived)

**Criteria**: Old AND low salience

- Doesn't meet hot or warm criteria

**Decay Rate**: λ = 0.05 (fast decay)

**Behavior**:

- Heavy compression when f < 0.7
- Fingerprinting when f < cold_threshold (default 0.25-0.3)
- Minimal storage footprint
- Can be regenerated on access

**Example**:

```python
# Old memory rarely accessed
# Last seen: 45 days ago, salience: 0.18
# Status: COLD
# Vector: Fingerprinted to 32d, summary reduced to keywords
```

## Decay Formula

The decay factor determines memory transformation:

```
f = exp(-λ × dt / (salience + 0.1))
```

Where:

- `λ` = Tier-specific decay constant (0.005/0.02/0.05)
- `dt` = Time elapsed in days since last access
- `salience` = Current memory strength (0-1), boosted by coactivations

### Salience Calculation

```
salience = clamp((base_salience × (1 + ln(1 + coactivations))), 0, 1)
```

Salience increases logarithmically with access count, preventing unbounded growth.

### New Salience After Decay

```
new_salience = clamp(salience × f, 0, 1)
```

## Compression Mechanics

### Vector Compression

When decay factor `f < 0.7`, vectors are compressed:

```python
# Original vector: 1536 dimensions
# Decay factor: f = 0.6
# Target dimensions: floor(1536 × 0.6) = 922 dimensions

# Compression via pooling
bucket_size = ceil(original_dim / target_dim)
compressed_vec = [mean(vec[i:i+bucket_size]) for i in range(0, len(vec), bucket_size)]
normalized = normalize(compressed_vec)
```

**Compression Limits**:

- **Minimum**: 64 dimensions
- **Maximum**: Original dimensions (256/384/1536 based on `OM_TIER`)

**Example**: 1536d → 922d → 614d → 384d → 256d → 128d → 64d (min)

### Summary Compression

Summaries compress in layers based on decay factor:

```python
if f > 0.8:
    # Light compression - truncate
    summary = original[:200] + "..."
elif f > 0.4:
    # Medium compression - extractive summary
    summary = top_sentences(original, 3)[:80]
else:
    # Heavy compression - keywords only
    summary = " ".join(top_keywords(original, 5))
```

### Fingerprinting

When `f < cold_threshold` (default 0.25-0.3), memories are fingerprinted:

```python
# Create minimal representation
fingerprint_vector = hash_to_vec(id + summary, 32)  # 32 dimensions
fingerprint_summary = " ".join(top_keywords(content, 3))  # 3 keywords

# Replace full memory
update_vector(id, fingerprint_vector)
update_summary(id, fingerprint_summary)
```

Fingerprinted memories occupy minimal space but can be regenerated when accessed.

## Practical Examples

### Example 1: Hot Memory Lifecycle

```python
# Day 0: Add important memory
om.add("Critical API authentication flow uses JWT tokens")
# Status: HOT (salience=0.8, coactivations=0)
# Vector: 1536d full resolution

# Day 2: Query increases coactivations
om.query("authentication")  # Match found
# Status: HOT (salience=0.85, coactivations=1, last_seen=now)
# λ = 0.005, decay factor f ≈ 0.99
# Vector: Still 1536d

# Day 10: Another query
om.query("JWT tokens")  # Match found
# Status: HOT (salience=0.90, coactivations=2, last_seen=now)
# Vector: 1536d (maintained by hot status)

# Result: Stays hot through regular access
```

### Example 2: Warm Memory Decay

```python
# Day 0: Add general information
om.add("Python supports list comprehensions for concise iteration")
# Status: WARM (salience=0.6, coactivations=0)

# Day 5: No access, decaying
# λ = 0.02, dt = 5 days
# f = exp(-0.02 × 5 / (0.6 + 0.1)) ≈ 0.87
# new_salience = 0.6 × 0.87 = 0.522
# Status: WARM
# Vector: 1536d (f > 0.7, no compression yet)

# Day 12: More decay
# dt = 12 days
# f = exp(-0.02 × 12 / (0.522 + 0.1)) ≈ 0.70
# new_salience = 0.522 × 0.70 = 0.365
# Status: WARM
# Vector: 1536d (just at threshold)

# Day 20: Compression begins
# dt = 20 days
# f = exp(-0.02 × 20 / (0.365 + 0.1)) ≈ 0.46
# new_salience = 0.365 × 0.46 = 0.168
# Status: COLD (salience < 0.4, old)
# Vector: Compressed to ~700d (1536 × 0.46)
# Summary: Compressed to keywords
```

### Example 3: Cold Memory Fingerprinting

```python
# Day 0: Add session context
om.add("User debugging timeout issue in production", salience=0.5)
# Status: WARM

# Day 45: Long time, no access
# λ = 0.05 (cold), dt = 45 days
# f = exp(-0.05 × 45 / (0.5 + 0.1)) ≈ 0.0055
# new_salience = 0.5 × 0.0055 = 0.0027
# Status: COLD
# f < 0.25 → FINGERPRINT

# Vector: 32d fingerprint (minimal)
# Summary: "user debug timeout"
# Storage: ~95% reduced

# Later: User queries "timeout issues"
# Match found in fingerprint
# on_query_hit() triggered
# → Regenerate full embedding from original content
# → Restore to WARM status
# → salience boosted to 0.5 + 0.5 = 1.0
```

## Reinforcement and Regeneration

### Automatic Reinforcement on Query

When `OM_DECAY_REINFORCE_ON_QUERY=true` (default), matched memories are reinforced:

```python
# Query matches a memory
results = om.query("authentication flow")

# For each match, automatic reinforcement:
new_salience = min(1.0, current_salience + 0.5)
last_seen_at = now()

# Example:
# Before: salience = 0.35 (cold)
# After:  salience = 0.85 (hot again!)
```

This prevents useful memories from fading away.

### Regeneration on Access

When `OM_REGENERATION_ENABLED=true` (default), fingerprinted memories regenerate:

```python
# Memory is fingerprinted (32d vector, keyword summary)
# User queries and matches fingerprint

# Automatic regeneration:
# 1. Extract original content from database
# 2. Generate full embedding (256d/384d/1536d)
# 3. Replace fingerprint with full vector
# 4. Boost salience significantly
# 5. Update last_seen_at

# Result: Memory restored to full fidelity
```

### Manual Reinforcement

Explicitly reinforce important memories:

```python
# Reinforce specific memory
om.reinforce(memory_id="mem_123")

# Backend applies reinforcement formula:
# new_salience = min(1.0, old_salience + boost_amount)
# where boost_amount is typically 0.2-0.5
```

## Environment Configuration

Control decay behavior via environment variables:

```bash
# Decay threads for parallel processing
OM_DECAY_THREADS=3

# Cold threshold for fingerprinting (0.0-1.0)
OM_DECAY_COLD_THRESHOLD=0.25

# Auto-reinforce on query matches
OM_DECAY_REINFORCE_ON_QUERY=true

# Regenerate fingerprinted memories on access
OM_REGENERATION_ENABLED=true

# Max vector dimensions before compression
OM_MAX_VECTOR_DIM=1536

# Min vector dimensions after compression
OM_MIN_VECTOR_DIM=64

# Summary compression layers (1-3)
OM_SUMMARY_LAYERS=3

# Decay batch ratio (portion of memories to decay per cycle)
OM_DECAY_RATIO=0.03

# Sleep between segment processing (ms)
OM_DECAY_SLEEP_MS=200

# Base tier dimensions (affects max compression)
OM_TIER=hybrid  # fast=256d, smart=384d, deep=1536d, hybrid=256d+BM25
```

See [Environment Variables](/docs/advanced/environment-variables) for full reference.

## Decay Process Lifecycle

### Periodic Decay Cycle

```typescript
// Runs every OM_DECAY_INTERVAL_MINUTES (default 1440 = 24 hours)

1. Check if queries are active (skip if active_q > 0)
2. Check cooldown period (skip if < 60s since last decay)
3. For each memory segment:
   a. Load batch of memories (OM_DECAY_RATIO × segment_size)
   b. Classify each into hot/warm/cold tier
   c. Calculate decay factor f = exp(-λ × dt / (salience + 0.1))
   d. Apply salience decay: new_salience = salience × f
   e. If f < 0.7: compress vector and summary
   f. If f < cold_threshold: fingerprint memory
   g. Update database with new values
   h. Sleep OM_DECAY_SLEEP_MS between segments
4. Log statistics: processed, changed, compressed, fingerprinted
```

### Batch Processing

```python
# Decay processes memories in batches
batch_size = floor(segment_size × OM_DECAY_RATIO)  # e.g., 3% per cycle
random_start = random(0, segment_size - batch_size)
batch = memories[random_start:random_start + batch_size]

# Distribute across threads
threads = OM_DECAY_THREADS (default: 3)
per_thread = batch_size / threads

# Parallel processing for performance
await Promise.all(threads.map(process_batch))
```

This ensures decay doesn't overload the system.

## Monitoring Decay

### Decay Logs

Watch decay process in action:

```bash
# Typical decay cycle output
[decay-2.0] 87/2891 | tiers: hot=342 warm=1456 cold=1093 | compressed=12 fingerprinted=3 | 1247.3ms across 15 segments
```

**Interpretation**:

- `87/2891`: 87 memories changed out of 2891 processed
- `hot=342`: 342 memories in hot tier
- `warm=1456`: 1456 memories in warm tier
- `cold=1093`: 1093 memories in cold tier
- `compressed=12`: 12 vectors compressed
- `fingerprinted=3`: 3 memories fingerprinted
- `1247.3ms`: Processing time
- `15 segments`: Memory segments processed

### Query-Time Reinforcement Logs

```bash
# When memory is accessed
[decay-2.0] regenerated/reinforced memory mem_abc123def456
```

Indicates automatic regeneration or reinforcement occurred.

## Best Practices

### Trust the Tiered System

The hot/warm/cold classification is automatic and intelligent:

```python
# Don't manually set decay_lambda on individual memories
# The tier system handles it automatically based on:
# - Recency (last_seen_at)
# - Activity (coactivations)
# - Importance (salience)
```

### Configure Thresholds Appropriately

Adjust based on your use case:

```bash
# Long-term knowledge base
OM_DECAY_COLD_THRESHOLD=0.15  # Keep more memories unfingerpinted

# Short-term cache
OM_DECAY_COLD_THRESHOLD=0.35  # Aggressive fingerprinting

# Balanced (default)
OM_DECAY_COLD_THRESHOLD=0.25
```

### Enable Reinforcement

Keep useful memories alive:

```bash
# Recommended for all use cases
OM_DECAY_REINFORCE_ON_QUERY=true

# Prevents frequently queried memories from fading
```

### Monitor Tier Distribution

Check if distribution matches your use case:

```python
# Get stats
stats = om.get_stats()

# Check tier distribution in logs
# Healthy distribution example:
# hot=20% (active recent memories)
# warm=50% (generally accessible)
# cold=30% (archived but retrievable)

# Adjust OM_DECAY_COLD_THRESHOLD if needed
```

### Tune Compression Aggressiveness

Control storage vs. fidelity tradeoff:

```bash
# Preserve more fidelity
OM_MIN_VECTOR_DIM=128  # Compress less aggressively
OM_SUMMARY_LAYERS=3    # More detailed summaries

# Maximize storage savings
OM_MIN_VECTOR_DIM=64   # Compress more
OM_SUMMARY_LAYERS=1    # Minimal summaries
```

## Next Steps

- Understand [HSG Architecture in HMD v2](/docs/concepts/hmd-v2)
- Learn about [Brain Sectors](/docs/concepts/sectors) and sector-specific decay
- Explore [Reinforcement API](/docs/api/reinforce)
- Configure [Environment Variables](/docs/advanced/environment-variables)

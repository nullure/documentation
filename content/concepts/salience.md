---
title: Salience | OpenMemory
description: Understand how OpenMemory calculates Salience (importance) to determine what to keep and what to forget.
keywords: salience, memory importance, ai memory retention, hmd v2 salience
---

# Salience

**Salience** is the measure of how "important" a memory is. In OpenMemory, salience determines:
1.  **Retrieval Priority**: High salience memories are more likely to be recalled.
2.  **Decay Resistance**: High salience memories decay slower.

## Calculation

Salience is calculated based on several factors:

1.  **Recency**: Newer memories are more salient.
2.  **Frequency**: Memories accessed often gain salience.
3.  **Emotional Intensity**: Memories with strong sentiment scores (positive or negative) are boosted.
4.  **Explicit Priority**: You can manually set importance.

## Manual Control

You can override the calculated salience when adding a memory:

```typescript
await mem.add("Critical system password", {
  salience: 1.0 // Maximum importance, will stick around
});
```

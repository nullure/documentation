---
title: Temporal Knowledge Graph | OpenMemory
description: Learn how OpenMemory's Temporal Knowledge Graph tracks facts over time. Understand valid_from, valid_to, and memory evolution.
keywords: temporal knowledge graph, time-aware ai, temporal memory, knowledge graph evolution, openmemory graph
---

# Temporal Knowledge Graph

OpenMemory goes beyond static vector storage by implementing a **Temporal Knowledge Graph**. This allows it to understand how facts change over time.

## Concepts

### Temporal Facts
A fact in OpenMemory is a triple (Subject, Predicate, Object) with a validity period.

- **valid_from**: The start time when this fact became true.
- **valid_to**: The end time when this fact ceased to be true (or `null` if currently true).

### Evolution
When you add a new fact that contradicts an existing one (e.g., "The CEO is Alice" vs "The CEO is Bob"), OpenMemory automatically:
1.  Detects the conflict based on the subject and predicate.
2.  "Closes" the old fact by setting its `valid_to` date to the new fact's `valid_from`.
3.  Adds the new fact as the current truth.

## Usage

### Adding a Temporal Fact

```typescript
await mem.addFact({
  subject: "User",
  predicate: "current_city",
  object: "New York",
  validFrom: "2023-01-01"
});
```

### Querying History

You can ask questions about the past:

```typescript
// "Where did I live in 2022?"
const result = await mem.query("current city", {
  time: "2022-06-01" 
});
```

### Timeline Reconstruction

Retrieve the full history of a subject:

```typescript
const history = await mem.getFactHistory("User", "current_city");
// Returns:
// [
//   { object: "London", validFrom: "2020...", validTo: "2023..." },
//   { object: "New York", validFrom: "2023...", validTo: null }
// ]
```

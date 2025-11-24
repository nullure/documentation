---
title: Associations | OpenMemory
description: Learn how OpenMemory links memories together using graph-based associations and waypoints.
keywords: memory associations, knowledge graph, waypoints, graph rag, openmemory graph
---

# Associations

OpenMemory doesn't just store isolated facts; it builds a **Graph of Associations**.

## How it works

When a new memory is added, OpenMemory:
1.  **Extracts Entities**: Identifies people, places, and concepts.
2.  **Finds Waypoints**: Looks for existing "Waypoints" (graph nodes) that match these entities.
3.  **Creates Edges**: Links the new memory to these waypoints.

## The Waypoint Graph

This graph structure allows for "Multi-hop Retrieval".

*   **Query**: "Who is Alice?"
*   **Hop 1**: Find node "Alice".
*   **Hop 2**: Find memories linked to "Alice" (e.g., "Alice is the CEO").
*   **Hop 3**: Find memories linked to "CEO" (e.g., "The CEO manages the roadmap").

This allows the agent to understand context that isn't explicitly stated in a single memory.

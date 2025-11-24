---
title: LangGraph Mode | OpenMemory
description: Advanced guide on using OpenMemory as a state persistence layer for LangGraph agents.
keywords: langgraph, agent state, persistence, checkpointer, openmemory langgraph
---

# LangGraph Mode

OpenMemory can operate in a special "LangGraph Mode" where it acts as the persistence layer for your LangGraph agents.

## Why use OpenMemory with LangGraph?

Standard LangGraph checkpointers (like SQLiteSaver) just save the state blob. OpenMemory does more:
1.  **Semantic Indexing**: It indexes the *content* of the state, allowing you to search for past states by meaning.
2.  **Temporal Graph**: It maps state transitions to a timeline.

## Configuration

To enable this mode, use the `OpenMemorySaver` class provided in the Python SDK.

```python
from langgraph.checkpoint.openmemory import OpenMemorySaver
```

See the [LangGraph API Reference](/docs/api/langgraph) for implementation details.

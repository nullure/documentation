---
title: LangGraph API | OpenMemory
description: API reference for using OpenMemory as a LangGraph Checkpointer. Persist agent state and enable time-travel debugging.
keywords: langgraph api, langgraph checkpointer, agent state persistence, openmemory langgraph, time travel debugging
---

# LangGraph API

OpenMemory implements the LangGraph `CheckpointSaver` interface, allowing you to persist the state of your stateful graphs (agents) automatically.

## Python Usage

```python
from langgraph.checkpoint.openmemory import OpenMemorySaver
from openmemory import OpenMemory
from langgraph.graph import StateGraph

# 1. Initialize Memory
mem = OpenMemory()

# 2. Create Checkpointer
checkpointer = OpenMemorySaver(mem)

# 3. Compile Graph with Checkpointer
workflow = StateGraph(...)
# ... define nodes ...
app = workflow.compile(checkpointer=checkpointer)

# 4. Run with Thread ID
config = {"configurable": {"thread_id": "thread_1"}}
app.invoke({"messages": ["Hi"]}, config=config)
```

## Features

### State Persistence
Every step of your agent's execution is saved to OpenMemory. If the process crashes, you can resume exactly where you left off.

### Time Travel
You can query past states of the agent using OpenMemory's temporal graph features.

```python
# Get state from 5 minutes ago
history = mem.get_state_history("thread_1", time_delta="-5m")
```

### Human-in-the-loop
Because state is persisted, you can pause execution, wait for human approval, and then resume the graph using the same `thread_id`.

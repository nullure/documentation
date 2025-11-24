---
title: Agents Example | OpenMemory
description: Learn how to build autonomous agents with long-term memory using OpenMemory.
keywords: ai agents, autonomous agents, agent memory, openmemory examples
---

# Building Agents with Memory

Agents need memory to be truly autonomous. Without it, they are just loops.

## The Loop

A memory-enabled agent loop looks like this:

1.  **Observe**: Receive input from environment.
2.  **Recall**: Query OpenMemory for relevant past experiences.
3.  **Plan**: Use LLM to decide action, conditioned on memory.
4.  **Act**: Execute tool or API call.
5.  **Reflect**: Store the result and the reasoning back into OpenMemory.

## Code Snippet

```typescript
async function agentLoop(input: string) {
  const context = await mem.query(input);
  const plan = await llm.plan(input, context);
  const result = await tools.execute(plan);
  await mem.add(`Action: ${plan}, Result: ${result}`);
}
```

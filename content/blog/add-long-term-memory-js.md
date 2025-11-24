---
title: Add long-term memory to your AI agent (JS example)
description: Learn how to add persistent, local-first memory to your Node.js AI agent using OpenMemory. No backend required.
keywords: ai memory js, nodejs ai agent, long-term memory javascript, openmemory tutorial, local ai memory
date: 2025-11-24
author: OpenMemory Team
---

# Add long-term memory to your AI agent (JS example)

Building an AI agent that remembers user preferences and past interactions is crucial for creating a personalized experience. In this guide, we'll show you how to add persistent, local-first memory to a Node.js agent using **OpenMemory**.

## Why OpenMemory?

Unlike vector databases which just store embeddings, OpenMemory is a **Cognitive Engine**. It manages:
- **Decay**: Old memories fade unless reinforced.
- **Sectors**: Separates episodic (events) from semantic (facts) memory.
- **Time**: Tracks when facts change (Temporal Knowledge Graph).

## Step 1: Install

```bash
npm install openmemory-js
```

## Step 2: Initialize

```javascript
import { OpenMemory } from "openmemory-js";

// Initialize standalone memory (creates ./agent.db)
const memory = new OpenMemory({ path: "./agent.db" });
```

## Step 3: The Memory Loop

In your agent's main loop, you should query memory *before* generating a response, and store the interaction *afterwards*.

```javascript
async function chat(userMessage) {
  // 1. Recall relevant context
  const context = await memory.query(userMessage);
  
  // 2. Generate Response (pseudo-code)
  const response = await llm.generate(userMessage, context);
  
  // 3. Store the interaction
  await memory.add(`User said: ${userMessage}`);
  await memory.add(`Agent replied: ${response}`);
  
  return response;
}
```

## Conclusion

With just a few lines of code, your agent now has a persistent brain that lives right in your project folder. No API keys or monthly fees required.

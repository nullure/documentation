---
title: Node.js Assistant Example | OpenMemory
description: Build a personal assistant in Node.js with OpenMemory.
keywords: nodejs assistant, ai assistant, javascript memory, openmemory node
---

# Node.js Assistant

A personal assistant script that tracks your tasks.

```typescript
import { OpenMemory } from "openmemory-js";

const mem = new OpenMemory();

async function addTask(task: string) {
  await mem.add(`Task: ${task}`, { tags: ["todo"] });
  console.log("Task added.");
}

async function whatToDo() {
  const tasks = await mem.query("What do I need to do?", { k: 3 });
  console.log("Here are your top tasks:");
  tasks.forEach(t => console.log("- " + t.text));
}

// Usage
await addTask("Buy milk");
await whatToDo();
```

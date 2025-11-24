---
title: Vercel AI SDK Integration | OpenMemory
description: Integrate OpenMemory with Vercel AI SDK to add long-term memory to your Next.js AI applications.
keywords: vercel ai sdk memory, nextjs ai memory, openmemory vercel, ai sdk integration, persistent memory nextjs
---

# Vercel AI SDK Integration

OpenMemory integrates seamlessly with the [Vercel AI SDK](https://sdk.vercel.ai/docs) to provide long-term memory for your AI applications.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install openmemory-js ai @ai-sdk/openai
    ```

2.  **Initialize Memory**
    ```typescript
    import { OpenMemory } from "openmemory-js";
    
    // Initialize in your route handler or server component
    const memory = new OpenMemory({ path: "./memory.sqlite" });
    ```

## Example: Next.js Route Handler

Here is how to inject memory into a chat completion:

```typescript
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { OpenMemory } from "openmemory-js";

const memory = new OpenMemory();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Retrieve relevant context
  const context = await memory.query(lastMessage);
  
  // 2. Add context to system prompt
  const systemPrompt = `
    You are a helpful assistant.
    Relevant memories: ${JSON.stringify(context)}
  `;

  // 3. Generate response
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: systemPrompt,
    messages,
    onFinish: async (completion) => {
      // 4. Save interaction
      await memory.add(`User: ${lastMessage}`);
      await memory.add(`Assistant: ${completion.text}`);
    }
  });

  return result.toDataStreamResponse();
}
```

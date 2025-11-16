---
title: Vercel AI SDK (Optional)
description: Plug-and-play OpenMemory integration for Vercel AI SDK apps.
---

# Optional OpenMemory API Integration for Vercel AI SDK

Goal: let existing Vercel AI SDK apps keep their current setup and optionally pull/store memory via simple HTTP calls.

## Setup

Set environment variables in your app (Vercel or local):

```
OM_BASE_URL=https://your-openmemory-host
OM_API_KEY=your-api-key
```

## Quick Usage (Next.js Route Handler)

```ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = body.user?.id;
  const query = (body.messages || []).map((m: any) => m.content).join('\n');

  // 1) Query OpenMemory for relevant context
  const mem = await fetch(`${process.env.OM_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, query, k: 8 }),
  }).then((r) => r.json());

  const messages = [
    ...(body.messages || []),
    mem?.result
      ? {
          role: 'system',
          content: `Relevant memory (OpenMemory):\n${mem.result}`,
        }
      : null,
  ].filter(Boolean);
```

## Install

    Install the Vercel AI SDK and OpenAI provider in your app:

    ```
    npm i ai @ai-sdk/openai
    ```

    ## Setup
      method: 'POST',
    ## Quick Usage (Next.js Route Handler)
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
    ```ts
    // app/api/chat/route.ts
    import { streamText } from "ai";
    import { createOpenAI } from "@ai-sdk/openai";

    export const runtime = "edge";

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });

    async function fetchOpenMemoryContext(messages: any[], userId?: string) {
      const query = (messages || []).map((m) => m?.content || "").join("\n");
      if (!query) return "";
      const r = await fetch(`${process.env.OM_BASE_URL}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, query, k: 8 }),
      });
      if (!r.ok) return "";
      const data = await r.json();
      return data?.result || "";
    }

    export async function POST(req: Request) {
      const body = await req.json();
      const messages = Array.isArray(body?.messages) ? body.messages : [];
      const userId: string | undefined = body?.user?.id;

      const memory = await fetchOpenMemoryContext(messages, userId);
      const augmented = memory
        ? [{ role: "system", content: `Relevant memory (OpenMemory):\n${memory}` }, ...messages]
        : messages;

      const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const result = await streamText({
        model: openai(modelName),
        messages: augmented as any,
      });

      return result.toAIStreamResponse();
    }
    ```

- Latency: the `/query` endpoint returns a compact bullet-list; typical overhead < 70ms in local tests.

  - Works with Edge Functions and the Vercel AI SDK streaming helpers.

- `POST /query`: `{ user_id?, query: string, k?: number }` → `{ result: string, matches: [...] }`
- `POST /memories`: `{ user_id?, content: string, tags?: string[], metadata?: any }` → stored memory record

## Future

- Helper utilities (memory.store/query) package.
- Hybrid cache (e.g., Vercel KV) for sub-10ms recall.
- Event hooks to trigger reflection on session end.

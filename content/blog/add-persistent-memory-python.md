---
title: Add persistent memory to your Python LLM app
description: A step-by-step guide to adding local, long-term memory to Python AI applications using OpenMemory.
keywords: python ai memory, llm memory python, openmemory python, local vector db, ai agent memory
date: 2025-11-24
author: OpenMemory Team
---

# Add persistent memory to your Python LLM app

Python is the language of AI, but most LLM apps suffer from amnesia. They forget everything as soon as the session ends. Let's fix that with **OpenMemory**.

## The Problem with Vector DBs

Using a raw vector database (like Chroma or Pinecone) for memory is hard. You have to manually handle:
- Chunking
- Embedding
- Relevance scoring
- Cleaning up old data

OpenMemory handles all of this automatically.

## Quick Setup

```bash
pip install openmemory-py
```

## Example: A Personal Assistant

```python
from openmemory import OpenMemory

# Initialize
mem = OpenMemory()

# Teach it something
mem.add("My birthday is October 5th")

# Ask it later
print(mem.query("When is my birthday?"))
```

## Advanced: Temporal Facts

OpenMemory tracks *when* things are true.

```python
mem.add_fact("User", "status", "student", valid_from="2020")
mem.add_fact("User", "status", "employed", valid_from="2024")
```

Now your agent knows the user *was* a student but is *now* employed.

---
title: Python Chatbot Example | OpenMemory
description: Build a stateful Python chatbot with long-term memory using OpenMemory.
keywords: python chatbot, ai chatbot, memory chatbot, openmemory python
---

# Python Chatbot

A simple CLI chatbot that remembers you.

```python
from openmemory import OpenMemory
import sys

mem = OpenMemory()

print("Bot: Hello! I'm listening.")

while True:
    user_input = input("You: ")
    if user_input.lower() == "exit": break
    
    # 1. Recall
    context = mem.query(user_input)
    context_str = "\n".join([m.text for m in context])
    
    # 2. Generate (Mock LLM)
    print(f"Bot (Thinking about): {context_str}")
    print("Bot: I've noted that.")
    
    # 3. Store
    mem.add(user_input)
```

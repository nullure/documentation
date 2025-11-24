---
title: Using OpenMemory with Claude Desktop MCP
description: Give Claude long-term memory using the OpenMemory MCP server. A complete guide to setting up Model Context Protocol.
keywords: claude desktop memory, mcp server, openmemory mcp, claude ai tools, persistent memory claude
date: 2025-11-24
author: OpenMemory Team
---

# Using OpenMemory with Claude Desktop MCP

Claude Desktop is powerful, but it forgets everything when you close a chat. OpenMemory fixes this via the **Model Context Protocol (MCP)**.

## What is MCP?
MCP is a standard that lets Claude connect to local tools. OpenMemory provides an MCP server that gives Claude a long-term brain.

## Setup Guide

1.  **Install OpenMemory**:
    ```bash
    npm install -g openmemory-js
    ```

2.  **Configure Claude**:
    Add this to your config file:
    ```json
    "openmemory": {
      "command": "npx",
      "args": ["-y", "openmemory-js", "mcp"]
    }
    ```

3.  **Chat**:
    Open Claude and say: "Please remember that my favorite color is blue."
    Claude will use the `openmemory_store` tool to save this.

    Next week, ask: "What is my favorite color?"
    Claude will use `openmemory_query` to recall it.

## Why this changes everything
This turns Claude from a stateless chatbot into a **learning assistant** that grows with you. It can remember your coding style, project details, and personal preferences forever.

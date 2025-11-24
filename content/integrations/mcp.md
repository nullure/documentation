---
title: MCP Integration | OpenMemory
description: Use OpenMemory with Claude Desktop, Cursor, and Windsurf via the Model Context Protocol (MCP). Give your AI assistant a persistent brain.
keywords: mcp, model context protocol, claude desktop memory, cursor memory, openmemory mcp, ai tools
---

# MCP Integration

OpenMemory implements the **Model Context Protocol (MCP)**, allowing it to serve as a memory layer for AI assistants like Claude Desktop, Cursor, and Windsurf.

## What is MCP?

MCP is an open standard that connects AI models to external data and tools. By running OpenMemory as an MCP server, you give your AI assistant the ability to:
- **Read** from your long-term memory.
- **Write** new memories as you interact.
- **Search** for relevant context automatically.

## Setup

### Claude Desktop

1.  **Install OpenMemory** (if not already running):
    ```bash
    npm install -g openmemory-js
    ```

2.  **Configure Claude Desktop**:
    Edit your `claude_desktop_config.json`:
    ```json
    {
      "mcpServers": {
        "openmemory": {
          "command": "npx",
          "args": ["-y", "openmemory-js", "mcp"]
        }
      }
    }
    ```

3.  **Restart Claude Desktop**. You should see the OpenMemory tools available.

## Available Tools

- `openmemory_store`: Save a new memory.
- `openmemory_query`: Search for memories.
- `openmemory_list`: List recent memories.
- `openmemory_reinforce`: Strengthen a specific memory.

## Example Usage

**User**: "Remember that the API key for the staging server is `sk-staging-123`."

**Claude (using `openmemory_store`)**: *Calls tool to save this fact.*

**User**: "What's the staging key?"

**Claude (using `openmemory_query`)**: *Searches memory, retrieves the key, and answers.*

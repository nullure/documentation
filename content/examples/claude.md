---
title: Claude Desktop Example | OpenMemory
description: Example of using OpenMemory with Claude Desktop via MCP.
keywords: claude desktop, mcp, openmemory example, claude memory
---

# Claude Desktop Integration

This example shows how to use OpenMemory as a "second brain" for Claude Desktop.

## Prerequisites

- Claude Desktop App installed.
- `openmemory-js` installed globally.

## Configuration

Add to `claude_desktop_config.json`:

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

## Workflow

1.  **Teach**: "Claude, remember that I am working on the 'Project X' repo located at `/src/proj-x`."
2.  **Recall**: "Where is the Project X repo?"
3.  **Claude**: "According to my memory, Project X is located at `/src/proj-x`."

---
title: IDE Integration | OpenMemory
description: Integrate OpenMemory with VS Code, Cursor, and JetBrains IDEs. Add long-term memory to your coding workflow.
keywords: ide integration, vs code extension, cursor integration, openmemory ide, coding memory, developer tools
---

# IDE Integration

OpenMemory provides extensions and integrations for popular IDEs to bring long-term memory to your coding workflow. This allows your AI coding assistants to remember context across sessions.

## Cursor Integration

Cursor is an AI-first code editor. You can connect OpenMemory to Cursor using the **Model Context Protocol (MCP)**.

### Setup

1.  **Install OpenMemory MCP Server**
    ```bash
    npm install -g openmemory-js
    ```

2.  **Configure Cursor**
    Go to **Cursor Settings > Features > MCP**.
    Add a new MCP server:
    - **Name**: `openmemory`
    - **Type**: `command`
    - **Command**: `npx -y openmemory-js mcp`

3.  **Usage**
    In Cursor Chat (Cmd+L), you can now use `@openmemory` or simply ask natural language questions.
    
    > "What was the decision we made about the auth schema last week?"

    Cursor will automatically query OpenMemory and use the retrieved context.

## VS Code Extension

The OpenMemory VS Code extension allows you to save code snippets and context directly to your memory.

### Installation

1.  Open VS Code Extensions (Cmd+Shift+X).
2.  Search for **OpenMemory**.
3.  Install the extension.

### Features

- **Save Selection**: Highlight code, right-click, and select "OpenMemory: Save to Memory".
- **Query**: Use the command palette (Cmd+Shift+P) > "OpenMemory: Query" to find relevant snippets.

## JetBrains (IntelliJ / PyCharm)

*Coming Soon* - The JetBrains plugin is currently in beta. [Sign up for early access](https://openmemory.ai/waitlist).

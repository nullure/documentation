---
title: MCP Tools
description: model context protocol tools for openmemory with user isolation
---

# mcp tools

the mcp server exposes lightweight tools to let agents and ides talk to openmemory over json-rpc. all tools optionally accept `user_id` to isolate data per user.

transport

- http: `POST /mcp` with a json-rpc 2.0 payload
- stdio: use the built server in `backend/src/ai/mcp.ts`

tools

1. `openmemory.query`

   - params: `{ query: string, k?: number, sector?: 'episodic'|'semantic'|'procedural'|'emotional'|'reflective', min_salience?: number, user_id?: string }`
   - returns: `{ content: [{type:'text', text:string}, {type:'text', text:string}] }` where the second text is a json payload with matches

2. `openmemory.store`

   - params: `{ content: string, tags?: string[], metadata?: Record<string,unknown>, user_id?: string }`
   - returns: `{ id: string, primary_sector: string, sectors: string[], user_id?: string }`

3. `openmemory.list`

   - params: `{ limit?: number, sector?: 'episodic'|'semantic'|'procedural'|'emotional'|'reflective', user_id?: string }`
   - returns: summarized recent memories (id, sector, salience, preview, user)

4. `openmemory.get`
   - params: `{ id: string, include_vectors?: boolean, user_id?: string }`
   - returns: full memory payload; when `user_id` is set, access is validated

For stdio mode (Claude Desktop):

```bash
node backend/dist/ai/mcp.js
```

#### Claude Code Integration

Claude Code supports HTTP MCP servers natively. Since OpenMemory provides an HTTP endpoint at `/mcp`, you can connect directly without additional configuration.

**Method 1: Using CLI (Recommended)**

```bash
# Add globally (available in all projects)
claude mcp add --transport http --scope user openmemory http://localhost:3000/mcp

# Or add to current project only
claude mcp add --transport http openmemory http://localhost:3000/mcp
```

**Method 2: Manual Configuration**

Add to `~/.claude.json` (global) or `.mcp.json` (project-specific):

```json
{
  "mcpServers": {
    "openmemory": {
      "type": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Then restart Claude Code.

notes

- implementation: `backend/src/ai/mcp.ts`
- user isolation flows into `add_hsg_memory`/`hsg_query` and `q.all_mem_by_user`
- for ide integrations, see the vscode extension in `IDE/`

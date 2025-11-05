---
title: IDE Integration
description: Store and retrieve IDE events, sessions, and coding patterns
---

# IDE Integration

OpenMemory provides specialized endpoints for IDE extensions to store coding events, manage sessions, and detect patterns in developer workflows.

## Store IDE Event

Store an IDE event as a memory with automatic sector classification.

### Endpoint

```
POST /api/ide/events
```

### Request

```typescript
{
  event_type: string
  file_path?: string
  content?: string
  session_id?: string
  metadata?: Record<string, unknown>
}
```

### Parameters

| Parameter    | Type   | Required | Description                                                |
| ------------ | ------ | -------- | ---------------------------------------------------------- |
| `event_type` | string | ✅       | Event type (e.g., "file_open", "code_edit", "debug_start") |
| `file_path`  | string | ❌       | File path being accessed                                   |
| `content`    | string | ❌       | Code snippet or event details                              |
| `session_id` | string | ❌       | Session identifier                                         |
| `metadata`   | object | ❌       | Additional metadata                                        |

### Response

```typescript
{
  success: boolean
  memory_id: string
  primary_sector: string
  sectors: string[]
}
```

### Example

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key", base_url="http://localhost:8080")

# Store code edit event
result = om.ide_store_event(
    event_type="code_edit",
    file_path="src/components/Button.tsx",
    content="Added error handling to onClick handler",
    session_id="session_20250105_abc123",
    metadata={"language": "typescript", "line_count": 45}
)

print(f"Stored as memory: {result['memory_id']}")
print(f"Classified as: {result['primary_sector']}")
```

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  baseUrl: 'http://localhost:8080',
  apiKey: 'your_api_key',
});

const result = await om.ideStoreEvent({
  event_type: 'file_open',
  file_path: 'src/api/users.ts',
  session_id: 'session_xyz',
  metadata: { project: 'backend-api' },
});
```

## Query IDE Context

Retrieve relevant IDE memories based on a query with optional filtering.

### Endpoint

```
POST /api/ide/context
```

### Request

```typescript
{
  query: string
  k?: number
  limit?: number
  session_id?: string
  file_path?: string
}
```

### Response

```typescript
{
  success: boolean;
  memories: Array<{
    memory_id: string;
    content: string;
    primary_sector: string;
    sectors: string[];
    score: number;
    salience: number;
    last_seen_at: number;
    path: string[];
  }>;
  total: number;
  query: string;
}
```

### Example

```python
# Query IDE context
result = om.ide_query_context(
    query="authentication implementation",
    k=10,
    session_id="session_xyz"  # Filter to current session
)

print(f"Found {result['total']} relevant memories")
for mem in result["memories"]:
    print(f"[{mem['score']:.2f}] {mem['content'][:80]}...")
```

```typescript
const result = await om.ideQueryContext('error handling patterns', {
  k: 5,
  file_path: 'src/api', // Filter by file path
});

result.memories.forEach((m) => {
  console.log(`${m.score.toFixed(2)}: ${m.content}`);
});
```

## Start IDE Session

Initialize a new IDE session for tracking developer activity.

### Endpoint

```
POST /api/ide/session/start
```

### Request

```typescript
{
  user_id?: string
  project_name?: string
  ide_name?: string
}
```

### Response

```typescript
{
  success: boolean;
  session_id: string;
  memory_id: string;
  started_at: number;
  user_id: string;
  project_name: string;
  ide_name: string;
}
```

### Example

```python
# Start new IDE session
session = om.ide_start_session(
    user_id="developer_123",
    project_name="openmemory-dashboard",
    ide_name="vscode"
)

print(f"Session ID: {session['session_id']}")
print(f"Started at: {session['started_at']}")

# Use session_id in subsequent events
om.ide_store_event(
    event_type="file_open",
    file_path="src/App.tsx",
    session_id=session["session_id"]
)
```

```typescript
const session = await om.ideStartSession({
  user_id: 'dev_456',
  project_name: 'backend-api',
  ide_name: 'cursor',
});

console.log(`Session: ${session.session_id}`);

// Store events with session ID
await om.ideStoreEvent({
  event_type: 'debug_start',
  session_id: session.session_id,
});
```

## End IDE Session

Conclude an IDE session and generate statistics.

### Endpoint

```
POST /api/ide/session/end
```

### Request

```typescript
{
  session_id: string;
}
```

### Response

```typescript
{
  success: boolean
  session_id: string
  ended_at: number
  summary_memory_id: string
  statistics: {
    total_events: number
    sectors: Record<string, number>
    unique_files: number
    files: string[]
  }
}
```

### Example

```python
# End IDE session
result = om.ide_end_session("session_20250105_abc123")

print(f"Session ended at: {result['ended_at']}")
print(f"Total events: {result['statistics']['total_events']}")
print(f"Files touched: {result['statistics']['unique_files']}")

for sector, count in result["statistics"]["sectors"].items():
    print(f"  {sector}: {count} events")

print(f"\nFiles modified:")
for file in result["statistics"]["files"]:
    print(f"  - {file}")
```

```typescript
const result = await om.ideEndSession(session.session_id);

console.log(`Session statistics:`);
console.log(`- Events: ${result.statistics.total_events}`);
console.log(`- Files: ${result.statistics.unique_files}`);
```

## Get Session Patterns

Retrieve detected coding patterns from a session (procedural sector memories).

### Endpoint

```
GET /api/ide/patterns/:session_id
```

### Response

```typescript
{
  success: boolean;
  session_id: string;
  pattern_count: number;
  patterns: Array<{
    pattern_id: string;
    description: string;
    salience: number;
    detected_at: number;
    last_reinforced: number;
  }>;
}
```

### Example

```python
# Get coding patterns
patterns = om.ide_get_patterns("session_xyz")

print(f"Detected {patterns['pattern_count']} patterns:")
for pattern in patterns["patterns"]:
    print(f"\n[{pattern['salience']:.2f}] {pattern['description']}")
    print(f"  Detected: {pattern['detected_at']}")
```

```typescript
const patterns = await om.ideGetPatterns(sessionId);

patterns.patterns.forEach((p) => {
  console.log(`Pattern: ${p.description}`);
  console.log(`Salience: ${p.salience.toFixed(2)}`);
});
```

## Complete IDE Session Example

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_api_key", base_url="http://localhost:8080")

# Start session
session = om.ide_start_session(
    user_id="developer_123",
    project_name="my-app",
    ide_name="vscode"
)

session_id = session["session_id"]
print(f"Started session: {session_id}")

# Store various events
events = [
    ("file_open", "src/App.tsx", "Opening main app file"),
    ("code_edit", "src/App.tsx", "Added new useState hook"),
    ("file_save", "src/App.tsx", "Saved changes"),
    ("debug_start", None, "Started debugger"),
    ("file_open", "src/api/users.ts", "Checking API implementation"),
    ("code_edit", "src/api/users.ts", "Fixed authentication bug"),
    ("test_run", None, "Running unit tests")
]

for event_type, file_path, content in events:
    om.ide_store_event(
        event_type=event_type,
        file_path=file_path,
        content=content,
        session_id=session_id,
        metadata={"project": "my-app"}
    )

# Query context during development
context = om.ide_query_context(
    query="authentication implementation",
    k=5,
    session_id=session_id
)

print(f"\nRelevant context: {context['total']} memories")

# Check patterns
patterns = om.ide_get_patterns(session_id)
print(f"\nDetected patterns: {patterns['pattern_count']}")

# End session
summary = om.ide_end_session(session_id)

print(f"\n=== Session Summary ===")
print(f"Total events: {summary['statistics']['total_events']}")
print(f"Files modified: {summary['statistics']['unique_files']}")
print(f"Sectors: {summary['statistics']['sectors']}")
```

## TypeScript IDE Extension Example

```typescript
import OpenMemory from 'openmemory-js';
import * as vscode from 'vscode';

class OpenMemoryIDEExtension {
  private om: OpenMemory;
  private sessionId: string | null = null;

  constructor() {
    this.om = new OpenMemory({
      baseUrl: 'http://localhost:8080',
      apiKey: process.env.OPENMEMORY_API_KEY!,
    });
  }

  async startSession() {
    const session = await this.om.ideStartSession({
      user_id: vscode.env.machineId,
      project_name: vscode.workspace.name || 'unknown',
      ide_name: 'vscode',
    });

    this.sessionId = session.session_id;
    console.log(`Session started: ${this.sessionId}`);
  }

  async onFileOpen(document: vscode.TextDocument) {
    if (!this.sessionId) return;

    await this.om.ideStoreEvent({
      event_type: 'file_open',
      file_path: document.fileName,
      content: `Opened ${document.languageId} file`,
      session_id: this.sessionId,
      metadata: {
        language: document.languageId,
        line_count: document.lineCount,
      },
    });
  }

  async onFileEdit(
    document: vscode.TextDocument,
    changes: vscode.TextDocumentContentChangeEvent[],
  ) {
    if (!this.sessionId) return;

    const changeDescription = changes
      .map((c) => `Line ${c.range.start.line}: ${c.text.length} chars`)
      .join(', ');

    await this.om.ideStoreEvent({
      event_type: 'code_edit',
      file_path: document.fileName,
      content: changeDescription,
      session_id: this.sessionId,
    });
  }

  async getContext(query: string): Promise<any> {
    if (!this.sessionId) return { memories: [] };

    return await this.om.ideQueryContext(query, {
      k: 10,
      session_id: this.sessionId,
    });
  }

  async endSession() {
    if (!this.sessionId) return;

    const summary = await this.om.ideEndSession(this.sessionId);
    console.log(`Session ended. Events: ${summary.statistics.total_events}`);

    this.sessionId = null;
  }
}

// Usage in VS Code extension
const extension = new OpenMemoryIDEExtension();

export function activate(context: vscode.ExtensionContext) {
  // Start session on activation
  extension.startSession();

  // Track file opens
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => extension.onFileOpen(doc)),
  );

  // Track edits
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      extension.onFileEdit(e.document, e.contentChanges),
    ),
  );

  // Context provider command
  context.subscriptions.push(
    vscode.commands.registerCommand('openmemory.getContext', async () => {
      const query = await vscode.window.showInputBox({
        prompt: 'What are you looking for?',
      });

      if (query) {
        const context = await extension.getContext(query);
        // Display context in panel
      }
    }),
  );
}

export function deactivate() {
  extension.endSession();
}
```

## Event Types

Common IDE event types:

- `file_open` - File opened in editor
- `file_close` - File closed
- `file_save` - File saved
- `code_edit` - Code modified
- `debug_start` - Debugger started
- `debug_stop` - Debugger stopped
- `test_run` - Tests executed
- `build` - Build triggered
- `search` - Code search performed
- `refactor` - Refactoring operation
- `git_commit` - Git commit
- `error` - Error encountered

## Metadata Conventions

Useful metadata fields:

```typescript
{
  language: "typescript",
  project: "backend-api",
  branch: "feature/auth",
  line_count: 150,
  function_name: "handleLogin",
  error_type: "TypeError",
  test_status: "passed"
}
```

## Best Practices

1. **Always use session IDs** for temporal context
2. **Include file paths** for location-aware search
3. **Add meaningful metadata** for better filtering
4. **End sessions** to generate statistics
5. **Query context** before showing suggestions

## Related Endpoints

- [Add Memory](/docs/api/add-memory) - Store general memories
- [Query Memory](/docs/api/query) - Search memories
- [User Management](/docs/api/user-management) - Multi-user support

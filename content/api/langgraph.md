---
title: LangGraph Memory (LGM)
description: Persistent memory for LangGraph agents with automatic context management
---

# LangGraph Memory (LGM)

OpenMemory provides native integration with LangGraph, giving your agents persistent memory that survives across conversations and deployments.

## Overview

LangGraph Memory (LGM) endpoints provide:

- **Persistent storage** for agent memories across sessions
- **Automatic context retrieval** based on graph state
- **Reflection creation** for learning and adaptation
- **Namespace isolation** for multi-agent systems
- **Configuration management** for memory behavior

## Store Memory

Store a memory from a LangGraph node execution.

### Endpoint

```
POST /lgm/store
```

### Request Body

```json
{
  "namespace": "string (required) - Agent/graph namespace",
  "node_id": "string (required) - LangGraph node identifier",
  "content": "string (required) - Memory content to store",
  "metadata": {
    "state": "object (optional) - Graph state snapshot",
    "user_id": "string (optional) - User identifier"
  }
}
```

### Response

```json
{
  "ok": true,
  "id": "mem_abc123",
  "stored_at": "2025-01-15T10:30:00Z"
}
```

### Python Example

```python
from openmemory import OpenMemory

om = OpenMemory(
    api_key="your_api_key",
    base_url="http://localhost:8080"
)

# Store memory from LangGraph node
result = om.lgm_store(
    namespace="customer_support_agent",
    node_id="analyze_intent",
    content="User is asking about refund policy for damaged items",
    metadata={
        "state": {
            "conversation_id": "conv_123",
            "intent": "refund_inquiry",
            "sentiment": "frustrated"
        },
        "user_id": "user_456"
    }
)

print(f"Memory stored: {result['id']}")
```

### TypeScript Example

```typescript
import OpenMemory from 'openmemory-js';

const om = new OpenMemory({
  apiKey: 'your_api_key',
  baseUrl: 'http://localhost:8080',
});

// Store from LangGraph node
const result = await om.lgmStore({
  namespace: 'sales_agent',
  nodeId: 'qualify_lead',
  content: 'Lead expressed interest in enterprise plan',
  metadata: {
    state: {
      leadScore: 85,
      companySize: 'medium',
      industry: 'fintech',
    },
    userId: 'lead_789',
  },
});

console.log(`Stored: ${result.id}`);
```

### cURL Example

```bash
curl -X POST http://localhost:8080/lgm/store \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "my_agent",
    "node_id": "process_input",
    "content": "User prefers morning meetings",
    "metadata": {
      "user_id": "user_123"
    }
  }'
```

## Retrieve Memories

Retrieve relevant memories for a LangGraph node based on query.

### Endpoint

```
POST /lgm/retrieve
```

### Request Body

```json
{
  "namespace": "string (required) - Agent/graph namespace",
  "node_id": "string (required) - Current node identifier",
  "query": "string (required) - Query to find relevant memories",
  "limit": "number (optional, default: 10) - Max memories to return",
  "metadata": {
    "user_id": "string (optional) - Filter by user"
  }
}
```

### Response

```json
{
  "ok": true,
  "memories": [
    {
      "id": "mem_abc123",
      "content": "Relevant memory content",
      "score": 0.89,
      "created_at": "2025-01-15T10:30:00Z",
      "metadata": {
        "node_id": "previous_node",
        "user_id": "user_456"
      }
    }
  ],
  "count": 5
}
```

### Python Example

```python
# Retrieve relevant memories for current node
result = om.lgm_retrieve(
    namespace="customer_support_agent",
    node_id="generate_response",
    query="What do we know about this user's previous issues?",
    limit=5,
    metadata={"user_id": "user_456"}
)

print(f"Found {result['count']} relevant memories")

for memory in result['memories']:
    print(f"- [{memory['score']:.2f}] {memory['content']}")
```

### TypeScript Example

```typescript
// Retrieve context for node execution
const result = await om.lgmRetrieve({
  namespace: 'sales_agent',
  nodeId: 'personalize_pitch',
  query: "What are the lead's pain points and preferences?",
  limit: 10,
  metadata: { userId: 'lead_789' },
});

const context = result.memories.map((m) => m.content).join('\n');

console.log(`Context for personalization:\n${context}`);
```

## Get Graph Context

Get comprehensive context for entire graph execution including related memories.

### Endpoint

```
POST /lgm/context
```

### Request Body

```json
{
  "namespace": "string (required) - Agent/graph namespace",
  "query": "string (required) - Query for context retrieval",
  "limit": "number (optional, default: 50) - Max memories",
  "metadata": {
    "user_id": "string (optional) - Filter by user"
  }
}
```

### Response

```json
{
  "ok": true,
  "context": {
    "memories": [...],
    "summary": "Aggregated context summary",
    "key_points": ["point 1", "point 2", "point 3"],
    "relevant_nodes": ["node1", "node2"]
  },
  "total": 23
}
```

### Python Example

```python
# Get full context for graph execution
context = om.lgm_get_context(
    namespace="customer_support_agent",
    query="Summarize this user's history and preferences",
    limit=50,
    metadata={"user_id": "user_456"}
)

print("Context Summary:")
print(context['context']['summary'])

print("\nKey Points:")
for point in context['context']['key_points']:
    print(f"- {point}")

print(f"\nTotal relevant memories: {context['total']}")
```

### TypeScript Example

```typescript
// Get comprehensive context
const context = await om.lgmGetContext({
  namespace: 'sales_agent',
  query: 'Full history of lead interactions and outcomes',
  limit: 100,
  metadata: { userId: 'lead_789' },
});

console.log('Summary:', context.context.summary);
console.log('Relevant nodes:', context.context.relevant_nodes);
```

## Create Reflection

Create a reflective memory that learns from past experiences.

### Endpoint

```
POST /lgm/reflection
```

### Request Body

```json
{
  "namespace": "string (required) - Agent/graph namespace",
  "content": "string (required) - Reflection content",
  "metadata": {
    "pattern": "string (optional) - Pattern identified",
    "insight": "string (optional) - Key insight learned",
    "user_id": "string (optional) - User context"
  }
}
```

### Response

```json
{
  "ok": true,
  "id": "refl_xyz789",
  "sector": "reflective",
  "created_at": "2025-01-15T10:45:00Z"
}
```

### Python Example

```python
# Create reflection from agent learning
reflection = om.lgm_create_reflection(
    namespace="customer_support_agent",
    content="Users who mention 'urgent' in their first message typically need escalation to tier-2 support",
    metadata={
        "pattern": "urgency_detection",
        "insight": "early_escalation_improves_satisfaction",
        "confidence": 0.87
    }
)

print(f"Reflection created: {reflection['id']}")
print(f"Stored in sector: {reflection['sector']}")
```

### TypeScript Example

```typescript
// Create learning reflection
const reflection = await om.lgmCreateReflection({
  namespace: 'sales_agent',
  content:
    'Leads from fintech industry respond better to security-focused messaging',
  metadata: {
    pattern: 'industry_messaging',
    insight: 'security_emphasis_fintech',
    confidence: 0.92,
  },
});

console.log(`Reflection: ${reflection.id}`);
```

### cURL Example

```bash
curl -X POST http://localhost:8080/lgm/reflection \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "my_agent",
    "content": "Pattern observed: users prefer concise responses",
    "metadata": {
      "pattern": "response_style",
      "insight": "brevity_preference"
    }
  }'
```

## Get Configuration

Get current LangGraph memory configuration.

### Endpoint

```
GET /lgm/config
```

### Response

```json
{
  "namespace": "default",
  "max_context": 50,
  "reflective": true,
  "auto_summarize": true,
  "decay_settings": {
    "episodic": 0.15,
    "semantic": 0.05,
    "reflective": 0.25
  }
}
```

### Python Example

```python
# Get LGM configuration
config = om.lgm_get_config()

print(f"Default namespace: {config['namespace']}")
print(f"Max context memories: {config['max_context']}")
print(f"Reflective mode: {config['reflective']}")

if 'decay_settings' in config:
    print("\nDecay settings:")
    for sector, rate in config['decay_settings'].items():
        print(f"  {sector}: λ={rate}")
```

### TypeScript Example

```typescript
const config = await om.lgmGetConfig();

console.log('LGM Configuration:');
console.log(`- Namespace: ${config.namespace}`);
console.log(`- Max context: ${config.max_context}`);
console.log(`- Reflective: ${config.reflective}`);
```

### cURL Example

```bash
curl http://localhost:8080/lgm/config \
  -H "Authorization: Bearer your_api_key"
```

## Environment Configuration

Configure LangGraph memory behavior via environment variables:

```bash
# Default namespace for LGM operations
OM_LG_NAMESPACE=default

# Maximum memories to include in context
OM_LG_MAX_CONTEXT=50

# Enable reflective learning (true/false)
OM_LG_REFLECTIVE=true
```

See [Environment Variables](/docs/advanced/environment-variables) for full configuration.

## Integration with LangGraph

### Basic Agent Example

```python
from langgraph.graph import StateGraph, END
from openmemory import OpenMemory

# Initialize OpenMemory
om = OpenMemory(api_key="your_api_key")

# Define graph state
class AgentState(TypedDict):
    messages: list[str]
    context: str
    user_id: str

# Node: Retrieve context
async def get_context(state: AgentState):
    context = om.lgm_get_context(
        namespace="my_agent",
        query=state["messages"][-1],
        metadata={"user_id": state["user_id"]}
    )
    return {"context": context["context"]["summary"]}

# Node: Process and store
async def process(state: AgentState):
    response = await agent_logic(state)

    # Store interaction
    om.lgm_store(
        namespace="my_agent",
        node_id="process",
        content=f"User said: {state['messages'][-1]}. Agent responded: {response}",
        metadata={"user_id": state["user_id"]}
    )

    return {"messages": state["messages"] + [response]}

# Build graph
graph = StateGraph(AgentState)
graph.add_node("get_context", get_context)
graph.add_node("process", process)
graph.add_edge("get_context", "process")
graph.add_edge("process", END)
graph.set_entry_point("get_context")

agent = graph.compile()
```

### Advanced Pattern with Reflection

```python
# Node: Analyze patterns
async def analyze_patterns(state: AgentState):
    # Get historical context
    history = om.lgm_retrieve(
        namespace="my_agent",
        node_id="analyze_patterns",
        query="past user behaviors and preferences",
        limit=100,
        metadata={"user_id": state["user_id"]}
    )

    # Detect patterns
    pattern = detect_pattern(history["memories"])

    if pattern["confidence"] > 0.8:
        # Create reflection
        om.lgm_create_reflection(
            namespace="my_agent",
            content=pattern["description"],
            metadata={
                "pattern": pattern["type"],
                "insight": pattern["insight"],
                "confidence": pattern["confidence"]
            }
        )

    return state
```

## Best Practices

1. **Use namespaces** to isolate different agents or use cases
2. **Store node-level memories** for fine-grained context
3. **Retrieve before executing** to get relevant historical context
4. **Create reflections** for patterns and learnings
5. **Filter by user_id** for personalized multi-user agents
6. **Monitor context size** - use limit parameter appropriately
7. **Leverage auto-summarization** for large context sets

## Multi-Agent Systems

Use namespaces to manage multiple agents:

```python
# Agent 1: Customer support
om.lgm_store(
    namespace="support_agent",
    node_id="handle_inquiry",
    content="Resolved billing question",
    metadata={"user_id": "user_123"}
)

# Agent 2: Sales
om.lgm_store(
    namespace="sales_agent",
    node_id="qualify_lead",
    content="Lead interested in enterprise plan",
    metadata={"user_id": "lead_456"}
)

# Agent 3: Coordinator (can access both)
support_context = om.lgm_retrieve(
    namespace="support_agent",
    query="user history",
    metadata={"user_id": "user_123"}
)

sales_context = om.lgm_retrieve(
    namespace="sales_agent",
    query="lead information",
    metadata={"user_id": "lead_456"}
)
```

## Next Steps

- Learn about [User Management](/docs/api/user-management) for multi-user agents
- Explore [Compression API](/docs/api/compression) to optimize memory storage
- See [Environment Variables](/docs/advanced/environment-variables) for configuration
- Read about [Brain Sectors](/docs/concepts/sectors) for memory organization

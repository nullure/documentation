---
title: Memory Sectors
description: Organize memories into hierarchical, contextual groups like your brain naturally does
---

# Memory Sectors

Memory Sectors are OpenMemory's way of organizing memories into hierarchical, contextual groups - similar to how your brain organizes memories into categories and contexts.

## What are Memory Sectors?

A **Memory Sector** is a logical container that groups related memories together. Think of it as a folder, but with semantic relationships and automatic organization based on content similarity and access patterns.

### Key Characteristics

- **Hierarchical**: Sectors can contain sub-sectors
- **Semantic**: Automatically grouped by content similarity
- **Dynamic**: Grow and split as needed
- **Connected**: Cross-sector links via waypoints

## Architecture

```
Root Sector
├── Work
│   ├── Project A
│   │   ├── Technical Docs
│   │   └── Meeting Notes
│   └── Project B
├── Personal
│   ├── Health
│   └── Finance
└── Learning
    ├── AI/ML
    └── Programming
```

## How Sectors Work

### Automatic Sector Creation

When you add memories, OpenMemory automatically:

1. **Analyzes content** using embeddings
2. **Finds similar memories** in existing sectors
3. **Assigns to appropriate sector** or creates new one
4. **Updates sector metadata** with new topics

```python
from openmemory import OpenMemory

om = OpenMemory(base_url="http://localhost:8080")

# Memory is automatically assigned to appropriate brain sector
result = om.add(
    content="Python decorators are powerful for metaprogramming"
)

print(f"Assigned to sector: {result['primary_sector']}")
```

### Manual Sector Assignment

You can explicitly assign memories to specific brain sectors:

```python
# Add to semantic sector (facts & knowledge)
om.add(
    content="List comprehensions are faster than loops in Python",
    metadata={"sector": "semantic"}
)

# Add to episodic sector (events & experiences)
om.add(
    content="Deployed version 2.0 to production at 3pm today",
    metadata={"sector": "episodic"}
)

# Query within a specific sector
result = om.query_sector(
    query="performance tips",
    sector="semantic"
)
```

## Brain Sectors (HMD v2)

OpenMemory uses 5 brain-inspired sectors based on the HMD v2 specification:

### 1. **Episodic** - Event Memories

- Temporal experiences and events
- What happened, when it happened
- Example: "Met with client at 3pm yesterday"

### 2. **Semantic** - Facts & Knowledge

- Factual information, preferences, concepts
- Timeless knowledge
- Example: "Python uses dynamic typing"

### 3. **Procedural** - Habits & Patterns

- Behavioral patterns, triggers, workflows
- How things are done
- Example: "User always commits before switching branches"

### 4. **Emotional** - Sentiment States

- Emotional context and sentiment
- Feelings and reactions
- Example: "User expressed frustration with build times"

### 5. **Reflective** - Meta-Memory & Logs

- System logs, audit trails, meta-information
- Memory about memories
- Example: "Recalculated sector weights at midnight"

## Sector Properties

### Decay Rates

Each sector has its own decay characteristics:

```python
# Get sector information
sectors_info = om.get_sectors()

print(sectors_info)
# {
#   "episodic": {"decay_lambda": 0.15, "count": 230},
#   "semantic": {"decay_lambda": 0.05, "count": 450},
#   "procedural": {"decay_lambda": 0.08, "count": 120},
#   "emotional": {"decay_lambda": 0.20, "count": 89},
#   "reflective": {"decay_lambda": 0.25, "count": 340}
# }
```

## Sector Operations

### Query by Sector

```python
# Query specific brain sectors
episodic_memories = om.query_sector("what happened yesterday", "episodic")
semantic_facts = om.query_sector("Python features", "semantic")
procedures = om.query_sector("user workflow", "procedural")
emotions = om.query_sector("frustrations", "emotional")
logs = om.query_sector("system events", "reflective")
```

### List All Memories by Sector

```python
# Get all memories from a sector
result = om.get_by_sector("semantic", limit=100)

for memory in result["items"]:
    print(memory["content"])
)

# Merge sectors
om.merge_sectors(
    source="Old Project",
    target="Archive"
)
```

### Delete Sectors

```python
# Soft delete (marks as archived)
om.archive_sector("Old Project")

# Hard delete (removes all memories)
om.delete_sector("Temporary", hard=True)
```

## Sector Strategies

### By Domain

Organize by knowledge domains:

```
Knowledge Base
├── Technical
│   ├── Backend
│   ├── Frontend
│   └── DevOps
├── Business
│   ├── Marketing
│   └── Sales
└── Operations
```

### By Time

Organize chronologically:

```
Timeline
├── 2025
│   ├── Q1
│   └── Q2
└── 2024
    └── Q4
```

### By Project

Organize by projects:

```
Projects
├── Active
│   ├── Website Redesign
│   └── API v2
├── Maintenance
└── Archived
```

### Hybrid Approach

Combine multiple strategies:

```
Root
├── Work
│   ├── 2025
│   │   └── Project A
│   └── Archive
└── Personal
    └── Health
        └── 2025
```

## Sector Linking

Sectors can be linked through waypoints, enabling cross-sector navigation:

```python
# Create link between sectors
om.link_sectors(
    source="Technical/API",
    target="Documentation/API",
    relationship="documented_by"
)

# Query with cross-sector navigation
results = om.query(
    query="authentication flow",
    start_sector="Technical/API",
    allow_cross_sector=True,
    max_hops=3
)
```

## Performance Considerations

### Sector Size

- **Optimal size**: 100-10,000 memories per sector
- **Too small**: Overhead from sector management
- **Too large**: Slower queries, less semantic coherence

### Sector Depth

- **Recommended depth**: 3-5 levels
- **Deeper hierarchies**: Slower navigation
- **Flatter hierarchies**: Less organization

### Auto-splitting

OpenMemory automatically splits large sectors:

```python
# Configure auto-split threshold
om.configure_sectors(
    max_memories_per_sector=5000,
    auto_split=True,
    split_strategy="semantic"  # or "balanced", "temporal"
)
```

## Best Practices

### 1. Start Simple

Begin with broad categories:

```python
om.create_sector("Work")
om.create_sector("Personal")
om.create_sector("Learning")
```

### 2. Let It Grow Organically

Allow auto-sector assignment to work:

```python
om.add_memory(content="...", auto_sector=True)
```

### 3. Review and Reorganize

Periodically review sector structure:

```python
# Get underutilized sectors
unused = om.list_sectors(min_memories=10, max_last_access_days=90)

# Merge or archive them
for sector in unused:
    om.archive_sector(sector.id)
```

### 4. Use Metadata

Tag sectors for better organization:

```python
om.update_sector(
    sector_id="project_a",
    metadata={
        "status": "active",
        "team": "engineering",
        "priority": "high"
    }
)
```

### 5. Monitor Performance

Track sector health:

```python
# Get slow sectors
slow_sectors = om.analyze_sectors(metric="query_time")

# Optimize large sectors
for sector in slow_sectors:
    if sector.memory_count > 10000:
        om.split_sector(sector.id)
```

## Advanced Features

### Sector Templates

Create reusable sector structures:

```python
# Define template
template = {
    "name": "Project Template",
    "children": ["Docs", "Code", "Meetings", "Research"]
}

# Apply template
om.create_from_template("New Project", template)
```

### Sector Permissions

Control access to sectors:

```python
om.set_sector_permissions(
    sector_id="confidential",
    read=["user_1", "user_2"],
    write=["user_1"]
)
```

### Sector Export

Export sector contents:

```python
# Export as JSON
om.export_sector("Work/Project A", format="json", file="project_a.json")

# Export as markdown
om.export_sector("Learning/AI", format="markdown", file="ai_notes.md")
```

## Next Steps

- Learn about [Waypoints & Graph](/docs/concepts/waypoints) for cross-sector navigation
- Understand [HMD v2 Specification](/docs/concepts/hmd-v2) for decay mechanics
- Explore [API Reference](/docs/api/add-memory) for sector operations

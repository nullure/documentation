---
title: Memory Sectors
description: Brain-inspired memory organization using 5 cognitive sectors
---

# Memory Sectors

OpenMemory organizes memories using **5 brain-inspired sectors** that mirror human cognitive systems. Each sector has specialized characteristics for decay rate, weight, and pattern recognition.

## Overview

Based on cognitive science research, OpenMemory uses a **Hierarchical Semantic Graph (HSG)** architecture with 5 distinct memory sectors:

1. **Episodic** - Events and experiences
2. **Semantic** - Facts and knowledge
3. **Procedural** - Habits and workflows
4. **Emotional** - Feelings and sentiment
5. **Reflective** - Meta-thoughts and insights

Each sector automatically classifies memories based on content patterns and manages decay rates appropriate to the memory type.

## The 5 Brain Sectors

### Episodic - Event Memories

**What**: Temporal experiences, events, and moments in time  
**Decay Rate**: λ = 0.015 (medium-fast decay)  
**Weight**: 1.2 (boosted importance)

**Pattern Recognition**:

- Time references: "today", "yesterday", "last week"
- Personal experiences: "I did", "I went", "I saw"
- Timestamps: "at 3:00pm", "on Monday", "in 2024"
- Event words: "happened", "occurred", "experience"

**Examples**:

```python
# Automatically classified as episodic
om.add("Met with the client at 3pm yesterday to discuss the Q4 roadmap")
om.add("That time we debugged the memory leak for 6 hours straight")
om.add("Deployed version 2.0 to production on Friday at 5pm")
```

**Best For**:

- Timeline tracking
- Session history
- User journeys
- Event logs

---

### Semantic - Facts & Knowledge

**What**: Factual information, definitions, concepts, and timeless knowledge  
**Decay Rate**: λ = 0.005 (very slow decay)  
**Weight**: 1.0 (standard importance)

**Pattern Recognition**:

- Definitions: "define", "meaning", "concept", "theory"
- Questions: "what is", "how does", "why do"
- Knowledge: "principle", "rule", "law", "algorithm"
- Information: "knowledge", "data", "research", "study"

**Examples**:

```python
# Automatically classified as semantic
om.add("Python uses dynamic typing and duck typing principles")
om.add("REST APIs follow the principles of stateless client-server communication")
om.add("The Big O notation O(n log n) represents logarithmic complexity")
```

**Best For**:

- Knowledge bases
- Documentation
- Facts and definitions
- Core concepts

---

### Procedural - Habits & Workflows

**What**: Step-by-step processes, workflows, habits, and procedures  
**Decay Rate**: λ = 0.008 (slow decay)  
**Weight**: 1.1 (slightly boosted)

**Pattern Recognition**:

- Instructions: "how to", "step by step", "procedure"
- Sequence: "first", "then", "next", "finally"
- Actions: "install", "configure", "run", "execute"
- Guides: "tutorial", "instructions", "manual"
- UI actions: "click", "press", "type", "enter"

**Examples**:

```python
# Automatically classified as procedural
om.add("To deploy: first run npm build, then docker build, finally kubectl apply")
om.add("User always runs git pull before starting work each morning")
om.add("Setup process: install dependencies, configure env vars, seed database")
```

**Best For**:

- Tutorials and guides
- Workflow tracking
- Habit detection
- SOPs (Standard Operating Procedures)

---

### Emotional - Feelings & Sentiment

**What**: Emotional states, feelings, reactions, and sentiment  
**Decay Rate**: λ = 0.020 (fast decay)  
**Weight**: 1.3 (highly boosted - emotions matter!)

**Pattern Recognition**:

- Feelings: "feel", "feeling", "emotion", "mood"
- Emotions: "happy", "sad", "angry", "excited", "worried"
- Preferences: "love", "hate", "like", "enjoy", "fear"
- Intensifiers: "amazing", "terrible", "wonderful", "awful"
- Emphasis: Multiple exclamation marks!!! or ???

**Examples**:

```python
# Automatically classified as emotional
om.add("User expressed frustration with the slow build times!!!")
om.add("Really excited about the new feature launch tomorrow!")
om.add("Feeling overwhelmed by the number of open issues")
```

**Best For**:

- Sentiment analysis
- User satisfaction tracking
- Emotional context
- Feedback analysis

---

### Reflective - Meta-Thoughts & Insights

**What**: Self-reflection, insights, conclusions, and meta-information  
**Decay Rate**: λ = 0.001 (extremely slow decay - learnings persist)  
**Weight**: 0.8 (lower weight - background context)

**Pattern Recognition**:

- Reflection: "think", "thought", "reflect", "reflection"
- Insights: "realize", "understand", "insight", "conclusion"
- Learning: "learn", "discovered", "recognize", "pattern"
- Meta: "observe", "notice", "seems", "appears"

**Examples**:

```python
# Automatically classified as reflective
om.add("I've noticed that users from enterprise prefer detailed documentation")
om.add("Pattern observed: bugs increase after Friday deployments")
om.add("Realized that caching at the API layer reduces DB load by 40%")
```

**Best For**:

- Learning and insights
- Pattern detection
- System observations
- Audit trails

## Automatic Sector Classification

When you add a memory, OpenMemory automatically analyzes the content and classifies it into the most appropriate sector based on pattern matching and semantic analysis.

```python
from openmemory import OpenMemory

om = OpenMemory(
    api_key="your_api_key",
    base_url="http://localhost:8080"
)

# Automatically classified
result = om.add(
    content="I deployed the new feature to production yesterday at 5pm"
)

print(f"Primary sector: {result['primary_sector']}")  # episodic
print(f"All sectors: {result['sectors']}")  # may include multiple
```

The classification system:

1. Runs pattern matching against each sector's regex patterns
2. Calculates confidence scores for each sector
3. Assigns primary sector (highest confidence)
4. May assign additional sectors if confidence is high enough

## Querying by Sector

You can query specific sectors using the SDK:

```python
# Query memories from semantic sector only
semantic_memories = om.get_by_sector("semantic", limit=50)

for memory in semantic_memories["items"]:
    print(f"- {memory['content']}")

# Query all sectors (default)
all_memories = om.get_all(limit=100)
```

## Sector Statistics

Get statistics about memory distribution across sectors:

```python
# Get sector breakdown
stats = om.get_stats()

print("Memory distribution:")
for sector, data in stats['sectors'].items():
    print(f"{sector}: {data['count']} memories (λ={data['decay_lambda']})")

# Example output:
# episodic: 230 memories (λ=0.015)
# semantic: 450 memories (λ=0.005)
# procedural: 120 memories (λ=0.008)
# emotional: 89 memories (λ=0.020)
# reflective: 34 memories (λ=0.001)
```

## Understanding Sector Weights

Each sector has a weight that influences query relevance:

| Sector     | Weight | Effect                                       |
| ---------- | ------ | -------------------------------------------- |
| Emotional  | 1.3    | Boosted - emotions carry more weight         |
| Episodic   | 1.2    | Slightly boosted - recent events matter      |
| Procedural | 1.1    | Slightly boosted - workflows are important   |
| Semantic   | 1.0    | Standard - balanced relevance                |
| Reflective | 0.8    | Reduced - background context, less prominent |

These weights affect query scoring and memory retrieval.

## HSG Architecture

OpenMemory uses a **Hierarchical Semantic Graph (HSG)** that:

1. **Organizes memories by sector** for efficient retrieval
2. **Maintains waypoints** (connections between related memories)
3. **Manages decay** differently per sector
4. **Optimizes queries** by searching relevant sectors first

The HSG architecture enables:

- Fast semantic search within sectors
- Cross-sector waypoint navigation
- Sector-specific decay management
- Efficient memory consolidation

## Best Practices

### Trust Automatic Classification

The pattern-based classification is highly accurate. Let OpenMemory handle sector assignment:

```python
# Good - automatic classification
om.add("User prefers dark mode UI")  # → semantic

# Unnecessary - manual override rarely needed
om.add(
    "User prefers dark mode UI",
    metadata={"force_sector": "semantic"}
)
```

### Use Appropriate Content

Write memory content that's clear about its nature:

```python
# Clear episodic markers
om.add("Deployed v2.0 on Friday January 15th at 3pm")

# Clear semantic markers
om.add("The formula for complexity is O(n log n)")

# Clear procedural markers
om.add("To deploy: first build, then test, finally push to prod")
```

### Monitor Sector Distribution

Track how memories are distributed:

```python
stats = om.get_stats()

# Check if distribution makes sense for your use case
# Too many episodic? Maybe add more semantic knowledge
# Too few reflective? Enable auto-reflection
```

### Leverage Sector Decay

Different sectors decay at different rates - use this:

```python
# Long-term knowledge → semantic (slow decay)
om.add("Company policy: All code must be reviewed before merge")

# Short-term context → episodic (medium decay)
om.add("Working on auth bug reported this morning")

# Transient feelings → emotional (fast decay)
om.add("Frustrated with slow CI pipeline today!")

# Persistent learnings → reflective (very slow decay)
om.add("Pattern: bugs increase after Friday deployments")
```

## Next Steps

- Learn about [Decay Algorithm](/docs/concepts/decay) for sector-specific decay
- Understand [HSG in HMD v2](/docs/concepts/hmd-v2) architecture details
- Explore [Waypoints](/docs/concepts/waypoints) for cross-sector connections
- See [Query API](/docs/api/query) for sector-filtered queries

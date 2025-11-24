---
title: Standalone vs Backend Mode
description: Choosing the right deployment model for your OpenMemory application. Learn when to use local mode vs server mode.
keywords: openmemory standalone, openmemory backend, local ai memory, ai memory server, openmemory deployment
date: 2025-11-24
author: OpenMemory Team
---

# Standalone vs Backend Mode — Choosing the right setup

OpenMemory offers two distinct ways to run: **Standalone Mode** and **Backend Mode**. Which one should you choose?

## Standalone Mode (Local-First)

In this mode, OpenMemory runs as a library inside your code.

**Pros:**
- Zero infrastructure (no Docker, no servers).
- Data lives in a local file (`memory.sqlite`).
- Fastest performance (no network latency).

**Cons:**
- Harder to share memory between multiple different apps.
- Single-process write lock (SQLite limitation).

**Choose this if:** You are building a CLI, a desktop app (Electron), a single-user agent, or a research prototype.

## Backend Mode (Server)

In this mode, OpenMemory runs as a standalone server (API).

**Pros:**
- Centralized memory for multiple agents/users.
- High concurrency (Postgres backend).
- Dashboard support.

**Cons:**
- Requires deployment (Docker/Node).
- Network overhead.

**Choose this if:** You are building a SaaS, a team-based tool, or a complex multi-agent system.

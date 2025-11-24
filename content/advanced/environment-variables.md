---
title: Environment Variables | OpenMemory
description: Complete reference of environment variables for configuring OpenMemory Backend Server.
keywords: openmemory env vars, configuration, docker config, backend settings
---

# Environment Variables

Configure the OpenMemory Backend Server using these environment variables.

## Core

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OM_PORT` | Server port | `8080` |
| `OM_API_KEY` | Master API key for authentication | - |
| `OM_LOG_LEVEL` | Logging verbosity (`debug`, `info`, `warn`, `error`) | `info` |

## Database

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OM_DB_TYPE` | Database type (`sqlite`, `postgres`) | `sqlite` |
| `OM_DB_PATH` | Path to SQLite file | `./data/memory.sqlite` |
| `OM_DB_URL` | PostgreSQL connection string | - |

## Embeddings

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OM_EMBED_PROVIDER` | Provider (`openai`, `gemini`, `ollama`, `local`) | `openai` |
| `OM_OPENAI_API_KEY` | OpenAI API Key | - |
| `OM_GEMINI_API_KEY` | Google Gemini API Key | - |
| `OM_OLLAMA_URL` | Ollama URL | `http://localhost:11434` |

## Memory Tier

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OM_TIER` | Cognitive tier (`fast`, `smart`, `deep`) | `smart` |

---
title: Docker Deployment | OpenMemory
description: Deploy OpenMemory using Docker. Build and run with docker-compose.
keywords: docker openmemory, docker compose, container deployment, memory server docker
---

# Docker Deployment

Deploy OpenMemory using Docker Compose for easy setup and management.

## Docker Compose (Recommended)

```bash
# clone the repository
git clone https://github.com/caviraoss/openmemory.git
cd openmemory

# copy environment file
cp .env.example .env

# start with docker compose
docker compose up --build -d
```

the server will be available at `http://localhost:8080`.

## docker-compose.yml reference

```yaml
version: '3.8'

services:
  openmemory:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '8080:8080'
    environment:
      # core configuration
      - OM_PORT=8080
      - OM_MODE=standard
      - OM_TIER=hybrid
      - OM_DB_PATH=/data/openmemory.sqlite
      - OM_API_KEY=${OM_API_KEY:-}
      
      # embeddings configuration
      - OM_EMBEDDINGS=synthetic
      - OM_EMBED_MODE=simple
      - OM_VEC_DIM=256
      
      # openai provider (optional)
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      
      # ollama provider (optional)
      - OLLAMA_URL=${OLLAMA_URL:-http://localhost:11434}
      
    volumes:
      - openmemory_data:/data
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8080/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

volumes:
  openmemory_data:
    driver: local
```

## configuration

key environment variables:

- `OM_API_KEY` - api key for authentication (optional)
- `OM_EMBEDDINGS` - embedding provider (`synthetic`, `openai`, `gemini`, `ollama`)
- `OM_PORT` - server port (default: 8080)
- `OM_MODE` - operation mode (default: `standard`)
- `OM_TIER` - memory tier (`hybrid`, `deep`)
- `OM_DB_PATH` - sqlite database path (default: `/data/openmemory.sqlite`)

for a full list of configuration options, see the [.env.example](https://github.com/caviraoss/openmemory/blob/main/.env.example) file.

## volume persistence

data is stored in the named volume `openmemory_data` which maps to `/data` inside the container. this includes:
- sqlite database
- vector embeddings
- user data

## health check

the container includes a health check endpoint at `/health` that verifies the server is running correctly.

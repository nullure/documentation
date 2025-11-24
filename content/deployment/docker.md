---
title: Docker Deployment | OpenMemory
description: Deploy OpenMemory using Docker. Official images and docker-compose examples.
keywords: docker openmemory, docker compose, container deployment, memory server docker
---

# Docker Deployment

We provide official Docker images for easy deployment.

## Run with Docker CLI

```bash
docker run -d \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  -e AUTH_TOKEN=secret \
  ghcr.io/caviraoss/openmemory:latest
```

## Docker Compose

```yaml
version: '3'
services:
  openmemory:
    image: ghcr.io/caviraoss/openmemory:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    environment:
      - AUTH_TOKEN=secret
    restart: always
```

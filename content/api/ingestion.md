---
title: Ingestion API | OpenMemory
description: API reference for ingesting documents and URLs into OpenMemory.
keywords: ingestion api, document upload, url ingestion, pdf ingestion, openmemory api
---

# Ingestion API

> [!NOTE]
> This reference is for the **Backend Server API**. For Standalone Mode, use `ingest(mem, path)`.

Ingest text, PDFs, or web pages into memory.

## Endpoint

```http
POST /ingest
```

## Request Body

```typescript
interface IngestRequest {
  text?: string;
  file?: File; // Multipart upload
  url?: string;
  metadata?: Record<string, any>;
}
```

## Example: Ingest URL

```bash
curl -X POST http://localhost:8080/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "url": "https://example.com/article",
    "metadata": { "source": "web" }
  }'
```

## Example: Ingest File

```bash
curl -X POST http://localhost:8080/ingest \
  -H "Authorization: Bearer your_api_key" \
  -F "file=@./document.pdf"
```

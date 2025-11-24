---
title: Ingestion Strategies | OpenMemory
description: Advanced strategies for ingesting large documents, websites, and multimodal data into OpenMemory.
keywords: ingestion strategies, document parsing, pdf to memory, web scraping, multimodal memory
---

# Ingestion Strategies

Ingesting data into long-term memory requires more than just "copy-paste". You need to consider chunking, metadata, and relevance.

## Pipelines

OpenMemory supports ingestion pipelines for:
- **Documents**: PDF, DOCX, TXT, Markdown.
- **Web**: URL scraping (HTML to Markdown).
- **Audio/Video**: MP3, WAV, MP4, MOV (via Whisper & FFmpeg).

## API Usage

You can ingest files via the API:

```bash
POST /memory/ingest
{
  "content_type": "audio/mp3",
  "data": "base64_encoded_audio...",
  "user_id": "user_1"
}
```


## Best Practices

### 1. Add Metadata
Always tag ingested content with its source.

```typescript
await ingest(mem, "paper.pdf", {
  metadata: { source: "research_paper", year: 2024 }
});
```

### 2. Use Semantic Chunking
For complex documents, use semantic chunking to keep related ideas together.

### 3. Rate Limiting
When ingesting a whole website, be mindful of your embedding provider's rate limits. OpenMemory handles backoff automatically in the background.

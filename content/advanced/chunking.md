---
title: Document Chunking
description: How the backend splits large documents into memory chunks
---

# Document Chunking

When you ingest large documents through the backend's `/memory/ingest` endpoint, OpenMemory automatically splits them into manageable chunks. **This is backend behavior** - the SDKs don't have built-in file ingestion.

## How Backend Chunking Works

The backend uses a paragraph-based chunking strategy:

1. **Split by paragraphs**: Documents are split at `\n\n` boundaries
2. **Group into sections**: Paragraphs are grouped up to ~3000 characters
3. **Preserve context**: Never splits mid-paragraph
4. **Create root memory**: For large documents, creates a summary root node
5. **Link with waypoints**: Connects root to child chunks bidirectionally

## Chunking Algorithm

```typescript
// Backend implementation
function splitIntoSections(text: string, maxChars: number = 3000): string[] {
  const paragraphs = text.split(/\n\n+/);
  const sections: string[] = [];
  let currentSection = '';

  for (const paragraph of paragraphs) {
    if (
      currentSection.length + paragraph.length > maxChars &&
      currentSection.length > 0
    ) {
      sections.push(currentSection.trim());
      currentSection = paragraph;
    } else {
      currentSection += '\n\n' + paragraph;
    }
  }

  if (currentSection.length > 0) {
    sections.push(currentSection.trim());
  }

  return sections;
}
```

## Configuration

Backend chunking is configured via environment variables:

```env
# Maximum section size (characters)
OM_CHUNK_SIZE=3000

# Token count threshold for root-child structure
OM_TOKEN_THRESHOLD=8000
```

## Root-Child Structure

For large documents (≥8000 tokens):

```
┌─────────────────────────────────┐
│    Root Memory (Summary)        │
│  "Document discusses X, Y, Z"   │
└──┬──────────────┬──────────────┬┘
   │              │              │
   │ waypoint     │ waypoint     │ waypoint
   │              │              │
┌──▼──────┐  ┌───▼──────┐  ┌───▼──────┐
│ Chunk 1 │  │ Chunk 2  │  │ Chunk 3  │
│ Intro   │  │ Body     │  │ Conclusion│
└─────────┘  └──────────┘  └──────────┘
```

## Using Document Ingestion

### Via HTTP API

```bash
curl -X POST http://localhost:8080/memory/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "content_type": "application/pdf",
    "data": "base64_encoded_pdf_data",
    "metadata": {"source": "research"}
  }'
```

### Response

```json
{
  "success": true,
  "rootMemoryId": "mem_root_123",
  "childMemoryIds": ["mem_child_456", "mem_child_789"],
  "message": "Document ingested with root-child structure",
  "metadata": {
    "totalSections": 2,
    "tokenCount": 9500,
    "fileType": "pdf"
  }
}
```

## Supported File Types

The backend can extract text from:

| Format | Content Type                                                            | Library   |
| ------ | ----------------------------------------------------------------------- | --------- |
| PDF    | application/pdf                                                         | pdf-parse |
| DOCX   | application/vnd.openxmlformats-officedocument.wordprocessingml.document | mammoth   |
| HTML   | text/html                                                               | turndown  |

## URL Ingestion

```bash
curl -X POST http://localhost:8080/memory/ingest/url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "url": "https://example.com/article",
    "metadata": {"source": "blog"}
  }'
```

## Best Practices

### Optimal Chunk Size

| Content Type   | Recommended Size  |
| -------------- | ----------------- |
| Technical docs | 2000-3000 chars   |
| Books/Articles | 3000-4000 chars   |
| Code           | By function/class |
| API docs       | 1000-2000 chars   |

Configure via `.env`:

```env
OM_CHUNK_SIZE=3000
```

### Metadata Tagging

Always include metadata for better retrieval:

```json
{
  "content_type": "application/pdf",
  "data": "...",
  "metadata": {
    "source": "research_papers",
    "author": "John Doe",
    "year": 2024,
    "category": "machine_learning",
    "filename": "paper.pdf"
  }
}
```

### Query Chunked Documents

After ingestion, query normally:

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_key", base_url="http://localhost:8080")

# Query returns relevant chunks
result = om.query("machine learning concepts", k=10)

for match in result["matches"]:
    print(f"[{match['score']:.2f}] {match['content'][:100]}...")
```

## Limitations

### Current Limitations

- **No custom chunking strategies**: Fixed paragraph-based algorithm
- **No streaming**: Must send entire document
- **Text only**: Images and charts are ignored
- **No OCR**: Scanned PDFs won't work

### File Size Limits

- **Recommended max**: 10 MB per file
- **Processing time**: 5-10 seconds for large PDFs
- **Memory usage**: ~3x file size during processing

## Chunk Quality Tips

1. **Well-formatted input**: Clean documents chunk better
2. **Consistent formatting**: Use consistent paragraph breaks
3. **Logical structure**: Headers and sections improve chunking
4. **Avoid giant paragraphs**: Break up walls of text

## Alternative: Manual Chunking

If you need custom chunking, process documents client-side:

```python
from openmemory import OpenMemory

om = OpenMemory(api_key="your_key", base_url="http://localhost:8080")

# Read and split document yourself
with open("document.txt", "r") as f:
    text = f.read()

# Custom chunking logic
def custom_chunk(text: str, size: int = 500):
    words = text.split()
    chunks = []
    current = []

    for word in words:
        current.append(word)
        if len(' '.join(current)) >= size:
            chunks.append(' '.join(current))
            current = []

    if current:
        chunks.append(' '.join(current))

    return chunks

chunks = custom_chunk(text)

# Add each chunk as separate memory
for i, chunk in enumerate(chunks):
    om.add(
        content=chunk,
        tags=["document", "chunk"],
        metadata={"chunk_index": i, "total_chunks": len(chunks)}
    )
```

## Related Documentation

- [Ingestion API](/docs/api/ingestion) - HTTP endpoints for file ingestion
- [Multimodal Ingestion](/docs/api/ingestion) - Supported file formats
- [Waypoints](/docs/concepts/waypoints) - Root-child relationships

## Next Steps

1. Use HTTP API directly for document ingestion
2. Or implement custom chunking in your application
3. Query chunks normally through SDKs

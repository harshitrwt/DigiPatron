# API Contract (v1.0)

This document serves as the absolute source of truth for communication between the Frontend and Backend layers of ContentGenome v2. If there is a dispute over data shapes, this document wins.

## 1. Image Upload
**Endpoint:** `POST /api/upload`
**Content-Type:** `multipart/form-data`

### Request Payload
- `file`: `File` (The image file)

### Response Payload (200 OK)
```json
{
  "status": "success",
  "data": {
    "image_id": "uuid-xxxx",
    "filename": "original_photo.jpg",
    "upload_time": "2026-04-24T12:00:00Z"
  }
}
```

## 2. Trigger Analysis Pipeline
**Endpoint:** `POST /api/analyze/{image_id}`

### Request Payload
None

### Response Payload (202 Accepted)
```json
{
  "status": "processing",
  "message": "Analysis started. Polling recommended."
}
```

## 3. Fetch Analysis Results (Score Card)
**Endpoint:** `GET /api/analyze/{image_id}/result`

### Response Payload (200 OK)
```json
{
  "status": "success",
  "data": {
    "image_id": "uuid-xxxx",
    "integrity_score": 43,
    "total_copies_detected": 6,
    "infringing_copies": 2,
    "modified_copies": 4
  }
}
```

## 4. Fetch Propagation Tree
**Endpoint:** `GET /api/tree/{image_id}`

### Response Payload (200 OK)
```json
{
  "status": "success",
  "data": {
    "root_id": "uuid-xxxx",
    "nodes": [
      {
        "id": "node-0",
        "image_id": "uuid-xxxx",
        "label": "Original",
        "url": "/assets/uuid-xxxx.jpg",
        "authenticity_label": "Original",
        "similarity_score": 100,
        "mutation_type": "None"
      },
      {
        "id": "node-1",
        "image_id": "uuid-yyyy",
        "label": "Modified",
        "url": "/assets/uuid-yyyy.jpg",
        "authenticity_label": "Likely Infringing",
        "similarity_score": 68,
        "mutation_type": "Crop + Watermark Remove"
      }
    ],
    "edges": [
      {
        "source": "node-0",
        "target": "node-1",
        "weight": 68,
        "label": "Crop + Watermark Remove"
      }
    ]
  }
}
```

## 5. Generate DMCA Draft
**Endpoint:** `POST /api/dmca/generate`

### Request Payload
```json
{
  "infringing_node_id": "node-1",
  "owner_name": "Jane Doe",
  "owner_email": "jane@example.com"
}
```

### Response Payload (200 OK)
```json
{
  "status": "success",
  "data": {
    "draft_text": "TO: [Platform Name] Copyright Agent\nSUBJECT: DMCA Takedown Notice\n\nI am the authorized representative of Jane Doe..."
  }
}
```

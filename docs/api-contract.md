# API Contract

Single source of truth for the API contract between the Next.js Web backend and the Python/FastAPI ML inference service.

---

## 1. POST `/detect/text`

Analyzes text content (comments, blogs, articles, essays) for AI-generated patterns and burstiness.

### Request
- **Method:** `POST`
- **Path:** `/detect/text`
- **Content-Type:** `application/json`

```json
{
  "text": "Furthermore, the multifaceted nature of artificial intelligence..."
}
```

### Response
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "verdict": "ai_generated", // "ai_generated" | "human" | "uncertain"
  "confidence": 0.87,         // float in range 0.0 - 1.0
  "model_version": "text-v1"
}
```

---

## 2. POST `/detect/image`

Analyzes an uploaded image file for synthetic artifacts, frequency anomalies, or generative model markers.

### Request
- **Method:** `POST`
- **Path:** `/detect/image`
- **Content-Type:** `multipart/form-data`
- **Field Name:** `image` (binary file: PNG, JPEG, WebP, max 10MB)

### Response
- **Status:** `200 OK`
- **Content-Type:** `application/json`

```json
{
  "verdict": "ai_generated", // "ai_generated" | "human" | "uncertain"
  "confidence": 0.94,         // float in range 0.0 - 1.0
  "model_version": "image-v1",
  "details": {
    "format": "image/png",
    "width": 1024,
    "height": 1024,
    "artifact_score": 0.91
  }
}
```

---

## 3. Fallback Providers

When the primary self-hosted ML service is unreachable:
1. **Walter AI Failover**: Automatically proxies through Walter AI (`developer-portal.walterwrites.ai/api/detector/`) using the configured `WALTER_AI_API_KEY`.
2. **Contract-Compliant Dev Mock**: If offline / in development, generates standard contract-compliant responses (`text-v1-dev-mock` / `image-v1-dev-mock`) so frontend development remains uninterrupted.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI(
    title="ContentLens ML Inference Service",
    description="FastAPI service for detecting AI-generated text, images, and videos.",
    version="0.1.0"
)

# Enable CORS for local testing and integration with Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input and Output schemas based on PROJECT.md contract
class TextDetectionRequest(BaseModel):
    text: str = Field(..., description="The text content to analyze for AI generation.")

class TextDetectionResponse(BaseModel):
    verdict: Literal["ai_generated", "human", "uncertain"]
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0.")
    model_version: str

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "ContentLens ML Service (FastAPI) is running.",
        "version": "0.1.0"
    }

@app.post("/detect/text", response_model=TextDetectionResponse)
def detect_text(request: TextDetectionRequest):
    # Phase 0 Mock implementation matching contract.
    # Return "uncertain" baseline for now.
    return TextDetectionResponse(
        verdict="uncertain",
        confidence=0.5,
        model_version="mock-text-v1"
    )

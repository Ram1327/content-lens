import os
import logging
from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from dotenv import load_dotenv

# Load environment variables from .env file for local development
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gateway")

# Lifespan manager to manage httpx connection pooling
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize connection pool
    app.state.http_client = httpx.AsyncClient(timeout=10.0)
    yield
    # Clean up connection pool
    await app.state.http_client.aclose()

app = FastAPI(
    title="ContentLens ML Inference Service",
    description="FastAPI service for detecting AI-generated text, images, and videos.",
    version="0.1.0",
    lifespan=lifespan
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
async def detect_text(request: TextDetectionRequest, http_request: Request):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")
        
    model_url = os.getenv("ML_MODEL_URL")
    
    # If ML_MODEL_URL is not configured, fall back to mock response (useful for Phase 0 testing)
    if not model_url:
        logger.info("ML_MODEL_URL is not set. Returning mock verdict.")
        return TextDetectionResponse(
            verdict="uncertain",
            confidence=0.5,
            model_version="mock-text-v1"
        )
        
    try:
        client: httpx.AsyncClient = http_request.app.state.http_client
        
        # Prepare target URL
        target_url = f"{model_url.rstrip('/')}/detect/text"
        logger.info(f"Forwarding text detection request to: {target_url}")
        
        # Make the request to Lightning.ai model server
        response = await client.post(
            target_url,
            json={"text": request.text},
            timeout=5.0
        )
        
        if response.status_code == 200:
            data = response.json()
            # Response shape: {"label": "ChatGPT" | "Human", "confidence": float, "probabilities": dict}
            model_label = data.get("label")
            confidence = data.get("confidence", 0.5)
            
            # Map verdict to contract: "ai_generated" | "human" | "uncertain"
            # Apply confidence thresholds: if confidence is close to 0.5 (e.g. between 0.45 and 0.55),
            # verdict is "uncertain"
            if 0.45 <= confidence <= 0.55:
                verdict = "uncertain"
            elif model_label == "ChatGPT":
                verdict = "ai_generated"
            elif model_label == "Human":
                verdict = "human"
            else:
                verdict = "uncertain"
                
            return TextDetectionResponse(
                verdict=verdict,
                confidence=confidence,
                model_version="text-v1"
            )
        else:
            logger.error(f"Model server returned status code {response.status_code}: {response.text}")
            return TextDetectionResponse(
                verdict="uncertain",
                confidence=0.5,
                model_version="text-v1-fallback-error"
            )
            
    except (httpx.TimeoutException, httpx.NetworkError) as e:
        logger.warning(f"Connection to model server failed or timed out: {str(e)}. Returning fallback response.")
        # This handles sleeping Studios on Lightning.ai (causes timeout during wake-up)
        return TextDetectionResponse(
            verdict="uncertain",
            confidence=0.5,
            model_version="text-v1-fallback-sleeping"
        )
    except Exception as e:
        logger.exception("Unexpected error in gateway detection handler")
        return TextDetectionResponse(
            verdict="uncertain",
            confidence=0.5,
            model_version="text-v1-fallback-exception"
        )

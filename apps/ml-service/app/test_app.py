import os
from unittest.mock import patch
import httpx
import pytest
from fastapi.testclient import TestClient

# Set environment variable BEFORE importing app to configure mock URL
os.environ["ML_MODEL_URL"] = "http://mock-lightning-ai-url"

from app.main import app

def test_read_root():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

@patch("httpx.AsyncClient.post")
def test_detect_text_success_ai(mock_post):
    # Mock a successful prediction from model server (AI generated)
    mock_post.return_value = httpx.Response(
        status_code=200,
        json={
            "label": "ChatGPT",
            "confidence": 0.85,
            "probabilities": {
                "Human": 0.15,
                "ChatGPT": 0.85
            }
        }
    )

    with TestClient(app) as client:
        response = client.post("/detect/text", json={"text": "This is AI generated content."})
        assert response.status_code == 200
        data = response.json()
        assert data["verdict"] == "ai_generated"
        assert data["confidence"] == 0.85
        assert data["model_version"] == "text-v1"
        
        # Verify the client was called with correct parameters
        mock_post.assert_called_once_with(
            "http://mock-lightning-ai-url/detect/text",
            json={"text": "This is AI generated content."},
            timeout=5.0
        )

@patch("httpx.AsyncClient.post")
def test_detect_text_success_human(mock_post):
    # Mock a successful prediction from model server (Human)
    mock_post.return_value = httpx.Response(
        status_code=200,
        json={
            "label": "Human",
            "confidence": 0.95,
            "probabilities": {
                "Human": 0.95,
                "ChatGPT": 0.05
            }
        }
    )

    with TestClient(app) as client:
        response = client.post("/detect/text", json={"text": "This is human written content."})
        assert response.status_code == 200
        data = response.json()
        assert data["verdict"] == "human"
        assert data["confidence"] == 0.95
        assert data["model_version"] == "text-v1"

@patch("httpx.AsyncClient.post")
def test_detect_text_uncertain_threshold(mock_post):
    # Mock a response where confidence falls inside the uncertain zone (e.g. 0.45 - 0.55)
    mock_post.return_value = httpx.Response(
        status_code=200,
        json={
            "label": "ChatGPT",
            "confidence": 0.51,
            "probabilities": {
                "Human": 0.49,
                "ChatGPT": 0.51
            }
        }
    )

    with TestClient(app) as client:
        response = client.post("/detect/text", json={"text": "Borderline text."})
        assert response.status_code == 200
        data = response.json()
        assert data["verdict"] == "uncertain"
        assert data["confidence"] == 0.51
        assert data["model_version"] == "text-v1"

@patch("httpx.AsyncClient.post")
def test_detect_text_sleeping_timeout(mock_post):
    # Mock a timeout exception (which simulates a sleeping Lightning.ai Studio waking up)
    mock_post.side_effect = httpx.TimeoutException("Connection timed out")

    with TestClient(app) as client:
        response = client.post("/detect/text", json={"text": "Trigger a timeout during wake up."})
        assert response.status_code == 200
        data = response.json()
        assert data["verdict"] == "uncertain"
        assert data["confidence"] == 0.5
        assert data["model_version"] == "text-v1-fallback-sleeping"

@patch("httpx.AsyncClient.post")
def test_detect_text_model_error(mock_post):
    # Mock an HTTP error from model server
    mock_post.return_value = httpx.Response(
        status_code=500,
        content=b"Internal Server Error"
    )

    with TestClient(app) as client:
        response = client.post("/detect/text", json={"text": "Trigger an internal error."})
        assert response.status_code == 200
        data = response.json()
        assert data["verdict"] == "uncertain"
        assert data["confidence"] == 0.5
        assert data["model_version"] == "text-v1-fallback-error"

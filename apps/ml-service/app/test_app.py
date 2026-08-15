from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_detect_text():
    response = client.post("/detect/text", json={"text": "Hello world"})
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data
    assert "confidence" in data
    assert "model_version" in data
    assert data["verdict"] == "uncertain"
    assert data["confidence"] == 0.5

if __name__ == "__main__":
    test_read_root()
    test_detect_text()
    print("All tests passed successfully!")

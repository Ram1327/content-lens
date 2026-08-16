import os
# Force Hugging Face cache to be inside the persistent Studio directory
os.environ["HF_HOME"] = "/teamspace/studios/this_studio/hf_cache"

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

app = FastAPI(
    title="ContentLens Text Detection Model Server",
    description="Loads Hello-SimpleAI/chatgpt-detector-roberta and runs predictions.",
    version="0.1.0"
)

# Load the model and tokenizer at startup
MODEL_NAME = "Hello-SimpleAI/chatgpt-detector-roberta"
print(f"Loading tokenizer for {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
print(f"Loading model for {MODEL_NAME}...")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval() # Set model to evaluation mode
print("Model loaded successfully!")

class TextRequest(BaseModel):
    text: str = Field(..., description="The text content to analyze.")

class TextResponse(BaseModel):
    label: str
    confidence: float
    probabilities: dict[str, float]

@app.get("/")
def health_check():
    return {"status": "healthy", "model": MODEL_NAME}

@app.post("/detect/text", response_model=TextResponse)
def predict_text(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    try:
        # Tokenize inputs
        inputs = tokenizer(request.text, return_tensors="pt", truncation=True, max_length=512)
        
        # Run inference
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = F.softmax(logits, dim=-1).squeeze().tolist()
            
        # Verify shape in case input matches edge cases
        if not isinstance(probs, list):
            probs = [probs]
            
        # Determine labels map
        # Hello-SimpleAI/chatgpt-detector-roberta output classes:
        # Label 0: Human
        # Label 1: ChatGPT (AI-generated)
        labels_map = {0: "Human", 1: "ChatGPT"}
        
        # Handle cases where config has custom labels or generic LABEL_0/LABEL_1 labels
        if hasattr(model.config, "id2label") and model.config.id2label:
            for idx, label_name in model.config.id2label.items():
                label_name_str = str(label_name).lower()
                if "human" in label_name_str or "real" in label_name_str:
                    labels_map[idx] = "Human"
                elif "chatgpt" in label_name_str or "fake" in label_name_str or "ai" in label_name_str:
                    labels_map[idx] = "ChatGPT"

        # Safe index mapping
        human_prob = probs[0] if len(probs) > 0 else 0.0
        ai_prob = probs[1] if len(probs) > 1 else 0.0
        
        # Determine verdict and confidence
        if ai_prob > human_prob:
            label = "ChatGPT"
            confidence = ai_prob
        else:
            label = "Human"
            confidence = human_prob
            
        return TextResponse(
            label=label,
            confidence=confidence,
            probabilities={
                "Human": human_prob,
                "ChatGPT": ai_prob
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

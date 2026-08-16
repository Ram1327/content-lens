import argparse
import sys
import httpx
from typing import List, Dict

try:
    from datasets import load_dataset
except ImportError:
    print("Error: The 'datasets' package is required to run the evaluation.")
    print("Please install it in your environment using: pip install datasets")
    sys.exit(1)

def run_evaluation(api_url: str, limit: int):
    print(f"Loading Hello-SimpleAI/HC3 dataset from Hugging Face...")
    # Load a small split of the 'all' subset
    # We load slightly more samples to ensure we get up to the limit of valid human/chatgpt responses
    dataset = load_dataset("Hello-SimpleAI/HC3", "all", split="train", streaming=True, trust_remote_code=True)
    
    test_cases = []
    print("Preparing test cases...")
    for item in dataset:
        if len(test_cases) >= limit:
            break
        # Each item has 'human_answers' and 'chatgpt_answers' lists
        if item.get("human_answers") and len(item["human_answers"]) > 0:
            test_cases.append({
                "text": item["human_answers"][0],
                "expected": "human"
            })
        if len(test_cases) >= limit:
            break
        if item.get("chatgpt_answers") and len(item["chatgpt_answers"]) > 0:
            test_cases.append({
                "text": item["chatgpt_answers"][0],
                "expected": "ai_generated"
            })
            
    print(f"Prepared {len(test_cases)} samples (balanced human/AI) for evaluation.")
    
    y_true = []
    y_pred = []
    
    # We will query the gateway API URL /detect/text
    detect_endpoint = f"{api_url.rstrip('/')}/detect/text"
    print(f"Evaluating against gateway endpoint: {detect_endpoint}...")
    
    correct = 0
    uncertain_count = 0
    total = len(test_cases)
    
    # We will use a standard client to make calls
    with httpx.Client(timeout=10.0) as client:
        for idx, case in enumerate(test_cases):
            text = case["text"]
            expected = case["expected"]
            
            # Simple text truncation if extremely long to avoid huge payloads
            if len(text) > 2000:
                text = text[:2000]
                
            try:
                response = client.post(detect_endpoint, json={"text": text})
                if response.status_code == 200:
                    data = response.json()
                    verdict = data.get("verdict") # human | ai_generated | uncertain
                    confidence = data.get("confidence", 0.0)
                    
                    y_true.append(expected)
                    y_pred.append(verdict)
                    
                    if verdict == expected:
                        correct += 1
                    elif verdict == "uncertain":
                        uncertain_count += 1
                        
                    print(f"[{idx+1}/{total}] Expected: {expected:<12} | Got: {verdict:<12} | Confidence: {confidence:.4f}")
                else:
                    print(f"[{idx+1}/{total}] Failed: Status code {response.status_code}")
                    y_true.append(expected)
                    y_pred.append("failed")
            except Exception as e:
                print(f"[{idx+1}/{total}] Request error: {str(e)}")
                y_true.append(expected)
                y_pred.append("error")
                
    # Calculate metrics
    evaluated_count = sum(1 for p in y_pred if p in ["human", "ai_generated", "uncertain"])
    
    if evaluated_count == 0:
        print("Error: No successful requests completed. Cannot compute metrics.")
        return
        
    # True Positive (AI detected as AI)
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == "ai_generated" and p == "ai_generated")
    # False Positive (Human detected as AI)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == "human" and p == "ai_generated")
    # True Negative (Human detected as Human)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == "human" and p == "human")
    # False Negative (AI detected as Human)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == "ai_generated" and p == "human")
    
    # Verdict metrics: treat uncertain as incorrect for strict metric evaluation
    accuracy = correct / total
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    
    print("\n" + "="*40)
    print(" EVALUATION RESULTS")
    print("="*40)
    print(f"Total samples:       {total}")
    print(f"Correct predictions: {correct} ({accuracy*100:.2f}%)")
    print(f"Uncertain outputs:   {uncertain_count} ({uncertain_count/total*100:.2f}%)")
    print(f"Precision (AI):      {precision:.4f}")
    print(f"Recall (AI):         {recall:.4f}")
    print(f"F1-Score (AI):       {f1:.4f}")
    print("="*40)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate ContentLens text detection API gateway.")
    parser.add_argument("--api-url", default="http://localhost:8000", help="Gateway API base URL (default: http://localhost:8000)")
    parser.add_argument("--limit", type=int, default=50, help="Number of samples to pull for evaluation (default: 50)")
    args = parser.parse_args()
    
    run_evaluation(args.api_url, args.limit)

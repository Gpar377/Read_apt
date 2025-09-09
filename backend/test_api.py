import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api_endpoints():
    """Test all API endpoints"""
    print("Testing Accessibility Reading Platform API...")
    
    # Test 1: Root endpoint
    print("\n1. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"[OK] Root: {response.json()}")
    except Exception as e:
        print(f"[ERROR] Root failed: {e}")
    
    # Test 2: Dyslexia sample text
    print("\n2. Testing dyslexia sample text...")
    try:
        response = requests.get(f"{BASE_URL}/api/dyslexia/sample-text")
        data = response.json()
        print(f"[OK] Sample text length: {len(data['text'])} chars")
        print(f"[OK] Questions count: {len(data['questions'])}")
    except Exception as e:
        print(f"[ERROR] Sample text failed: {e}")
    
    # Test 3: Dyslexia prediction
    print("\n3. Testing dyslexia prediction...")
    try:
        payload = {"speed": 0.3, "survey_score": 0.4}
        response = requests.post(f"{BASE_URL}/api/dyslexia/predict", json=payload)
        result = response.json()
        print(f"[OK] Dyslexia prediction: Severity {result['severity']}, Confidence {result['confidence']:.3f}")
        print(f"[OK] Adaptation preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] Dyslexia prediction failed: {e}")
    
    # Test 4: ADHD questionnaire
    print("\n4. Testing ADHD questionnaire...")
    try:
        response = requests.get(f"{BASE_URL}/api/adhd/questionnaire")
        data = response.json()
        print(f"[OK] Hyperactivity questions: {len(data['hyperactivity_questions'])}")
        print(f"[OK] Inattention questions: {len(data['inattention_questions'])}")
    except Exception as e:
        print(f"[ERROR] ADHD questionnaire failed: {e}")
    
    # Test 5: ADHD prediction
    print("\n5. Testing ADHD prediction...")
    try:
        payload = {
            "q1_responses": [2, 1, 3, 2, 1, 0, 2, 3, 1],  # Hyperactivity
            "q2_responses": [3, 2, 3, 2, 3, 2, 1, 2, 3]   # Inattention
        }
        response = requests.post(f"{BASE_URL}/api/adhd/predict", json=payload)
        result = response.json()
        print(f"[OK] ADHD prediction: Type {result['type']}, Confidence {result['confidence']:.3f}")
        print(f"[OK] Adaptation preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] ADHD prediction failed: {e}")
    
    # Test 6: Vision classification
    print("\n6. Testing vision classification...")
    try:
        payload = {"glasses_power": -2.5}
        response = requests.post(f"{BASE_URL}/api/adaptation/vision/classify", json=payload)
        result = response.json()
        print(f"[OK] Vision classification: Class {result['class_level']}")
        print(f"[OK] Adaptation preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] Vision classification failed: {e}")
    
    # Test 7: Text adaptation
    print("\n7. Testing text adaptation...")
    try:
        payload = {
            "text": "The quick brown fox jumps over the lazy dog. This is a test sentence for adaptation.",
            "dyslexia_preset": "severe",
            "adhd_preset": "hyperactive",
            "vision_preset": "mild"
        }
        response = requests.post(f"{BASE_URL}/api/adaptation/adapt-text", json=payload)
        result = response.json()
        print(f"[OK] Text adapted successfully")
        print(f"[OK] Features enabled: {result['features']}")
        print(f"[OK] TTS enabled: {result['tts_enabled']}")
        print(f"[OK] TL;DR available: {result['tldr_available']}")
        if result['tldr_available']:
            print(f"[OK] TL;DR: {result['tldr']}")
    except Exception as e:
        print(f"[ERROR] Text adaptation failed: {e}")
    
    # Test 8: Get presets
    print("\n8. Testing adaptation presets...")
    try:
        response = requests.get(f"{BASE_URL}/api/adaptation/presets")
        data = response.json()
        print(f"[OK] Dyslexia presets: {list(data['dyslexia'].keys())}")
        print(f"[OK] ADHD presets: {list(data['adhd'].keys())}")
        print(f"[OK] Vision presets: {list(data['vision'].keys())}")
    except Exception as e:
        print(f"[ERROR] Presets failed: {e}")
    
    # Test 9: Get CSS styles
    print("\n9. Testing CSS styles...")
    try:
        response = requests.get(f"{BASE_URL}/api/adaptation/css-styles")
        data = response.json()
        print(f"[OK] CSS styles loaded: {len(data['css'])} characters")
    except Exception as e:
        print(f"[ERROR] CSS styles failed: {e}")
    
    print("\nAPI testing completed!")

if __name__ == "__main__":
    print("Waiting for server to start...")
    time.sleep(3)
    test_api_endpoints()
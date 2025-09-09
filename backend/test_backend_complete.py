import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.text_service import text_service
from app.services.ml_service import ml_service
from app.models.predictions import TextAdaptation, DyslexiaInput, ADHDInput, VisionInput
import asyncio

def test_complete_backend():
    """Test all backend components without server"""
    print("Testing Complete Backend Components...")
    print("=" * 50)
    
    # Test 1: Text Service
    print("\n1. Testing Text Service...")
    try:
        result = text_service.adapt_text(
            "The quick brown fox jumps over the lazy dog.",
            dyslexia_preset="severe",
            adhd_preset="hyperactive", 
            vision_preset="mild"
        )
        print(f"[OK] Text adaptation: {len(result['features'])} features enabled")
        print(f"[OK] TTS enabled: {result['tts_enabled']}")
        print(f"[OK] TL;DR available: {result['tldr_available']}")
        
        if result['tldr_available']:
            tldr = text_service.generate_tldr("The quick brown fox jumps over the lazy dog.")
            print(f"[OK] TL;DR generated: {len(tldr)} chars")
    except Exception as e:
        print(f"[ERROR] Text service failed: {e}")
    
    # Test 2: ML Service - Dyslexia
    print("\n2. Testing ML Service - Dyslexia...")
    try:
        result = ml_service.predict_dyslexia(0.3, 0.4)
        print(f"[OK] Dyslexia prediction: Severity {result['severity']}")
        print(f"[OK] Confidence: {result['confidence']:.3f}")
        print(f"[OK] Preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] Dyslexia prediction failed: {e}")
    
    # Test 3: ML Service - ADHD
    print("\n3. Testing ML Service - ADHD...")
    try:
        result = ml_service.predict_adhd(
            [2, 1, 3, 2, 1, 0, 2, 3, 1],
            [3, 2, 3, 2, 3, 2, 1, 2, 3]
        )
        print(f"[OK] ADHD prediction: Type {result['type']}")
        print(f"[OK] Confidence: {result['confidence']:.3f}")
        print(f"[OK] Preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] ADHD prediction failed: {e}")
    
    # Test 4: ML Service - Vision
    print("\n4. Testing ML Service - Vision...")
    try:
        result = ml_service.classify_vision(-2.5)
        print(f"[OK] Vision classification: Class {result['class_level']}")
        print(f"[OK] Preset: {result['adaptation_preset']}")
    except Exception as e:
        print(f"[ERROR] Vision classification failed: {e}")
    
    # Test 5: Pydantic Models
    print("\n5. Testing Pydantic Models...")
    try:
        # Test TextAdaptation model
        text_adapt = TextAdaptation(
            text="Test text",
            dyslexia_preset="mild",
            adhd_preset="normal",
            vision_preset="normal"
        )
        print(f"[OK] TextAdaptation model: {text_adapt.text[:10]}...")
        
        # Test DyslexiaInput model
        dyslexia_input = DyslexiaInput(speed=0.5, survey_score=0.6)
        print(f"[OK] DyslexiaInput model: speed={dyslexia_input.speed}")
        
        # Test ADHDInput model
        adhd_input = ADHDInput(
            q1_responses=[1, 2, 1, 2, 1, 2, 1, 2, 1],
            q2_responses=[2, 1, 2, 1, 2, 1, 2, 1, 2]
        )
        print(f"[OK] ADHDInput model: {len(adhd_input.q1_responses)} responses")
        
        # Test VisionInput model
        vision_input = VisionInput(glasses_power=-1.5)
        print(f"[OK] VisionInput model: power={vision_input.glasses_power}")
        
    except Exception as e:
        print(f"[ERROR] Pydantic models failed: {e}")
    
    # Test 6: Agent System Import
    print("\n6. Testing Agent System Import...")
    try:
        from app.agents.agent_orchestrator import orchestrator
        print(f"[OK] Agent orchestrator imported")
        print(f"[OK] Available agents: {len(orchestrator.agent_registry)}")
        print(f"[OK] Available workflows: {len(orchestrator.workflow_templates)}")
    except Exception as e:
        print(f"[ERROR] Agent system import failed: {e}")
    
    # Test 7: FastAPI App Import
    print("\n7. Testing FastAPI App Import...")
    try:
        from app.main import app
        print(f"[OK] FastAPI app imported")
        print(f"[OK] App title: {app.title}")
        print(f"[OK] App version: {app.version}")
    except Exception as e:
        print(f"[ERROR] FastAPI app import failed: {e}")
    
    print("\nBackend Component Testing Completed!")

async def test_agent_system():
    """Test agent system functionality"""
    print("\n8. Testing Agent System Functionality...")
    try:
        from app.agents.agent_orchestrator import orchestrator
        
        # Test agent status
        status = await orchestrator.get_agent_status()
        print(f"[OK] Agent status check: {status['orchestrator_status']}")
        
        # Test simple workflow
        test_data = {"user_id": "test", "type": "assessment"}
        result = await orchestrator.execute_workflow("complete_assessment", test_data)
        print(f"[OK] Workflow execution: {result['success']}")
        
    except Exception as e:
        print(f"[ERROR] Agent system functionality failed: {e}")

if __name__ == "__main__":
    test_complete_backend()
    asyncio.run(test_agent_system())
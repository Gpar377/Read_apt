import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from app.services.text_service import text_service
from app.services.ml_service import ml_service
from app.services.google_tts_service import tts_service
from app.agents.agent_orchestrator import orchestrator

async def complete_system_demo():
    """Demonstrate the complete accessibility system workflow"""
    print("COMPLETE ACCESSIBILITY SYSTEM DEMO")
    print("=" * 50)
    
    # STEP 1: User Assessment
    print("\n1. USER ASSESSMENT PHASE")
    print("-" * 30)
    
    # Dyslexia Assessment
    print("Testing user for dyslexia...")
    dyslexia_result = ml_service.predict_dyslexia(0.3, 0.4)  # Slow reading, poor comprehension
    print(f"Dyslexia Result: {dyslexia_result['adaptation_preset']} (confidence: {dyslexia_result['confidence']:.2f})")
    
    # ADHD Assessment  
    print("Testing user for ADHD...")
    adhd_responses = [2, 3, 2, 3, 2, 1, 3, 2, 3, 3, 2, 3, 2, 3, 2, 1, 2, 3]  # High scores
    adhd_result = ml_service.predict_adhd(adhd_responses[:9], adhd_responses[9:])
    print(f"ADHD Result: {adhd_result['adaptation_preset']} (confidence: {adhd_result['confidence']:.2f})")
    
    # Vision Assessment
    print("Testing user vision...")
    vision_result = ml_service.classify_vision(-3.5)  # Strong prescription
    print(f"Vision Result: {vision_result['adaptation_preset']} (class: {vision_result['class_level']})")
    
    # STEP 2: AI Agent Processing
    print("\n2. AI AGENT PROCESSING")
    print("-" * 30)
    
    assessment_data = {
        "user_id": "demo_user",
        "dyslexia_result": dyslexia_result,
        "adhd_result": adhd_result,
        "vision_result": vision_result
    }
    
    agent_result = await orchestrator.execute_workflow("complete_assessment", assessment_data)
    print(f"Agent Workflow: {agent_result['success']} ({len(agent_result['results'])} steps)")
    
    # STEP 3: Text Adaptation
    print("\n3. TEXT ADAPTATION ENGINE")
    print("-" * 30)
    
    sample_text = """
    The quick brown fox jumps over the lazy dog. This pangram contains every letter 
    of the alphabet at least once. Reading comprehension and speed are important 
    factors in accessibility. Modern technology can help users with different needs 
    access digital content more effectively.
    """
    
    # Apply adaptations based on assessment results
    adapted_result = text_service.adapt_text(
        sample_text,
        dyslexia_preset=dyslexia_result['adaptation_preset'],
        adhd_preset=adhd_result['adaptation_preset'], 
        vision_preset=vision_result['adaptation_preset']
    )
    
    print(f"Original text length: {len(sample_text)} chars")
    print(f"Adapted text length: {len(adapted_result['adapted_text'])} chars")
    print(f"Features applied: {adapted_result['features']}")
    print(f"TTS enabled: {adapted_result['tts_enabled']}")
    print(f"TL;DR available: {adapted_result['tldr_available']}")
    
    # Generate TL;DR if available
    if adapted_result['tldr_available']:
        tldr = text_service.generate_tldr(sample_text)
        print(f"TL;DR: {tldr}")
    
    # STEP 4: TTS Configuration
    print("\n4. TEXT-TO-SPEECH SETUP")
    print("-" * 30)
    
    # Determine TTS condition based on results
    tts_condition = "normal"
    if dyslexia_result['adaptation_preset'] == "severe":
        tts_condition = "dyslexia"
    elif adhd_result['adaptation_preset'] in ["hyperactive", "severe"]:
        tts_condition = "adhd"  
    elif vision_result['adaptation_preset'] == "low_vision":
        tts_condition = "vision"
    
    # Get TTS configuration
    if tts_condition == "dyslexia":
        tts_config = tts_service.get_dyslexia_voice_config()
    elif tts_condition == "adhd":
        tts_config = tts_service.get_adhd_voice_config()
    elif tts_condition == "vision":
        tts_config = tts_service.get_vision_voice_config()
    else:
        tts_config = {"speaking_rate": 1.0, "pitch": 0.0}
    
    print(f"TTS Condition: {tts_condition}")
    print(f"TTS Config: {tts_config}")
    
    # Generate TTS result
    tts_result = tts_service.synthesize_speech(sample_text[:100] + "...", tts_config)
    print(f"TTS Ready: {tts_result['success']} ({tts_result['provider']})")
    
    # STEP 5: Complete User Profile
    print("\n5. COMPLETE USER PROFILE")
    print("-" * 30)
    
    user_profile = {
        "user_id": "demo_user",
        "assessments": {
            "dyslexia": dyslexia_result,
            "adhd": adhd_result,
            "vision": vision_result
        },
        "adaptations": {
            "text_features": adapted_result['features'],
            "css_styles": adapted_result['css_styles'],
            "tts_enabled": adapted_result['tts_enabled'],
            "tldr_available": adapted_result['tldr_available']
        },
        "tts_configuration": {
            "condition": tts_condition,
            "settings": tts_config,
            "provider": tts_result['provider']
        },
        "ai_agents": {
            "workflow_completed": agent_result['success'],
            "steps_executed": len(agent_result['results'])
        }
    }
    
    print("User Profile Generated:")
    for category, data in user_profile.items():
        if category != "user_id":
            print(f"  {category}: {len(str(data))} chars of config data")
    
    # STEP 6: Browser Integration Code
    print("\n6. BROWSER INTEGRATION")
    print("-" * 30)
    
    # Generate JavaScript for browser extension
    browser_js = f"""
// Generated Accessibility Configuration
const userConfig = {{
    dyslexia: "{dyslexia_result['adaptation_preset']}",
    adhd: "{adhd_result['adaptation_preset']}", 
    vision: "{vision_result['adaptation_preset']}",
    tts_enabled: {str(adapted_result['tts_enabled']).lower()},
    tldr_available: {str(adapted_result['tldr_available']).lower()}
}};

// Apply CSS adaptations
const cssStyles = `{adapted_result['css_styles']}`;
const styleSheet = document.createElement('style');
styleSheet.textContent = cssStyles;
document.head.appendChild(styleSheet);

// Setup TTS
const ttsConfig = {{
    rate: {tts_config.get('speaking_rate', 1.0)},
    pitch: {1.0 + tts_config.get('pitch', 0.0) / 10},
    volume: 1.0
}};

function speakText(text) {{
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = ttsConfig.rate;
    utterance.pitch = ttsConfig.pitch;
    utterance.volume = ttsConfig.volume;
    speechSynthesis.speak(utterance);
}}

// Auto-adapt page content
document.addEventListener('DOMContentLoaded', function() {{
    // Apply text adaptations to all paragraphs
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {{
        if (userConfig.dyslexia === 'severe') {{
            p.style.letterSpacing = '3px';
            p.style.lineHeight = '2.5';
        }}
        if (userConfig.adhd === 'hyperactive') {{
            // Add sentence chunking
            p.style.marginBottom = '20px';
        }}
        if (userConfig.vision === 'low_vision') {{
            p.style.fontSize = '150%';
            p.style.backgroundColor = 'white';
            p.style.color = 'black';
        }}
    }});
    
    // Add TTS buttons if enabled
    if (userConfig.tts_enabled) {{
        paragraphs.forEach(p => {{
            const ttsBtn = document.createElement('button');
            ttsBtn.textContent = '🔊';
            ttsBtn.onclick = () => speakText(p.textContent);
            p.appendChild(ttsBtn);
        }});
    }}
}});
"""
    
    print("Browser JavaScript generated:")
    print(f"  - CSS adaptations: {len(adapted_result['css_styles'])} chars")
    print(f"  - TTS configuration: {len(str(tts_config))} chars")
    print(f"  - Auto-adaptation script: {len(browser_js)} chars")
    
    # STEP 7: API Endpoints Summary
    print("\n7. AVAILABLE API ENDPOINTS")
    print("-" * 30)
    
    endpoints = [
        "POST /api/dyslexia/predict - Dyslexia assessment",
        "POST /api/adhd/predict - ADHD assessment", 
        "POST /api/adaptation/vision/classify - Vision classification",
        "POST /api/adaptation/adapt-text - Text adaptation",
        "GET /api/adaptation/presets - Get adaptation presets",
        "GET /api/adaptation/css-styles - Get CSS styles",
        "POST /api/tts/speak - Text-to-speech",
        "GET /api/tts/voice-configs - TTS configurations",
        "POST /api/agents/intelligent-routing - AI agent workflows",
        "GET /api/agents/status - Agent system status"
    ]
    
    for endpoint in endpoints:
        print(f"  {endpoint}")
    
    print(f"\nTotal API endpoints: {len(endpoints)}")
    
    print("\n" + "=" * 50)
    print("COMPLETE SYSTEM DEMONSTRATION FINISHED")
    print("[SUCCESS] All components working together!")
    print("[SUCCESS] Ready for browser extension integration!")

def run_complete_demo():
    """Run the complete system demonstration"""
    try:
        asyncio.run(complete_system_demo())
    except Exception as e:
        print(f"Demo failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_complete_demo()
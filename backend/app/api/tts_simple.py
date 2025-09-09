from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.google_tts_service import tts_service

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    condition: Optional[str] = "normal"  # dyslexia, adhd, vision, normal

@router.post("/speak")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech with accessibility optimizations"""
    try:
        # Get voice configuration based on condition
        voice_config = None
        
        if request.condition == "dyslexia":
            voice_config = tts_service.get_dyslexia_voice_config()
        elif request.condition == "adhd":
            voice_config = tts_service.get_adhd_voice_config()
        elif request.condition == "vision":
            voice_config = tts_service.get_vision_voice_config()
        
        # Synthesize speech
        result = tts_service.synthesize_speech(request.text, voice_config)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "TTS failed"))
        
        return {
            "success": True,
            "text": request.text,
            "condition": request.condition,
            "tts_result": result,
            "instructions": "Use the provided settings with browser speechSynthesis API"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/voice-configs")
async def get_voice_configurations():
    """Get TTS voice configurations for different conditions"""
    return {
        "dyslexia": {
            "config": tts_service.get_dyslexia_voice_config(),
            "description": "Slower, clearer speech for dyslexic users"
        },
        "adhd": {
            "config": tts_service.get_adhd_voice_config(), 
            "description": "Engaging pace to maintain attention"
        },
        "vision": {
            "config": tts_service.get_vision_voice_config(),
            "description": "Loud, clear speech for low vision users"
        },
        "usage": "Apply these settings to browser speechSynthesis API"
    }

@router.post("/generate-speech-config")
async def generate_speech_config(
    text: str,
    dyslexia_preset: str = "normal",
    adhd_preset: str = "normal",
    vision_preset: str = "normal"
):
    """Generate TTS configuration based on accessibility presets"""
    try:
        # Determine primary condition
        condition = "normal"
        if dyslexia_preset in ["mild", "severe"]:
            condition = "dyslexia"
        elif adhd_preset in ["inattentive", "hyperactive", "severe"]:
            condition = "adhd"
        elif vision_preset == "low_vision":
            condition = "vision"
        
        # Get appropriate voice config
        voice_config = None
        if condition == "dyslexia":
            voice_config = tts_service.get_dyslexia_voice_config()
        elif condition == "adhd":
            voice_config = tts_service.get_adhd_voice_config()
        elif condition == "vision":
            voice_config = tts_service.get_vision_voice_config()
        
        # Generate TTS result
        result = tts_service.synthesize_speech(text, voice_config)
        
        return {
            "success": True,
            "text": text,
            "detected_condition": condition,
            "presets_applied": {
                "dyslexia": dyslexia_preset,
                "adhd": adhd_preset,
                "vision": vision_preset
            },
            "tts_config": result,
            "browser_implementation": {
                "javascript": f"""
// TTS Implementation for {condition} users
const utterance = new SpeechSynthesisUtterance("{text}");
utterance.rate = {result.get('settings', {}).get('rate', 1.0)};
utterance.pitch = {result.get('settings', {}).get('pitch', 1.0)};
utterance.volume = {result.get('settings', {}).get('volume', 1.0)};
speechSynthesis.speak(utterance);
                """
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-tts")
async def test_tts():
    """Test TTS for all accessibility conditions"""
    test_results = {}
    
    test_texts = {
        "dyslexia": "This is a test for dyslexic users with slower, clearer speech.",
        "adhd": "Quick test for ADHD users with engaging pace!",
        "vision": "This is a test for low vision users with loud, clear speech.",
        "normal": "This is a normal speech test."
    }
    
    for condition, text in test_texts.items():
        try:
            voice_config = None
            if condition == "dyslexia":
                voice_config = tts_service.get_dyslexia_voice_config()
            elif condition == "adhd":
                voice_config = tts_service.get_adhd_voice_config()
            elif condition == "vision":
                voice_config = tts_service.get_vision_voice_config()
            
            result = tts_service.synthesize_speech(text, voice_config)
            test_results[condition] = {
                "text": text,
                "config": voice_config,
                "result": result,
                "success": result["success"]
            }
            
        except Exception as e:
            test_results[condition] = {
                "text": text,
                "success": False,
                "error": str(e)
            }
    
    return {
        "message": "TTS testing completed for all conditions",
        "tests": test_results,
        "implementation_note": "Use browser speechSynthesis API with provided settings"
    }
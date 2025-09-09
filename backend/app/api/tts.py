from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.tts_service import tts_service

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    rate: Optional[int] = 150
    volume: Optional[float] = 0.8
    voice_id: Optional[int] = 0

class TTSSettingsRequest(BaseModel):
    rate: Optional[int] = 150
    volume: Optional[float] = 0.8
    voice_id: Optional[int] = 0

@router.post("/speak")
async def speak_text(request: TTSRequest):
    """Convert text to speech and play it"""
    try:
        settings = {
            "rate": request.rate,
            "volume": request.volume,
            "voice_id": request.voice_id
        }
        
        result = tts_service.speak_text(request.text, settings)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "success": True,
            "message": "Text is being spoken",
            "text_preview": request.text[:50] + "..." if len(request.text) > 50 else request.text,
            "settings": result["settings_used"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-audio")
async def generate_audio(request: TTSRequest):
    """Generate audio file from text"""
    try:
        settings = {
            "rate": request.rate,
            "volume": request.volume,
            "voice_id": request.voice_id
        }
        
        result = tts_service.save_audio(request.text, settings)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "success": True,
            "audio_data": result["audio_data"],
            "format": result["format"],
            "text_length": result["text_length"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/voices")
async def get_voices():
    """Get available TTS voices"""
    try:
        voices = tts_service.get_available_voices()
        return voices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/optimized-settings/{condition}")
async def get_optimized_settings(condition: str):
    """Get TTS settings optimized for specific conditions"""
    try:
        if condition.lower() == "dyslexia":
            settings = tts_service.get_dyslexia_optimized_settings()
        elif condition.lower() == "adhd":
            settings = tts_service.get_adhd_optimized_settings()
        elif condition.lower() == "vision":
            settings = tts_service.get_vision_optimized_settings()
        else:
            raise HTTPException(status_code=400, detail="Invalid condition. Use: dyslexia, adhd, or vision")
        
        return {
            "condition": condition,
            "optimized_settings": settings,
            "usage": f"These settings are optimized for users with {condition}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-speech")
async def test_speech():
    """Test TTS with sample text"""
    try:
        sample_texts = {
            "dyslexia": "This is a test for dyslexic users. The speech is slower and clearer to help with comprehension.",
            "adhd": "Quick test for ADHD users! This speech maintains attention with an engaging pace.",
            "vision": "This is a test for users with low vision. The speech is loud and clear for better accessibility."
        }
        
        results = {}
        
        for condition, text in sample_texts.items():
            if condition == "dyslexia":
                settings = tts_service.get_dyslexia_optimized_settings()
            elif condition == "adhd":
                settings = tts_service.get_adhd_optimized_settings()
            else:
                settings = tts_service.get_vision_optimized_settings()
            
            result = tts_service.speak_text(text, settings)
            results[condition] = {
                "text": text,
                "settings": settings,
                "success": result["success"]
            }
        
        return {
            "message": "Testing TTS for all conditions",
            "tests": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/speak-adapted-text")
async def speak_adapted_text(
    text: str,
    dyslexia_preset: str = "normal",
    adhd_preset: str = "normal", 
    vision_preset: str = "normal"
):
    """Speak text with accessibility adaptations"""
    try:
        # Determine optimal TTS settings based on presets
        settings = {"rate": 150, "volume": 0.8, "voice_id": 0}
        
        # Adjust for dyslexia
        if dyslexia_preset == "severe":
            dyslexia_settings = tts_service.get_dyslexia_optimized_settings()
            settings.update(dyslexia_settings)
        
        # Adjust for ADHD
        if adhd_preset in ["hyperactive", "severe"]:
            adhd_settings = tts_service.get_adhd_optimized_settings()
            settings["rate"] = adhd_settings["rate"]
        
        # Adjust for vision
        if vision_preset == "low_vision":
            vision_settings = tts_service.get_vision_optimized_settings()
            settings["volume"] = vision_settings["volume"]
        
        result = tts_service.speak_text(text, settings)
        
        return {
            "success": result["success"],
            "message": "Adapted text is being spoken",
            "adaptations_applied": {
                "dyslexia": dyslexia_preset,
                "adhd": adhd_preset,
                "vision": vision_preset
            },
            "tts_settings": settings
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
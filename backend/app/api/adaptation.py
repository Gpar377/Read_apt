from fastapi import APIRouter
from app.models.predictions import TextAdaptation, VisionInput, VisionResult
from app.services.text_service import text_service
from app.services.ml_service import ml_service

router = APIRouter()

@router.post("/adapt-text")
async def adapt_text(adaptation_request: TextAdaptation):
    """Apply text adaptations based on user presets"""
    result = text_service.adapt_text(
        adaptation_request.text,
        adaptation_request.dyslexia_preset,
        adaptation_request.adhd_preset,
        adaptation_request.vision_preset
    )
    
    # Generate TL;DR if needed
    if result["tldr_available"]:
        result["tldr"] = text_service.generate_tldr(adaptation_request.text)
    
    return result

@router.post("/vision/classify", response_model=VisionResult)
async def classify_vision(input_data: VisionInput):
    """Classify vision level based on glasses prescription"""
    result = ml_service.classify_vision(input_data.glasses_power)
    return VisionResult(**result)

@router.get("/presets")
async def get_adaptation_presets():
    """Get available adaptation presets and their descriptions"""
    return {
        "dyslexia": {
            "normal": "Standard text display",
            "mild": "Moderate letter and line spacing",
            "severe": "Heavy spacing, dyslexic letter highlighting, TTS support"
        },
        "adhd": {
            "normal": "Standard text display",
            "inattentive": "Highlight every 3rd word for focus",
            "hyperactive": "Chunked sentences, word highlighting, TL;DR available",
            "severe": "Full chunking, highlighting, TTS, and TL;DR support"
        },
        "vision": {
            "normal": "Standard text size and contrast",
            "mild": "25-30% text enlargement, slight spacing increase",
            "low_vision": "50% larger fonts, high contrast, TTS support"
        }
    }

@router.get("/css-styles")
async def get_css_styles():
    """Get CSS classes for text adaptations"""
    return {
        "css": """
        .dyslexic-mirror {
            background-color: #fef3c7;
            color: #92400e;
            font-weight: bold;
            padding: 1px 3px;
            border-radius: 3px;
            border: 1px solid #f59e0b;
        }
        
        .dyslexic-vowel {
            background-color: #dbeafe;
            color: #1e40af;
            font-weight: 600;
            padding: 1px 2px;
            border-radius: 2px;
        }
        
        .dyslexic-syllables {
            letter-spacing: 2px;
            word-spacing: 4px;
        }
        
        .reading-line-odd {
            background-color: #f9fafb;
            padding: 8px 12px;
            margin: 2px 0;
            border-left: 3px solid #10b981;
        }
        
        .reading-line-even {
            background-color: #f3f4f6;
            padding: 8px 12px;
            margin: 2px 0;
            border-left: 3px solid #3b82f6;
        }
        
        .adhd-highlight {
            background-color: #e3f2fd;
            font-weight: bold;
            padding: 1px 3px;
            border-radius: 3px;
        }
        
        .sentence-chunk {
            margin-bottom: 15px;
            padding: 10px;
            border-left: 3px solid #2196f3;
            background-color: #f8f9fa;
        }
        
        .tts-button {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        
        .tldr-section {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #ff9800;
        }
        """
    }
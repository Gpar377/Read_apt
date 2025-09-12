from fastapi import APIRouter
from app.models.predictions import DyslexiaInput, DyslexiaResult
from app.services.ml_service import ml_service
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

@router.post("/predict", response_model=DyslexiaResult)
async def predict_dyslexia(input_data: DyslexiaInput):
    """Predict dyslexia severity based on reading speed and comprehension"""
    result = ml_service.predict_dyslexia(input_data.speed, input_data.survey_score)
    return DyslexiaResult(**result)

class EnhancedDyslexiaInput(BaseModel):
    reading_speed: float
    survey_score: float
    comprehension_score: Optional[float] = None

@router.post("/predict-enhanced", response_model=DyslexiaResult)
async def predict_dyslexia_enhanced(input_data: EnhancedDyslexiaInput):
    """Enhanced dyslexia prediction with comprehension scoring"""
    # Calculate weighted score including comprehension
    weighted_score = (
        input_data.reading_speed * 0.4 + 
        (1 - input_data.survey_score) * 0.4 +  # Invert survey score (higher = worse)
        (input_data.comprehension_score or 0.5) * 0.2
    )
    
    if weighted_score > 0.7:
        severity = "normal"
        preset = 2
    elif weighted_score > 0.4:
        severity = "mild" 
        preset = 1
    else:
        severity = "severe"
        preset = 0
    
    return DyslexiaResult(
        severity=severity,
        confidence=min(weighted_score, 0.95),
        preset=preset,
        recommendations=[
            "Use dyslexia-friendly fonts" if severity != "normal" else "Continue regular reading",
            "Increase line spacing" if severity == "severe" else "Moderate spacing adjustments",
            "Enable letter highlighting" if severity == "severe" else "Standard text formatting"
        ]
    )

@router.get("/sample-text")
async def get_sample_reading_text():
    """Get enhanced sample text for dyslexia reading test"""
    return {
        "text": "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Reading speed and comprehension are important factors in assessing dyslexia. The ability to process written information quickly and accurately varies among individuals. Some people find it challenging to distinguish between similar-looking letters like 'b' and 'd' or 'p' and 'q'.",
        "questions": [
            {
                "question": "What animal jumps over the dog?",
                "options": ["Cat", "Fox", "Rabbit", "Horse"],
                "correct": 1
            },
            {
                "question": "What type of sentence is mentioned in the text?",
                "options": ["Palindrome", "Pangram", "Anagram", "Acronym"],
                "correct": 1
            },
            {
                "question": "Which letter pairs are mentioned as challenging to distinguish?",
                "options": ["a/e and i/o", "b/d and p/q", "m/n and r/s", "f/t and h/k"],
                "correct": 1
            }
        ]
    }
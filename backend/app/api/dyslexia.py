from fastapi import APIRouter
from app.models.predictions import DyslexiaInput, DyslexiaResult
from app.services.ml_service import ml_service

router = APIRouter()

@router.post("/predict", response_model=DyslexiaResult)
async def predict_dyslexia(input_data: DyslexiaInput):
    """Predict dyslexia severity based on reading speed and comprehension"""
    result = ml_service.predict_dyslexia(input_data.speed, input_data.survey_score)
    return DyslexiaResult(**result)

@router.get("/sample-text")
async def get_sample_reading_text():
    """Get sample text for dyslexia reading test"""
    return {
        "text": "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Reading speed and comprehension are important factors in assessing dyslexia. The ability to process written information quickly and accurately varies among individuals.",
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
                "question": "What does the text say varies among individuals?",
                "options": ["Height", "Age", "Processing ability", "Color preference"],
                "correct": 2
            }
        ]
    }
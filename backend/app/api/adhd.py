from fastapi import APIRouter
from app.models.predictions import ADHDInput, ADHDResult
from app.services.ml_service import ml_service
from pydantic import BaseModel
from typing import List

router = APIRouter()

class SimpleADHDInput(BaseModel):
    answers: List[int]

@router.post("/predict", response_model=ADHDResult)
async def predict_adhd(input_data: SimpleADHDInput):
    """Predict ADHD type based on questionnaire responses"""
    # Split answers into hyperactivity (first 9) and inattention (last 9)
    hyperactivity_score = sum(input_data.answers[:9]) / 27  # Max 27 (9*3)
    inattention_score = sum(input_data.answers[9:]) / 27
    
    if hyperactivity_score > 0.6 and inattention_score > 0.6:
        adhd_type = "combined"
        preset = 0
    elif hyperactivity_score > 0.6:
        adhd_type = "hyperactive"
        preset = 1
    elif inattention_score > 0.6:
        adhd_type = "inattentive"
        preset = 2
    else:
        adhd_type = "normal"
        preset = 3
    
    return ADHDResult(
        type=adhd_type,
        confidence=max(hyperactivity_score, inattention_score),
        preset=preset,
        recommendations=[
            "Use text chunking" if adhd_type != "normal" else "Continue regular reading",
            "Enable word highlighting" if adhd_type in ["inattentive", "combined"] else "Standard formatting",
            "Use TL;DR summaries" if adhd_type in ["hyperactive", "combined"] else "Full text reading"
        ]
    )

@router.get("/questionnaire")
async def get_adhd_questionnaire():
    """Get ADHD assessment questionnaire"""
    return {
        "hyperactivity_questions": [
            "How often do you fidget with your hands or feet?",
            "How often do you leave your seat when expected to remain seated?",
            "How often do you feel restless?",
            "How often do you have difficulty engaging in quiet activities?",
            "How often do you feel 'on the go' or act as if 'driven by a motor'?",
            "How often do you talk excessively?",
            "How often do you blurt out answers before questions are completed?",
            "How often do you have difficulty waiting your turn?",
            "How often do you interrupt or intrude on others?"
        ],
        "inattention_questions": [
            "How often do you fail to pay close attention to details?",
            "How often do you have difficulty sustaining attention in tasks?",
            "How often do you don't seem to listen when spoken to directly?",
            "How often do you don't follow through on instructions?",
            "How often do you have difficulty organizing tasks and activities?",
            "How often do you avoid tasks that require sustained mental effort?",
            "How often do you lose things necessary for tasks?",
            "How often are you easily distracted by extraneous stimuli?",
            "How often are you forgetful in daily activities?"
        ],
        "scale": {
            "0": "Never",
            "1": "Rarely", 
            "2": "Sometimes",
            "3": "Often"
        }
    }
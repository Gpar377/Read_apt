from pydantic import BaseModel
from typing import List

class DyslexiaInput(BaseModel):
    speed: float  # 0-1 reading speed score
    survey_score: float  # 0-1 comprehension score

class DyslexiaResult(BaseModel):
    severity: str  # "severe", "mild", "normal"
    confidence: float
    preset: int  # 0: severe, 1: mild, 2: normal
    recommendations: List[str] = []

class ADHDInput(BaseModel):
    q1_responses: List[int]  # Q1_1 to Q1_9 (hyperactivity)
    q2_responses: List[int]  # Q2_1 to Q2_9 (inattention)

class ADHDResult(BaseModel):
    type: str  # "normal", "inattentive", "hyperactive", "combined"
    confidence: float
    preset: int  # 0-3
    recommendations: List[str] = []

class VisionInput(BaseModel):
    glasses_power: float  # Diopter value

class VisionResult(BaseModel):
    level: str  # "normal", "mild", "moderate", "severe"
    confidence: float
    preset: int
    recommendations: List[str] = []

class TextAdaptation(BaseModel):
    text: str
    dyslexia_preset: str = "normal"
    adhd_preset: str = "normal"
    vision_preset: str = "normal"
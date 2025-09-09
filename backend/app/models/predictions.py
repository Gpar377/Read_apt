from pydantic import BaseModel
from typing import List

class DyslexiaInput(BaseModel):
    speed: float  # 0-1 reading speed score
    survey_score: float  # 0-1 comprehension score

class DyslexiaResult(BaseModel):
    severity: int  # 0: severe, 1: mild, 2: no dyslexia
    confidence: float
    adaptation_preset: str

class ADHDInput(BaseModel):
    q1_responses: List[int]  # Q1_1 to Q1_9 (hyperactivity)
    q2_responses: List[int]  # Q2_1 to Q2_9 (inattention)

class ADHDResult(BaseModel):
    type: int  # 0: no ADHD, 1: inattentive, 2: hyperactive, 3: severe
    confidence: float
    adaptation_preset: str

class VisionInput(BaseModel):
    glasses_power: float  # Diopter value

class VisionResult(BaseModel):
    class_level: int  # 0: normal, 1: mild, 2: low vision
    adaptation_preset: str

class TextAdaptation(BaseModel):
    text: str
    dyslexia_preset: str = "normal"
    adhd_preset: str = "normal"
    vision_preset: str = "normal"
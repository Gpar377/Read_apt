from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.gemini_service import gemini_service

router = APIRouter()

class SummaryRequest(BaseModel):
    text: str
    summary_type: Optional[str] = "general"  # general, adhd, dyslexia
    max_length: Optional[int] = 100

class SummaryResponse(BaseModel):
    success: bool
    summary: str
    word_count: int
    source: str
    format: Optional[str] = None

@router.post("/generate", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate text summary using Gemini API"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        if len(request.text) < 50:
            raise HTTPException(status_code=400, detail="Text too short to summarize")
        
        if request.summary_type == "adhd":
            result = await gemini_service.generate_adhd_summary(request.text)
        else:
            result = await gemini_service.generate_summary(request.text, request.max_length)
        
        return SummaryResponse(
            success=result["success"],
            summary=result["summary"],
            word_count=result["word_count"],
            source=result["source"],
            format=result.get("format")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@router.post("/tldr")
async def generate_tldr(request: SummaryRequest):
    """Generate TL;DR summary specifically for ADHD users"""
    try:
        request.summary_type = "adhd"
        request.max_length = 50  # Keep it very short
        
        result = await gemini_service.generate_adhd_summary(request.text)
        
        return {
            "tldr": result["summary"],
            "success": result["success"],
            "source": result["source"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TL;DR generation failed: {str(e)}")

@router.get("/supported-types")
async def get_supported_summary_types():
    """Get supported summary types"""
    return {
        "summary_types": [
            {
                "type": "general",
                "description": "Standard summary for all users",
                "max_length": 100
            },
            {
                "type": "adhd", 
                "description": "Bullet-point summary for ADHD users",
                "max_length": 75
            },
            {
                "type": "dyslexia",
                "description": "Simple language summary for dyslexic users", 
                "max_length": 80
            }
        ]
    }
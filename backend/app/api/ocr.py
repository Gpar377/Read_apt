from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from app.services.ocr_service import ocr_service
from app.services.text_service import text_service

router = APIRouter()

class OCRBase64Request(BaseModel):
    image_base64: str
    disorder_type: Optional[str] = None  # dyslexia, adhd, vision
    severity: Optional[str] = "normal"   # normal, mild, severe

@router.post("/extract-text")
async def extract_text_from_upload(file: UploadFile = File(...)):
    """Extract text from uploaded image file"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file data
        image_data = await file.read()
        
        # Extract text using OCR
        result = ocr_service.extract_text_from_image(image_data)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "OCR failed"))
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": result["extracted_text"],
            "character_count": result["character_count"],
            "word_count": result["word_count"],
            "confidence": result["confidence"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

@router.post("/extract-and-adapt")
async def extract_and_adapt_text(request: OCRBase64Request):
    """Extract text from base64 image and apply accessibility adaptations"""
    try:
        # Extract text from image
        ocr_result = ocr_service.extract_text_from_base64(request.image_base64)
        
        if not ocr_result["success"]:
            raise HTTPException(status_code=500, detail=ocr_result.get("error", "OCR failed"))
        
        extracted_text = ocr_result["extracted_text"]
        
        if not extracted_text.strip():
            return {
                "success": False,
                "error": "No text found in image",
                "extracted_text": "",
                "adapted_text": ""
            }
        
        # Apply single disorder adaptation
        adapted_result = None
        if request.disorder_type and request.disorder_type != "normal":
            # Apply adaptation for single disorder only
            if request.disorder_type == "dyslexia":
                adapted_result = text_service.adapt_text(
                    extracted_text, 
                    dyslexia_preset=request.severity,
                    adhd_preset="normal",
                    vision_preset="normal"
                )
            elif request.disorder_type == "adhd":
                adapted_result = text_service.adapt_text(
                    extracted_text,
                    dyslexia_preset="normal", 
                    adhd_preset=request.severity,
                    vision_preset="normal"
                )
            elif request.disorder_type == "vision":
                adapted_result = text_service.adapt_text(
                    extracted_text,
                    dyslexia_preset="normal",
                    adhd_preset="normal", 
                    vision_preset=request.severity
                )
        
        return {
            "success": True,
            "ocr_result": {
                "extracted_text": extracted_text,
                "character_count": ocr_result["character_count"],
                "word_count": ocr_result["word_count"],
                "confidence": ocr_result["confidence"]
            },
            "adaptation_result": adapted_result,
            "disorder_applied": request.disorder_type,
            "severity_applied": request.severity
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR and adaptation failed: {str(e)}")

@router.get("/supported-formats")
async def get_supported_formats():
    """Get supported image formats for OCR"""
    return {
        "supported_formats": ["jpg", "jpeg", "png", "bmp", "tiff", "gif"],
        "max_file_size": "10MB",
        "recommended_dpi": "300 DPI for best results",
        "tips": [
            "Use high contrast images",
            "Ensure text is clearly visible",
            "Avoid skewed or rotated images",
            "Good lighting improves accuracy"
        ]
    }
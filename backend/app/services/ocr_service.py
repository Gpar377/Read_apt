import pytesseract
from PIL import Image
import io
import base64
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        # Configure Tesseract path if needed (Windows)
        try:
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        except:
            pass  # Use system PATH
    
    def extract_text_from_image(self, image_data: bytes) -> Dict[str, Any]:
        """Extract text from image using OCR"""
        try:
            # Open image from bytes
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract
            extracted_text = pytesseract.image_to_string(image, lang='eng')
            
            # Clean up text
            cleaned_text = self._clean_extracted_text(extracted_text)
            
            return {
                "success": True,
                "extracted_text": cleaned_text,
                "character_count": len(cleaned_text),
                "word_count": len(cleaned_text.split()),
                "confidence": self._estimate_confidence(cleaned_text)
            }
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "extracted_text": ""
            }
    
    def extract_text_from_base64(self, base64_image: str) -> Dict[str, Any]:
        """Extract text from base64 encoded image"""
        try:
            # Remove data URL prefix if present
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]
            
            # Decode base64 to bytes
            image_data = base64.b64decode(base64_image)
            
            return self.extract_text_from_image(image_data)
            
        except Exception as e:
            logger.error(f"Base64 OCR extraction failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "extracted_text": ""
            }
    
    def _clean_extracted_text(self, text: str) -> str:
        """Clean and format extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        cleaned = ' '.join(lines)
        
        # Fix common OCR errors
        cleaned = cleaned.replace('  ', ' ')  # Double spaces
        cleaned = cleaned.replace(' .', '.')  # Space before period
        cleaned = cleaned.replace(' ,', ',')  # Space before comma
        
        return cleaned.strip()
    
    def _estimate_confidence(self, text: str) -> float:
        """Estimate OCR confidence based on text characteristics"""
        if not text:
            return 0.0
        
        # Simple heuristic based on text length and character variety
        word_count = len(text.split())
        char_variety = len(set(text.lower()))
        
        if word_count < 5:
            return 0.3
        elif word_count < 20:
            return 0.6
        elif char_variety > 15:
            return 0.9
        else:
            return 0.7

ocr_service = OCRService()
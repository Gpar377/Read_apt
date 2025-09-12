import os
import requests
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    async def generate_summary(self, text: str, max_length: int = 100) -> Dict[str, Any]:
        """Generate a TL;DR summary using Gemini API"""
        try:
            if not self.api_key:
                return self._fallback_summary(text, max_length)
            
            prompt = f"""
            Please provide a concise TL;DR summary of the following text in {max_length} words or less.
            Focus on the main points and key information:
            
            {text}
            
            TL;DR:
            """
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "maxOutputTokens": max_length * 2,
                    "temperature": 0.3,
                    "topP": 0.8,
                    "topK": 40
                }
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                summary = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                
                # Clean up the summary
                if summary.startswith("TL;DR:"):
                    summary = summary[6:].strip()
                
                return {
                    "success": True,
                    "summary": summary,
                    "word_count": len(summary.split()),
                    "source": "gemini"
                }
            else:
                logger.error(f"Gemini API error: {response.status_code} - {response.text}")
                return self._fallback_summary(text, max_length)
                
        except Exception as e:
            logger.error(f"Gemini summary generation failed: {str(e)}")
            return self._fallback_summary(text, max_length)
    
    def _fallback_summary(self, text: str, max_length: int) -> Dict[str, Any]:
        """Fallback summary generation using simple text processing"""
        sentences = text.split('. ')
        
        # Take first few sentences up to max_length words
        summary_sentences = []
        word_count = 0
        
        for sentence in sentences:
            sentence_words = len(sentence.split())
            if word_count + sentence_words <= max_length:
                summary_sentences.append(sentence)
                word_count += sentence_words
            else:
                break
        
        if not summary_sentences:
            # If no complete sentences fit, take first max_length words
            words = text.split()[:max_length]
            summary = ' '.join(words) + '...'
        else:
            summary = '. '.join(summary_sentences)
            if not summary.endswith('.'):
                summary += '.'
        
        return {
            "success": True,
            "summary": summary,
            "word_count": len(summary.split()),
            "source": "fallback"
        }
    
    async def generate_adhd_summary(self, text: str) -> Dict[str, Any]:
        """Generate ADHD-friendly summary with bullet points"""
        try:
            if not self.api_key:
                return self._fallback_adhd_summary(text)
            
            prompt = f"""
            Create an ADHD-friendly summary of this text using:
            - Short bullet points
            - Key facts only
            - Easy to scan format
            - Maximum 5 bullet points
            
            Text: {text}
            
            Summary:
            """
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "maxOutputTokens": 200,
                    "temperature": 0.2,
                    "topP": 0.8
                }
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.base_url}?key={self.api_key}",
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                summary = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                
                return {
                    "success": True,
                    "summary": summary,
                    "format": "bullet_points",
                    "source": "gemini"
                }
            else:
                return self._fallback_adhd_summary(text)
                
        except Exception as e:
            logger.error(f"ADHD summary generation failed: {str(e)}")
            return self._fallback_adhd_summary(text)
    
    def _fallback_adhd_summary(self, text: str) -> Dict[str, Any]:
        """Fallback ADHD summary with bullet points"""
        sentences = text.split('. ')[:5]  # Take first 5 sentences
        
        bullet_points = []
        for i, sentence in enumerate(sentences):
            if sentence.strip():
                # Keep sentences short (max 15 words)
                words = sentence.split()[:15]
                bullet_point = '• ' + ' '.join(words)
                if not bullet_point.endswith('.'):
                    bullet_point += '.'
                bullet_points.append(bullet_point)
        
        summary = '\n'.join(bullet_points)
        
        return {
            "success": True,
            "summary": summary,
            "format": "bullet_points",
            "source": "fallback"
        }

gemini_service = GeminiService()
import pyttsx3
import threading
from typing import Dict, Any, Optional
import tempfile
import os
import base64

class TTSService:
    """Text-to-Speech service for accessibility features"""
    
    def __init__(self):
        self.engine = None
        self.voices = []
        self.current_settings = {
            "rate": 150,
            "volume": 0.8,
            "voice_id": 0
        }
        self._initialize_engine()
    
    def _initialize_engine(self):
        """Initialize TTS engine"""
        try:
            self.engine = pyttsx3.init()
            self.voices = self.engine.getProperty('voices')
            
            # Set default properties
            self.engine.setProperty('rate', self.current_settings["rate"])
            self.engine.setProperty('volume', self.current_settings["volume"])
            
            if self.voices:
                self.engine.setProperty('voice', self.voices[0].id)
            
            print(f"TTS Engine initialized with {len(self.voices)} voices")
            
        except Exception as e:
            print(f"TTS initialization failed: {e}")
            self.engine = None
    
    def get_available_voices(self) -> Dict[str, Any]:
        """Get list of available voices"""
        if not self.voices:
            return {"voices": [], "error": "No voices available"}
        
        voice_list = []
        for i, voice in enumerate(self.voices):
            voice_info = {
                "id": i,
                "name": voice.name,
                "gender": "female" if "female" in voice.name.lower() else "male",
                "language": getattr(voice, 'languages', ['en'])[0] if hasattr(voice, 'languages') else 'en'
            }
            voice_list.append(voice_info)
        
        return {
            "voices": voice_list,
            "current_voice": self.current_settings["voice_id"],
            "total_voices": len(voice_list)
        }
    
    def speak_text(self, text: str, settings: Optional[Dict] = None) -> Dict[str, Any]:
        """Speak text with optional custom settings"""
        if not self.engine:
            return {"success": False, "error": "TTS engine not available"}
        
        try:
            # Apply custom settings if provided
            if settings:
                self._apply_settings(settings)
            
            # Clean text for better speech
            clean_text = self._clean_text_for_speech(text)
            
            # Speak in separate thread to avoid blocking
            def speak():
                self.engine.say(clean_text)
                self.engine.runAndWait()
            
            thread = threading.Thread(target=speak)
            thread.daemon = True
            thread.start()
            
            return {
                "success": True,
                "message": "Text is being spoken",
                "text_length": len(clean_text),
                "settings_used": self.current_settings
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def save_audio(self, text: str, settings: Optional[Dict] = None) -> Dict[str, Any]:
        """Save text as audio file"""
        if not self.engine:
            return {"success": False, "error": "TTS engine not available"}
        
        try:
            # Apply settings
            if settings:
                self._apply_settings(settings)
            
            # Clean text
            clean_text = self._clean_text_for_speech(text)
            
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            temp_path = temp_file.name
            temp_file.close()
            
            # Save to file
            self.engine.save_to_file(clean_text, temp_path)
            self.engine.runAndWait()
            
            # Read file and encode as base64
            with open(temp_path, 'rb') as f:
                audio_data = base64.b64encode(f.read()).decode()
            
            # Clean up
            os.unlink(temp_path)
            
            return {
                "success": True,
                "audio_data": audio_data,
                "format": "wav",
                "text_length": len(clean_text)
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _apply_settings(self, settings: Dict):
        """Apply TTS settings"""
        if "rate" in settings:
            rate = max(50, min(300, settings["rate"]))  # Clamp between 50-300
            self.engine.setProperty('rate', rate)
            self.current_settings["rate"] = rate
        
        if "volume" in settings:
            volume = max(0.0, min(1.0, settings["volume"]))  # Clamp between 0-1
            self.engine.setProperty('volume', volume)
            self.current_settings["volume"] = volume
        
        if "voice_id" in settings and self.voices:
            voice_id = settings["voice_id"]
            if 0 <= voice_id < len(self.voices):
                self.engine.setProperty('voice', self.voices[voice_id].id)
                self.current_settings["voice_id"] = voice_id
    
    def _clean_text_for_speech(self, text: str) -> str:
        """Clean text for better speech synthesis"""
        # Remove HTML tags if any
        import re
        clean_text = re.sub(r'<[^>]+>', '', text)
        
        # Replace common abbreviations
        replacements = {
            "TL;DR": "Too Long Didn't Read",
            "TTS": "Text To Speech",
            "AI": "Artificial Intelligence",
            "ML": "Machine Learning",
            "API": "Application Programming Interface",
            "URL": "You Are El",
            "HTTP": "H T T P",
            "CSS": "Cascading Style Sheets"
        }
        
        for abbr, full in replacements.items():
            clean_text = clean_text.replace(abbr, full)
        
        return clean_text
    
    def get_dyslexia_optimized_settings(self) -> Dict[str, Any]:
        """Get TTS settings optimized for dyslexic users"""
        return {
            "rate": 120,  # Slower speech
            "volume": 0.9,  # Higher volume
            "voice_id": 0,  # Default voice
            "description": "Slower, clearer speech for dyslexic users"
        }
    
    def get_adhd_optimized_settings(self) -> Dict[str, Any]:
        """Get TTS settings optimized for ADHD users"""
        return {
            "rate": 160,  # Slightly faster to maintain attention
            "volume": 0.8,
            "voice_id": 0,
            "description": "Engaging pace for ADHD users"
        }
    
    def get_vision_optimized_settings(self) -> Dict[str, Any]:
        """Get TTS settings optimized for low vision users"""
        return {
            "rate": 140,  # Moderate pace
            "volume": 1.0,  # Maximum volume
            "voice_id": 0,
            "description": "Clear, loud speech for vision impaired users"
        }

# Global TTS service instance
tts_service = TTSService()
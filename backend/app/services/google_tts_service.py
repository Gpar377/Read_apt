import base64
import os
from typing import Dict, Any, Optional
import tempfile

try:
    from google.cloud import texttospeech
    GOOGLE_TTS_AVAILABLE = True
except ImportError:
    GOOGLE_TTS_AVAILABLE = False
    texttospeech = None

class GoogleTTSService:
    """Google Cloud Text-to-Speech service"""
    
    def __init__(self):
        self.client = None
        self.use_google_tts = False
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Google TTS client"""
        try:
            # Check if Google Cloud credentials are available
            if os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or os.getenv("GOOGLE_TTS_API_KEY"):
                self.client = texttospeech.TextToSpeechClient()
                self.use_google_tts = True
                print("Google TTS initialized successfully")
            else:
                print("Google TTS credentials not found, using fallback")
        except Exception as e:
            print(f"Google TTS initialization failed: {e}")
    
    def synthesize_speech(self, text: str, voice_config: Optional[Dict] = None) -> Dict[str, Any]:
        """Synthesize speech using Google TTS"""
        if not self.use_google_tts:
            return self._fallback_tts(text)
        
        try:
            # Default voice configuration
            default_config = {
                "language_code": "en-US",
                "name": "en-US-Wavenet-D",
                "ssml_gender": texttospeech.SsmlVoiceGender.NEUTRAL
            }
            
            if voice_config:
                default_config.update(voice_config)
            
            # Set up the synthesis input
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Build the voice request
            voice = texttospeech.VoiceSelectionParams(
                language_code=default_config["language_code"],
                name=default_config["name"],
                ssml_gender=default_config["ssml_gender"]
            )
            
            # Select the type of audio file
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )
            
            # Perform the text-to-speech request
            response = self.client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # Encode audio content as base64
            audio_base64 = base64.b64encode(response.audio_content).decode()
            
            return {
                "success": True,
                "audio_data": audio_base64,
                "format": "mp3",
                "provider": "google_tts",
                "voice_used": default_config["name"]
            }
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _fallback_tts(self, text: str) -> Dict[str, Any]:
        """Fallback TTS using browser Web Speech API format"""
        return {
            "success": True,
            "audio_data": None,
            "format": "web_speech_api",
            "provider": "browser_fallback",
            "text": text,
            "message": "Use browser Web Speech API for TTS"
        }
    
    def get_dyslexia_voice_config(self) -> Dict[str, Any]:
        """Voice configuration optimized for dyslexic users"""
        return {
            "language_code": "en-US",
            "name": "en-US-Wavenet-A",  # Clear female voice
            "ssml_gender": "FEMALE",
            "speaking_rate": 0.8,  # Slower speech
            "pitch": 0.0
        }
    
    def get_adhd_voice_config(self) -> Dict[str, Any]:
        """Voice configuration optimized for ADHD users"""
        return {
            "language_code": "en-US", 
            "name": "en-US-Wavenet-D",  # Engaging neutral voice
            "ssml_gender": "NEUTRAL",
            "speaking_rate": 1.1,  # Slightly faster to maintain attention
            "pitch": 2.0  # Higher pitch for engagement
        }
    
    def get_vision_voice_config(self) -> Dict[str, Any]:
        """Voice configuration optimized for low vision users"""
        return {
            "language_code": "en-US",
            "name": "en-US-Wavenet-B",  # Clear male voice
            "ssml_gender": "MALE",
            "speaking_rate": 0.9,  # Moderate pace
            "pitch": 0.0,
            "volume_gain_db": 6.0  # Louder volume
        }

# Simple TTS service without Google Cloud dependency
class SimpleTTSService:
    """Simple TTS service using browser Web Speech API"""
    
    def synthesize_speech(self, text: str, voice_config: Optional[Dict] = None) -> Dict[str, Any]:
        """Return configuration for browser-based TTS"""
        
        # Default settings
        settings = {
            "rate": 1.0,
            "pitch": 1.0,
            "volume": 1.0,
            "voice": "default"
        }
        
        # Apply voice configuration
        if voice_config:
            if "speaking_rate" in voice_config:
                settings["rate"] = voice_config["speaking_rate"]
            if "pitch" in voice_config:
                settings["pitch"] = voice_config["pitch"] / 10 + 1  # Convert to 0-2 range
            if "volume_gain_db" in voice_config:
                settings["volume"] = min(1.0, 0.8 + voice_config["volume_gain_db"] / 20)
        
        return {
            "success": True,
            "audio_data": None,
            "format": "web_speech_api",
            "provider": "browser_tts",
            "text": text,
            "settings": settings,
            "message": "Use browser speechSynthesis API"
        }
    
    def get_dyslexia_voice_config(self) -> Dict[str, Any]:
        return {"speaking_rate": 0.8, "pitch": 0.0}
    
    def get_adhd_voice_config(self) -> Dict[str, Any]:
        return {"speaking_rate": 1.1, "pitch": 2.0}
    
    def get_vision_voice_config(self) -> Dict[str, Any]:
        return {"speaking_rate": 0.9, "pitch": 0.0, "volume_gain_db": 6.0}

# Use simple TTS service (no Google Cloud dependency)
tts_service = SimpleTTSService()
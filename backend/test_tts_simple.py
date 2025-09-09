import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.google_tts_service import tts_service

def test_tts_configurations():
    """Test TTS configurations for different accessibility needs"""
    print("TEXT-TO-SPEECH TESTING")
    print("=" * 40)
    
    # Test texts for different conditions
    test_cases = {
        "dyslexia": "This text is optimized for dyslexic users with slower, clearer speech.",
        "adhd": "This text uses engaging pace to help ADHD users maintain attention!",
        "vision": "This text is loud and clear for users with low vision needs.",
        "normal": "This is normal text without special adaptations."
    }
    
    print("\n1. Testing Voice Configurations...")
    
    for condition, text in test_cases.items():
        print(f"\n--- {condition.upper()} CONDITION ---")
        
        # Get voice config
        if condition == "dyslexia":
            config = tts_service.get_dyslexia_voice_config()
        elif condition == "adhd":
            config = tts_service.get_adhd_voice_config()
        elif condition == "vision":
            config = tts_service.get_vision_voice_config()
        else:
            config = None
        
        # Test TTS
        result = tts_service.synthesize_speech(text, config)
        
        print(f"Text: {text[:50]}...")
        print(f"Success: {result['success']}")
        print(f"Provider: {result.get('provider', 'unknown')}")
        print(f"Format: {result.get('format', 'unknown')}")
        
        if 'settings' in result:
            settings = result['settings']
            print(f"Rate: {settings.get('rate', 'N/A')}")
            print(f"Pitch: {settings.get('pitch', 'N/A')}")
            print(f"Volume: {settings.get('volume', 'N/A')}")
        
        if result.get('format') == 'web_speech_api':
            print("Implementation: Use browser speechSynthesis API")
            print(f"JavaScript: speechSynthesis.speak(new SpeechSynthesisUtterance('{text[:30]}...'))")
    
    print("\n2. Testing Browser TTS Integration...")
    
    # Generate JavaScript code for browser implementation
    browser_code = """
// Accessibility TTS Implementation
class AccessibilityTTS {
    constructor() {
        this.synth = window.speechSynthesis;
    }
    
    speak(text, condition = 'normal') {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply condition-specific settings
        switch(condition) {
            case 'dyslexia':
                utterance.rate = 0.8;  // Slower
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                break;
            case 'adhd':
                utterance.rate = 1.1;  // Slightly faster
                utterance.pitch = 1.2; // Higher pitch
                utterance.volume = 0.9;
                break;
            case 'vision':
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = 1.0; // Maximum volume
                break;
            default:
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
        }
        
        this.synth.speak(utterance);
    }
    
    stop() {
        this.synth.cancel();
    }
}

// Usage examples:
const tts = new AccessibilityTTS();
tts.speak("Hello dyslexic users!", "dyslexia");
tts.speak("Quick message for ADHD users!", "adhd");
tts.speak("Clear message for low vision users!", "vision");
"""
    
    print("Browser TTS JavaScript Implementation:")
    print(browser_code)
    
    print("\n3. TTS API Endpoints Available:")
    endpoints = [
        "POST /api/tts/speak - Convert text to speech",
        "GET /api/tts/voice-configs - Get voice configurations", 
        "POST /api/tts/generate-speech-config - Generate config for presets",
        "GET /api/tts/test-tts - Test all TTS conditions"
    ]
    
    for endpoint in endpoints:
        print(f"  - {endpoint}")
    
    print("\nTTS SYSTEM READY!")
    print("Use browser Web Speech API for actual audio playback")

if __name__ == "__main__":
    test_tts_configurations()
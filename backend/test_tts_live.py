import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.tts_service import tts_service
import time

def test_tts_live():
    """Live TTS testing"""
    print("LIVE TEXT-TO-SPEECH TESTING")
    print("=" * 40)
    
    # Test 1: Basic TTS
    print("\n1. Testing Basic TTS...")
    result = tts_service.speak_text("Hello! This is a test of the text to speech system.")
    print(f"Basic TTS: {result['success']}")
    time.sleep(3)
    
    # Test 2: Available Voices
    print("\n2. Available Voices...")
    voices = tts_service.get_available_voices()
    print(f"Total voices: {voices.get('total_voices', 0)}")
    for voice in voices.get('voices', [])[:3]:  # Show first 3
        print(f"  - {voice['name']} ({voice['gender']})")
    
    # Test 3: Dyslexia Optimized
    print("\n3. Testing Dyslexia-Optimized TTS...")
    dyslexia_settings = tts_service.get_dyslexia_optimized_settings()
    result = tts_service.speak_text(
        "This speech is optimized for dyslexic users with slower, clearer pronunciation.",
        dyslexia_settings
    )
    print(f"Dyslexia TTS: {result['success']} (Rate: {dyslexia_settings['rate']})")
    time.sleep(4)
    
    # Test 4: ADHD Optimized
    print("\n4. Testing ADHD-Optimized TTS...")
    adhd_settings = tts_service.get_adhd_optimized_settings()
    result = tts_service.speak_text(
        "This speech maintains attention with an engaging pace for ADHD users!",
        adhd_settings
    )
    print(f"ADHD TTS: {result['success']} (Rate: {adhd_settings['rate']})")
    time.sleep(3)
    
    # Test 5: Vision Optimized
    print("\n5. Testing Vision-Optimized TTS...")
    vision_settings = tts_service.get_vision_optimized_settings()
    result = tts_service.speak_text(
        "This speech is loud and clear for users with low vision.",
        vision_settings
    )
    print(f"Vision TTS: {result['success']} (Volume: {vision_settings['volume']})")
    time.sleep(3)
    
    # Test 6: Custom Text
    print("\n6. Testing Custom Accessibility Text...")
    custom_text = """
    Welcome to the Accessibility Reading Platform! 
    This system uses AI to adapt text for dyslexia, ADHD, and low vision users.
    The text-to-speech feature helps users consume content through audio.
    """
    
    result = tts_service.speak_text(custom_text)
    print(f"Custom text TTS: {result['success']}")
    print(f"Text length: {result.get('text_length', 0)} characters")
    time.sleep(6)
    
    # Test 7: Interactive Test
    print("\n7. Interactive TTS Test...")
    print("Enter text to speak (or 'quit' to exit):")
    
    while True:
        try:
            user_text = input("> ")
            if user_text.lower() in ['quit', 'exit', 'q']:
                break
            
            if user_text.strip():
                result = tts_service.speak_text(user_text)
                if result['success']:
                    print("[SPEAKING] Audio playing...")
                else:
                    print(f"[ERROR] {result.get('error', 'Unknown error')}")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")
    
    print("\nTTS Testing Complete!")

def test_tts_settings():
    """Test different TTS settings"""
    print("\nTESTING TTS SETTINGS")
    print("=" * 30)
    
    test_text = "Testing different speech rates and volumes."
    
    # Test different rates
    rates = [100, 150, 200, 250]
    for rate in rates:
        print(f"\nTesting rate: {rate} WPM")
        settings = {"rate": rate, "volume": 0.8}
        result = tts_service.speak_text(f"Speech rate is {rate} words per minute.", settings)
        print(f"Rate {rate}: {result['success']}")
        time.sleep(2)
    
    # Test different volumes
    volumes = [0.3, 0.6, 0.9]
    for volume in volumes:
        print(f"\nTesting volume: {volume}")
        settings = {"rate": 150, "volume": volume}
        result = tts_service.speak_text(f"Volume level is {int(volume*100)} percent.", settings)
        print(f"Volume {volume}: {result['success']}")
        time.sleep(2)

if __name__ == "__main__":
    print("TEXT-TO-SPEECH LIVE TESTING")
    print("=" * 50)
    
    try:
        test_tts_live()
        
        # Ask if user wants to test settings
        print("\nWould you like to test different TTS settings? (y/n)")
        if input().lower().startswith('y'):
            test_tts_settings()
            
    except Exception as e:
        print(f"[ERROR] TTS testing failed: {e}")
        print("Make sure you have pyttsx3 installed: pip install pyttsx3")
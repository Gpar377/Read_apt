import os
from dotenv import load_dotenv

load_dotenv()

def test_gemini_direct():
    """Test Gemini API directly"""
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        print(f"API Key present: {bool(api_key)}")
        print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Say hello")
        print(f"Success: {response.text}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    test_gemini_direct()
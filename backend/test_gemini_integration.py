import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import asyncio
from app.agents.base_agent import BaseAgent

class TestAgent(BaseAgent):
    def __init__(self):
        super().__init__("TestAgent", "You are a helpful AI assistant for accessibility testing.")
    
    async def process(self, data):
        return await self.execute(data)

async def test_gemini_integration():
    """Test Gemini API integration"""
    print("Testing Gemini API Integration...")
    print("=" * 40)
    
    # Create test agent
    agent = TestAgent()
    
    print(f"Agent LLM Type: {getattr(agent, 'llm_type', 'unknown')}")
    print(f"Using Gemini: {getattr(agent, 'use_gemini', False)}")
    print(f"Using OpenAI: {getattr(agent, 'use_openai', False)}")
    
    # Test basic functionality
    test_data = {
        "type": "test",
        "message": "Hello, can you help with accessibility features?"
    }
    
    print(f"\nTesting agent execution...")
    result = await agent.execute(test_data)
    
    print(f"Success: {result['success']}")
    print(f"Agent: {result['agent']}")
    
    if result['success']:
        print(f"Response length: {len(result['result'])} characters")
        print(f"Model used: {result.get('model', 'unknown')}")
        print(f"Response preview: {result['result'][:100]}...")
    else:
        print(f"Error: {result.get('error', 'Unknown error')}")
    
    # Test memory functionality
    print(f"\nMemory messages: {len(agent.memory.messages)}")
    
    return result['success']

def test_gemini_import():
    """Test if Gemini can be imported"""
    print("Testing Gemini Import...")
    try:
        import google.generativeai as genai
        print("[OK] Google Generative AI imported successfully")
        return True
    except ImportError as e:
        print(f"[ERROR] Cannot import Google Generative AI: {e}")
        print("Install with: pip install google-generativeai")
        return False

if __name__ == "__main__":
    print("Gemini Integration Test")
    print("=" * 50)
    
    # Test import first
    import_success = test_gemini_import()
    
    if import_success:
        # Test integration
        success = asyncio.run(test_gemini_integration())
        
        if success:
            print("\n[OK] Gemini integration test passed!")
        else:
            print("\n[INFO] Gemini integration using fallback (mock/OpenAI)")
    else:
        print("\n[INFO] Gemini package not installed, using fallback")
    
    print("\nTo use Gemini API:")
    print("1. Install: pip install google-generativeai")
    print("2. Get API key from: https://makersuite.google.com/app/apikey")
    print("3. Set GEMINI_API_KEY in .env file")
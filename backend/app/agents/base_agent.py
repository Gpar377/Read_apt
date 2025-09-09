from abc import ABC, abstractmethod
from typing import Dict, Any, List
import os
from dotenv import load_dotenv
import json

load_dotenv()

class MockMemory:
    """Mock memory for demo purposes"""
    def __init__(self):
        self.messages = []
    
    def add_user_message(self, message: str):
        self.messages.append({"type": "user", "content": message})
    
    def add_ai_message(self, message: str):
        self.messages.append({"type": "ai", "content": message})

class BaseAgent(ABC):
    """Base class for all accessibility agents"""
    
    def __init__(self, agent_name: str, system_prompt: str):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.memory = MockMemory()
        
        # Check for Gemini API key first, then OpenAI as fallback
        self.use_gemini = os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your-gemini-api-key-here"
        self.use_openai = os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your-openai-api-key-here"
        
        if self.use_gemini:
            try:
                import google.generativeai as genai
                genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
                self.llm = genai.GenerativeModel('gemini-1.5-flash')
                self.llm_type = "gemini"
                print(f"Using Gemini API for {agent_name}")
            except ImportError:
                self.use_gemini = False
                print(f"Warning: Gemini not available for {agent_name}")
        
        if not self.use_gemini and self.use_openai:
            try:
                from langchain_openai import ChatOpenAI
                self.llm = ChatOpenAI(
                    model="gpt-3.5-turbo",
                    temperature=0.7,
                    openai_api_key=os.getenv("OPENAI_API_KEY")
                )
                self.llm_type = "openai"
                print(f"Using OpenAI API for {agent_name}")
            except ImportError:
                self.use_openai = False
                print(f"Warning: OpenAI not available for {agent_name}")
        
        if not self.use_gemini and not self.use_openai:
            self.llm_type = "mock"
            print(f"Using mock responses for {agent_name}")
    
    async def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent with input data"""
        try:
            if self.use_gemini:
                return await self._execute_with_gemini(input_data)
            elif self.use_openai:
                return await self._execute_with_openai(input_data)
            else:
                return await self._execute_mock(input_data)
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "agent": self.agent_name
            }
    
    async def _execute_with_gemini(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute with Gemini API"""
        prompt = f"{self.system_prompt}\n\nInput: {input_data}\n\nPlease provide a helpful response:"
        
        response = await self.llm.generate_content_async(prompt)
        
        self.memory.add_user_message(str(input_data))
        self.memory.add_ai_message(response.text)
        
        return {
            "success": True,
            "result": response.text,
            "agent": self.agent_name,
            "model": "gemini-pro"
        }
    
    async def _execute_with_openai(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute with real OpenAI"""
        from langchain.schema import SystemMessage, HumanMessage
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"Input: {input_data}")
        ]
        
        response = await self.llm.ainvoke(messages)
        
        self.memory.add_user_message(str(input_data))
        self.memory.add_ai_message(response.content)
        
        return {
            "success": True,
            "result": response.content,
            "agent": self.agent_name,
            "model": "gpt-3.5-turbo"
        }
    
    async def _execute_mock(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute with mock responses for demo"""
        mock_response = f"Mock response from {self.agent_name}: Processed {input_data.get('type', 'unknown')} request successfully."
        
        self.memory.add_user_message(str(input_data))
        self.memory.add_ai_message(mock_response)
        
        return {
            "success": True,
            "result": mock_response,
            "agent": self.agent_name,
            "mock": True
        }
    
    @abstractmethod
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process specific to each agent type"""
        pass
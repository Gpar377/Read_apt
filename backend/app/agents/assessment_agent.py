from .base_agent import BaseAgent
from typing import Dict, Any, List
import json
import random

class AssessmentAgent(BaseAgent):
    """Intelligent assessment agent that adapts tests based on user responses"""
    
    def __init__(self):
        system_prompt = """
        You are an intelligent assessment agent for accessibility testing. Your role is to:
        
        1. DYNAMICALLY ADAPT tests based on user performance
        2. PERSONALIZE difficulty and question types
        3. DETECT patterns in user responses
        4. PROVIDE real-time feedback and encouragement
        5. OPTIMIZE test length based on confidence levels
        
        For Dyslexia Assessment:
        - Adjust reading passage difficulty based on speed
        - Modify question complexity based on comprehension
        - Suggest breaks if user shows fatigue
        - Adapt timing based on individual pace
        
        For ADHD Assessment:
        - Reorder questions based on attention patterns
        - Provide focus cues when attention drops
        - Adjust question phrasing for clarity
        - Skip redundant questions if pattern is clear
        
        Always respond in JSON format with specific recommendations.
        Be encouraging and supportive in your feedback.
        """
        super().__init__("AssessmentAgent", system_prompt)
        self.user_profiles = {}  # Store user assessment history
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process assessment data and provide adaptive recommendations"""
        assessment_type = data.get("type")
        user_id = data.get("user_id", "anonymous")
        
        if assessment_type == "dyslexia":
            return await self._process_dyslexia_assessment(data, user_id)
        elif assessment_type == "adhd":
            return await self._process_adhd_assessment(data, user_id)
        else:
            return {"error": "Unknown assessment type"}
    
    async def _process_dyslexia_assessment(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Adaptive dyslexia assessment processing"""
        
        # Get user's current performance
        reading_time = data.get("reading_time", 0)
        comprehension_score = data.get("comprehension_score", 0)
        current_question = data.get("current_question", 1)
        total_questions = data.get("total_questions", 5)
        
        # Build context for AI
        context = {
            "reading_time": reading_time,
            "comprehension_score": comprehension_score,
            "progress": f"{current_question}/{total_questions}",
            "user_history": self.user_profiles.get(user_id, {}),
            "task": "Analyze performance and provide next steps for dyslexia assessment"
        }
        
        # Get AI recommendation
        ai_response = await self.execute(context)
        
        if ai_response["success"]:
            try:
                # Parse AI response and create structured output
                recommendations = self._parse_ai_response(ai_response["result"])
                
                # Generate adaptive next steps
                next_steps = await self._generate_next_steps(
                    "dyslexia", reading_time, comprehension_score, current_question
                )
                
                # Update user profile
                self._update_user_profile(user_id, "dyslexia", {
                    "reading_time": reading_time,
                    "comprehension_score": comprehension_score,
                    "session_date": "current"
                })
                
                return {
                    "assessment_type": "dyslexia",
                    "adaptive_feedback": recommendations.get("feedback", "Keep going!"),
                    "next_steps": next_steps,
                    "difficulty_adjustment": recommendations.get("difficulty", "maintain"),
                    "estimated_completion": self._estimate_completion(current_question, total_questions),
                    "personalized_tips": recommendations.get("tips", []),
                    "confidence_level": self._calculate_confidence(reading_time, comprehension_score)
                }
            except Exception as e:
                return self._fallback_dyslexia_response(reading_time, comprehension_score)
        else:
            return self._fallback_dyslexia_response(reading_time, comprehension_score)
    
    async def _process_adhd_assessment(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Adaptive ADHD assessment processing"""
        
        responses = data.get("responses", [])
        current_question = data.get("current_question", 1)
        response_times = data.get("response_times", [])
        
        context = {
            "responses": responses,
            "current_question": current_question,
            "response_patterns": self._analyze_response_patterns(responses),
            "attention_indicators": self._analyze_attention_patterns(response_times),
            "task": "Analyze ADHD assessment patterns and provide adaptive recommendations"
        }
        
        ai_response = await self.execute(context)
        
        if ai_response["success"]:
            try:
                recommendations = self._parse_ai_response(ai_response["result"])
                
                # Generate adaptive questionnaire modifications
                next_questions = await self._adapt_adhd_questions(responses, current_question)
                
                self._update_user_profile(user_id, "adhd", {
                    "responses": responses,
                    "patterns": self._analyze_response_patterns(responses)
                })
                
                return {
                    "assessment_type": "adhd",
                    "adaptive_feedback": recommendations.get("feedback", "Continue assessment"),
                    "next_questions": next_questions,
                    "skip_redundant": recommendations.get("skip_questions", []),
                    "focus_cues": recommendations.get("focus_cues", []),
                    "estimated_type": self._predict_adhd_type(responses),
                    "confidence_level": len(responses) * 0.1  # Increases with more data
                }
            except Exception as e:
                return self._fallback_adhd_response(responses, current_question)
        else:
            return self._fallback_adhd_response(responses, current_question)
    
    async def _generate_next_steps(self, assessment_type: str, *args) -> List[str]:
        """Generate personalized next steps"""
        if assessment_type == "dyslexia":
            reading_time, comprehension_score, current_question = args
            if reading_time > 60 and comprehension_score < 0.5:
                return [
                    "Take a 30-second break to rest your eyes",
                    "Next passage will be slightly easier",
                    "Focus on key words rather than every detail"
                ]
            elif reading_time < 20 and comprehension_score > 0.8:
                return [
                    "Excellent pace! Next passage will be more challenging",
                    "Try to maintain your current reading speed",
                    "Focus on deeper comprehension"
                ]
            else:
                return [
                    "You're doing well, continue at your own pace",
                    "Take your time to understand the content",
                    "Remember, accuracy is more important than speed"
                ]
        
        return ["Continue with the assessment"]
    
    async def _adapt_adhd_questions(self, responses: List[int], current_question: int) -> List[Dict]:
        """Adapt ADHD questions based on response patterns"""
        
        # Analyze response patterns
        if len(responses) >= 6:
            hyperactivity_avg = sum(responses[:min(len(responses)//2, 9)]) / min(len(responses)//2, 9)
            
            if hyperactivity_avg > 2.5:
                # Focus more on hyperactivity questions
                return [
                    {
                        "question": "How often do you feel like you're 'driven by a motor'?",
                        "focus_area": "hyperactivity",
                        "adaptive_reason": "High hyperactivity indicators detected"
                    }
                ]
            elif hyperactivity_avg < 1.0:
                # Focus more on inattention
                return [
                    {
                        "question": "How often do you have trouble organizing tasks?",
                        "focus_area": "inattention", 
                        "adaptive_reason": "Low hyperactivity, checking inattention patterns"
                    }
                ]
        
        # Default questions
        return [
            {
                "question": "How often are you easily distracted?",
                "focus_area": "general",
                "adaptive_reason": "Standard assessment flow"
            }
        ]
    
    def _analyze_response_patterns(self, responses: List[int]) -> Dict[str, Any]:
        """Analyze patterns in user responses"""
        if not responses:
            return {}
        
        return {
            "average_score": sum(responses) / len(responses),
            "consistency": len(set(responses)) / len(responses),  # Lower = more consistent
            "trend": "increasing" if responses[-1] > responses[0] else "decreasing",
            "extreme_responses": sum(1 for r in responses if r in [0, 3]) / len(responses)
        }
    
    def _analyze_attention_patterns(self, response_times: List[float]) -> Dict[str, Any]:
        """Analyze attention patterns from response timing"""
        if not response_times:
            return {}
        
        avg_time = sum(response_times) / len(response_times)
        return {
            "average_response_time": avg_time,
            "attention_drops": sum(1 for t in response_times if t > avg_time * 1.5),
            "rushed_responses": sum(1 for t in response_times if t < 2.0),
            "focus_stability": "stable" if max(response_times) - min(response_times) < 10 else "variable"
        }
    
    def _predict_adhd_type(self, responses: List[int]) -> str:
        """Predict ADHD type based on current responses"""
        if len(responses) < 6:
            return "insufficient_data"
        
        mid_point = len(responses) // 2
        hyperactivity_score = sum(responses[:mid_point]) / mid_point if mid_point > 0 else 0
        inattention_score = sum(responses[mid_point:]) / (len(responses) - mid_point) if len(responses) > mid_point else 0
        
        if hyperactivity_score > 2.0 and inattention_score > 2.0:
            return "combined_type"
        elif hyperactivity_score > inattention_score:
            return "hyperactive_type"
        elif inattention_score > hyperactivity_score:
            return "inattentive_type"
        else:
            return "no_adhd_indicated"
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured data"""
        try:
            # Try to extract JSON from response
            if "{" in response and "}" in response:
                start = response.find("{")
                end = response.rfind("}") + 1
                json_str = response[start:end]
                return json.loads(json_str)
        except:
            pass
        
        # Fallback parsing
        return {
            "feedback": "Continue with your assessment",
            "difficulty": "maintain",
            "tips": ["Take your time", "Focus on accuracy"]
        }
    
    def _update_user_profile(self, user_id: str, assessment_type: str, data: Dict[str, Any]):
        """Update user profile with assessment data"""
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {}
        
        if assessment_type not in self.user_profiles[user_id]:
            self.user_profiles[user_id][assessment_type] = []
        
        self.user_profiles[user_id][assessment_type].append(data)
    
    def _calculate_confidence(self, reading_time: float, comprehension_score: float) -> float:
        """Calculate confidence level in assessment"""
        # Simple heuristic - can be made more sophisticated
        time_factor = min(reading_time / 30, 1.0)  # Normalize to 30 seconds
        score_factor = comprehension_score
        return (time_factor + score_factor) / 2
    
    def _estimate_completion(self, current: int, total: int) -> str:
        """Estimate completion time"""
        progress = current / total
        if progress < 0.3:
            return "Just getting started"
        elif progress < 0.7:
            return "Halfway there"
        else:
            return "Almost done"
    
    def _fallback_dyslexia_response(self, reading_time: float, comprehension_score: float) -> Dict[str, Any]:
        """Fallback response when AI fails"""
        return {
            "assessment_type": "dyslexia",
            "adaptive_feedback": "Continue at your own pace",
            "next_steps": ["Take your time with the next passage"],
            "difficulty_adjustment": "maintain",
            "estimated_completion": "In progress",
            "personalized_tips": ["Focus on understanding", "Don't rush"],
            "confidence_level": 0.5
        }
    
    def _fallback_adhd_response(self, responses: List[int], current_question: int) -> Dict[str, Any]:
        """Fallback response when AI fails"""
        return {
            "assessment_type": "adhd",
            "adaptive_feedback": "Continue with the questionnaire",
            "next_questions": [{"question": "Continue with standard questions", "focus_area": "general"}],
            "skip_redundant": [],
            "focus_cues": ["Take your time"],
            "estimated_type": "assessment_in_progress",
            "confidence_level": 0.3
        }
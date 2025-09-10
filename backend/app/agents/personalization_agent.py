from .base_agent import BaseAgent
from typing import Dict, Any, List
import json
import numpy as np

class PersonalizationAgent(BaseAgent):
    """Agent that learns user preferences and optimizes adaptations over time"""
    
    def __init__(self):
        system_prompt = """
        You are a personalization agent for accessibility adaptations. Your role is to:
        
        1. LEARN from user interactions and feedback
        2. OPTIMIZE text adaptations based on user behavior
        3. PREDICT user preferences for new content
        4. FINE-TUNE adaptation parameters dynamically
        5. SUGGEST personalized improvement strategies
        
        Key Capabilities:
        - Analyze reading patterns and preferences
        - Adjust spacing, highlighting, and TTS based on usage
        - Learn from user feedback (explicit and implicit)
        - Predict optimal settings for different content types
        - Provide personalized recommendations
        
        Always consider:
        - User's condition severity and type
        - Reading context (work, leisure, study)
        - Time of day and fatigue levels
        - Content complexity and length
        - Historical performance data
        
        Respond with specific, actionable personalization recommendations.
        """
        super().__init__("PersonalizationAgent", system_prompt)
        self.user_preferences = {}
        self.adaptation_history = {}
        self.performance_metrics = {}
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process user data and provide personalized adaptations"""
        
        user_id = data.get("user_id", "anonymous")
        action_type = data.get("action_type")
        
        if action_type == "optimize_settings":
            return await self._optimize_user_settings(data, user_id)
        elif action_type == "learn_feedback":
            return await self._learn_from_feedback(data, user_id)
        elif action_type == "predict_preferences":
            return await self._predict_preferences(data, user_id)
        elif action_type == "adaptive_tuning":
            return await self._adaptive_tuning(data, user_id)
        else:
            return {"error": "Unknown personalization action"}
    
    async def _optimize_user_settings(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Optimize user settings based on historical data and AI analysis"""
        
        # Get user's historical data
        user_history = self.user_preferences.get(user_id, {})
        performance_data = self.performance_metrics.get(user_id, {})
        
        # Current session data
        current_settings = data.get("current_settings", {})
        reading_performance = data.get("reading_performance", {})
        content_type = data.get("content_type", "general")
        
        # Build context for AI optimization
        context = {
            "user_history": user_history,
            "performance_data": performance_data,
            "current_settings": current_settings,
            "reading_performance": reading_performance,
            "content_type": content_type,
            "task": "Optimize accessibility settings for maximum reading efficiency and comfort"
        }
        
        # Get AI recommendations
        ai_response = await self.execute(context)
        
        if ai_response["success"]:
            try:
                # Generate optimized settings
                optimized_settings = await self._generate_optimized_settings(
                    user_history, reading_performance, content_type
                )
                
                # Calculate confidence in recommendations
                confidence = self._calculate_optimization_confidence(user_history, performance_data)
                
                # Update user preferences
                self._update_user_preferences(user_id, optimized_settings, reading_performance)
                
                return {
                    "optimized_settings": optimized_settings,
                    "confidence_level": confidence,
                    "reasoning": self._extract_reasoning(ai_response["result"]),
                    "expected_improvement": self._predict_improvement(optimized_settings, performance_data),
                    "personalization_tips": await self._generate_personalization_tips(user_history),
                    "adaptive_features": self._suggest_adaptive_features(reading_performance)
                }
            except Exception as e:
                return self._fallback_optimization(current_settings)
        else:
            return self._fallback_optimization(current_settings)
    
    async def _learn_from_feedback(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Learn from explicit and implicit user feedback"""
        
        feedback_type = data.get("feedback_type")  # "explicit", "implicit", "behavioral"
        feedback_data = data.get("feedback_data", {})
        settings_used = data.get("settings_used", {})
        
        # Process different types of feedback
        if feedback_type == "explicit":
            # User directly rated or commented on adaptations
            rating = feedback_data.get("rating", 0)
            comments = feedback_data.get("comments", "")
            preferred_changes = feedback_data.get("preferred_changes", {})
            
            learning_context = {
                "feedback_type": "explicit",
                "rating": rating,
                "comments": comments,
                "settings": settings_used,
                "task": "Learn from explicit user feedback to improve future adaptations"
            }
            
        elif feedback_type == "implicit":
            # Behavioral indicators (time spent, scrolling patterns, etc.)
            reading_time = feedback_data.get("reading_time", 0)
            scroll_patterns = feedback_data.get("scroll_patterns", [])
            pause_points = feedback_data.get("pause_points", [])
            completion_rate = feedback_data.get("completion_rate", 0)
            
            learning_context = {
                "feedback_type": "implicit",
                "behavioral_data": {
                    "reading_time": reading_time,
                    "scroll_patterns": scroll_patterns,
                    "pause_points": pause_points,
                    "completion_rate": completion_rate
                },
                "settings": settings_used,
                "task": "Analyze behavioral patterns to understand adaptation effectiveness"
            }
        
        # Get AI insights
        ai_response = await self.execute(learning_context)
        
        if ai_response["success"]:
            # Extract learning insights
            insights = self._extract_learning_insights(ai_response["result"])
            
            # Update learning model
            self._update_learning_model(user_id, feedback_type, feedback_data, insights)
            
            return {
                "learning_insights": insights,
                "preference_updates": self._get_preference_updates(user_id),
                "adaptation_suggestions": insights.get("suggestions", []),
                "confidence_improvement": self._calculate_learning_confidence(user_id)
            }
        else:
            # Fallback processing when AI fails
            error_details = ai_response.get("error", "Unknown AI processing error")
            fallback_insights = self._fallback_feedback_processing(feedback_type, feedback_data)
            
            return {
                "learning_insights": fallback_insights,
                "preference_updates": self._get_preference_updates(user_id),
                "adaptation_suggestions": fallback_insights.get("suggestions", []),
                "confidence_improvement": 0.3,
                "error_info": {
                    "type": "ai_processing_failed",
                    "details": error_details,
                    "fallback_used": True,
                    "retry_suggested": True
                }
            }
    
    async def _predict_preferences(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Predict user preferences for new content or contexts"""
        
        content_info = data.get("content_info", {})
        context_info = data.get("context_info", {})  # time of day, device, purpose
        
        # Get user's historical preferences
        user_profile = self.user_preferences.get(user_id, {})
        
        prediction_context = {
            "user_profile": user_profile,
            "content_info": content_info,
            "context_info": context_info,
            "task": "Predict optimal accessibility settings for this specific content and context"
        }
        
        ai_response = await self.execute(prediction_context)
        
        if ai_response["success"]:
            predicted_settings = await self._generate_predicted_settings(
                user_profile, content_info, context_info
            )
            
            return {
                "predicted_settings": predicted_settings,
                "prediction_confidence": self._calculate_prediction_confidence(user_profile, content_info),
                "reasoning": self._extract_reasoning(ai_response["result"]),
                "alternative_options": self._generate_alternatives(predicted_settings),
                "context_adaptations": self._suggest_context_adaptations(context_info)
            }
        else:
            return self._fallback_prediction(user_profile)
    
    async def _adaptive_tuning(self, data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Real-time adaptive tuning based on current reading session"""
        
        session_data = data.get("session_data", {})
        current_performance = data.get("current_performance", {})
        fatigue_indicators = data.get("fatigue_indicators", {})
        
        tuning_context = {
            "session_data": session_data,
            "current_performance": current_performance,
            "fatigue_indicators": fatigue_indicators,
            "user_baseline": self.performance_metrics.get(user_id, {}),
            "task": "Provide real-time adaptive tuning recommendations"
        }
        
        ai_response = await self.execute(tuning_context)
        
        if ai_response["success"]:
            tuning_recommendations = self._generate_tuning_recommendations(
                session_data, current_performance, fatigue_indicators
            )
            
            return {
                "tuning_recommendations": tuning_recommendations,
                "urgency_level": self._assess_tuning_urgency(current_performance, fatigue_indicators),
                "adaptive_actions": tuning_recommendations.get("immediate_actions", []),
                "session_optimization": tuning_recommendations.get("session_tips", [])
            }
        else:
            return self._fallback_tuning(current_performance)
    
    async def _generate_optimized_settings(self, user_history: Dict, performance: Dict, content_type: str) -> Dict[str, Any]:
        """Generate optimized settings based on data analysis"""
        
        # Analyze historical performance patterns
        best_performing_settings = self._find_best_settings(user_history, performance)
        
        # Content-specific optimizations
        content_optimizations = {
            "technical": {"font_size": "+10%", "line_spacing": "+20%"},
            "narrative": {"word_highlighting": "reduced", "chunk_size": "larger"},
            "educational": {"tts_speed": "slower", "summary_frequency": "high"}
        }
        
        base_settings = best_performing_settings.copy()
        if content_type in content_optimizations:
            base_settings.update(content_optimizations[content_type])
        
        return {
            "dyslexia_settings": {
                "letter_spacing": base_settings.get("letter_spacing", "2px"),
                "line_height": base_settings.get("line_height", "2.0"),
                "font_size": base_settings.get("font_size", "110%"),
                "highlighting": base_settings.get("highlighting", "moderate")
            },
            "adhd_settings": {
                "word_highlighting_frequency": base_settings.get("word_highlighting", 3),
                "sentence_chunking": base_settings.get("chunking", "enabled"),
                "focus_cues": base_settings.get("focus_cues", "subtle")
            },
            "vision_settings": {
                "contrast_level": base_settings.get("contrast", "high"),
                "magnification": base_settings.get("magnification", "125%"),
                "color_scheme": base_settings.get("color_scheme", "dark_on_light")
            },
            "general_settings": {
                "tts_enabled": base_settings.get("tts", False),
                "break_reminders": base_settings.get("breaks", True),
                "progress_indicators": base_settings.get("progress", True)
            }
        }
    
    async def _generate_personalization_tips(self, user_history: Dict) -> List[str]:
        """Generate personalized tips based on user history"""
        
        tips = []
        
        # Analyze usage patterns
        if user_history.get("frequent_breaks", False):
            tips.append("Consider enabling automatic break reminders every 15 minutes")
        
        if user_history.get("prefers_audio", False):
            tips.append("Try combining text-to-speech with visual highlighting for better comprehension")
        
        if user_history.get("struggles_with_long_text", False):
            tips.append("Enable progressive disclosure to reveal content in smaller chunks")
        
        # Default tips if no history
        if not tips:
            tips = [
                "Experiment with different font sizes to find your optimal reading comfort",
                "Try adjusting line spacing if text feels cramped",
                "Use TTS for longer documents to reduce eye strain"
            ]
        
        return tips
    
    def _find_best_settings(self, user_history: Dict, performance: Dict) -> Dict[str, Any]:
        """Find settings that historically performed best for user"""
        
        # Simple heuristic - in real implementation, use ML
        best_settings = {}
        
        if performance.get("reading_speed", 0) > 0.7:
            best_settings["font_size"] = "100%"  # Normal size for fast readers
        else:
            best_settings["font_size"] = "120%"  # Larger for slower readers
        
        if performance.get("comprehension", 0) < 0.6:
            best_settings["highlighting"] = "high"
            best_settings["chunking"] = "enabled"
        
        return best_settings
    
    def _calculate_optimization_confidence(self, user_history: Dict, performance_data: Dict) -> float:
        """Calculate confidence in optimization recommendations"""
        
        data_points = len(user_history.get("sessions", []))
        consistency = performance_data.get("consistency_score", 0.5)
        
        # More data points and consistency = higher confidence
        confidence = min((data_points * 0.1) + (consistency * 0.5), 1.0)
        return round(confidence, 2)
    
    def _update_user_preferences(self, user_id: str, settings: Dict, performance: Dict):
        """Update user preference model"""
        
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {"sessions": [], "preferences": {}}
        
        session_data = {
            "settings": settings,
            "performance": performance,
            "timestamp": "current"
        }
        
        self.user_preferences[user_id]["sessions"].append(session_data)
        
        # Update performance metrics
        if user_id not in self.performance_metrics:
            self.performance_metrics[user_id] = {}
        
        self.performance_metrics[user_id].update(performance)
    
    def _extract_reasoning(self, ai_response: str) -> str:
        """Extract reasoning from AI response"""
        # Simple extraction - can be enhanced with NLP
        if "because" in ai_response.lower():
            return ai_response.split("because")[1].split(".")[0].strip()
        return "Based on your usage patterns and performance data"
    
    def _predict_improvement(self, settings: Dict, performance_data: Dict) -> Dict[str, str]:
        """Predict expected improvements from new settings"""
        
        current_performance = performance_data.get("reading_speed", 0.5)
        
        improvements = {}
        
        if settings.get("dyslexia_settings", {}).get("font_size", "100%") != "100%":
            improvements["reading_comfort"] = "15-25% improvement expected"
        
        if settings.get("adhd_settings", {}).get("sentence_chunking") == "enabled":
            improvements["focus_retention"] = "20-30% improvement expected"
        
        return improvements
    
    def _extract_learning_insights(self, ai_response: str) -> Dict[str, Any]:
        """Extract learning insights from AI response"""
        
        # Parse AI response for insights
        insights = {
            "key_findings": [],
            "suggestions": [],
            "confidence": 0.7
        }
        
        # Simple parsing - enhance with proper NLP
        if "improve" in ai_response.lower():
            insights["suggestions"].append("Settings optimization recommended")
        
        if "effective" in ai_response.lower():
            insights["key_findings"].append("Current adaptations are working well")
        
        return insights
    
    def _update_learning_model(self, user_id: str, feedback_type: str, feedback_data: Dict, insights: Dict):
        """Update the learning model with new insights"""
        
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {"learning_data": []}
        
        learning_entry = {
            "feedback_type": feedback_type,
            "feedback_data": feedback_data,
            "insights": insights,
            "timestamp": "current"
        }
        
        if "learning_data" not in self.user_preferences[user_id]:
            self.user_preferences[user_id]["learning_data"] = []
        
        self.user_preferences[user_id]["learning_data"].append(learning_entry)
    
    def _fallback_optimization(self, current_settings: Dict) -> Dict[str, Any]:
        """Fallback when AI optimization fails"""
        return {
            "optimized_settings": current_settings,
            "confidence_level": 0.3,
            "reasoning": "Using current settings as baseline",
            "expected_improvement": {},
            "personalization_tips": ["Continue using current settings"],
            "adaptive_features": []
        }
    
    def _fallback_prediction(self, user_profile: Dict) -> Dict[str, Any]:
        """Fallback prediction when AI fails"""
        return {
            "predicted_settings": user_profile.get("last_settings", {}),
            "prediction_confidence": 0.3,
            "reasoning": "Based on previous settings",
            "alternative_options": [],
            "context_adaptations": []
        }
    
    def _generate_tuning_recommendations(self, session_data: Dict, current_performance: Dict, fatigue_indicators: Dict) -> Dict[str, Any]:
        """Generate tuning recommendations based on session data"""
        recommendations = {
            "immediate_actions": [],
            "session_tips": []
        }
        
        # Check fatigue indicators
        if fatigue_indicators.get("reading_speed_decline", 0) > 0.2:
            recommendations["immediate_actions"].append("Increase font size by 10%")
            recommendations["session_tips"].append("Consider taking a 5-minute break")
        
        # Check performance decline
        if current_performance.get("comprehension", 1.0) < 0.6:
            recommendations["immediate_actions"].append("Enable sentence highlighting")
            recommendations["session_tips"].append("Reduce reading speed")
        
        return recommendations
    
    def _fallback_tuning(self, current_performance: Dict) -> Dict[str, Any]:
        """Fallback tuning when AI fails"""
        return {
            "tuning_recommendations": {"immediate_actions": ["Continue current session"]},
            "urgency_level": "low",
            "adaptive_actions": [],
            "session_optimization": []
        }
    
    def _fallback_feedback_processing(self, feedback_type: str, feedback_data: Dict) -> Dict[str, Any]:
        """Fallback processing when AI feedback analysis fails"""
        if feedback_type == "explicit":
            rating = feedback_data.get("rating", 0)
            suggestions = ["Continue current settings"] if rating >= 3 else ["Try adjusting font size or spacing"]
        else:
            completion_rate = feedback_data.get("completion_rate", 0)
            suggestions = ["Settings appear effective"] if completion_rate > 0.7 else ["Consider enabling more assistance features"]
        
        return {
            "key_findings": ["Basic feedback analysis completed"],
            "suggestions": suggestions,
            "confidence": 0.3
        }
    
    def _get_preference_updates(self, user_id: str) -> Dict[str, Any]:
        """Get recent preference updates for user"""
        user_data = self.user_preferences.get(user_id, {})
        return {
            "recent_changes": user_data.get("recent_changes", []),
            "trending_preferences": user_data.get("trending_preferences", {}),
            "last_updated": user_data.get("last_updated", "never")
        }
    
    def _calculate_learning_confidence(self, user_id: str) -> float:
        """Calculate confidence in learning model for user"""
        user_data = self.user_preferences.get(user_id, {})
        learning_data = user_data.get("learning_data", [])
        return min(len(learning_data) * 0.1, 0.9)
    
    def _generate_predicted_settings(self, user_profile: Dict, content_info: Dict, context_info: Dict) -> Dict[str, Any]:
        """Generate predicted settings based on user profile and context"""
        base_settings = user_profile.get("preferences", {})
        
        # Simple prediction logic
        predicted = {
            "font_size": base_settings.get("font_size", "110%"),
            "line_spacing": base_settings.get("line_spacing", "1.5"),
            "highlighting": "moderate"
        }
        
        # Adjust for content type
        if content_info.get("complexity") == "high":
            predicted["highlighting"] = "high"
            predicted["font_size"] = "120%"
        
        return predicted
    
    def _calculate_prediction_confidence(self, user_profile: Dict, content_info: Dict) -> float:
        """Calculate confidence in prediction"""
        sessions = len(user_profile.get("sessions", []))
        return min(sessions * 0.15, 0.85)
    
    def _generate_alternatives(self, predicted_settings: Dict) -> List[Dict]:
        """Generate alternative setting options"""
        return [
            {"name": "Conservative", "font_size": "100%", "highlighting": "low"},
            {"name": "Enhanced", "font_size": "130%", "highlighting": "high"}
        ]
    
    def _suggest_context_adaptations(self, context_info: Dict) -> List[str]:
        """Suggest adaptations based on context"""
        adaptations = []
        if context_info.get("time_of_day") == "evening":
            adaptations.append("Consider dark mode for evening reading")
        if context_info.get("device") == "mobile":
            adaptations.append("Increase font size for mobile reading")
        return adaptations
    
    def _assess_tuning_urgency(self, current_performance: Dict, fatigue_indicators: Dict) -> str:
        """Assess urgency of tuning adjustments"""
        if fatigue_indicators.get("reading_speed_decline", 0) > 0.3:
            return "high"
        elif current_performance.get("comprehension", 1.0) < 0.5:
            return "medium"
        return "low"
    
    def _suggest_adaptive_features(self, reading_performance: Dict) -> List[str]:
        """Suggest adaptive features based on performance"""
        features = []
        if reading_performance.get("comprehension", 0) < 0.6:
            features.append("Enable sentence-by-sentence highlighting")
        if reading_performance.get("reading_speed", 0) < 0.4:
            features.append("Consider text-to-speech assistance")
        return features
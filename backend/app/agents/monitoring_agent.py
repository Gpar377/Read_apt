from .base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime, timedelta

class MonitoringAgent(BaseAgent):
    """Agent that monitors user progress and provides intelligent insights"""
    
    def __init__(self):
        system_prompt = """
        You are a monitoring and analytics agent for accessibility progress tracking. Your role is to:
        
        1. TRACK user progress and performance over time
        2. IDENTIFY patterns in reading behavior and adaptation usage
        3. DETECT regression or improvement in accessibility needs
        4. PREDICT optimal intervention timing
        5. GENERATE actionable insights and recommendations
        
        Monitoring Capabilities:
        - Progress tracking across sessions
        - Performance trend analysis
        - Adaptation effectiveness measurement
        - Fatigue and attention pattern detection
        - Personalized milestone setting
        - Intervention timing optimization
        
        Analytics Focus:
        - Reading speed and comprehension trends
        - Adaptation preference evolution
        - Session duration and frequency patterns
        - Error patterns and improvement areas
        - Engagement and motivation indicators
        
        Provide specific, data-driven insights with actionable recommendations.
        """
        super().__init__("MonitoringAgent", system_prompt)
        self.user_analytics = {}
        self.progress_tracking = {}
        self.intervention_history = {}
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process monitoring data and provide insights"""
        
        monitoring_type = data.get("monitoring_type")
        
        if monitoring_type == "track_progress":
            return await self._track_user_progress(data)
        elif monitoring_type == "analyze_trends":
            return await self._analyze_performance_trends(data)
        elif monitoring_type == "detect_patterns":
            return await self._detect_behavioral_patterns(data)
        elif monitoring_type == "recommend_interventions":
            return await self._recommend_interventions(data)
        elif monitoring_type == "generate_insights":
            return await self._generate_progress_insights(data)
        else:
            return {"error": "Unknown monitoring type"}
    
    async def _track_user_progress(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Track and analyze user progress over time"""
        
        user_id = data.get("user_id")
        session_data = data.get("session_data", {})
        performance_metrics = data.get("performance_metrics", {})
        
        # Store session data
        self._store_session_data(user_id, session_data, performance_metrics)
        
        # Get historical data for analysis
        user_history = self.user_analytics.get(user_id, {})
        
        tracking_context = {
            "current_session": session_data,
            "performance_metrics": performance_metrics,
            "user_history": user_history,
            "task": "Analyze current progress and provide tracking insights"
        }
        
        ai_response = await self.execute(tracking_context)
        
        if ai_response["success"]:
            try:
                progress_analysis = await self._analyze_progress_data(user_id, session_data, performance_metrics)
                
                return {
                    "progress_summary": progress_analysis["summary"],
                    "performance_trends": progress_analysis["trends"],
                    "milestone_progress": progress_analysis["milestones"],
                    "areas_of_improvement": progress_analysis["improvements"],
                    "areas_of_concern": progress_analysis["concerns"],
                    "next_goals": progress_analysis["goals"],
                    "confidence_score": progress_analysis["confidence"]
                }
            except Exception as e:
                return self._fallback_progress_tracking(session_data)
        else:
            return self._fallback_progress_tracking(session_data)
    
    async def _analyze_performance_trends(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze performance trends and patterns"""
        
        user_id = data.get("user_id")
        time_period = data.get("time_period", "week")  # day, week, month
        metrics_focus = data.get("metrics_focus", ["reading_speed", "comprehension", "engagement"])
        
        user_data = self.user_analytics.get(user_id, {})
        
        trends_context = {
            "user_data": user_data,
            "time_period": time_period,
            "metrics_focus": metrics_focus,
            "task": f"Analyze {time_period} performance trends for specified metrics"
        }
        
        ai_response = await self.execute(trends_context)
        
        if ai_response["success"]:
            try:
                trend_analysis = await self._perform_trend_analysis(user_id, time_period, metrics_focus)
                
                return {
                    "trend_summary": trend_analysis["summary"],
                    "performance_changes": trend_analysis["changes"],
                    "statistical_significance": trend_analysis["significance"],
                    "trend_predictions": trend_analysis["predictions"],
                    "recommended_actions": trend_analysis["actions"],
                    "trend_visualizations": trend_analysis["visualizations"]
                }
            except Exception as e:
                return self._fallback_trend_analysis(user_data)
        else:
            return self._fallback_trend_analysis(user_data)
    
    async def _detect_behavioral_patterns(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Detect patterns in user behavior and adaptation usage"""
        
        user_id = data.get("user_id")
        pattern_types = data.get("pattern_types", ["usage", "performance", "preferences"])
        
        user_behavior_data = self._get_behavioral_data(user_id)
        
        pattern_context = {
            "behavioral_data": user_behavior_data,
            "pattern_types": pattern_types,
            "task": "Detect significant behavioral patterns and their implications"
        }
        
        ai_response = await self.execute(pattern_context)
        
        if ai_response["success"]:
            try:
                pattern_analysis = await self._analyze_behavioral_patterns(user_id, pattern_types)
                
                return {
                    "detected_patterns": pattern_analysis["patterns"],
                    "pattern_significance": pattern_analysis["significance"],
                    "behavioral_insights": pattern_analysis["insights"],
                    "adaptation_patterns": pattern_analysis["adaptations"],
                    "usage_patterns": pattern_analysis["usage"],
                    "recommendation_adjustments": pattern_analysis["adjustments"]
                }
            except Exception as e:
                return self._fallback_pattern_detection(user_behavior_data)
        else:
            return self._fallback_pattern_detection(user_behavior_data)
    
    async def _recommend_interventions(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Recommend interventions based on monitoring data"""
        
        user_id = data.get("user_id")
        current_challenges = data.get("current_challenges", [])
        intervention_history = self.intervention_history.get(user_id, [])
        
        intervention_context = {
            "current_challenges": current_challenges,
            "intervention_history": intervention_history,
            "user_progress": self.progress_tracking.get(user_id, {}),
            "task": "Recommend optimal interventions based on current challenges and history"
        }
        
        ai_response = await self.execute(intervention_context)
        
        if ai_response["success"]:
            try:
                interventions = await self._generate_intervention_recommendations(
                    user_id, current_challenges, intervention_history
                )
                
                return {
                    "recommended_interventions": interventions["recommendations"],
                    "intervention_priority": interventions["priority"],
                    "expected_outcomes": interventions["outcomes"],
                    "implementation_timeline": interventions["timeline"],
                    "success_metrics": interventions["metrics"],
                    "alternative_approaches": interventions["alternatives"]
                }
            except Exception as e:
                return self._fallback_intervention_recommendations(current_challenges)
        else:
            return self._fallback_intervention_recommendations(current_challenges)
    
    async def _generate_progress_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive progress insights"""
        
        user_id = data.get("user_id")
        insight_depth = data.get("insight_depth", "comprehensive")  # basic, detailed, comprehensive
        
        comprehensive_data = self._compile_comprehensive_data(user_id)
        
        insights_context = {
            "comprehensive_data": comprehensive_data,
            "insight_depth": insight_depth,
            "task": f"Generate {insight_depth} progress insights with actionable recommendations"
        }
        
        ai_response = await self.execute(insights_context)
        
        if ai_response["success"]:
            try:
                insights = await self._compile_progress_insights(user_id, insight_depth)
                
                return {
                    "overall_progress": insights["overall"],
                    "key_achievements": insights["achievements"],
                    "improvement_areas": insights["improvements"],
                    "personalized_recommendations": insights["recommendations"],
                    "future_goals": insights["goals"],
                    "success_probability": insights["success_probability"],
                    "motivational_insights": insights["motivation"]
                }
            except Exception as e:
                return self._fallback_progress_insights(comprehensive_data)
        else:
            return self._fallback_progress_insights(comprehensive_data)
    
    async def _analyze_progress_data(self, user_id: str, session_data: Dict, performance_metrics: Dict) -> Dict[str, Any]:
        """Analyze progress data and generate insights"""
        
        # Get historical data
        history = self.user_analytics.get(user_id, {"sessions": []})
        
        # Calculate trends
        recent_sessions = history["sessions"][-5:] if len(history["sessions"]) >= 5 else history["sessions"]
        
        if len(recent_sessions) >= 2:
            # Calculate improvement trends
            reading_speeds = [s.get("reading_speed", 0) for s in recent_sessions]
            comprehension_scores = [s.get("comprehension", 0) for s in recent_sessions]
            
            speed_trend = "improving" if reading_speeds[-1] > reading_speeds[0] else "declining"
            comprehension_trend = "improving" if comprehension_scores[-1] > comprehension_scores[0] else "declining"
        else:
            speed_trend = "insufficient_data"
            comprehension_trend = "insufficient_data"
        
        return {
            "summary": f"Session completed with {performance_metrics.get('comprehension', 0):.1%} comprehension",
            "trends": {
                "reading_speed": speed_trend,
                "comprehension": comprehension_trend
            },
            "milestones": self._check_milestones(user_id, performance_metrics),
            "improvements": self._identify_improvements(recent_sessions, performance_metrics),
            "concerns": self._identify_concerns(recent_sessions, performance_metrics),
            "goals": self._suggest_next_goals(performance_metrics),
            "confidence": min(len(recent_sessions) * 0.2, 1.0)
        }
    
    async def _perform_trend_analysis(self, user_id: str, time_period: str, metrics_focus: List[str]) -> Dict[str, Any]:
        """Perform detailed trend analysis"""
        
        user_data = self.user_analytics.get(user_id, {"sessions": []})
        sessions = user_data["sessions"]
        
        # Filter sessions by time period (simplified)
        if time_period == "week":
            relevant_sessions = sessions[-7:] if len(sessions) >= 7 else sessions
        elif time_period == "month":
            relevant_sessions = sessions[-30:] if len(sessions) >= 30 else sessions
        else:
            relevant_sessions = sessions[-1:] if sessions else []
        
        trends = {}
        for metric in metrics_focus:
            values = [s.get(metric, 0) for s in relevant_sessions]
            if len(values) >= 2:
                trend_direction = "increasing" if values[-1] > values[0] else "decreasing"
                trend_strength = abs(values[-1] - values[0]) / max(values[0], 0.1)
            else:
                trend_direction = "stable"
                trend_strength = 0
            
            trends[metric] = {
                "direction": trend_direction,
                "strength": trend_strength,
                "current_value": values[-1] if values else 0
            }
        
        return {
            "summary": f"Analysis of {len(relevant_sessions)} sessions over {time_period}",
            "changes": trends,
            "significance": "moderate" if len(relevant_sessions) >= 5 else "low",
            "predictions": self._generate_trend_predictions(trends),
            "actions": self._suggest_trend_actions(trends),
            "visualizations": self._create_trend_visualizations(trends)
        }
    
    def _store_session_data(self, user_id: str, session_data: Dict, performance_metrics: Dict):
        """Store session data for analysis"""
        
        if user_id not in self.user_analytics:
            self.user_analytics[user_id] = {"sessions": [], "created": "current"}
        
        session_entry = {
            "timestamp": "current",
            "session_data": session_data,
            "performance": performance_metrics,
            "reading_speed": performance_metrics.get("reading_speed", 0),
            "comprehension": performance_metrics.get("comprehension", 0),
            "engagement": performance_metrics.get("engagement", 0)
        }
        
        self.user_analytics[user_id]["sessions"].append(session_entry)
        
        # Keep only last 100 sessions
        if len(self.user_analytics[user_id]["sessions"]) > 100:
            self.user_analytics[user_id]["sessions"] = self.user_analytics[user_id]["sessions"][-100:]
    
    def _check_milestones(self, user_id: str, performance_metrics: Dict) -> List[Dict]:
        """Check if user has reached any milestones"""
        
        milestones = []
        
        comprehension = performance_metrics.get("comprehension", 0)
        reading_speed = performance_metrics.get("reading_speed", 0)
        
        if comprehension >= 0.8:
            milestones.append({
                "type": "comprehension",
                "achievement": "High comprehension achieved",
                "value": comprehension
            })
        
        if reading_speed >= 0.7:
            milestones.append({
                "type": "speed",
                "achievement": "Good reading speed achieved",
                "value": reading_speed
            })
        
        return milestones
    
    def _identify_improvements(self, recent_sessions: List[Dict], current_performance: Dict) -> List[str]:
        """Identify areas of improvement"""
        
        improvements = []
        
        if len(recent_sessions) >= 2:
            prev_comprehension = recent_sessions[-2].get("comprehension", 0)
            curr_comprehension = current_performance.get("comprehension", 0)
            
            if curr_comprehension > prev_comprehension:
                improvements.append("Comprehension is improving")
        
        if current_performance.get("reading_speed", 0) > 0.6:
            improvements.append("Reading speed is good")
        
        return improvements if improvements else ["Continue current approach"]
    
    def _identify_concerns(self, recent_sessions: List[Dict], current_performance: Dict) -> List[str]:
        """Identify areas of concern"""
        
        concerns = []
        
        if current_performance.get("comprehension", 0) < 0.4:
            concerns.append("Low comprehension - consider easier content")
        
        if current_performance.get("reading_speed", 0) < 0.3:
            concerns.append("Slow reading speed - check adaptation settings")
        
        return concerns
    
    def _suggest_next_goals(self, performance_metrics: Dict) -> List[str]:
        """Suggest next goals based on current performance"""
        
        goals = []
        
        comprehension = performance_metrics.get("comprehension", 0)
        if comprehension < 0.7:
            goals.append("Improve comprehension to 70%")
        elif comprehension < 0.9:
            goals.append("Achieve excellent comprehension (90%)")
        
        reading_speed = performance_metrics.get("reading_speed", 0)
        if reading_speed < 0.6:
            goals.append("Increase reading speed")
        
        return goals if goals else ["Maintain current performance"]
    
    def _fallback_progress_tracking(self, session_data: Dict) -> Dict[str, Any]:
        """Fallback progress tracking"""
        return {
            "progress_summary": "Session completed successfully",
            "performance_trends": {"overall": "stable"},
            "milestone_progress": [],
            "areas_of_improvement": ["Continue practicing"],
            "areas_of_concern": [],
            "next_goals": ["Complete next session"],
            "confidence_score": 0.5
        }
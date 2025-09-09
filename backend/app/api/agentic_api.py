from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.agents.agent_orchestrator import orchestrator

router = APIRouter()

# Pydantic models for agentic API
class AgenticRequest(BaseModel):
    type: str  # assessment, reading_session, progress_check, real_time_help
    user_id: Optional[str] = "anonymous"
    context: Dict[str, Any] = {}
    data: Dict[str, Any] = {}

class WorkflowRequest(BaseModel):
    workflow_name: str
    input_data: Dict[str, Any]
    user_id: Optional[str] = "anonymous"

class CustomWorkflowRequest(BaseModel):
    steps: List[Dict[str, Any]]
    input_data: Dict[str, Any]
    user_id: Optional[str] = "anonymous"

class CollaborationRequest(BaseModel):
    agents: List[str]
    shared_data: Dict[str, Any]
    user_id: Optional[str] = "anonymous"

class AgentRequest(BaseModel):
    agent_name: str
    action: str
    data: Dict[str, Any]
    user_id: Optional[str] = "anonymous"

@router.post("/intelligent-routing")
async def intelligent_routing(request: AgenticRequest):
    """Intelligently route requests to appropriate agents"""
    try:
        # Add user_id to request data
        request_data = {
            "type": request.type,
            "user_id": request.user_id,
            "context": request.context,
            **request.data
        }
        
        result = await orchestrator.intelligent_routing(request_data)
        
        return {
            "success": True,
            "routing_result": result,
            "request_type": request.type,
            "user_id": request.user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing failed: {str(e)}")

@router.post("/execute-workflow")
async def execute_workflow(request: WorkflowRequest):
    """Execute a predefined agent workflow"""
    try:
        # Add user_id to input data
        input_data = {
            "user_id": request.user_id,
            **request.input_data
        }
        
        result = await orchestrator.execute_workflow(request.workflow_name, input_data)
        
        return {
            "success": True,
            "workflow_result": result,
            "workflow_name": request.workflow_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")

@router.post("/custom-workflow")
async def execute_custom_workflow(request: CustomWorkflowRequest):
    """Execute a custom agent workflow"""
    try:
        input_data = {
            "user_id": request.user_id,
            **request.input_data
        }
        
        result = await orchestrator.execute_custom_workflow(request.steps, input_data)
        
        return {
            "success": True,
            "custom_workflow_result": result,
            "steps_executed": len(request.steps)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom workflow failed: {str(e)}")

@router.post("/collaborative-processing")
async def collaborative_processing(request: CollaborationRequest):
    """Enable agents to collaborate on complex tasks"""
    try:
        shared_data = {
            "user_id": request.user_id,
            **request.shared_data
        }
        
        result = await orchestrator.collaborative_processing(request.agents, shared_data)
        
        return {
            "success": True,
            "collaboration_result": result,
            "participating_agents": request.agents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Collaboration failed: {str(e)}")

@router.post("/agent/{agent_name}")
async def execute_single_agent(agent_name: str, request: AgentRequest):
    """Execute a single agent directly"""
    try:
        # Validate agent exists
        if agent_name not in orchestrator.agent_registry:
            raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")
        
        agent = orchestrator.agent_registry[agent_name]
        
        # Prepare agent data
        agent_data = {
            "user_id": request.user_id,
            **request.data
        }
        
        # Add action-specific data formatting
        if agent_name == "assessment":
            agent_data["type"] = request.action
        elif agent_name == "content":
            agent_data["content_type"] = request.action
        elif agent_name == "personalization":
            agent_data["action_type"] = request.action
        elif agent_name == "monitoring":
            agent_data["monitoring_type"] = request.action
        
        result = await agent.process(agent_data)
        
        return {
            "success": True,
            "agent_result": result,
            "agent_name": agent_name,
            "action": request.action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

@router.get("/workflows")
async def get_available_workflows():
    """Get list of available predefined workflows"""
    try:
        workflows = orchestrator.workflow_templates
        
        workflow_info = {}
        for name, steps in workflows.items():
            workflow_info[name] = {
                "description": _get_workflow_description(name),
                "steps": len(steps),
                "agents_involved": list(set(step["agent"] for step in steps)),
                "estimated_duration": _estimate_workflow_duration(steps)
            }
        
        return {
            "available_workflows": workflow_info,
            "total_workflows": len(workflows)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get workflows: {str(e)}")

@router.get("/agents")
async def get_available_agents():
    """Get list of available agents and their capabilities"""
    try:
        agents_info = {
            "assessment": {
                "description": "Adaptive assessment and testing",
                "capabilities": ["dyslexia_assessment", "adhd_questionnaire", "adaptive_feedback"],
                "actions": ["dyslexia", "adhd"]
            },
            "personalization": {
                "description": "Learning and optimization of user preferences",
                "capabilities": ["settings_optimization", "preference_learning", "adaptive_tuning"],
                "actions": ["optimize_settings", "learn_feedback", "predict_preferences", "adaptive_tuning"]
            },
            "content": {
                "description": "Intelligent content processing and adaptation",
                "capabilities": ["complexity_analysis", "summary_generation", "text_chunking", "vocabulary_adaptation"],
                "actions": ["analyze_complexity", "generate_summary", "create_chunks", "adapt_vocabulary", "generate_audio", "create_highlights"]
            },
            "monitoring": {
                "description": "Progress tracking and analytics",
                "capabilities": ["progress_tracking", "trend_analysis", "pattern_detection", "intervention_recommendations"],
                "actions": ["track_progress", "analyze_trends", "detect_patterns", "recommend_interventions", "generate_insights"]
            }
        }
        
        return {
            "available_agents": agents_info,
            "total_agents": len(agents_info)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get agents: {str(e)}")

@router.get("/status")
async def get_system_status():
    """Get status of all agents and orchestrator"""
    try:
        status = await orchestrator.get_agent_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get status: {str(e)}")

# Specialized endpoints for common use cases

@router.post("/adaptive-assessment")
async def adaptive_assessment(user_id: str = "anonymous", assessment_type: str = "dyslexia"):
    """Start an adaptive assessment session"""
    try:
        request_data = {
            "type": "assessment",
            "user_id": user_id,
            "context": {"assessment_type": assessment_type},
            "adaptive_mode": True
        }
        
        result = await orchestrator.intelligent_routing(request_data)
        
        return {
            "assessment_started": True,
            "assessment_type": assessment_type,
            "result": result,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

@router.post("/adaptive-reading")
async def adaptive_reading_session(
    text: str,
    user_id: str = "anonymous",
    content_type: str = "general",
    user_conditions: List[str] = []
):
    """Start an adaptive reading session"""
    try:
        request_data = {
            "type": "reading_session",
            "user_id": user_id,
            "context": {
                "text": text,
                "content_type": content_type,
                "user_conditions": user_conditions
            }
        }
        
        result = await orchestrator.intelligent_routing(request_data)
        
        return {
            "reading_session_started": True,
            "content_type": content_type,
            "result": result,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reading session failed: {str(e)}")

@router.post("/real-time-adaptation")
async def real_time_adaptation(
    user_id: str,
    current_performance: Dict[str, Any],
    fatigue_indicators: Dict[str, Any] = {},
    session_data: Dict[str, Any] = {}
):
    """Get real-time adaptation recommendations"""
    try:
        request_data = {
            "type": "real_time_help",
            "user_id": user_id,
            "context": {
                "current_performance": current_performance,
                "fatigue_indicators": fatigue_indicators,
                "session_data": session_data
            }
        }
        
        result = await orchestrator.intelligent_routing(request_data)
        
        return {
            "real_time_adaptation": True,
            "recommendations": result,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Real-time adaptation failed: {str(e)}")

@router.get("/progress-insights/{user_id}")
async def get_progress_insights(user_id: str, insight_depth: str = "comprehensive"):
    """Get comprehensive progress insights for a user"""
    try:
        request_data = {
            "type": "progress_check",
            "user_id": user_id,
            "context": {"insight_depth": insight_depth}
        }
        
        result = await orchestrator.intelligent_routing(request_data)
        
        return {
            "progress_insights": True,
            "insight_depth": insight_depth,
            "result": result,
            "user_id": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progress insights failed: {str(e)}")

# Helper functions

def _get_workflow_description(workflow_name: str) -> str:
    """Get description for workflow"""
    descriptions = {
        "complete_assessment": "Comprehensive assessment including dyslexia, ADHD testing with personalized optimization",
        "adaptive_reading": "Intelligent content analysis and adaptation for optimal reading experience",
        "progress_review": "Detailed progress analysis with trend identification and intervention recommendations",
        "real_time_adaptation": "Real-time performance monitoring with dynamic adaptation suggestions"
    }
    return descriptions.get(workflow_name, "Custom workflow")

def _estimate_workflow_duration(steps: List[Dict]) -> str:
    """Estimate workflow duration"""
    step_count = len(steps)
    if step_count <= 2:
        return "1-2 minutes"
    elif step_count <= 4:
        return "2-5 minutes"
    else:
        return "5-10 minutes"
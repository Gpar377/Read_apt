from typing import Dict, Any, List
from .assessment_agent import AssessmentAgent
from .personalization_agent import PersonalizationAgent
from .content_agent import ContentAgent
from .monitoring_agent import MonitoringAgent
import asyncio
import json

class AgentOrchestrator:
    """Orchestrates multiple AI agents for comprehensive accessibility support"""
    
    def __init__(self):
        self.assessment_agent = AssessmentAgent()
        self.personalization_agent = PersonalizationAgent()
        self.content_agent = ContentAgent()
        self.monitoring_agent = MonitoringAgent()
        
        self.agent_registry = {
            "assessment": self.assessment_agent,
            "personalization": self.personalization_agent,
            "content": self.content_agent,
            "monitoring": self.monitoring_agent
        }
        
        self.workflow_templates = self._initialize_workflows()
    
    def _initialize_workflows(self) -> Dict[str, List[Dict]]:
        """Initialize predefined agent workflows"""
        return {
            "complete_assessment": [
                {"agent": "assessment", "action": "dyslexia_test"},
                {"agent": "assessment", "action": "adhd_questionnaire"},
                {"agent": "personalization", "action": "optimize_settings"},
                {"agent": "monitoring", "action": "track_progress"}
            ],
            "adaptive_reading": [
                {"agent": "content", "action": "analyze_complexity"},
                {"agent": "personalization", "action": "predict_preferences"},
                {"agent": "content", "action": "adapt_content"},
                {"agent": "monitoring", "action": "track_engagement"}
            ],
            "progress_review": [
                {"agent": "monitoring", "action": "analyze_trends"},
                {"agent": "personalization", "action": "learn_feedback"},
                {"agent": "monitoring", "action": "recommend_interventions"}
            ],
            "real_time_adaptation": [
                {"agent": "monitoring", "action": "detect_patterns"},
                {"agent": "personalization", "action": "adaptive_tuning"},
                {"agent": "content", "action": "dynamic_adjustment"}
            ]
        }
    
    async def execute_workflow(self, workflow_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a predefined agent workflow"""
        
        if workflow_name not in self.workflow_templates:
            return {"error": f"Unknown workflow: {workflow_name}"}
        
        workflow_steps = self.workflow_templates[workflow_name]
        results = []
        context = input_data.copy()
        
        try:
            for step in workflow_steps:
                agent_name = step["agent"]
                action = step["action"]
                
                # Execute agent step
                step_result = await self._execute_agent_step(agent_name, action, context)
                
                # Add result to context for next steps
                context[f"{agent_name}_result"] = step_result
                results.append({
                    "step": f"{agent_name}_{action}",
                    "result": step_result,
                    "success": step_result.get("success", True)
                })
                
                # Stop workflow if step fails critically
                if not step_result.get("success", True) and step_result.get("critical", False):
                    break
            
            return {
                "workflow": workflow_name,
                "success": True,
                "results": results,
                "final_context": context,
                "summary": self._generate_workflow_summary(workflow_name, results)
            }
            
        except Exception as e:
            return {
                "workflow": workflow_name,
                "success": False,
                "error": str(e),
                "partial_results": results
            }
    
    async def execute_custom_workflow(self, steps: List[Dict], input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a custom agent workflow"""
        
        results = []
        context = input_data.copy()
        
        try:
            for step in steps:
                agent_name = step.get("agent")
                action = step.get("action")
                step_data = step.get("data", {})
                
                # Merge step data with context
                merged_data = {**context, **step_data}
                
                step_result = await self._execute_agent_step(agent_name, action, merged_data)
                
                context[f"{agent_name}_result"] = step_result
                results.append({
                    "step": f"{agent_name}_{action}",
                    "result": step_result,
                    "success": step_result.get("success", True)
                })
            
            return {
                "workflow": "custom",
                "success": True,
                "results": results,
                "final_context": context
            }
            
        except Exception as e:
            return {
                "workflow": "custom",
                "success": False,
                "error": str(e),
                "partial_results": results
            }
    
    async def intelligent_routing(self, user_request: Dict[str, Any]) -> Dict[str, Any]:
        """Intelligently route user requests to appropriate agents"""
        
        request_type = user_request.get("type")
        user_context = user_request.get("context", {})
        
        # Determine optimal agent workflow based on request
        if request_type == "assessment":
            return await self.execute_workflow("complete_assessment", user_request)
        
        elif request_type == "reading_session":
            return await self.execute_workflow("adaptive_reading", user_request)
        
        elif request_type == "progress_check":
            return await self.execute_workflow("progress_review", user_request)
        
        elif request_type == "real_time_help":
            return await self.execute_workflow("real_time_adaptation", user_request)
        
        elif request_type == "multi_agent":
            # Complex request requiring multiple agents
            return await self._handle_multi_agent_request(user_request)
        
        else:
            # Single agent request
            return await self._handle_single_agent_request(user_request)
    
    async def collaborative_processing(self, agents: List[str], shared_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enable agents to collaborate on complex tasks"""
        
        # Execute agents in parallel where possible
        parallel_tasks = []
        sequential_results = {}
        
        for agent_name in agents:
            if agent_name in self.agent_registry:
                # Prepare data for each agent
                agent_data = {
                    **shared_data,
                    "collaborative_context": sequential_results,
                    "participating_agents": agents
                }
                
                # Some agents can run in parallel, others need sequential execution
                if agent_name in ["content", "monitoring"]:
                    # These can run in parallel
                    task = self._execute_agent_collaboration(agent_name, agent_data)
                    parallel_tasks.append((agent_name, task))
                else:
                    # These need sequential execution
                    result = await self._execute_agent_collaboration(agent_name, agent_data)
                    sequential_results[agent_name] = result
        
        # Execute parallel tasks
        if parallel_tasks:
            parallel_results = await asyncio.gather(*[task for _, task in parallel_tasks])
            for i, (agent_name, _) in enumerate(parallel_tasks):
                sequential_results[agent_name] = parallel_results[i]
        
        # Synthesize results
        synthesis = await self._synthesize_collaborative_results(sequential_results, shared_data)
        
        return {
            "collaboration_type": "multi_agent",
            "participating_agents": agents,
            "individual_results": sequential_results,
            "synthesized_result": synthesis,
            "success": True
        }
    
    async def _execute_agent_step(self, agent_name: str, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single agent step"""
        
        if agent_name not in self.agent_registry:
            return {"success": False, "error": f"Unknown agent: {agent_name}"}
        
        agent = self.agent_registry[agent_name]
        
        # Prepare agent-specific data
        agent_data = data.copy()
        
        if agent_name == "assessment":
            agent_data["type"] = action.replace("_test", "").replace("_questionnaire", "")
        elif agent_name == "content":
            agent_data["content_type"] = action.replace("_", "_")
        elif agent_name == "personalization":
            agent_data["action_type"] = action
        elif agent_name == "monitoring":
            agent_data["monitoring_type"] = action
        
        try:
            result = await agent.process(agent_data)
            return {"success": True, "data": result, "agent": agent_name}
        except Exception as e:
            return {"success": False, "error": str(e), "agent": agent_name}
    
    async def _execute_agent_collaboration(self, agent_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute agent in collaborative mode"""
        
        agent = self.agent_registry[agent_name]
        
        # Add collaboration context
        collaboration_data = {
            **data,
            "collaboration_mode": True,
            "shared_context": data.get("collaborative_context", {})
        }
        
        return await agent.process(collaboration_data)
    
    async def _handle_multi_agent_request(self, user_request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle complex requests requiring multiple agents"""
        
        request_complexity = user_request.get("complexity", "medium")
        required_agents = user_request.get("required_agents", ["assessment", "personalization"])
        
        if request_complexity == "high":
            # Use collaborative processing
            return await self.collaborative_processing(required_agents, user_request)
        else:
            # Use sequential workflow
            workflow_steps = [
                {"agent": agent, "action": "process", "data": user_request}
                for agent in required_agents
            ]
            return await self.execute_custom_workflow(workflow_steps, user_request)
    
    async def _handle_single_agent_request(self, user_request: Dict[str, Any]) -> Dict[str, Any]:
        """Handle simple single-agent requests"""
        
        target_agent = user_request.get("target_agent", "assessment")
        
        if target_agent in self.agent_registry:
            agent = self.agent_registry[target_agent]
            result = await agent.process(user_request)
            return {
                "single_agent_result": result,
                "agent": target_agent,
                "success": True
            }
        else:
            return {"success": False, "error": f"Unknown agent: {target_agent}"}
    
    async def _synthesize_collaborative_results(self, results: Dict[str, Any], original_data: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize results from multiple agents"""
        
        synthesis = {
            "combined_insights": [],
            "unified_recommendations": [],
            "confidence_score": 0.0,
            "action_priorities": []
        }
        
        # Extract insights from each agent
        for agent_name, result in results.items():
            if isinstance(result, dict) and "data" in result:
                agent_data = result["data"]
                
                # Extract agent-specific insights
                if agent_name == "assessment":
                    synthesis["combined_insights"].append({
                        "source": "assessment",
                        "insight": agent_data.get("adaptive_feedback", "Assessment completed")
                    })
                
                elif agent_name == "personalization":
                    synthesis["unified_recommendations"].extend(
                        agent_data.get("personalization_tips", [])
                    )
                
                elif agent_name == "content":
                    synthesis["combined_insights"].append({
                        "source": "content",
                        "insight": f"Content complexity: {agent_data.get('complexity_score', 'unknown')}"
                    })
                
                elif agent_name == "monitoring":
                    synthesis["action_priorities"].extend(
                        agent_data.get("recommended_actions", [])
                    )
        
        # Calculate overall confidence
        confidence_scores = []
        for result in results.values():
            if isinstance(result, dict) and "data" in result:
                confidence_scores.append(result["data"].get("confidence_level", 0.5))
        
        synthesis["confidence_score"] = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.5
        
        return synthesis
    
    def _generate_workflow_summary(self, workflow_name: str, results: List[Dict]) -> str:
        """Generate a summary of workflow execution"""
        
        successful_steps = sum(1 for r in results if r.get("success", True))
        total_steps = len(results)
        
        summary = f"Workflow '{workflow_name}' completed: {successful_steps}/{total_steps} steps successful"
        
        if successful_steps == total_steps:
            summary += " - All objectives achieved"
        elif successful_steps > total_steps * 0.7:
            summary += " - Most objectives achieved"
        else:
            summary += " - Partial completion, review needed"
        
        return summary
    
    async def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        
        status = {}
        
        for agent_name, agent in self.agent_registry.items():
            try:
                # Simple health check
                test_data = {"type": "health_check"}
                result = await agent.execute(test_data)
                
                status[agent_name] = {
                    "status": "healthy" if result.get("success") else "error",
                    "last_check": "current",
                    "memory_usage": len(str(agent.memory.chat_memory.messages)) if hasattr(agent, 'memory') else 0
                }
            except Exception as e:
                status[agent_name] = {
                    "status": "error",
                    "error": str(e),
                    "last_check": "current"
                }
        
        return {
            "orchestrator_status": "active",
            "agent_statuses": status,
            "available_workflows": list(self.workflow_templates.keys()),
            "total_agents": len(self.agent_registry)
        }

# Global orchestrator instance
orchestrator = AgentOrchestrator()
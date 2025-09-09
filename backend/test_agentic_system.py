import asyncio
import json
import time
from app.agents.agent_orchestrator import orchestrator

async def test_agentic_system():
    """Test the complete agentic system functionality"""
    print("Testing Agentic System...")
    
    # Test 1: Agent Status Check
    print("\n1. Testing agent status...")
    try:
        status = await orchestrator.get_agent_status()
        print(f"[OK] Orchestrator status: {status['orchestrator_status']}")
        print(f"[OK] Total agents: {status['total_agents']}")
        print(f"[OK] Available workflows: {status['available_workflows']}")
        
        for agent_name, agent_status in status['agent_statuses'].items():
            print(f"   - {agent_name}: {agent_status['status']}")
    except Exception as e:
        print(f"[ERROR] Agent status failed: {e}")
    
    # Test 2: Complete Assessment Workflow
    print("\n2. Testing complete assessment workflow...")
    try:
        assessment_data = {
            "user_id": "test_user_123",
            "assessment_type": "comprehensive",
            "dyslexia_data": {"speed": 0.3, "survey_score": 0.4},
            "adhd_data": {
                "q1_responses": [2, 1, 3, 2, 1, 0, 2, 3, 1],
                "q2_responses": [3, 2, 3, 2, 3, 2, 1, 2, 3]
            }
        }
        
        result = await orchestrator.execute_workflow("complete_assessment", assessment_data)
        print(f"[OK] Assessment workflow: {result['success']}")
        print(f"[OK] Steps completed: {len(result['results'])}")
        print(f"[OK] Summary: {result['summary']}")
    except Exception as e:
        print(f"[ERROR] Assessment workflow failed: {e}")
    
    # Test 3: Adaptive Reading Workflow
    print("\n3. Testing adaptive reading workflow...")
    try:
        reading_data = {
            "user_id": "test_user_123",
            "content": "The quick brown fox jumps over the lazy dog. This is a test sentence for reading adaptation.",
            "user_preferences": {
                "dyslexia_preset": "mild",
                "adhd_preset": "inattentive",
                "vision_preset": "normal"
            }
        }
        
        result = await orchestrator.execute_workflow("adaptive_reading", reading_data)
        print(f"[OK] Reading workflow: {result['success']}")
        print(f"[OK] Steps completed: {len(result['results'])}")
    except Exception as e:
        print(f"[ERROR] Reading workflow failed: {e}")
    
    # Test 4: Intelligent Routing
    print("\n4. Testing intelligent routing...")
    try:
        # Assessment request
        assessment_request = {
            "type": "assessment",
            "user_id": "test_user_456",
            "context": {"first_time": True}
        }
        
        result = await orchestrator.intelligent_routing(assessment_request)
        print(f"[OK] Assessment routing: {result['success']}")
        
        # Reading session request
        reading_request = {
            "type": "reading_session",
            "user_id": "test_user_456",
            "content": "Sample reading content for testing.",
            "context": {"session_type": "practice"}
        }
        
        result = await orchestrator.intelligent_routing(reading_request)
        print(f"[OK] Reading routing: {result['success']}")
    except Exception as e:
        print(f"[ERROR] Intelligent routing failed: {e}")
    
    # Test 5: Collaborative Processing
    print("\n5. Testing collaborative processing...")
    try:
        collaborative_data = {
            "user_id": "test_user_789",
            "task": "comprehensive_analysis",
            "content": "Complex text requiring multiple agent analysis.",
            "user_profile": {
                "dyslexia_severity": "mild",
                "adhd_type": "inattentive",
                "vision_level": "normal"
            }
        }
        
        agents = ["assessment", "personalization", "content", "monitoring"]
        result = await orchestrator.collaborative_processing(agents, collaborative_data)
        
        print(f"[OK] Collaborative processing: {result['success']}")
        print(f"[OK] Participating agents: {len(result['participating_agents'])}")
        print(f"[OK] Synthesis confidence: {result['synthesized_result']['confidence_score']:.3f}")
    except Exception as e:
        print(f"[ERROR] Collaborative processing failed: {e}")
    
    # Test 6: Custom Workflow
    print("\n6. Testing custom workflow...")
    try:
        custom_steps = [
            {"agent": "assessment", "action": "quick_check", "data": {"type": "dyslexia"}},
            {"agent": "personalization", "action": "optimize_settings", "data": {"priority": "reading_speed"}},
            {"agent": "content", "action": "adapt_content", "data": {"complexity": "medium"}}
        ]
        
        custom_data = {
            "user_id": "test_user_custom",
            "workflow_type": "custom_adaptation"
        }
        
        result = await orchestrator.execute_custom_workflow(custom_steps, custom_data)
        print(f"[OK] Custom workflow: {result['success']}")
        print(f"[OK] Custom steps completed: {len(result['results'])}")
    except Exception as e:
        print(f"[ERROR] Custom workflow failed: {e}")
    
    # Test 7: Multi-Agent Request
    print("\n7. Testing multi-agent request...")
    try:
        multi_agent_request = {
            "type": "multi_agent",
            "complexity": "high",
            "required_agents": ["assessment", "personalization", "content"],
            "user_id": "test_user_multi",
            "task": "comprehensive_support"
        }
        
        result = await orchestrator.intelligent_routing(multi_agent_request)
        print(f"[OK] Multi-agent request: {result['success']}")
        print(f"[OK] Collaboration type: {result.get('collaboration_type', 'sequential')}")
    except Exception as e:
        print(f"[ERROR] Multi-agent request failed: {e}")
    
    # Test 8: Progress Review Workflow
    print("\n8. Testing progress review workflow...")
    try:
        progress_data = {
            "user_id": "test_user_progress",
            "time_period": "last_week",
            "metrics": {
                "reading_speed": [0.3, 0.35, 0.4, 0.42, 0.45],
                "comprehension": [0.6, 0.65, 0.7, 0.72, 0.75],
                "engagement": [0.8, 0.82, 0.85, 0.87, 0.9]
            }
        }
        
        result = await orchestrator.execute_workflow("progress_review", progress_data)
        print(f"[OK] Progress review: {result['success']}")
        print(f"[OK] Review summary: {result['summary']}")
    except Exception as e:
        print(f"[ERROR] Progress review failed: {e}")
    
    # Test 9: Real-time Adaptation
    print("\n9. Testing real-time adaptation...")
    try:
        realtime_data = {
            "user_id": "test_user_realtime",
            "current_session": {
                "reading_speed": 0.25,
                "error_rate": 0.15,
                "fatigue_level": 0.6,
                "time_elapsed": 1200  # 20 minutes
            },
            "content_difficulty": "medium"
        }
        
        result = await orchestrator.execute_workflow("real_time_adaptation", realtime_data)
        print(f"[OK] Real-time adaptation: {result['success']}")
        print(f"[OK] Adaptation steps: {len(result['results'])}")
    except Exception as e:
        print(f"[ERROR] Real-time adaptation failed: {e}")
    
    print("\nAgentic System testing completed!")

def run_agentic_tests():
    """Run all agentic system tests"""
    print("Starting Agentic System Tests...")
    print("=" * 50)
    
    try:
        asyncio.run(test_agentic_system())
    except Exception as e:
        print(f"[CRITICAL ERROR] in agentic system: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_agentic_tests()
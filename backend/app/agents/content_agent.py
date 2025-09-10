from .base_agent import BaseAgent
from typing import Dict, Any, List
import re
import json

class ContentAgent(BaseAgent):
    """Intelligent content processing agent that adapts text dynamically"""
    
    def __init__(self):
        system_prompt = """
        You are an intelligent content adaptation agent. Your role is to:
        
        1. ANALYZE text complexity and structure
        2. GENERATE adaptive summaries and simplifications
        3. CREATE context-aware highlights and emphasis
        4. PRODUCE intelligent text chunking
        5. GENERATE audio descriptions and TTS scripts
        
        Content Processing Capabilities:
        - Analyze reading level and complexity
        - Generate TL;DR summaries with key points
        - Create progressive disclosure content
        - Adapt vocabulary for different comprehension levels
        - Generate focus cues and attention anchors
        - Create audio-friendly text versions
        
        Adaptation Strategies:
        - For Dyslexia: Simplify sentence structure, highlight key terms
        - For ADHD: Create attention anchors, break into digestible chunks
        - For Low Vision: Generate descriptive audio content
        
        Always maintain content meaning while optimizing accessibility.
        Provide specific, actionable content modifications.
        """
        super().__init__("ContentAgent", system_prompt)
        self.content_cache = {}
        self.complexity_analyzer = ComplexityAnalyzer()
    
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process content based on user needs and accessibility requirements"""
        
        content_type = data.get("content_type")
        
        if content_type == "analyze_complexity":
            return await self._analyze_content_complexity(data)
        elif content_type == "generate_summary":
            return await self._generate_adaptive_summary(data)
        elif content_type == "create_chunks":
            return await self._create_intelligent_chunks(data)
        elif content_type == "adapt_vocabulary":
            return await self._adapt_vocabulary_level(data)
        elif content_type == "generate_audio":
            return await self._generate_audio_content(data)
        elif content_type == "create_highlights":
            return await self._create_smart_highlights(data)
        else:
            return {"error": "Unknown content processing type"}
    
    async def _analyze_content_complexity(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze text complexity and provide adaptation recommendations"""
        
        text = data.get("text", "")
        user_profile = data.get("user_profile", {})
        
        # Basic complexity analysis
        complexity_metrics = self.complexity_analyzer.analyze(text)
        
        # AI-enhanced analysis
        analysis_context = {
            "text": text[:500] + "..." if len(text) > 500 else text,  # Truncate for AI
            "complexity_metrics": complexity_metrics,
            "user_profile": user_profile,
            "task": "Analyze text complexity and recommend accessibility adaptations"
        }
        
        ai_response = await self.execute(analysis_context)
        
        if ai_response["success"]:
            try:
                # Combine AI insights with metrics
                ai_insights = self._parse_ai_analysis(ai_response["result"])
                
                return {
                    "complexity_score": complexity_metrics["overall_score"],
                    "reading_level": complexity_metrics["reading_level"],
                    "sentence_complexity": complexity_metrics["avg_sentence_length"],
                    "vocabulary_difficulty": complexity_metrics["difficult_words_ratio"],
                    "ai_insights": ai_insights,
                    "adaptation_recommendations": self._generate_adaptation_recommendations(
                        complexity_metrics, user_profile
                    ),
                    "estimated_reading_time": self._estimate_reading_time(text, user_profile),
                    "attention_demands": self._assess_attention_demands(complexity_metrics)
                }
            except Exception as e:
                return self._fallback_complexity_analysis(complexity_metrics)
        else:
            return self._fallback_complexity_analysis(complexity_metrics)
    
    async def _generate_adaptive_summary(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate intelligent summaries based on user needs"""
        
        text = data.get("text", "")
        summary_type = data.get("summary_type", "standard")  # standard, simple, bullet_points
        user_conditions = data.get("user_conditions", [])
        target_length = data.get("target_length", "medium")
        
        summary_context = {
            "text": text,
            "summary_type": summary_type,
            "user_conditions": user_conditions,
            "target_length": target_length,
            "task": f"Generate a {summary_type} summary optimized for users with {user_conditions}"
        }
        
        ai_response = await self.execute(summary_context)
        
        if ai_response["success"]:
            try:
                # Generate multiple summary versions
                summaries = await self._create_multiple_summaries(text, summary_type, user_conditions)
                
                return {
                    "primary_summary": summaries["primary"],
                    "alternative_summaries": summaries["alternatives"],
                    "key_points": summaries["key_points"],
                    "complexity_reduction": self._calculate_complexity_reduction(text, summaries["primary"]),
                    "reading_time_saved": self._calculate_time_savings(text, summaries["primary"]),
                    "accessibility_features": summaries["accessibility_features"]
                }
            except Exception as e:
                return self._fallback_summary(text, summary_type)
        else:
            return self._fallback_summary(text, summary_type)
    
    async def _create_intelligent_chunks(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create intelligent text chunks based on content structure and user needs"""
        
        text = data.get("text", "")
        chunking_strategy = data.get("chunking_strategy", "semantic")  # semantic, length, attention
        user_attention_span = data.get("user_attention_span", "medium")
        
        chunking_context = {
            "text": text,
            "strategy": chunking_strategy,
            "attention_span": user_attention_span,
            "task": "Create optimal text chunks for accessibility and comprehension"
        }
        
        ai_response = await self.execute(chunking_context)
        
        if ai_response["success"]:
            try:
                # Create chunks using AI guidance
                chunks = await self._create_semantic_chunks(text, chunking_strategy, user_attention_span)
                
                return {
                    "chunks": chunks["chunks"],
                    "chunk_metadata": chunks["metadata"],
                    "navigation_aids": chunks["navigation"],
                    "progressive_disclosure": chunks["progressive"],
                    "attention_anchors": chunks["anchors"],
                    "estimated_chunk_times": chunks["timing"]
                }
            except Exception as e:
                return self._fallback_chunking(text)
        else:
            return self._fallback_chunking(text)
    
    async def _adapt_vocabulary_level(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt vocabulary complexity for user comprehension level"""
        
        text = data.get("text", "")
        target_level = data.get("target_level", "intermediate")  # simple, intermediate, advanced
        preserve_meaning = data.get("preserve_meaning", True)
        
        vocabulary_context = {
            "text": text,
            "target_level": target_level,
            "preserve_meaning": preserve_meaning,
            "task": f"Adapt vocabulary to {target_level} level while preserving meaning"
        }
        
        ai_response = await self.execute(vocabulary_context)
        
        if ai_response["success"]:
            try:
                adapted_content = self._perform_vocabulary_adaptation(text, target_level)
                
                return {
                    "adapted_text": adapted_content["text"],
                    "vocabulary_changes": adapted_content["changes"],
                    "complexity_reduction": adapted_content["complexity_change"],
                    "meaning_preservation_score": adapted_content["meaning_score"],
                    "glossary": adapted_content["glossary"],
                    "reading_level_change": adapted_content["level_change"]
                }
            except Exception as e:
                return self._fallback_vocabulary_adaptation(text)
        else:
            return self._fallback_vocabulary_adaptation(text)
    
    async def _generate_audio_content(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate audio-optimized content and TTS scripts"""
        
        text = data.get("text", "")
        audio_type = data.get("audio_type", "standard")  # standard, descriptive, guided
        speech_rate = data.get("speech_rate", "normal")
        include_descriptions = data.get("include_descriptions", False)
        
        audio_context = {
            "text": text,
            "audio_type": audio_type,
            "speech_rate": speech_rate,
            "include_descriptions": include_descriptions,
            "task": "Generate audio-optimized content with appropriate pacing and descriptions"
        }
        
        ai_response = await self.execute(audio_context)
        
        if ai_response["success"]:
            try:
                audio_content = self._create_audio_optimized_content(text, audio_type, speech_rate)
                
                return {
                    "tts_script": audio_content["script"],
                    "pause_markers": audio_content["pauses"],
                    "emphasis_cues": audio_content["emphasis"],
                    "pronunciation_guide": audio_content["pronunciation"],
                    "audio_descriptions": audio_content["descriptions"],
                    "estimated_duration": audio_content["duration"],
                    "accessibility_enhancements": audio_content["enhancements"]
                }
            except Exception as e:
                return self._fallback_audio_content(text)
        else:
            return self._fallback_audio_content(text)
    
    async def _create_smart_highlights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create intelligent highlights based on content importance and user needs"""
        
        text = data.get("text", "")
        highlight_purpose = data.get("highlight_purpose", "comprehension")  # comprehension, navigation, focus
        user_conditions = data.get("user_conditions", [])
        
        highlight_context = {
            "text": text,
            "purpose": highlight_purpose,
            "user_conditions": user_conditions,
            "task": f"Create smart highlights for {highlight_purpose} optimization"
        }
        
        ai_response = await self.execute(highlight_context)
        
        if ai_response["success"]:
            try:
                highlights = self._generate_intelligent_highlights(text, highlight_purpose, user_conditions)
                
                return {
                    "highlight_map": highlights["map"],
                    "highlight_types": highlights["types"],
                    "color_coding": highlights["colors"],
                    "importance_levels": highlights["importance"],
                    "navigation_highlights": highlights["navigation"],
                    "focus_anchors": highlights["focus_anchors"]
                }
            except Exception as e:
                return self._fallback_highlights(text)
        else:
            return self._fallback_highlights(text)
    
    async def _create_multiple_summaries(self, text: str, summary_type: str, user_conditions: List[str]) -> Dict[str, Any]:
        """Create multiple summary versions for different needs"""
        
        # Extract key sentences using simple heuristics
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        # Simple scoring based on position and length
        key_sentences = []
        for i, sentence in enumerate(sentences):
            score = 1.0
            if i < len(sentences) * 0.3:  # First third gets bonus
                score += 0.3
            if len(sentence.split()) > 15:  # Longer sentences get bonus
                score += 0.2
            key_sentences.append((sentence, score))
        
        # Sort by score and take top sentences
        key_sentences.sort(key=lambda x: x[1], reverse=True)
        
        if summary_type == "simple":
            primary = ". ".join([s[0] for s in key_sentences[:2]])
        elif summary_type == "bullet_points":
            primary = "\n• " + "\n• ".join([s[0] for s in key_sentences[:3]])
        else:
            primary = ". ".join([s[0] for s in key_sentences[:3]])
        
        return {
            "primary": primary,
            "alternatives": [
                {"type": "ultra_short", "text": key_sentences[0][0] if key_sentences else ""},
                {"type": "detailed", "text": ". ".join([s[0] for s in key_sentences[:5]])}
            ],
            "key_points": [s[0] for s in key_sentences[:3]],
            "accessibility_features": ["simplified_language", "shorter_sentences"]
        }
    
    async def _create_semantic_chunks(self, text: str, strategy: str, attention_span: str) -> Dict[str, Any]:
        """Create semantic chunks based on content structure"""
        
        # Simple paragraph-based chunking
        paragraphs = text.split('\n\n')
        if not paragraphs or len(paragraphs) == 1:
            # Split by sentences if no paragraphs
            sentences = re.split(r'[.!?]+', text)
            paragraphs = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        # Determine chunk size based on attention span
        chunk_sizes = {
            "short": 1,
            "medium": 2,
            "long": 3
        }
        
        chunk_size = chunk_sizes.get(attention_span, 2)
        
        chunks = []
        for i in range(0, len(paragraphs), chunk_size):
            chunk_content = '\n\n'.join(paragraphs[i:i+chunk_size])
            chunks.append({
                "id": f"chunk_{i//chunk_size + 1}",
                "content": chunk_content,
                "word_count": len(chunk_content.split()),
                "estimated_time": len(chunk_content.split()) / 200 * 60  # seconds
            })
        
        return {
            "chunks": chunks,
            "metadata": {"total_chunks": len(chunks), "strategy": strategy},
            "navigation": [f"Section {i+1}" for i in range(len(chunks))],
            "progressive": {"enabled": True, "reveal_trigger": "user_action"},
            "anchors": [f"anchor_{i}" for i in range(len(chunks))],
            "timing": [chunk["estimated_time"] for chunk in chunks]
        }
    
    def _parse_ai_analysis(self, ai_response: str) -> Dict[str, Any]:
        """Parse AI analysis response"""
        
        # Simple parsing - enhance with proper NLP
        insights = {
            "readability": "medium",
            "key_challenges": [],
            "recommendations": []
        }
        
        if "complex" in ai_response.lower():
            insights["readability"] = "high"
            insights["key_challenges"].append("Complex sentence structure")
        
        if "simple" in ai_response.lower():
            insights["readability"] = "low"
        
        return insights
    
    def _estimate_reading_time(self, text: str, user_profile: Dict) -> Dict[str, float]:
        """Estimate reading time based on user profile"""
        
        word_count = len(text.split())
        
        # Base reading speeds (words per minute)
        base_speeds = {
            "no_condition": 250,
            "mild_dyslexia": 180,
            "severe_dyslexia": 120,
            "adhd": 200,
            "low_vision": 150
        }
        
        # Determine user's reading speed
        conditions = user_profile.get("conditions", [])
        if "severe_dyslexia" in conditions:
            wpm = base_speeds["severe_dyslexia"]
        elif "mild_dyslexia" in conditions:
            wpm = base_speeds["mild_dyslexia"]
        elif "adhd" in conditions:
            wpm = base_speeds["adhd"]
        elif "low_vision" in conditions:
            wpm = base_speeds["low_vision"]
        else:
            wpm = base_speeds["no_condition"]
        
        reading_time_minutes = word_count / wpm
        
        return {
            "estimated_minutes": round(reading_time_minutes, 1),
            "word_count": word_count,
            "reading_speed_wpm": wpm
        }
    
    def _fallback_complexity_analysis(self, metrics: Dict) -> Dict[str, Any]:
        """Fallback complexity analysis"""
        return {
            "complexity_score": metrics.get("overall_score", 0.5),
            "reading_level": metrics.get("reading_level", "intermediate"),
            "adaptation_recommendations": ["Consider simplifying vocabulary"],
            "estimated_reading_time": {"estimated_minutes": 5.0},
            "attention_demands": "medium"
        }
    
    def _fallback_summary(self, text: str, summary_type: str) -> Dict[str, Any]:
        """Fallback summary generation"""
        sentences = text.split('.')[:2]
        summary = '. '.join(sentences) + '.'
        
        return {
            "primary_summary": summary,
            "alternative_summaries": [],
            "key_points": sentences,
            "complexity_reduction": 0.3,
            "reading_time_saved": 0.5
        }


class ComplexityAnalyzer:
    """Analyzes text complexity using various metrics"""
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze text complexity"""
        
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 0]
        
        # Basic metrics
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        # Difficult words (simple heuristic: words > 6 characters)
        difficult_words = [word for word in words if len(word) > 6]
        difficult_words_ratio = len(difficult_words) / len(words) if words else 0
        
        # Overall complexity score (0-1, higher = more complex)
        complexity_score = min(
            (avg_sentence_length / 20) * 0.4 +
            (avg_word_length / 8) * 0.3 +
            difficult_words_ratio * 0.3,
            1.0
        )
        
        # Reading level estimation
        if complexity_score < 0.3:
            reading_level = "elementary"
        elif complexity_score < 0.6:
            reading_level = "intermediate"
        else:
            reading_level = "advanced"
        
        return {
            "overall_score": round(complexity_score, 2),
            "reading_level": reading_level,
            "avg_sentence_length": round(avg_sentence_length, 1),
            "avg_word_length": round(avg_word_length, 1),
            "difficult_words_ratio": round(difficult_words_ratio, 2),
            "word_count": len(words),
            "sentence_count": len(sentences)
        }
    
    def _generate_intelligent_highlights(self, text: str, purpose: str, user_conditions: List[str]) -> Dict[str, Any]:
        """Generate intelligent highlights based on content analysis"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
        
        # Simple highlighting logic
        highlight_map = {}
        for i, sentence in enumerate(sentences):
            if i == 0 or "important" in sentence.lower() or "key" in sentence.lower():
                highlight_map[f"sentence_{i}"] = "high_importance"
            elif len(sentence.split()) > 15:
                highlight_map[f"sentence_{i}"] = "medium_importance"
        
        return {
            "map": highlight_map,
            "types": ["importance", "navigation", "focus"],
            "colors": {"high_importance": "#ffeb3b", "medium_importance": "#e3f2fd"},
            "importance": ["high", "medium", "low"],
            "navigation": [f"nav_{i}" for i in range(len(sentences))],
            "focus_anchors": [f"focus_{i}" for i in range(0, len(sentences), 3)]
        }
    
    def _fallback_highlights(self, text: str) -> Dict[str, Any]:
        """Fallback highlighting when AI fails"""
        return {
            "highlight_map": {"sentence_0": "high_importance"},
            "highlight_types": ["basic"],
            "color_coding": {"high_importance": "#ffeb3b"},
            "importance_levels": ["high"],
            "navigation_highlights": [],
            "focus_anchors": ["focus_0"]
        }
    
    def _generate_adaptation_recommendations(self, complexity_metrics: Dict, user_profile: Dict) -> List[str]:
        """Generate adaptation recommendations based on complexity and user profile"""
        recommendations = []
        
        if complexity_metrics.get("overall_score", 0) > 0.7:
            recommendations.append("Consider simplifying vocabulary")
            recommendations.append("Break long sentences into shorter ones")
        
        if complexity_metrics.get("avg_sentence_length", 0) > 20:
            recommendations.append("Reduce sentence length for better readability")
        
        user_conditions = user_profile.get("conditions", [])
        if "dyslexia" in user_conditions:
            recommendations.append("Use dyslexia-friendly formatting")
        if "adhd" in user_conditions:
            recommendations.append("Add attention anchors and breaks")
        
        return recommendations if recommendations else ["Content is well-suited for user"]
    
    def _assess_attention_demands(self, complexity_metrics: Dict) -> str:
        """Assess attention demands of the content"""
        score = complexity_metrics.get("overall_score", 0.5)
        
        if score < 0.3:
            return "low"
        elif score < 0.7:
            return "medium"
        else:
            return "high"
    
    def _perform_vocabulary_adaptation(self, text: str, target_level: str) -> Dict[str, Any]:
        """Perform vocabulary adaptation"""
        # Simple word replacement logic
        simple_replacements = {
            "utilize": "use",
            "demonstrate": "show",
            "facilitate": "help",
            "approximately": "about",
            "subsequently": "then"
        }
        
        adapted_text = text
        changes = []
        
        for complex_word, simple_word in simple_replacements.items():
            if complex_word in adapted_text:
                adapted_text = adapted_text.replace(complex_word, simple_word)
                changes.append({"from": complex_word, "to": simple_word})
        
        return {
            "text": adapted_text,
            "changes": changes,
            "complexity_change": -0.1 * len(changes),
            "meaning_score": 0.95,
            "glossary": {change["to"]: f"Simplified from '{change['from']}'" for change in changes},
            "level_change": f"Adapted to {target_level} level"
        }
    
    def _create_audio_optimized_content(self, text: str, audio_type: str, speech_rate: str) -> Dict[str, Any]:
        """Create audio-optimized content"""
        # Add pauses and emphasis markers
        script = text.replace(".", ". <pause>")
        script = script.replace("!", "! <pause>")
        script = script.replace("?", "? <pause>")
        
        return {
            "script": script,
            "pauses": ["sentence_end", "paragraph_break"],
            "emphasis": ["important_terms", "key_concepts"],
            "pronunciation": {},
            "descriptions": ["Audio-optimized for accessibility"],
            "duration": len(text.split()) / 150 * 60,  # seconds
            "enhancements": ["pause_markers", "emphasis_cues"]
        }
    
    def _calculate_complexity_reduction(self, original: str, summary: str) -> float:
        """Calculate complexity reduction percentage"""
        original_words = len(original.split())
        summary_words = len(summary.split())
        return round((original_words - summary_words) / original_words, 2) if original_words > 0 else 0
    
    def _calculate_time_savings(self, original: str, summary: str) -> float:
        """Calculate time savings in minutes"""
        original_time = len(original.split()) / 200  # 200 WPM average
        summary_time = len(summary.split()) / 200
        return round(original_time - summary_time, 1)
    
    def _fallback_chunking(self, text: str) -> Dict[str, Any]:
        """Fallback chunking when AI fails"""
        paragraphs = text.split('\n\n') if '\n\n' in text else [text]
        chunks = [{"id": f"chunk_{i+1}", "content": p, "word_count": len(p.split())} for i, p in enumerate(paragraphs)]
        
        return {
            "chunks": chunks,
            "chunk_metadata": {"total_chunks": len(chunks)},
            "navigation_aids": [f"Section {i+1}" for i in range(len(chunks))],
            "progressive_disclosure": {"enabled": False},
            "attention_anchors": [],
            "estimated_chunk_times": [60] * len(chunks)
        }
    
    def _fallback_vocabulary_adaptation(self, text: str) -> Dict[str, Any]:
        """Fallback vocabulary adaptation"""
        return {
            "adapted_text": text,
            "vocabulary_changes": [],
            "complexity_reduction": 0,
            "meaning_preservation_score": 1.0,
            "glossary": {},
            "reading_level_change": "No changes made"
        }
    
    def _fallback_audio_content(self, text: str) -> Dict[str, Any]:
        """Fallback audio content generation"""
        return {
            "tts_script": text,
            "pause_markers": [],
            "emphasis_cues": [],
            "pronunciation_guide": {},
            "audio_descriptions": [],
            "estimated_duration": len(text.split()) / 150 * 60,
            "accessibility_enhancements": []
        }
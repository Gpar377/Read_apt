import re
from typing import Dict, Any

class TextAdaptationService:
    
    def adapt_text(self, text: str, dyslexia_preset: str = "normal", 
                   adhd_preset: str = "normal", vision_preset: str = "normal") -> Dict[str, Any]:
        """Apply text adaptations based on presets"""
        
        adapted_text = text
        css_styles = {}
        features = []
        
        # Dyslexia adaptations
        if dyslexia_preset == "severe":
            css_styles.update({
                "letter-spacing": "3px",
                "line-height": "2.5",
                "word-spacing": "8px"
            })
            adapted_text = self.highlight_dyslexic_letters(adapted_text)
            features.extend(["heavy_spacing", "dyslexic_highlighting", "tts_enabled"])
            
        elif dyslexia_preset == "mild":
            css_styles.update({
                "letter-spacing": "2px",
                "line-height": "2.0",
                "word-spacing": "4px"
            })
            features.append("moderate_spacing")
        
        # ADHD adaptations
        if adhd_preset == "inattentive":
            adapted_text = self.highlight_every_third_word(adapted_text)
            features.append("word_highlighting")
            
        elif adhd_preset == "hyperactive":
            adapted_text = self.chunk_sentences(adapted_text)
            adapted_text = self.highlight_every_third_word(adapted_text)
            css_styles["margin-bottom"] = "20px"
            features.extend(["sentence_chunking", "word_highlighting", "tldr_available"])
            
        elif adhd_preset == "severe":
            adapted_text = self.chunk_sentences(adapted_text)
            adapted_text = self.highlight_every_third_word(adapted_text)
            css_styles["margin-bottom"] = "25px"
            features.extend(["sentence_chunking", "word_highlighting", "tts_enabled", "tldr_available"])
        
        # Vision adaptations
        if vision_preset == "mild":
            css_styles.update({
                "font-size": "125%",
                "letter-spacing": "1px",
                "line-height": "1.8"
            })
            features.append("text_enlargement")
            
        elif vision_preset == "low_vision":
            css_styles.update({
                "font-size": "150%",
                "background-color": "white",
                "color": "black",
                "letter-spacing": "2px",
                "line-height": "2.2",
                "font-weight": "bold"
            })
            features.extend(["large_text", "high_contrast", "tts_enabled"])
        
        return {
            "adapted_text": adapted_text,
            "css_styles": css_styles,
            "features": features,
            "tts_enabled": "tts_enabled" in features,
            "tldr_available": "tldr_available" in features
        }
    
    def highlight_dyslexic_letters(self, text: str) -> str:
        """Highlight commonly confused letters for dyslexic readers"""
        dyslexic_pairs = ['b', 'd', 'p', 'q', 'm', 'w', 'n', 'u']
        for letter in dyslexic_pairs:
            text = text.replace(letter, f'<span class="dyslexic-highlight">{letter}</span>')
            text = text.replace(letter.upper(), f'<span class="dyslexic-highlight">{letter.upper()}</span>')
        return text
    
    def highlight_every_third_word(self, text: str) -> str:
        """Highlight every third word for ADHD focus"""
        words = text.split()
        for i in range(2, len(words), 3):  # Every 3rd word (0-indexed)
            words[i] = f'<span class="adhd-highlight">{words[i]}</span>'
        return ' '.join(words)
    
    def chunk_sentences(self, text: str) -> str:
        """Add spacing between sentences for ADHD readers"""
        sentences = re.split(r'([.!?]+)', text)
        chunked = []
        for i in range(0, len(sentences)-1, 2):
            if i+1 < len(sentences):
                sentence = sentences[i] + sentences[i+1]
                chunked.append(f'<div class="sentence-chunk">{sentence.strip()}</div>')
        return ''.join(chunked)
    
    def generate_tldr(self, text: str) -> str:
        """Generate simple TL;DR summary"""
        sentences = re.split(r'[.!?]+', text)
        # Simple heuristic: take first and last meaningful sentences
        meaningful_sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        if len(meaningful_sentences) >= 2:
            return f"TL;DR: {meaningful_sentences[0]}. {meaningful_sentences[-1]}."
        elif len(meaningful_sentences) == 1:
            return f"TL;DR: {meaningful_sentences[0]}."
        return "TL;DR: " + text[:100] + "..."

text_service = TextAdaptationService()
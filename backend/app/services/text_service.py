import re
from typing import Dict, Any
import html

class TextAdaptationService:
    
    def adapt_text(self, text: str, dyslexia_preset: str = "normal", 
                   adhd_preset: str = "normal", vision_preset: str = "normal") -> Dict[str, Any]:
        """Apply text adaptations based on presets - single disorder focus"""
        
        adapted_text = text
        css_styles = {}
        features = []
        primary_disorder = "normal"
        
        # Determine primary disorder (only one at a time)
        if dyslexia_preset != "normal":
            primary_disorder = "dyslexia"
        elif adhd_preset != "normal":
            primary_disorder = "adhd"
        elif vision_preset != "normal":
            primary_disorder = "vision"
        
        # Apply adaptations for single disorder only
        if primary_disorder == "dyslexia":
            if dyslexia_preset == "severe":
                css_styles.update({
                    "letter-spacing": "4px",
                    "line-height": "3.0",
                    "word-spacing": "12px",
                    "font-family": "OpenDyslexic, 'Comic Sans MS', Arial, sans-serif",
                    "font-size": "120%",
                    "background-color": "#fefce8",
                    "color": "#1f2937",
                    "text-align": "left",
                    "max-width": "60ch",
                    "margin": "0 auto",
                    "padding": "20px"
                })
                adapted_text = self.highlight_dyslexic_letters(adapted_text)
                adapted_text = self.add_reading_ruler(adapted_text)
                features.extend(["heavy_spacing", "dyslexic_highlighting", "syllable_breaks", "reading_ruler", "tts_enabled"])
            elif dyslexia_preset == "mild":
                css_styles.update({
                    "letter-spacing": "2px",
                    "line-height": "2.2",
                    "word-spacing": "6px",
                    "font-family": "OpenDyslexic, Arial, sans-serif",
                    "background-color": "#fffbeb",
                    "max-width": "70ch",
                    "padding": "15px"
                })
                adapted_text = self.highlight_dyslexic_letters(adapted_text)
                features.extend(["moderate_spacing", "dyslexic_highlighting"])
        
        elif primary_disorder == "adhd":
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
        
        elif primary_disorder == "vision":
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
            "primary_disorder": primary_disorder,
            "tts_enabled": "tts_enabled" in features,
            "tldr_available": "tldr_available" in features
        }
    
    def highlight_dyslexic_letters(self, text: str) -> str:
        """Apply comprehensive dyslexia adaptations"""
        text = html.escape(text)
        
        # 1. Highlight mirror letters (b/d, p/q, m/w, n/u)
        mirror_pairs = [('b', 'd'), ('p', 'q'), ('m', 'w'), ('n', 'u')]
        for pair in mirror_pairs:
            for letter in pair:
                text = text.replace(letter, f'<span class="dyslexic-mirror">{letter}</span>')
                text = text.replace(letter.upper(), f'<span class="dyslexic-mirror">{letter.upper()}</span>')
        
        # 2. Color-code vowels for easier recognition
        vowels = ['a', 'e', 'i', 'o', 'u']
        for vowel in vowels:
            text = text.replace(vowel, f'<span class="dyslexic-vowel">{vowel}</span>')
            text = text.replace(vowel.upper(), f'<span class="dyslexic-vowel">{vowel.upper()}</span>')
        
        # 3. Break long words with syllable markers
        words = text.split(' ')
        processed_words = []
        for word in words:
            clean_word = re.sub(r'<[^>]+>', '', word)
            if len(clean_word) > 6:  # Long words
                syllables = self._break_into_syllables(word)
                processed_words.append('<span class="dyslexic-syllables">' + '·'.join(syllables) + '</span>')
            else:
                processed_words.append(word)
        
        return ' '.join(processed_words)
    
    def highlight_every_third_word(self, text: str) -> str:
        """Highlight every third word for ADHD focus"""
        # Escape HTML to prevent XSS
        text = html.escape(text)
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
    
    def _break_into_syllables(self, word: str) -> list:
        """Simple syllable breaking for dyslexic readers"""
        clean_word = re.sub(r'<[^>]+>', '', word)
        if len(clean_word) <= 3:
            return [word]
        
        syllables = []
        current = ""
        for i, char in enumerate(clean_word):
            current += char
            if char.lower() in 'aeiou' and i < len(clean_word) - 1:
                if len(current) >= 2:
                    syllables.append(current)
                    current = ""
        
        if current:
            if syllables:
                syllables[-1] += current
            else:
                syllables.append(current)
        
        return syllables if len(syllables) > 1 else [word]
    
    def add_reading_ruler(self, text: str) -> str:
        """Add reading ruler guides for dyslexic readers"""
        sentences = re.split(r'([.!?]+)', text)
        ruler_text = []
        for i, sentence in enumerate(sentences):
            if sentence.strip() and not re.match(r'^[.!?]+$', sentence):
                ruler_class = "reading-line-odd" if i % 2 == 0 else "reading-line-even"
                ruler_text.append(f'<div class="{ruler_class}">{sentence.strip()}</div>')
            elif sentence.strip():
                ruler_text.append(sentence)
        return ''.join(ruler_text)
    
    def apply_single_disorder_preset(self, text: str, disorder: str, severity: str) -> Dict[str, Any]:
        """Apply preset for single disorder only"""
        if disorder == "dyslexia":
            return self.adapt_text(text, dyslexia_preset=severity)
        elif disorder == "adhd":
            return self.adapt_text(text, adhd_preset=severity)
        elif disorder == "vision":
            return self.adapt_text(text, vision_preset=severity)
        else:
            return self.adapt_text(text)

text_service = TextAdaptationService()
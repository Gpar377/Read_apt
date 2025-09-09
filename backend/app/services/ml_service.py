import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import os

class MLService:
    def __init__(self):
        self.dyslexia_model = None
        self.adhd_model = None
        self.load_models()
    
    def load_models(self):
        """Load trained models or create dummy ones for demo"""
        try:
            self.dyslexia_model = joblib.load("models/dyslexia_model.pkl")
            self.adhd_model = joblib.load("models/adhd_model.pkl")
            print("Real trained models loaded successfully")
        except FileNotFoundError:
            print("Model files not found, creating dummy models for demo")
            self.create_dummy_models()
        except Exception as e:
            print(f"Error loading models: {e}, using dummy models")
            self.create_dummy_models()
    
    def create_dummy_models(self):
        """Create dummy models for demonstration"""
        # Dummy dyslexia model
        X_dyslexia = np.random.rand(1000, 2)  # speed, survey_score
        y_dyslexia = np.random.randint(0, 3, 1000)  # 0,1,2 severity
        self.dyslexia_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.dyslexia_model.fit(X_dyslexia, y_dyslexia)
        
        # Dummy ADHD model
        X_adhd = np.random.rand(1000, 18)  # 18 questionnaire responses
        y_adhd = np.random.randint(0, 4, 1000)  # 0,1,2,3 types
        self.adhd_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.adhd_model.fit(X_adhd, y_adhd)
    
    def predict_dyslexia(self, speed: float, survey_score: float):
        """Predict dyslexia severity based on real dataset patterns"""
        features = np.array([[speed, survey_score]])
        prediction = self.dyslexia_model.predict(features)[0]
        confidence = max(self.dyslexia_model.predict_proba(features)[0])
        
        # Real dataset mapping: 0=severe, 1=mild, 2=no dyslexia
        presets = {
            0: "severe",    # heavy spacing, highlight dyslexic letters, TTS
            1: "mild",      # moderate spacing, moderate interline spacing  
            2: "normal"     # normal reading mode
        }
        
        descriptions = {
            0: "Severe dyslexia detected - Heavy adaptations recommended",
            1: "Mild dyslexia detected - Moderate adaptations recommended", 
            2: "No dyslexia detected - Normal reading mode"
        }
        
        return {
            "severity": int(prediction),
            "confidence": float(confidence),
            "adaptation_preset": presets[prediction],
            "description": descriptions[prediction],
            "reading_speed_score": float(speed),
            "comprehension_score": float(survey_score)
        }
    
    def predict_adhd(self, q1_responses: list, q2_responses: list):
        """Predict ADHD type based on 18-question assessment"""
        # Combine all 18 responses (Q1_1 to Q1_9, Q2_1 to Q2_9)
        all_responses = q1_responses + q2_responses
        features = np.array([all_responses])
        
        prediction = self.adhd_model.predict(features)[0]
        confidence = max(self.adhd_model.predict_proba(features)[0])
        
        # Real dataset mapping: 0=No ADHD, 1=Inattentive, 2=Hyperactive, 3=Severe
        presets = {
            0: "normal",        # normal text display
            1: "inattentive",   # highlight every 3rd word
            2: "hyperactive",   # chunk sentences + highlight + TL;DR
            3: "severe"         # chunk + highlight + TTS + TL;DR
        }
        
        descriptions = {
            0: "No ADHD detected - Normal text display",
            1: "Inattentive type ADHD - Focus enhancement recommended",
            2: "Hyperactive-Impulsive type ADHD - Text chunking recommended", 
            3: "Severe ADHD - Full accessibility features recommended"
        }
        
        # Calculate subscale scores
        hyperactivity_score = np.mean(q1_responses)
        inattention_score = np.mean(q2_responses)
        
        return {
            "type": int(prediction),
            "confidence": float(confidence),
            "adaptation_preset": presets[prediction],
            "description": descriptions[prediction],
            "hyperactivity_score": float(hyperactivity_score),
            "inattention_score": float(inattention_score),
            "total_responses": len(all_responses)
        }
    
    def classify_vision(self, glasses_power: float):
        """Rule-based vision classification based on glasses prescription"""
        if glasses_power >= -1.5:
            return {
                "class_level": 0, 
                "adaptation_preset": "normal",
                "description": "Normal/Mild Vision Aid",
                "features": ["Slight text enlargement (+10-15%)", "Standard spacing", "No contrast changes"]
            }
        elif glasses_power >= -3.0:
            return {
                "class_level": 1, 
                "adaptation_preset": "mild",
                "description": "Mild Low Vision", 
                "features": ["Text magnification (+25-30%)", "Increased line spacing", "Slight contrast enhancement"]
            }
        else:
            return {
                "class_level": 2, 
                "adaptation_preset": "low_vision",
                "description": "Low Vision",
                "features": ["Large fonts (+50%)", "High contrast mode", "Increased spacing", "Text-to-Speech available"]
            }

ml_service = MLService()
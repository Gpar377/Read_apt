import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def create_sample_dyslexia_data():
    """Create sample dyslexia data (replace with actual Kaggle data)"""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate synthetic data based on dyslexia patterns
    data = []
    for _ in range(n_samples):
        # Severe dyslexia: low speed, low comprehension
        if np.random.random() < 0.3:
            speed = np.random.uniform(0.0, 0.4)
            survey_score = np.random.uniform(0.0, 0.5)
            label = 0
        # Mild dyslexia: moderate speed, moderate comprehension
        elif np.random.random() < 0.5:
            speed = np.random.uniform(0.3, 0.7)
            survey_score = np.random.uniform(0.4, 0.8)
            label = 1
        # No dyslexia: high speed, high comprehension
        else:
            speed = np.random.uniform(0.6, 1.0)
            survey_score = np.random.uniform(0.7, 1.0)
            label = 2
        
        data.append([speed, survey_score, label])
    
    return pd.DataFrame(data, columns=['speed', 'survey_score', 'label'])

def create_sample_adhd_data():
    """Create sample ADHD data (replace with actual Kaggle data)"""
    np.random.seed(42)
    n_samples = 1000
    
    data = []
    for _ in range(n_samples):
        # Generate 18 questionnaire responses (0-3 scale)
        q1_responses = np.random.randint(0, 4, 9)  # Hyperactivity
        q2_responses = np.random.randint(0, 4, 9)  # Inattention
        
        # Determine label based on response patterns
        hyperactivity_score = np.mean(q1_responses)
        inattention_score = np.mean(q2_responses)
        
        if hyperactivity_score < 1.0 and inattention_score < 1.0:
            label = 0  # No ADHD
        elif inattention_score > hyperactivity_score and inattention_score > 2.0:
            label = 1  # Inattentive
        elif hyperactivity_score > inattention_score and hyperactivity_score > 2.0:
            label = 2  # Hyperactive
        elif hyperactivity_score > 2.5 and inattention_score > 2.5:
            label = 3  # Severe/Combined
        else:
            label = 0  # Default to no ADHD
        
        row = list(q1_responses) + list(q2_responses) + [label]
        data.append(row)
    
    columns = [f'Q1_{i+1}' for i in range(9)] + [f'Q2_{i+1}' for i in range(9)] + ['label']
    return pd.DataFrame(data, columns=columns)

def train_dyslexia_model():
    """Train dyslexia classification model"""
    print("Training dyslexia model...")
    
    # Load or create data
    df = create_sample_dyslexia_data()
    
    X = df[['speed', 'survey_score']]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Dyslexia model accuracy: {accuracy:.3f}")
    print(classification_report(y_test, y_pred))
    
    # Save model
    os.makedirs("../models", exist_ok=True)
    joblib.dump(model, "../models/dyslexia_model.pkl")
    print("Dyslexia model saved!")
    
    return model

def train_adhd_model():
    """Train ADHD classification model"""
    print("Training ADHD model...")
    
    # Load or create data
    df = create_sample_adhd_data()
    
    feature_cols = [f'Q1_{i+1}' for i in range(9)] + [f'Q2_{i+1}' for i in range(9)]
    X = df[feature_cols]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"ADHD model accuracy: {accuracy:.3f}")
    print(classification_report(y_test, y_pred))
    
    # Save model
    os.makedirs("../models", exist_ok=True)
    joblib.dump(model, "../models/adhd_model.pkl")
    print("ADHD model saved!")
    
    return model

if __name__ == "__main__":
    print("Training ML models for Accessibility Reading Platform...")
    
    dyslexia_model = train_dyslexia_model()
    adhd_model = train_adhd_model()
    
    print("\nAll models trained successfully!")
    print("Models saved in ../models/ directory")
    print("You can now run the FastAPI server with: uvicorn app.main:app --reload")